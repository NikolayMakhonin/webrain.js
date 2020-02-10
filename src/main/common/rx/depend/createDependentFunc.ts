import {Func, IFuncCallState} from './contracts'

export function createDependentFunc<
	TThis,
	TArgs extends any[],
	TValue,
>(getState: Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>>) {
	return function() {
		const state = getState.apply(this, arguments)
		return state.dependentFunc()
	}
}
