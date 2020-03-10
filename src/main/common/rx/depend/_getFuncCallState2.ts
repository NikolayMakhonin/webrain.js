import {ObjectPool} from '../../lists/ObjectPool'
import {PairingHeap, PairingNode} from '../../lists/PairingHeap'
import {createFuncCallState} from './_dependentFunc'
import {Func, IFuncCallState, IValueState, TCall} from './contracts'
import {createCallWithArgs} from './helpers'
import {unsubscribeDependencies} from './subscribeDependency'

export const valueIdsMap = new Map<any, number>()
export const valueStatesMap = new Map<number, IValueState>()

let nextValueId: number = 1
export function getValueState(value: any): number {
	let id = valueIdsMap.get(value)
	if (id == null) {
		id = nextValueId++
		const state: IValueState = {
			usageCount: 0,
			value,
		}
		valueIdsMap.set(value, id)
		valueStatesMap.set(id, state)
	}
	return id
}

export function deleteValueState(id: number, value: any): void {
	if (!valueStatesMap.delete(id)) {
		throw new Error('value not found')
	}
	if (!valueIdsMap.delete(value)) {
		throw new Error('valueState not found')
	}
}

export const valueIdsBuffer: number[] = []
export const callStateHashTable = new Map<number, Array<IFuncCallState<any, any, any>>>()

let callStatesCount = 0
const maxCallStatesCount = 1500
const minDeleteCallStatesCount = 500
let nextCallStatesCount = maxCallStatesCount

let usageNextId = 1

export function addFuncCallState<
	TThis,
	TArgs extends any[],
	TValue,
>(
	func: Func<TThis, TArgs, TValue>,
	_this: TThis,
	callWithArgs: TCall<TArgs>,
	valueIds: number[],
): IFuncCallState<TThis, TArgs, TValue> {
	const callState = createFuncCallState<TThis, TArgs, TValue>(
		func,
		_this,
		callWithArgs,
		valueIds,
	)

	if (callStatesCount >= nextCallStatesCount) {
		reduceCallStates(callStatesCount - maxCallStatesCount + minDeleteCallStatesCount)
		nextCallStatesCount = callStatesCount + minDeleteCallStatesCount
	}
	callStatesCount++

	return callState
}

// tslint:disable-next-line:no-shadowed-variable
export function _getFuncCallState2<
	TThis,
	TArgs extends any[],
	TValue
>(
	func: Func<TThis, TArgs, TValue>,
): Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>> {
	const funcId = nextValueId++
	const funcHash = (17 * 31 + funcId) | 0
	return function() {
		const countArgs = arguments.length
		const countValueStates = countArgs + 2

		valueIdsBuffer[0] = funcId
		let hash = funcHash

		{
			const valueId = getValueState(this)
			valueIdsBuffer[1] = valueId
			hash = (hash * 31 + valueId) | 0
		}

		for (let i = 0; i < countArgs; i++) {
			const valueId = getValueState(arguments[i])
			valueIdsBuffer[i + 2] = valueId
			hash = (hash * 31 + valueId) | 0
		}

		let callState
		let callStates = callStateHashTable.get(hash)
		if (callStates != null) {
			for (let i = 0, len = callStates.length; i < len; i++) {
				const state = callStates[i]
				const valueIds = state.valueIds
				if (valueIds.length === countValueStates) {
					let j = 0
					for (; j < countValueStates; j++) {
						if (valueIds[j] !== valueIdsBuffer[j]) {
							break
						}
					}

					if (j === countValueStates) {
						callState = state
						break
					}
				}
			}
		} else {
			callStates = []
			callStateHashTable.set(hash, callStates)
		}

		if (callState == null) {
			const valueIdsClone: number[] = [] // new Array(countValueStates)
			for (let i = 0; i < countValueStates; i++) {
				const valueId = valueIdsBuffer[i]
				valueIdsClone[i] = valueId
				if (i > 0) {
					const valueState = valueStatesMap.get(valueId)
					valueState.usageCount++
				}
			}

			callState = addFuncCallState<TThis, TArgs, TValue>(
				func,
				this,
				createCallWithArgs.apply(null, arguments),
				valueIdsClone,
			)

			callStates.push(callState)
		}

		callState.deleteOrder = usageNextId++

		return callState
	}
}

export function deleteFuncCallState<
	TThis,
	TArgs extends any[],
	TValue
>(callState: IFuncCallState<TThis, TArgs, TValue>) {
	unsubscribeDependencies(callState)

	const valueIds = callState.valueIds

	let hash = 17
	for (let i = 0, len = valueIds.length; i < len; i++) {
		const valueId = valueIds[i]
		hash = (hash * 31 + valueId) | 0
		if (i > 0) {
			const valueState = valueStatesMap.get(valueId)
			const usageCount = valueState.usageCount
			if (usageCount <= 0) {
				throw new Error('usageCount <= 0')
			} else if (usageCount === 1 && i > 0) {
				deleteValueState(valueId, valueState.value)
			} else {
				valueState.usageCount--
			}
		}
	}

	// search and delete callState
	const callStates = callStateHashTable.get(hash)
	const callStatesLastIndex = callStates.length - 1
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

	callStatesCount--
}

export const reduceCallObjectPool = new ObjectPool<PairingNode<IFuncCallState<any, any, any>>>(10000000)
export const reduceCallHeap = new PairingHeap<IFuncCallState<any, any, any>>({
	objectPool: reduceCallObjectPool,
	lessThanFunc(o1, o2) {
		return o1.deleteOrder < o2.deleteOrder
	},
})

export function reduceCallStates<
	TThis,
	TArgs extends any[],
	TValue
>(deleteSize: number) {
	callStateHashTable.forEach(states => {
		for (let i = 0, len = states.length; i < len; i++) {
			const callState = states[i]
			if (!callState.hasSubscribers && !callState.isHandling) {
				reduceCallHeap.add(callState)
			}
		}
	})

	while (deleteSize > 0 && reduceCallHeap.size > 0) {
		const callState = reduceCallHeap.deleteMin()
		const {_unsubscribers} = callState
		if (_unsubscribers != null) {
			for (let i = 0, len = _unsubscribers.length; i < len; i++) {
				const state = _unsubscribers[i].state
				if (state._subscribersFirst === state._subscribersLast) {
					reduceCallHeap.add(state)
				}
			}
		}
		deleteFuncCallState(callState)
		deleteSize--
	}

	reduceCallHeap.clear()
}
