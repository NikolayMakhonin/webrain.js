import {ThenableOrValue} from '../../async/async'
import {_getFuncCallState} from './_getFuncCallState'
import {Func, IFuncCallState} from './contracts'
import {createDependFunc} from './createDependentFunc'

export type TRootStateMap = WeakMap<Func<any, any, any>, Func<any, any, IFuncCallState<any, any, any>>>

export function createMakeDependentFunc(rootStateMap: TRootStateMap) {
	function makeDependentFunc<
		TThis,
		TArgs extends any[],
		TValue,
	>(func: Func<TThis, TArgs, Iterator<TValue>>): Func<TThis, TArgs, ThenableOrValue<TValue>>
	function makeDependentFunc<
		TThis,
		TArgs extends any[],
		TValue,
	>(func: Func<TThis, TArgs, TValue>): Func<TThis, TArgs, TValue>
	function makeDependentFunc<
		TThis,
		TArgs extends any[],
		TValue,
	>(func: Func<TThis, TArgs, TValue | Iterator<TValue>>): Func<TThis, TArgs, TValue> {
		if (rootStateMap.get(func)) {
			throw new Error('Multiple call makeDependentFunc() for func: ' + func)
		}
		const getState = _getFuncCallState(func, new Map<number, any>())
		rootStateMap.set(func, getState)

		const dependentFunc = createDependFunc(getState)

		rootStateMap.set(dependentFunc, getState)

		return dependentFunc
	}

	return makeDependentFunc
}
