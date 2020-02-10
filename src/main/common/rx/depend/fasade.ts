import {ThenableOrValue} from '../../async/async'
import {Func, IFuncCallState} from './contracts'
import {_getFuncCallState} from './_getFuncCallState'

export function createDependentFunc<TThis,
	TArgs extends any[],
	TValue,
	>(getState: Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>>) {
	return function () {
		const state = getState.apply(this, arguments)
		return state.dependentFunc()
	}
}

export type TRootStateMap = WeakMap<Func<any, any, any>, Func<any, any, IFuncCallState<any, any, any>>>

export function createMakeDependentFunc(rootStateMap: TRootStateMap) {
	function makeDependentFunc<TThis,
		TArgs extends any[],
		TValue,
		>(func: Func<TThis, TArgs, Iterator<TValue>>): Func<TThis, TArgs, ThenableOrValue<TValue>>
	function makeDependentFunc<TThis,
		TArgs extends any[],
		TValue,
		>(func: Func<TThis, TArgs, TValue>): Func<TThis, TArgs, TValue>
	function makeDependentFunc<TThis,
		TArgs extends any[],
		TValue,
		>(func: Func<TThis, TArgs, TValue | Iterator<TValue>>): Func<TThis, TArgs, TValue> {
		if (rootStateMap.get(func)) {
			throw new Error('Multiple call makeDependentFunc() for func: ' + func)
		}
		const getState = _getFuncCallState(func, new Map<number, any>())
		rootStateMap.set(func, getState)

		const dependentFunc = createDependentFunc(getState)

		rootStateMap.set(dependentFunc, getState)

		return dependentFunc
	}

	return makeDependentFunc
}// tslint:disable-next-line:no-empty
const emptyFunc: Func<any, any, any> = () => {
}

export function createGetFuncCallState(rootStateMap: TRootStateMap) {
	function getFuncCallState<TThis,
		TArgs extends any[],
		TValue>(func: Func<TThis, TArgs, TValue>): Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>> {
		return rootStateMap.get(func) || emptyFunc
	}

	return getFuncCallState
}

const rootStateMap: TRootStateMap = new WeakMap()
export const getFuncCallState = createGetFuncCallState(rootStateMap)
export const makeDependentFunc = createMakeDependentFunc(rootStateMap)