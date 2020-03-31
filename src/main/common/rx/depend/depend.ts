import {isThenable, ThenableOrIterator, ThenableOrValue} from '../../async/async'
import {resolveAsync, ThenableSync} from '../../async/ThenableSync'
import {DeferredCalc, IDeferredCalcOptions} from '../deferred-calc/DeferredCalc'
import {CallState, TCallState, TFuncCall} from './CallState'
import {Func, ICallState, IDeferredOptions} from './contracts'
import {createCallStateProvider, ICallStateProvider} from './createCallStateProvider'
import {InternalError} from './helpers'

type TCallStateProviderMap = WeakMap<Func<any, any, any>, ICallStateProvider<any, any, any>>
const callStateProviderMap: TCallStateProviderMap = new WeakMap()

// region getCallState / getOrCreateCallState

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
	const callStateProvider = callStateProviderMap.get(func)
	return callStateProvider == null
		? EMPTY_FUNC
		: callStateProvider.get
}

export function getOrCreateCallState<
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
	const callStateProvider = callStateProviderMap.get(func)
	return callStateProvider == null
		? EMPTY_FUNC
		: callStateProvider.getOrCreate
}

// endregion

// region makeDependentFunc

export function createDependentFunc<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(callStateProvider: ICallStateProvider<TThisOuter, TArgs, TResultInner>)
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
			= callStateProvider.getOrCreate.apply(this, arguments)
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
	if (callStateProviderMap.get(func)) {
		throw new InternalError('Multiple call makeDependentFunc() for func: ' + func)
	}

	const callStateProvider = createCallStateProvider(func, funcCall, initCallState)

	callStateProviderMap.set(func, callStateProvider)

	const dependentFunc = createDependentFunc(callStateProvider)

	callStateProviderMap.set(dependentFunc, callStateProvider)

	return dependentFunc as any
}

// endregion

// region makeDeferredFunc

function _canBeCalcCallback() {
	this.calc()
}

function _calcFunc() {
	this.done()
}

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

	const thenable = {
		subscribers: [],
		resolved: false,
		then(done) {
			if (this.resolved) {
				done()
			} else {
				this.subscribers.push(done)
			}
			return null
		},
		resolve() {
			this.resolved = true
			for (let i = 0, len = this.subscribers.length; i < len; i++) {
				this.subscribers[i]()
			}
			this.subscribers.length = 0
		},
	}

	let _resolve = null

	const _deferredCalc = new DeferredCalc(
		_canBeCalcCallback,
		_calcFunc,
		() => {
			const __resolve = _resolve
			_resolve = null
			if (__resolve) {
				__resolve()
			}
			thenable.resolve()
		},
		options,
		true,
	)
	state._deferredCalc = _deferredCalc

	const iteratorResult = {
		value: thenable as any,
		done: false,
	}

	let stage = 2
	const iterator: Iterator<TResultInner> = {
		next: () => {
			switch (stage) {
				case 0: {
					stage = 1
					thenable.resolved = false
					_deferredCalc.invalidate()
					iteratorResult.value = thenable
					iteratorResult.done = false
					return iteratorResult
				}
				case 1: {
					stage = 2
					const value = funcCall(state)
					if (isThenable(value)) {
						state._internalError('You should use iterator instead thenable for async functions')
					}
					iteratorResult.value = value
					iteratorResult.done = true
					return iteratorResult
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
