import {ObjectPool} from '../../lists/ObjectPool'
import {PairingHeap, PairingNode} from '../../lists/PairingHeap'
import {deleteFuncCallState} from './_getFuncCallState2'
import {IFuncCallState, IValueState} from './contracts'

function compareCallStateByDeletePriority(o1, o2) {
	return o1.deletePriority > o2.deletePriority
		? 1
		: -1
}

const reduceCallObjectPool = new ObjectPool<PairingNode<IFuncCallState<any, any, any>, number>>(10000000)
const reduceCallHeap = new PairingHeap<IFuncCallState<any, any, any>, number>(reduceCallObjectPool)

function reduceCallStates<TThis,
	TArgs extends any[],
	TValue>(
	// tslint:disable-next-line:no-shadowed-variable
	valueStateMap: Map<any, IValueState>,
	callStateHashTable: Map<number, Array<IFuncCallState<TThis, TArgs, TValue>>>,
	deleteSize: number,
) {
	callStateHashTable.forEach(states => {
		for (let i = 0, len = states.length; i < len; i++) {
			const callState = states[i]
			if (!callState.hasSubscribers) {
				reduceCallHeap.add(callState, callState.deletePriority)
			}
		}
	})

	while (deleteSize > 0) {
		const callState = reduceCallHeap.deleteMin()
		deleteFuncCallState(callState.item)
		deleteSize--
	}
}
