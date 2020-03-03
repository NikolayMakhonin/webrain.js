import {IFuncCallState, IValueState} from './contracts'

function compareCallStateByUsage(o1, o2) {
	return o1.usageScore > o2.usageScore
		? 1
		: -1
}

const callStates = []

function reduceCallStates<TThis,
	TArgs extends any[],
	TValue>(
	// tslint:disable-next-line:no-shadowed-variable
	valueStateMap: Map<any, IValueState>,
	callStateHashTable: Map<number, Array<IFuncCallState<TThis, TArgs, TValue>>>,
	reduceSize: number,
) {
	let index = 0
	callStateHashTable.forEach(states => {
		for (let i = 0, len = states.length; i < len; i++) {
			const callState = states[i]
			if (!callState.hasSubscribers) {
				callStates[index++] = callState
			}
		}
	})

	callStates.length = index
	callStates.sort(compareCallStateByUsage)

	for (let i = 0, len = callStates.length; i < len; i++) {

	}
}
