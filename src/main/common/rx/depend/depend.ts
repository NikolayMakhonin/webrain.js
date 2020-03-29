import {ThenableOrIterator, ThenableOrValue, TReject, TResolve} from '../../async/async'
import {CallState, TCallState, TFuncCall} from './CallState'
import {Func, ICallState, TGetThis} from './contracts'
import {InternalError} from './helpers'
import {makeGetOrCreateCallState} from './makeGetOrCreateCallState'

type TRootStateMap = WeakMap<Func<any, any, any>, Func<any, any, TCallState>>
const rootStateMap: TRootStateMap = new WeakMap()

// region getCallState

// tslint:disable-next-line:no-empty
const EMPTY_FUNC: Func<any, any, any> = () => {}

export function getCallState<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(
	func: Func<TThisOuter, TArgs, TResultInner>,
): Func<
	TThisOuter,
	TArgs,
	ICallState<TThisOuter, TArgs, TResultInner>
> {
	return rootStateMap.get(func) || EMPTY_FUNC
}

// endregion

// region makeDependentFunc

export function createDependentFunc<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(getState: Func<TThisOuter, TArgs, CallState<TThisOuter, TArgs, TResultInner>>)
: Func<
	TThisOuter,
	TArgs,
	Func<
		TThisOuter,
		TArgs,
		TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner
	>
> {
	return function() {
		const state: CallState<TThisOuter, TArgs, TResultInner>
			= getState.apply(this, arguments)
		return state.getValue() as any
	}
}

export function makeDependentFunc<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(
	func: Func<unknown, TArgs, unknown>,
	funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>,
	initCallState?: (state: CallState<TThisOuter, TArgs, TResultInner>) => void,
): Func<
	TThisOuter,
	TArgs,
	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner
> {
	if (rootStateMap.get(func)) {
		throw new InternalError('Multiple call makeDependentFunc() for func: ' + func)
	}

	const getOrCreateCallState = makeGetOrCreateCallState(func, funcCall, initCallState)

	rootStateMap.set(func, getOrCreateCallState)

	const dependentFunc = createDependentFunc(getOrCreateCallState)

	rootStateMap.set(dependentFunc, getOrCreateCallState)

	return dependentFunc as any
}

// endregion

// region depend / dependX

export function _funcCall<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(state: CallState<TThisOuter, TArgs, TResultInner>): TResultInner {
	return state.callWithArgs(state.thisOuter, state.func) as any
}

/** Inner this same as outer this */
export function depend<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	TResultWrapper = TResultInner,
>(
	func: Func<TThisOuter, TArgs, TResultInner>,
): Func<
	TThisOuter,
	TArgs,
	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner
> {
	return makeDependentFunc(func, _funcCall) as any
}

export function funcCallX<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(state: CallState<TThisOuter, TArgs, TResultInner>): TResultInner {
	return state.callWithArgs(state, state.func) as any
}

/** Inner this as CallState */
export function dependX<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(
	func: Func<
		CallState<TThisOuter, TArgs, TResultInner>,
		TArgs,
		TResultInner
	>,
): Func<
	TThisOuter,
	TArgs,
	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner
> {
	return makeDependentFunc(func, funcCallX) as any
}

// endregion
