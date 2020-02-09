import {Func, IFuncCallState} from './contracts'
import {TRootStateMap} from './createMakeDependentFunc'

// tslint:disable-next-line:no-empty
const emptyFunc: Func<any, any, any> = () => {}

export function createGetFuncCallState(rootStateMap: TRootStateMap) {
	function getFuncCallState<TThis,
		TArgs extends any[],
		TValue>(func: Func<TThis, TArgs, TValue>): Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>> {
		return rootStateMap.get(func) || emptyFunc
	}

	return getFuncCallState
}
