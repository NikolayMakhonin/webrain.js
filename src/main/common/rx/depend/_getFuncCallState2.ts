import {createFuncCallState} from './_dependentFunc'
import {Func, IFuncCallState, IValueState} from './contracts'
import {createCallWithArgs} from './helpers'

export function isRefType(value): boolean {
	return value != null && (typeof value === 'object' || typeof value === 'function')
}

interface ISemiWeakMap<K, V> {
	map: Map<K, V>
	weakMap: WeakMap<K extends object ? K : never, V>
}

export function createSemiWeakMap<K, V>(): ISemiWeakMap<K, V> {
	return {
		map: new Map(),
		weakMap: new WeakMap(),
	}
}

export function semiWeakMapGet<K, V>(semiWeakMap: ISemiWeakMap<K, V>, key: K): V {
	let value
	if (isRefType(key)) {
		const weakMap = semiWeakMap.weakMap
		value = weakMap.get(key as any)
	} else {
		const map = semiWeakMap.map
		value = map.get(key)
	}
	return value == null ? null : value
}

export function semiWeakMapSet<K, V>(semiWeakMap: ISemiWeakMap<K, V>, key: K, value: V): void {
	if (isRefType(key)) {
		const weakMap = semiWeakMap.weakMap
		weakMap.set(key as any, value)
	} else {
		const map = semiWeakMap.map
		map.set(key, value)
	}
}

const valueStateMap = new Map<any, IValueState>()

let nextValueId: number = 1
function getValueState(value: any): IValueState {
	let state = valueStateMap.get(value)
	if (state == null) {
		state = {
			id: nextValueId++,
			usageCount: 0,
			value,
		}
		valueStateMap.set(value, state)
	}
	return state
}

function deleteValueState(valueState: IValueState): void {
	if (!valueStateMap.delete(valueState.value)) {
		throw new Error('valueState not found')
	}
}

const valueStates: IValueState[] = []
const callStateHashTable = new Map<number, Array<IFuncCallState<any, any, any>>>()
let usageNextId = 1

// tslint:disable-next-line:no-shadowed-variable
export function _getFuncCallState2<
	TThis,
	TArgs extends any[],
	TValue
>(
	func: Func<TThis, TArgs, TValue>,
): Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>> {
	const funcState = getValueState(func)
	const funcHash = (17 * 31 + funcState.id) | 0
	return function() {
		const countArgs = arguments.length
		const countValueStates = countArgs + 2

		valueStates[0] = funcState
		let hash = funcHash

		{
			const valueState: IValueState = getValueState(this)
			valueStates[1] = valueState
			hash = (hash * 31 + valueState.id) | 0
		}

		for (let i = 0; i < countArgs; i++) {
			const valueState = getValueState(arguments[i])
			valueStates[i + 2] = valueState
			hash = (hash * 31 + valueState.id) | 0
		}

		let callState
		let callStates = callStateHashTable.get(hash)
		if (callStates != null) {
			for (let i = 0, len = callStates.length; i < len; i++) {
				const state = callStates[i]
				const key = state.valueStates
				if (key.length === countValueStates) {
					let notFound
					for (let j = 0; j <= countArgs; j++) {
						if (key[j] !== valueStates[j]) {
							notFound = true
							break
						}
					}
					if (!notFound) {
						callState = state
						break
					}
				}
			}
		} else {
			callStates = []
			callStateHashTable.set(hash, callStates)
		}

		if (!callState) {
			const valueStatesClone: IValueState[] = [] // new Array(argsLength + 1)
			for (let i = 0; i < countValueStates; i++) {
				const valueState = valueStates[i]
				valueStatesClone[i] = valueState
				valueState.usageCount++
			}

			callState = createFuncCallState<TThis, TArgs, TValue>(
				func,
				this,
				createCallWithArgs.apply(null, arguments),
				valueStatesClone,
				hash,
			)
			callStates.push(callState)
		}

		callState.deletePriority = usageNextId++

		return callState
	}
}

export function deleteFuncCallState<
	TThis,
	TArgs extends any[],
	TValue
>(callState: IFuncCallState<TThis, TArgs, TValue>) {
	const valueStates = callState.valueStates
	let hash = 17
	for (let i = 0, len = valueStates.length; i < len; i++) {
		const valueState = valueStates[i]
		hash = hash * 31 + valueState.id
		const usageCount = valueState.usageCount
		if (usageCount === 1) {
			deleteValueState(valueState)
		} else {
			valueState.usageCount = usageCount - 1
		}
	}

	// search and delete callState
	const callStates = callStateHashTable.get(hash)
	const callStatesLastIndex = callStates.length
	if (callStatesLastIndex === -1) {
		throw new Error('callStates.length === 0')
	} else if (callStatesLastIndex === 0) {
		if (callStates[0] !== callState) {
			throw new Error('callStates[0] !== callState')
		}
		callStateHashTable.delete(hash)
	} else {
		let index = 0
		for (index = 0; index <= callStatesLastIndex; index++) {
			if (callStates[index] === callState) {
				if (index !== callStatesLastIndex) {
					callStates[index] = callStates[callStatesLastIndex]
				}
				callStates.length = callStatesLastIndex
				break
			}
		}
		if (index > callStatesLastIndex) {
			throw new Error('callState not found')
		}
	}
}
