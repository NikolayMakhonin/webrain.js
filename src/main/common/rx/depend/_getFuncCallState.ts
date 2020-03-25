import {ObjectPool} from '../../lists/ObjectPool'
import {PairingHeap, PairingNode} from '../../lists/PairingHeap'
import {Func, IFuncCallState, IValueState, TCall, TGetThis} from './contracts'
import {createFuncCallState, FuncCallState, TFuncCallState} from './FuncCallState'
import {createCallWithArgs, InternalError} from './helpers'
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
		throw new InternalError('value not found')
	}
	if (!valueIdsMap.delete(value)) {
		throw new InternalError('valueState not found')
	}
}

export const valueIdsBuffer: number[] = []
export const callStateHashTable = new Map<number, TFuncCallState[]>()

let callStatesCount = 0
const maxCallStatesCount = 1500
const minDeleteCallStatesCount = 500
let nextCallStatesCount = maxCallStatesCount

let usageNextId = 1

export function addFuncCallState<
	TThisOuter,
	TArgs extends any[],
	TInnerResult,
	TThisInner,
>(
	func: Func<TThisInner, TArgs, TInnerResult>,
	thisOuter: TThisOuter,
	callWithArgs: TCall<TArgs>,
	getThisInner: TGetThis<TThisOuter, TArgs, TInnerResult, TThisInner>,
	valueIds: number[],
): IFuncCallState<TThisOuter, TArgs, TInnerResult, TThisInner> {
	const callState = createFuncCallState(
		func,
		thisOuter,
		callWithArgs,
		getThisInner,
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
export function _getFuncCallState<
	TThisOuter,
	TArgs extends any[],
	TInnerResult,
	TThisInner
>(
	func: Func<TThisInner, TArgs, TInnerResult>,
	getThisInner: TGetThis<TThisOuter, TArgs, TInnerResult, TThisInner>,
): Func<TThisOuter, TArgs, FuncCallState<TThisOuter, TArgs, TInnerResult, TThisInner>> {
	const funcId = nextValueId++
	const funcHash = (17 * 31 + funcId) | 0

	return function __getFuncCallState(this: TThisOuter) {
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

			callState = addFuncCallState<TThisOuter, TArgs, TInnerResult, TThisInner>(
				func,
				this,
				createCallWithArgs.apply(null, arguments),
				getThisInner,
				valueIdsClone,
			)

			callStates.push(callState)
		}

		callState.deleteOrder = usageNextId++

		return callState
	}
}

export function deleteFuncCallState(callState: TFuncCallState) {
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

export const reduceCallObjectPool = new ObjectPool<PairingNode<TFuncCallState>>(10000000)
export const reduceCallHeap = new PairingHeap<TFuncCallState>({
	objectPool: reduceCallObjectPool,
	lessThanFunc(o1, o2) {
		return o1.deleteOrder < o2.deleteOrder
	},
})

function reduceCallHeapAdd(states: TFuncCallState[]) {
	for (let i = 0, len = states.length; i < len; i++) {
		const callState = states[i]
		if (!callState.hasSubscribers && !callState.isHandling) {
			reduceCallHeap.add(callState)
		}
	}
}

export function reduceCallStates(deleteSize: number) {
	callStateHashTable.forEach(reduceCallHeapAdd)

	while (deleteSize > 0 && reduceCallHeap.size > 0) {
		const callState = reduceCallHeap.deleteMin()
		const {_unsubscribers, _unsubscribersLength} = callState
		if (_unsubscribers != null) {
			for (let i = 0, len = _unsubscribersLength; i < len; i++) {
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
