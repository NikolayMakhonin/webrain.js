import {ObjectPool} from '../../lists/ObjectPool'
import {PairingHeap, PairingNode} from '../../lists/PairingHeap'
import {CallState, TCallState, TFuncCall} from './CallState'
import {Func, ICallState, TCall} from './contracts'
import {createCallWithArgs, InternalError} from './helpers'

// region get/create/delete ValueState

export interface IValueState {
	usageCount: number
	value: any
}

export const valueIdToStateMap = new Map<number, IValueState>()
export const valueToIdMap = new Map<any, number>()
let nextValueId: number = 1

export function getValueState(valueId: number): IValueState {
	return valueIdToStateMap.get(valueId)
}

export function getOrCreateValueId(value: any): number {
	let id = valueToIdMap.get(value)
	if (id == null) {
		id = nextValueId++
		const state: IValueState = {
			usageCount: 0,
			value,
		}
		valueToIdMap.set(value, id)
		valueIdToStateMap.set(id, state)
	}
	return id
}

export function deleteValueState(valueId: number, value: any): void {
	if (!valueIdToStateMap.delete(valueId)) {
		throw new InternalError('value not found')
	}
	if (!valueToIdMap.delete(value)) {
		throw new InternalError('valueState not found')
	}
}

// endregion

// region get/create/delete CallState

export const callStateHashTable = new Map<number, TCallState[]>()
let callStatesCount = 0

// region getOrCreateCallState

const maxCallStatesCount = 1500
const minDeleteCallStatesCount = 500
let nextCallStatesCount = maxCallStatesCount

export function createCallState<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(
	thisOuter: TThisOuter,
	callWithArgs: TCall<TArgs>,
	funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>,
	valueIds: number[],
): ICallState<TThisOuter, TArgs, TResultInner> {
	const callState = new CallState(
		thisOuter,
		callWithArgs,
		funcCall,
		valueIds,
	)

	if (callStatesCount >= nextCallStatesCount) {
		reduceCallStates(callStatesCount - maxCallStatesCount + minDeleteCallStatesCount)
		nextCallStatesCount = callStatesCount + minDeleteCallStatesCount
	}
	callStatesCount++

	return callState
}

let usageNextId = 1
export const valueIdsBuffer: number[] = []

// tslint:disable-next-line:no-shadowed-variable
export function makeGetOrCreateCallState<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(
	funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>,
): Func<TThisOuter, TArgs, CallState<TThisOuter, TArgs, TResultInner>> {
	const funcId = nextValueId++
	const funcHash = (17 * 31 + funcId) | 0

	return function _getOrCreateCallState(this: TThisOuter) {
		const countArgs = arguments.length
		const countValueStates = countArgs + 2

		valueIdsBuffer[0] = funcId
		let hash = funcHash

		{
			const valueId = getOrCreateValueId(this)
			valueIdsBuffer[1] = valueId
			hash = (hash * 31 + valueId) | 0
		}

		for (let i = 0; i < countArgs; i++) {
			const valueId = getOrCreateValueId(arguments[i])
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
					const valueState = getValueState(valueId)
					valueState.usageCount++
				}
			}

			callState = createCallState<TThisOuter, TArgs, TResultInner>(
				this,
				createCallWithArgs.apply(null, arguments),
				funcCall,
				valueIdsClone,
			)

			callStates.push(callState)
		}

		callState.deleteOrder = usageNextId++

		return callState
	}
}

// endregion

// region reduceCallStates to free memory

export function deleteCallState(callState: TCallState) {
	callState._unsubscribeDependencies()

	const valueIds = callState.valueIds

	let hash = 17
	for (let i = 0, len = valueIds.length; i < len; i++) {
		const valueId = valueIds[i]
		hash = (hash * 31 + valueId) | 0
		if (i > 0) {
			const valueState = getValueState(valueId)
			const usageCount = valueState.usageCount
			if (usageCount <= 0) {
				throw new InternalError('usageCount <= 0')
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
		throw new InternalError('callStates.length === 0')
	} else if (callStatesLastIndex === 0) {
		if (callStates[0] !== callState) {
			throw new InternalError('callStates[0] !== callState')
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
			throw new InternalError('callState not found')
		}
	}

	callStatesCount--
}

export const reduceCallStatesHeap = new PairingHeap<TCallState>({
	objectPool: new ObjectPool<PairingNode<TCallState>>(10000000),
	lessThanFunc(o1, o2) {
		return o1.deleteOrder < o2.deleteOrder
	},
})

function reduceCallStatesHeapAdd(states: TCallState[]) {
	for (let i = 0, len = states.length; i < len; i++) {
		const callState = states[i]
		if (!callState.hasSubscribers && !callState.isHandling) {
			reduceCallStatesHeap.add(callState)
		}
	}
}

export function reduceCallStates(deleteSize: number) {
	callStateHashTable.forEach(reduceCallStatesHeapAdd)

	while (deleteSize > 0 && reduceCallStatesHeap.size > 0) {
		const callState = reduceCallStatesHeap.deleteMin()
		const {_unsubscribers, _unsubscribersLength} = callState
		if (_unsubscribers != null) {
			for (let i = 0, len = _unsubscribersLength; i < len; i++) {
				const state = _unsubscribers[i].state
				if (state._subscribersFirst === state._subscribersLast) {
					reduceCallStatesHeap.add(state)
				}
			}
		}
		deleteCallState(callState)
		deleteSize--
	}

	reduceCallStatesHeap.clear()
}

// endregion

// endregion
