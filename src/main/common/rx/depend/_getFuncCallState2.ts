import {createFuncCallState} from './_dependentFunc'
import {Func, IFuncCallState, TCall} from './contracts'
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

interface IValueState {
	id: number
}

const valueStateMap = createSemiWeakMap<any, IValueState>()

let nextValueId: number = 1
function getValueState(value: any): IValueState {
	let state = semiWeakMapGet(valueStateMap, value)
	if (state == null) {
		state = {
			id: nextValueId++,
		}
		semiWeakMapSet(valueStateMap, value, state)
	}
	return state
}

const valueStates = []

// tslint:disable-next-line:no-shadowed-variable
export function _getFuncCallState2<TThis,
	TArgs extends any[],
	TValue>(
	func: Func<TThis, TArgs, TValue>,
): Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>> {
	const funcState = getValueState(func)
	const funcHash = (17 * 31 + funcState.id) | 0
	const callStateHashTable = new Map()
	return function() {
		const argsLength = arguments.length

		valueStates[0] = funcState
		let hash = funcHash

		let valueState: IValueState = getValueState(this)
		valueStates[1] = valueState
		hash = (hash * 31 + valueState.id) | 0

		for (let i = 0; i < argsLength; i++) {
			valueState = getValueState(arguments[i])
			valueStates[i + 2] = valueState
			hash = (hash * 31 + valueState.id) | 0
		}

		let callState
		let callStates = callStateHashTable.get(hash)
		if (callStates != null) {
			for (let i = 0, len = callStates.length; i < len; i++) {
				const state = callStates[i]
				const key = state.valueStates
				if (key.length === argsLength + 2) {
					let notFound
					for (let j = 0; j <= argsLength; j++) {
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
			const valueStatesClone = [] // new Array(argsLength + 1)
			for (let i = 0; i < argsLength + 2; i++) {
				valueStatesClone[i] = valueStates[i]
			}

			callState = createFuncCallState<TThis, TArgs, TValue>(
				func,
				this,
				createCallWithArgs.apply(null, arguments),
				valueStatesClone,
			)

			callStates.push(callState)
		}

		return callState
	}
}
