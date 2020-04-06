// import {ThenableOrIterator, ThenableOrValue} from '../../async/async'
// import {resolveAsync, ThenableSync} from '../../async/ThenableSync'
// import {DeferredCalc, IDeferredCalcOptions} from '../../rx/deferred-calc/DeferredCalc'
// import {ITiming} from '../deferred-calc/timing'
// import {CallState, TFuncCall} from './CallState'
// import {Func} from './contracts'
// import {_funcCall, funcCallX, makeDependentFunc} from './depend'
//
// // region makeDeferredFunc
//
// export function _initDeferredCallState<
// 	TThisOuter,
// 	TArgs extends any[],
// 	TResultInner,
// >(
// 	state: CallState<TThisOuter, TArgs, TResultInner>,
// 	funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>,
// 	defaultOptions: IDeferredOptions,
// ) {
// 	const options: IDeferredCalcOptions = {
// 		throttleTime: defaultOptions.delayBeforeCalc,
// 		maxThrottleTime: defaultOptions.delayBeforeCalc,
// 		minTimeBetweenCalc: defaultOptions.minTimeBetweenCalc,
// 		autoInvalidateInterval: defaultOptions.autoInvalidateInterval,
// 		timing: null,
// 	}
// 	state.deferredOptions = options
//
// 	const _deferred = {
// 		calc: new DeferredCalc(
// 			null,
// 			() => {
// 				const {resolve, reject} = state._deferred
// 				state._deferred.resolve = null
// 				state._deferred.reject = null
// 				resolveAsync(
// 					funcCall(state),
// 					resolve,
// 					reject,
// 				)
// 			},
// 			null,
// 			options,
// 		),
// 		resolve: null,
// 		reject: null,
// 	}
// 	state._deferred = _deferred
//
// 	const iteratorResult = {
// 		value: null,
// 		done: true,
// 	}
//
// 	const executor = (resolve, reject) => {
// 		iteratorResult.value = null
// 		if (_deferred.resolve != null || _deferred.reject != null) {
// 			throw new Error('_deferred.resolve != null || _deferred.reject != null')
// 		}
// 		_deferred.resolve = resolve
// 		_deferred.reject = reject
// 		_deferred.calc.invalidate() // TODO call on state invalidate
// 		_deferred.calc.calc()
// 	}
//
// 	const iterator: Iterator<TResultInner> = {
// 		next: () => {
// 			iteratorResult.value = new ThenableSync(executor)
// 			return iteratorResult
// 		},
// 	}
//
// 	state.funcCall = () => iterator as any
// }
//
// /** Inner this as CallState */
// export function makeDeferredFunc<
// 	TThisOuter,
// 	TArgs extends any[],
// 	TResultInner,
// >(
// 	func: Func<unknown, TArgs, unknown>,
// 	funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>,
// 	defaultOptions: IDeferredOptions,
// ): Func<
// 	TThisOuter,
// 	TArgs,
// 	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : ThenableOrValue<TResultInner>
// > {
// 	return makeDependentFunc(func, null, state => {
// 		_initDeferredCallState(state, funcCall, defaultOptions)
// 	}) as any
// }
//
// // endregion
//
// // region deferred / deferredX
//
// export interface IDeferredOptions {
// 	delayBeforeCalc?: number,
// 	minTimeBetweenCalc?: number,
// 	autoInvalidateInterval?: number,
// 	timing?: ITiming,
// }
//
// /** Inner this same as outer this */
// export function deferred<
// 	TThisOuter,
// 	TArgs extends any[],
// 	TResultInner,
// 	TResultWrapper = TResultInner,
// >(
// 	func: Func<TThisOuter, TArgs, TResultInner>,
// 	defaultOptions: IDeferredOptions,
// ): Func<
// 	TThisOuter,
// 	TArgs,
// 	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner
// > {
// 	return makeDeferredFunc(func, _funcCall, defaultOptions) as any
// }
//
// /** Inner this as CallState */
// export function deferredX<
// 	TThisOuter,
// 	TArgs extends any[],
// 	TResultInner,
// >(
// 	func: Func<
// 		CallState<TThisOuter, TArgs, TResultInner>,
// 		TArgs,
// 		TResultInner
// 	>,
// 	defaultOptions: IDeferredOptions,
// ): Func<
// 	TThisOuter,
// 	TArgs,
// 	TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner
// > {
// 	return makeDeferredFunc(func, funcCallX, defaultOptions) as any
// }
//
// // endregion
