import { IThenable, ThenableOrIterator, ThenableOrValue } from '../../../async/async';
import { Func } from '../../../helpers/typescript';
import { ObjectPool } from '../../../lists/ObjectPool';
import { PairingHeap } from '../../../lists/PairingHeap';
import { IDeferredCalcOptions } from '../../deferred-calc/DeferredCalc';
import { ISubscriber, IUnsubscribe } from '../../subjects/observable';
import { CallStatus, CallStatusShort, ICallState, ILinkItem, TCall, TCallStateAny, TFuncCall, TInnerValue, TResultOuter } from './contracts';
export declare type Flag_None = 0;
export declare type Flag_Invalidating = 1;
export declare type Flag_Invalidated = 2;
export declare type Mask_Invalidate = (0 | Flag_Invalidating | Flag_Invalidated);
export declare type Flag_Recalc = 4;
export declare type Flag_Parent_Invalidating = 8;
export declare type Flag_Parent_Invalidated = 16;
export declare type Mask_Parent_Invalidate = (0 | Flag_Parent_Invalidating | Flag_Parent_Invalidated);
export declare type Flag_Parent_Recalc = 32;
export declare type Flag_Check = 128;
export declare type Flag_Calculating = 256;
export declare type Flag_Async = 512;
export declare type Flag_Calculated = 1024;
export declare type Mask_Calculate = (0 | Flag_Check | Flag_Calculating | Flag_Async | Flag_Calculated);
export declare type Flag_HasValue = 2048;
export declare type Flag_HasError = 4096;
export declare type Flag_InternalError = 8192;
export declare type Update_Invalidating = Flag_Invalidating;
export declare type Update_Invalidated = Flag_Invalidated;
export declare type Update_Recalc = 4;
export declare type Update_Invalidating_Recalc = 5;
export declare type Update_Invalidated_Recalc = 6;
export declare type Update_Check = Flag_Check;
export declare type Update_Check_Async = 640;
export declare type Update_Calculating = Flag_Calculating;
export declare type Update_Calculating_Async = 768;
export declare type Update_Calculated_Value = 3072;
export declare type Update_Calculated_Error = 5120;
export declare type Mask_Update_Invalidate = Update_Invalidating | Update_Invalidated | Update_Recalc | Update_Invalidating_Recalc | Update_Invalidated_Recalc;
export declare type Mask_Update = Mask_Update_Invalidate | Update_Check | Update_Check_Async | Update_Calculating | Update_Calculating_Async | Update_Calculated_Value | Update_Calculated_Error;
export declare const Flag_None: Flag_None;
export declare const Flag_Invalidating: Flag_Invalidating;
export declare const Flag_Invalidated: Flag_Invalidated;
export declare const Mask_Invalidate = 3;
export declare const Flag_Recalc: Flag_Recalc;
export declare const Flag_Parent_Invalidating: Flag_Parent_Invalidating;
export declare const Flag_Parent_Invalidated: Flag_Parent_Invalidated;
export declare const Mask_Parent_Invalidate = 24;
export declare const Flag_Parent_Recalc: Flag_Parent_Recalc;
export declare const Flag_Check: Flag_Check;
export declare const Flag_Calculating: Flag_Calculating;
export declare const Flag_Async: Flag_Async;
export declare const Flag_Calculated: Flag_Calculated;
export declare const Mask_Calculate = 1920;
export declare const Flag_HasValue: Flag_HasValue;
export declare const Flag_HasError: Flag_HasError;
export declare const Flag_InternalError: Flag_InternalError;
export declare const Update_Invalidating: Update_Invalidating;
export declare const Update_Invalidated: Update_Invalidated;
export declare const Update_Recalc: Update_Recalc;
export declare const Update_Invalidating_Recalc: Update_Invalidating_Recalc;
export declare const Update_Invalidated_Recalc: Update_Invalidated_Recalc;
export declare const Update_Check: Update_Check;
export declare const Update_Check_Async: Update_Check_Async;
export declare const Update_Calculating: Update_Calculating;
export declare const Update_Calculating_Async: Update_Calculating_Async;
export declare const Update_Calculated_Value: Update_Calculated_Value;
export declare const Update_Calculated_Error: Update_Calculated_Error;
export declare const Mask_Update_Invalidate: number;
export declare const Mask_Update: number;
export declare function getInvalidate(status: CallStatus): Mask_Invalidate;
export declare function setInvalidate(status: CallStatus, value: Mask_Invalidate | Flag_None): CallStatus;
export declare function isInvalidating(status: CallStatus): boolean;
export declare function isInvalidated(status: CallStatus): boolean;
export declare function isRecalc(status: CallStatus): boolean;
export declare function setRecalc(status: CallStatus, value: boolean): CallStatus;
export declare function getCalculate(status: CallStatus): Mask_Calculate;
export declare function setCalculate(status: CallStatus, value: Mask_Calculate | Flag_None): CallStatus;
export declare function isCheck(status: CallStatus): boolean;
export declare function isCalculating(status: CallStatus): boolean;
export declare function isCalculated(status: CallStatus): boolean;
export declare function isHasValue(status: CallStatus): boolean;
export declare function setHasValue(status: CallStatus, value: boolean): CallStatus;
export declare function isHasError(status: CallStatus): boolean;
export declare function setHasError(status: CallStatus, value: boolean): CallStatus;
export declare function statusToString(status: CallStatus): string;
export declare function toStatusShort(status: CallStatus): CallStatusShort;
export declare const ALWAYS_CHANGE_VALUE: String;
export declare const NO_CHANGE_VALUE: String;
export declare type TSubscriberLink = ISubscriberLink<any, any>;
export interface ISubscriberLink<TState extends TCallStateAny, TSubscriber extends TCallStateAny> extends ILinkItem<TSubscriber> {
    state: TState;
    prev: ISubscriberLink<TState, any>;
    next: ISubscriberLink<TState, any>;
    isLazy: boolean;
}
export declare const subscriberLinkPool: ObjectPool<TSubscriberLink>;
export declare function releaseSubscriberLink(obj: TSubscriberLink): void;
export declare function getSubscriberLink<TState extends TCallStateAny, TSubscriber extends TCallStateAny>(state: TState, subscriber: TSubscriber, prev: ISubscriberLink<TState, any>, next: ISubscriberLink<TState, any>, isLazy: boolean): ISubscriberLink<TState, TSubscriber>;
export declare function subscriberLinkDelete<TState extends TCallStateAny>(item: ISubscriberLink<TState, any>): void;
export declare function invalidateParent<TState extends TCallStateAny, TSubscriber extends TCallStateAny>(link: ISubscriberLink<TState, TSubscriber>, status: Mask_Update_Invalidate): ISubscriberLink<TState, any>;
export declare class CallState<TThisOuter, TArgs extends any[], TResultInner> implements ICallState<TThisOuter, TArgs, TResultInner> {
    constructor(func: Func<unknown, TArgs, unknown>, thisOuter: TThisOuter, callWithArgs: TCall<TArgs>, funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>, valueIds: Int32Array);
    readonly func: Func<unknown, TArgs, unknown>;
    readonly _this: TThisOuter;
    readonly callWithArgs: TCall<TArgs>;
    funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>;
    readonly valueIds: Int32Array;
    status: CallStatus;
    valueAsync: IThenable<TInnerValue<TResultInner>>;
    value: TInnerValue<TResultInner>;
    error: any;
    get valueOrThrow(): TInnerValue<TResultInner>;
    private _data;
    get data(): {
        [key: string]: any;
        [key: number]: any;
    };
    deferredOptions: IDeferredCalcOptions;
    private _parentCallState;
    private _callId;
    private _changedSubject;
    get hasSubscribers(): boolean;
    get statusShort(): CallStatusShort;
    get statusString(): string;
    getValue(isLazy?: boolean, dontThrowOnError?: boolean): TResultOuter<TResultInner>;
    private _calc;
    private _subscribeDependency;
    private _subscribe;
    private _checkDependenciesChangedAsync;
    private _checkDependenciesChanged;
    private _updateCheck;
    private _updateCheckAsync;
    private _updateCalculating;
    private _updateCalculatingAsync;
    private _updateCalculated;
    private _updateCalculatedValue;
    private _updateCalculatedError;
    private _afterCalc;
    invalidate(): void;
    private _invalidateParents;
    private onChanged;
    /**
     * Subscribe "on invalidated" or "on calculated"
     * @param subscriber The first argument is {@link ICallState};
     * [statusShort]{@link ICallState.statusShort} is [Invalidated]{@link CallStatusShort.Invalidated},
     * [CalculatedValue]{@link CallStatusShort.CalculatedValue}
     * or [CalculatedError]{@link CallStatusShort.CalculatedError}
     */
    subscribe(subscriber: ISubscriber<this>): IUnsubscribe;
}
export interface IValueState {
    usageCount: number;
    value: any;
}
export declare const valueIdToStateMap: Map<number, IValueState>;
export declare const valueToIdMap: Map<any, number>;
export declare function getValueState(valueId: number): IValueState;
export declare function getValueId(value: any): number;
export declare function getOrCreateValueId(value: any): number;
export declare function deleteValueState(valueId: number, value: any): void;
interface ICallStateProvider<TThisOuter, TArgs extends any[], TResultInner> {
    get: Func<TThisOuter, TArgs, CallState<TThisOuter, TArgs, TResultInner>>;
    getOrCreate: Func<TThisOuter, TArgs, CallState<TThisOuter, TArgs, TResultInner>>;
    func: Func<unknown, TArgs, unknown>;
    dependFunc: Func<TThisOuter, TArgs, TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner>;
    isBindThis: boolean;
}
export declare function createCallStateProvider<TThisOuter, TArgs extends any[], TResultInner>(func: Func<unknown, TArgs, unknown>, funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>, initCallState: (state: CallState<TThisOuter, TArgs, TResultInner>) => void): ICallStateProvider<TThisOuter, TArgs, TResultInner>;
export declare function invalidateCallState<TThisOuter, TArgs extends any[], TResultInner>(state: ICallState<TThisOuter, TArgs, TResultInner>): boolean;
export declare function subscribeCallState<TThisOuter, TArgs extends any[], TResultInner>(callState: ICallState<TThisOuter, TArgs, TResultInner>, subscriber?: ISubscriber<ICallState<TThisOuter, TArgs, TResultInner>>): IUnsubscribe;
export declare function getCallState<TThisOuter, TArgs extends any[], TResultInner>(func: Func<TThisOuter, TArgs, TResultInner>): Func<TThisOuter, TArgs, ICallState<TThisOuter, TArgs, TResultInner>>;
export declare function getOrCreateCallState<TThisOuter, TArgs extends any[], TResultInner>(func: Func<TThisOuter, TArgs, TResultInner>): Func<TThisOuter, TArgs, ICallState<TThisOuter, TArgs, TResultInner>>;
export declare function dependBindThis<TThis, TArgs extends any[], TResult>(_this: TThis, func: Func<TThis, TArgs, TResult>): Func<never, TArgs, TResult>;
export declare const callStateHashTable: Map<number, TCallStateAny[]>;
export declare function deleteCallState(callState: TCallStateAny): void;
export declare const reduceCallStatesHeap: PairingHeap<TCallStateAny>;
export declare function reduceCallStates(deleteSize: number, _minCallStateLifeTime: number): number;
export declare function createDependentFunc<TThisOuter, TArgs extends any[], TResultInner>(func: Func<unknown, TArgs, unknown>, callStateProvider: ICallStateProvider<TThisOuter, TArgs, TResultInner>, canAlwaysRecalc: boolean): Func<TThisOuter, TArgs, Func<TThisOuter, TArgs, TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner>>;
/**
 * @param canAlwaysRecalc sync, no deferred, without dependencies
 */
export declare function makeDependentFunc<TThisOuter, TArgs extends any[], TResultInner>(func: Func<unknown, TArgs, unknown>, funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>, initCallState?: (state: CallState<TThisOuter, TArgs, TResultInner>) => void, canAlwaysRecalc?: boolean): Func<TThisOuter, TArgs, TResultInner extends ThenableOrIterator<infer V> ? ThenableOrValue<V> : TResultInner>;
export {};
