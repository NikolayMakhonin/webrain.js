import {isThenable, ThenableOrIterator, ThenableOrValue} from '../../../async/async'
import {ThenableSync} from '../../../async/ThenableSync'
import {DeferredCalc, IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {CallState, makeDependentFunc, TFuncCall} from './CallState'
import {Func, IDeferredOptions} from './contracts'
import {InternalError} from './helpers'

// region makeDeferredFunc

class SimpleThenable {
	private _subscribers: Array<() => void> = null
	private _resolved: boolean = false

	public then(done: () => void) {
		if (this._resolved) {
			done()
		} else {
			let {_subscribers} = this
			if (_subscribers == null) {
				this._subscribers = _subscribers = []
			}
			_subscribers.push(done)
		}
		return null
	}

	public resolve() {
		if (this._resolved) {
			throw new InternalError('Multiple call resolve()')
		}
		this._resolved = true

		const {_subscribers} = this
		if (_subscribers != null) {
			this._subscribers = null
			for (let i = 0, len = _subscribers.length; i < len; i++) {
				_subscribers[i]()
			}
		}
	}

	public reset() {
		this._resolved = false
		const {_subscribers} = this
		if (_subscribers != null && _subscribers.length > 0) {
			throw new InternalError('reset when it has subscribers')
		}
	}
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

	const thenable = new SimpleThenable()

	const _deferredCalc = new DeferredCalc({
		shouldInvalidate() {
			state.invalidate()
		},
		calcCompletedCallback() {
			thenable.resolve()
		},
		options,
		dontImmediateInvalidate: true,
	})
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
					thenable.reset()
					_deferredCalc.invalidate()
					iteratorResult.value = thenable
					iteratorResult.done = false
					return iteratorResult
				}
				case 1: {
					stage = 2
					const value = funcCall(state)
					if (isThenable(value) && !(value instanceof ThenableSync)) {
						state._internalError('You should use iterator or ThenableSync instead Promise for async functions')
					}
					iteratorResult.value = value
					iteratorResult.done = true
					return iteratorResult
				}
				default:
					throw new InternalError('stage == ' + stage)
			}
		},
		[Symbol.iterator]: () => {
			if (stage !== 2) {
				throw new InternalError('stage == ' + stage)
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
	initCallState?: (state: CallState<TThisOuter, TArgs, TResultInner>) => void,
): Func<
	TThisOuter,
	TArgs,
	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : ThenableOrValue<TResultInner>
> {
	return makeDependentFunc(func, null, state => {
		_initDeferredCallState(state, funcCall, defaultOptions)
		if (initCallState != null) {
			initCallState(state as any)
		}
	}) as any
}

// endregion

// region depend / dependX

export function _funcCall<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
>(state: CallState<TThisOuter, TArgs, TResultInner>): TResultInner {
	return state.callWithArgs(state._this, state.func) as any
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
	initCallState?: (state: CallState<TThisOuter, TArgs, TResultInner>) => void,
	canAlwaysRecalc?: boolean,
): Func<
	TThisOuter,
	TArgs,
	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner
> {
	if (canAlwaysRecalc && deferredOptions != null) {
		throw new InternalError('canAlwaysRecalc should not be deferred')
	}
	return deferredOptions == null
		? makeDependentFunc(func, _funcCall, initCallState, canAlwaysRecalc) as any
		: makeDeferredFunc(func, _funcCall, deferredOptions, initCallState) as any
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
	initCallState?: (state: CallState<TThisOuter, TArgs, TResultInner>) => void,
): Func<
	TThisOuter,
	TArgs,
	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner
> {
	return deferredOptions == null
		? makeDependentFunc(func, funcCallX, initCallState, false) as any
		: makeDeferredFunc(func, funcCallX, deferredOptions, initCallState) as any
}

// endregion

// region dependLazy

// export function dependLazy<
// 	TThis,
// 	TArgs extends any[],
// 	TResult,
// >(
// 	func: Func<
// 		TThis,
// 		TArgs,
// 		TResult
// 	>,
// ): Func<
// 	TThis,
// 	TArgs,
// 	TResult
// > {
// 	return function() {
// 		const state = getOrCreateCallState(func).apply(this, arguments)
// 		const value = state.getValue()
// 		if (!isThenable(value)) {
// 			return value
// 		}
//
// 		value
// 			.then(() => {
// 				state.
// 			})
// 	}
// }

// endregion
