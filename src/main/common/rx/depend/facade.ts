import {ThenableOrIterator, ThenableOrValue} from '../../async/async'
import {getOrCreateFuncCallState} from './_getFuncCallState'
import {Func, IFuncCallState, TGetThis} from './contracts'
import {TFuncCallState} from './FuncCallState'
import {InternalError} from './helpers'

export function createDependentFunc<
	TThisOuter,
	TArgs extends any[],
	TInnerResult,
	TThisInner
>(getState: Func<TThisOuter, TArgs, IFuncCallState<TThisOuter, TArgs, TInnerResult, TThisInner>>): Func<
	TThisOuter,
	TArgs,
	Func<
		TThisOuter,
		TArgs,
		TInnerResult extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TInnerResult
	>
> {
	return function() {
		const state: IFuncCallState<TThisOuter, TArgs, TInnerResult, TThisInner>
			= getState.apply(this, arguments)
		return state.getValue() as any
	}
}

type TRootStateMap = WeakMap<Func<any, any, any>, Func<any, any, TFuncCallState>>

// interface TMakeDependentFunc {
// 	<TThisOuter, TArgs extends any[], TInnerResult, TThisInner>(
// 		func: Func<TThisInner, TArgs, Iterator<TInnerResult>>,
// 	): Func<TThisInner, TArgs, ThenableOrValue<TInnerResult>>
//
// 	<TThisOuter, TArgs extends any[], TInnerResult, TThisInner>(
// 		func: Func<TThisInner, TArgs, TInnerResult>,
// 	): Func<TThisInner, TArgs, TInnerResult>
// }

// type TMakeDependentFunc = <
// 	TThisOuter,
// 	TArgs extends any[],
// 	TInnerResult
// >(
// 	func: Func<TThisOuter, TArgs, TInnerResult>,
// ) => Func<
// 	TThisOuter,
// 	TArgs,
// 	TInnerResult extends Iterator<infer V, any, any> ? ThenableOrValue<V> : TInnerResult
// >
//
// type TMakeDependentFuncX = <
// 	TThisOuter,
// 	TArgs extends any[],
// 	TInnerResult,
// >(
// 	func: Func<IFuncCallState<TThisOuter, TArgs, TInnerResult>, TArgs, TInnerResult>,
// ) => Func<
// 	TThisOuter,
// 	TArgs,
// 	TInnerResult extends Iterator<infer V, any, any> ? ThenableOrValue<V> : TInnerResult
// >

// tslint:disable-next-line:no-empty
const EMPTY_FUNC: Func<any, any, any> = () => {}

// tslint:disable-next-line:no-shadowed-variable
export function createGetFuncCallState(rootStateMap: TRootStateMap) {
	// tslint:disable-next-line:no-shadowed-variable
	function getFuncCallState<
		TThisOuter,
		TArgs extends any[],
		TInnerResult,
		TThisInner
	>(
		func: Func<TThisOuter, TArgs, TInnerResult>,
	): Func<TThisOuter, TArgs, IFuncCallState<TThisOuter, TArgs, TInnerResult, TThisInner>> {
		return rootStateMap.get(func) || EMPTY_FUNC
	}

	return getFuncCallState
}

const rootStateMap: TRootStateMap = new WeakMap()
// tslint:disable-next-line:no-shadowed-variable
export const getFuncCallState = createGetFuncCallState(rootStateMap)

function makeDependentFunc<
	TThisOuter,
	TArgs extends any[],
	TInnerResult,
	TThisInner
>(
	func: Func<TThisInner, TArgs, TInnerResult>,
	getThisInner: TGetThis<TThisOuter, TArgs, TInnerResult, TThisInner>,
): Func<
	TThisOuter,
	TArgs,
	TInnerResult extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TInnerResult
> {
	if (rootStateMap.get(func)) {
		throw new InternalError('Multiple call makeDependentFunc() for func: ' + func)
	}

	const getState = getOrCreateFuncCallState(func, getThisInner)

	rootStateMap.set(func, getState)

	const dependentFunc = createDependentFunc(getState)

	rootStateMap.set(dependentFunc, getState)

	return dependentFunc as any
}

function ThisAsOrig<
	TThisOuter,
	TArgs extends any[],
	TInnerResult,
	TThisInner
>(this: IFuncCallState<TThisOuter, TArgs, TInnerResult, TThisInner>): TThisOuter {
	return this.thisOuter
}

function ThisAsState<
	TThisOuter,
	TArgs extends any[],
	TInnerResult,
	TThisInner
>(
	this: IFuncCallState<TThisOuter, TArgs, TInnerResult, TThisInner>,
): IFuncCallState<TThisOuter, TArgs, TInnerResult, TThisInner> {
	return this
}

interface TFuncCallStateX<TThisOuter, TArgs extends any[], TInnerResult>
	extends IFuncCallState<TThisOuter, TArgs, TInnerResult, TFuncCallStateX<TThisOuter, TArgs, TInnerResult>>
{}

export function dependX<
	TThisOuter,
	TArgs extends any[],
	TInnerResult
>(func: Func<TFuncCallStateX<TThisOuter, TArgs, TInnerResult>, TArgs, TInnerResult>) {
	return makeDependentFunc<TThisOuter, TArgs, TInnerResult, TFuncCallStateX<TThisOuter, TArgs, TInnerResult>>
		(func, ThisAsState)
}

export function depend<
	TThisOuter,
	TArgs extends any[],
	TInnerResult,
>(func: Func<TThisOuter, TArgs, TInnerResult>) {
	return makeDependentFunc<TThisOuter, TArgs, TInnerResult, TThisOuter>
		(func, ThisAsOrig)
}
