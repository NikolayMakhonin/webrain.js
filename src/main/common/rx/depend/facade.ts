import {ThenableOrValue} from '../../async/async'
import {_dependentFunc} from './_dependentFunc'
import {_getFuncCallState} from './_getFuncCallState'
import {_getFuncCallState2} from './_getFuncCallState2'
import {Func, IFuncCallState} from './contracts'
import {InternalError} from './helpers'

export function createDependentFunc<TThis,
	TArgs extends any[],
	TValue,
	>(getState: Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>>) {
	return function() {
		const state = getState.apply(this, arguments)
		return _dependentFunc(state)
	}
}

type TRootStateMap = WeakMap<Func<any, any, any>, Func<any, any, IFuncCallState<any, any, any>>>

// tslint:disable-next-line:no-shadowed-variable
export function createMakeDependentFunc(rootStateMap: TRootStateMap) {
	// tslint:disable-next-line:no-shadowed-variable
	function makeDependentFunc<TThis,
		TArgs extends any[],
		TValue,
		>(func: Func<TThis, TArgs, Iterator<TValue>>): Func<TThis, TArgs, ThenableOrValue<TValue>>
	// tslint:disable-next-line:no-shadowed-variable
	function makeDependentFunc<TThis,
		TArgs extends any[],
		TValue,
		>(func: Func<TThis, TArgs, TValue>): Func<TThis, TArgs, TValue>
	// tslint:disable-next-line:no-shadowed-variable
	function makeDependentFunc<TThis,
		TArgs extends any[],
		TValue,
		>(func: Func<TThis, TArgs, TValue | Iterator<TValue>>): Func<TThis, TArgs, TValue> {
		if (rootStateMap.get(func)) {
			throw new InternalError('Multiple call makeDependentFunc() for func: ' + func)
		}
		const getState = _getFuncCallState2(func)
		rootStateMap.set(func, getState)

		const dependentFunc = createDependentFunc(getState)

		rootStateMap.set(dependentFunc, getState)

		return dependentFunc
	}

	return makeDependentFunc
}

// tslint:disable-next-line:no-empty
const emptyFunc: Func<any, any, any> = () => {
}

// tslint:disable-next-line:no-shadowed-variable
export function createGetFuncCallState(rootStateMap: TRootStateMap) {
	// tslint:disable-next-line:no-shadowed-variable
	function getFuncCallState<TThis,
		TArgs extends any[],
		TValue>(func: Func<TThis, TArgs, TValue>): Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>> {
		return rootStateMap.get(func) || emptyFunc
	}

	return getFuncCallState
}

const rootStateMap: TRootStateMap = new WeakMap()
// tslint:disable-next-line:no-shadowed-variable
export const getFuncCallState = createGetFuncCallState(rootStateMap)
// tslint:disable-next-line:no-shadowed-variable
export const makeDependentFunc = createMakeDependentFunc(rootStateMap)
