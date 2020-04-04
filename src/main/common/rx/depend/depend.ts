import {isThenable, ThenableOrIterator, ThenableOrValue} from '../../async/async'
import {DeferredCalc, IDeferredCalcOptions} from '../deferred-calc/DeferredCalc'
import {CallState, makeDependentFunc, TFuncCall} from './CallState'
import {Func, IDeferredOptions} from './contracts'

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
	deferredOptions: IDeferredOptions,
) {
	const options: IDeferredCalcOptions = {
		delayBeforeCalc: deferredOptions.delayBeforeCalc,
		minTimeBetweenCalc: deferredOptions.minTimeBetweenCalc,
		autoInvalidateInterval: deferredOptions.autoInvalidateInterval,
		timing: null,
	}
	state.deferredOptions = options

	// TODO - remove []
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

/**
 * Inner this same as outer this
 * @param func
 * @param deferredOptions
 * @param canAlwaysRecalc sync, no deferred, without dependencies
 */
export function depend<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
	TResultWrapper = TResultInner,
>(
	func: Func<TThisOuter, TArgs, TResultInner>,
	deferredOptions?: IDeferredOptions,
	canAlwaysRecalc?: boolean,
): Func<
	TThisOuter,
	TArgs,
	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner
> {
	if (canAlwaysRecalc && deferredOptions != null) {
		throw new Error('canAlwaysRecalc should not be deferred')
	}
	return deferredOptions == null
		? makeDependentFunc(func, _funcCall, null, canAlwaysRecalc) as any
		: makeDeferredFunc(func, _funcCall, deferredOptions) as any
}

export function funcCallX<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(state: CallState<TThisOuter, TArgs, TResultInner>): TResultInner {
	return state.callWithArgs(state, state.func) as any
}

/**
 * Inner this as CallState
 * @param func
 * @param deferredOptions
 * @param canAlwaysRecalc sync, no deferred, without dependencies
 */
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
	deferredOptions?: IDeferredOptions,
	canAlwaysRecalc?: boolean,
): Func<
	TThisOuter,
	TArgs,
	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner
> {
	if (canAlwaysRecalc && deferredOptions != null) {
		throw new Error('canAlwaysRecalc should not be deferred')
	}
	return deferredOptions == null
		? makeDependentFunc(func, funcCallX, null, canAlwaysRecalc) as any
		: makeDeferredFunc(func, funcCallX, deferredOptions) as any
}

// endregion
