import {createFuncCallState} from './_dependentFunc'
import {Func, IFuncCallState, IValueState} from './contracts'
import {createCallWithArgs} from './helpers'

const valueStateMap = new Map<any, IValueState>()

let nextValueId: number = 1
function getValueState(value: any): IValueState {
	let state = valueStateMap.get(value)
	if (state == null) {
		nextValueId = (nextValueId + 1) | 0
		state = {
			id: nextValueId,
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

const valueStatesBuffer: IValueState[] = []
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
		const countValueStates = (countArgs + 2) | 0

		valueStatesBuffer[0] = funcState
		let hash = funcHash

		{
			const valueState: IValueState = getValueState(this)
			valueStatesBuffer[1] = valueState
			hash = (hash * 31 + valueState.id) | 0
		}

		for (let i = 0; i < countArgs; i++) {
			const valueState = getValueState(arguments[i])
			valueStatesBuffer[i + 2] = valueState
			hash = (hash * 31 + valueState.id) | 0
		}

		let callState
		let callStates = callStateHashTable.get(hash)
		if (callStates != null) {
			for (let i = 0, len = callStates.length; i < len; i++) {
				const state = callStates[i]
				const valueStates = state.valueStates
				if (valueStates.length === countValueStates) {
					let j = 0
					for (; j < countValueStates; j++) {
						if (valueStates[j] !== valueStatesBuffer[j]) {
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
			const valueStatesClone: IValueState[] = [] // new Array(countValueStates)
			for (let i = 0; i < countValueStates; i++) {
				const valueState = valueStatesBuffer[i]
				valueStatesClone[i] = valueState
				valueState.usageCount = (valueState.usageCount + 1) | 0
			}

			callState = createFuncCallState<TThis, TArgs, TValue>(
				func,
				this,
				createCallWithArgs.apply(null, arguments),
				valueStatesClone,
			)

			callStates.push(callState)
		}

		usageNextId = (usageNextId + 1) | 0
		callState.deletePriority = usageNextId

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
		hash = (hash * 31 + valueState.id) | 0
		const usageCount = valueState.usageCount
		if (usageCount === 1) {
			deleteValueState(valueState)
		} else {
			valueState.usageCount = (usageCount - 1) | 0
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
