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
	funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>,
): Func<
	TThisOuter,
	TArgs,
	ICallState<TThisOuter, TArgs, TResultInner>
> {
	return rootStateMap.get(funcCall) || EMPTY_FUNC
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
	TResultWrapper = TResultInner,
>(
	func: Func<any, TArgs, TResultInner>,
	funcCall: TFuncCall<TThisOuter, TArgs, TResultWrapper>,
): Func<
	TThisOuter,
	TArgs,
	TResultWrapper extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultWrapper
> {
	if (rootStateMap.get(func)) {
		throw new InternalError('Multiple call makeDependentFunc() for func: ' + func)
	}

	const getOrCreateCallState = makeGetOrCreateCallState(funcCall)

	rootStateMap.set(func, getOrCreateCallState)

	const dependentFunc = createDependentFunc(getOrCreateCallState)

	rootStateMap.set(dependentFunc, getOrCreateCallState)

	return dependentFunc as any
}

// endregion

// region depend / dependX

/** Inner this same as outer this */
export function depend<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	TResultWrapper = TResultInner,
>(
	func: Func<TThisOuter, TArgs, TResultInner>,
) {
	return makeDependentFunc(func, function funcCall() {
		return this.callWithArgs(this.thisOuter, func)
	})
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
) {
	return makeDependentFunc(func, function funcCall() {
		return this.callWithArgs(this, func)
	})
}

// endregion
