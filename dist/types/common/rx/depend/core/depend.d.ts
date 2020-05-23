import { ThenableOrIterator, ThenableOrValue } from '../../../async/async';
import { Func } from '../../../helpers/typescript';
import { CallState } from './CallState';
import { IDeferredOptions, TFuncCall } from './contracts';
export declare function _initDeferredCallState<TThisOuter, TArgs extends any[], TResultInner>(state: CallState<TThisOuter, TArgs, TResultInner>, funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>, deferredOptions: IDeferredOptions): void;
/** Inner this as CallState */
export declare function makeDeferredFunc<TThisOuter, TArgs extends any[], TResultInner>(func: Func<unknown, TArgs, unknown>, funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>, defaultOptions: IDeferredOptions, initCallState?: (state: CallState<TThisOuter, TArgs, TResultInner>) => void): Func<TThisOuter, TArgs, TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : ThenableOrValue<TResultInner>>;
export declare function _funcCall<TThisOuter, TArgs extends any[], TResultInner>(state: CallState<TThisOuter, TArgs, TResultInner>): TResultInner;
/**
 * Inner this same as outer this
 * @param func
 * @param deferredOptions
 * @param canAlwaysRecalc sync, no deferred, without dependencies
 */
export declare function depend<TThisOuter, TArgs extends any[], TResultInner, TResultWrapper = TResultInner>(func: Func<TThisOuter, TArgs, TResultInner>, deferredOptions?: IDeferredOptions, initCallState?: (state: CallState<TThisOuter, TArgs, TResultInner>) => void, canAlwaysRecalc?: boolean): Func<TThisOuter, TArgs, TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner>;
export declare function funcCallX<TThisOuter, TArgs extends any[], TResultInner>(state: CallState<TThisOuter, TArgs, TResultInner>): TResultInner;
/**
 * Inner this as CallState
 * @param func
 * @param deferredOptions
 */
export declare function dependX<TThisOuter, TArgs extends any[], TResultInner>(func: Func<CallState<TThisOuter, TArgs, TResultInner>, TArgs, TResultInner>, deferredOptions?: IDeferredOptions, initCallState?: (state: CallState<TThisOuter, TArgs, TResultInner>) => void): Func<TThisOuter, TArgs, TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner>;
