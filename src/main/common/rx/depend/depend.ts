import {isThenable, ThenableOrIterator, ThenableOrValue} from '../../async/async'
import {resolveAsync, ThenableSync} from '../../async/ThenableSync'
import {DeferredCalc, IDeferredCalcOptions} from '../deferred-calc/DeferredCalc'
import {CallState, TCallState, TFuncCall} from './CallState'
import {Func, ICallState, IDeferredOptions} from './contracts'
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

// region makeDeferredFunc

export function _initDeferredCallState<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(
	state: CallState<TThisOuter, TArgs, TResultInner>,
	funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>,
	defaultOptions: IDeferredOptions,
) {
	const options: IDeferredCalcOptions = {
		delayBeforeCalc: defaultOptions.delayBeforeCalc,
		minTimeBetweenCalc: defaultOptions.minTimeBetweenCalc,
		autoInvalidateInterval: defaultOptions.autoInvalidateInterval,
		timing: null,
	}
	state.deferredOptions = options

	let _resolve = null

	const _deferredCalc = new DeferredCalc(
		function() {
			this.calc()
		},
		done => {
			done()
		},
		() => {
			const __resolve = _resolve
			_resolve = null
			__resolve()
		},
		options,
		true,
	)
	state._deferredCalc = _deferredCalc

	const executor = resolve => {
		if (_resolve != null) {
			throw new Error('_resolve != null')
		}
		_resolve = resolve
		_deferredCalc.invalidate()
	}

	let stage = 2

	const iterator: Iterator<TResultInner> = {
		next: () => {
			switch (stage) {
				case 0: {
					stage = 1
					const value = new ThenableSync(executor)
					return {
						value,
						done: false,
					}
				}
				case 1: {
					stage = 2
					const value = funcCall(state)
					if (isThenable(value)) {
						state._internalError('You should use iterator instead thenable for async functions')
					}
					return {
						value,
						done: true,
					}
				}
				default:
					throw new Error('stage == ' + stage)
			}
		},
		[Symbol.iterator]: () => {
			if (stage !== 2) {
				throw new Error('stage == ' + stage)
			}
			stage = 0
			return iterator
		},
	} as any

	state.funcCall = iterator[Symbol.iterator]
}

/** Inner this as CallState */
export function makeDeferredFunc<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(
	func: Func<unknown, TArgs, unknown>,
	funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>,
	defaultOptions: IDeferredOptions,
): Func<
	TThisOuter,
	TArgs,
	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : ThenableOrValue<TResultInner>
> {
	return makeDependentFunc(func, null, state => {
		_initDeferredCallState(state, funcCall, defaultOptions)
	}) as any
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
	defaultOptions?: IDeferredOptions,
): Func<
	TThisOuter,
	TArgs,
	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner
> {
	return defaultOptions == null
		? makeDependentFunc(func, _funcCall) as any
		: makeDeferredFunc(func, _funcCall, defaultOptions) as any
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
	defaultOptions?: IDeferredOptions,
): Func<
	TThisOuter,
	TArgs,
	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner
> {
	return defaultOptions == null
		? makeDependentFunc(func, funcCallX) as any
		: makeDeferredFunc(func, funcCallX, defaultOptions) as any
}

// endregion
