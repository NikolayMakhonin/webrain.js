import { IThenable, ThenableOrValue } from '../../../async/async';
import { Func } from '../../../helpers/typescript';
import { ISubscriber, IUnsubscribe } from '../../subjects/observable';
import { CallState } from './CallState';
export declare type TCall<TArgs extends any[]> = <TThis, TValue>(_this: TThis, func: Func<TThis, TArgs, TValue>) => TValue;
export interface ILinkItem<T> {
    value: T;
    prev: ILinkItem<T>;
    next: ILinkItem<T>;
}
export declare enum CallStatus {
    Flag_None = 0,
    Flag_Invalidating = 1,
    Flag_Invalidated = 2,
    Mask_Invalidate = 3,
    Flag_Recalc = 4,
    Flag_Parent_Invalidating = 8,
    Flag_Parent_Invalidated = 16,
    Mask_Parent_Invalidate = 24,
    Flag_Parent_Recalc = 32,
    Flag_Check = 128,
    Flag_Calculating = 256,
    Flag_Async = 512,
    Flag_Calculated = 1024,
    Mask_Calculate = 1920,
    Flag_HasValue = 2048,
    Flag_HasError = 4096,
    Flag_InternalError = 8192
}
export declare enum CallStatusShort {
    Handling = "Handling",
    Invalidated = "Invalidated",
    CalculatedValue = "CalculatedValue",
    CalculatedError = "CalculatedError"
}
export declare type TResultOuter<TResultInner> = TResultInner extends Iterator<infer V> ? ThenableOrValue<V> : TResultInner;
export declare type TInnerValue<TResultInner> = TResultInner extends Iterator<infer V> ? V : TResultInner;
export interface IDeferredOptions {
    delayBeforeCalc?: number;
    minTimeBetweenCalc?: number;
    autoInvalidateInterval?: number;
}
export declare type ICallStateAny = ICallState<any, any, any>;
export declare type TCallStateAny = CallState<any, any, any>;
export declare type TFuncCall<TThisOuter, TArgs extends any[], TResultInner> = (state: CallState<TThisOuter, TArgs, TResultInner>) => TResultInner;
export interface ICallState<TThisOuter, TArgs extends any[], TResultInner> {
    readonly func: Func<unknown, TArgs, unknown>;
    readonly _this: TThisOuter;
    readonly callWithArgs: TCall<TArgs>;
    readonly funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>;
    readonly valueIds: Int32Array;
    readonly status: CallStatus;
    readonly valueAsync: IThenable<TInnerValue<TResultInner>>;
    readonly value: TInnerValue<TResultInner>;
    readonly error: any;
    readonly valueOrThrow: TInnerValue<TResultInner>;
    readonly data: {
        [key: string]: any;
        [key: number]: any;
    };
    readonly deferredOptions: IDeferredOptions;
    readonly hasSubscribers: boolean;
    readonly statusShort: CallStatusShort;
    getValue(isLazy?: boolean, dontThrowOnError?: boolean): TResultOuter<TResultInner>;
    invalidate(): void;
    /**
     * Subscribe "on invalidated" or "on calculated"
     * @param subscriber The first argument is {@link ICallState};
     * [statusShort]{@link ICallState.statusShort} is [Invalidated]{@link CallStatusShort.Invalidated},
     * [CalculatedValue]{@link CallStatusShort.CalculatedValue}
     * or [CalculatedError]{@link CallStatusShort.CalculatedError}
     */
    subscribe(subscriber: ISubscriber<this>): IUnsubscribe;
}
