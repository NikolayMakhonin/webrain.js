import { isThenable, IThenable, ThenableOrIteratorOrValue, ThenableOrValue, TOnFulfilled, TOnRejected, TReject, TResolve, TResolveAsyncValue } from './async';
export declare type TExecutor<TValue = any> = (resolve: TResolve<TValue>, reject: TReject) => void;
export declare enum ThenableSyncStatus {
    Resolving = "Resolving",
    Resolved = "Resolved",
    Rejected = "Rejected"
}
export declare function createResolved<TValue = any>(value: ThenableOrIteratorOrValue<TValue>, customResolveValue?: TResolveAsyncValue): ThenableSync<TValue>;
export declare function createRejected<TValue = any>(error: ThenableOrIteratorOrValue<any>, customResolveValue?: TResolveAsyncValue): ThenableSync<TValue>;
export declare class ThenableSync<TValue = any> implements IThenable<TValue> {
    private _onfulfilled;
    private _onrejected;
    private _value;
    private _error;
    private _status;
    private readonly _customResolveValue;
    constructor(executor?: TExecutor<TValue>, customResolveValue?: TResolveAsyncValue);
    resolve(value?: ThenableOrIteratorOrValue<TValue>): void;
    private _resolve;
    private __resolve;
    reject(error?: ThenableOrIteratorOrValue<any>): void;
    private _reject;
    private __reject;
    private _then;
    then<TResult1 = TValue, TResult2 = never>(onfulfilled?: TOnFulfilled<TValue, TResult1>, onrejected?: TOnRejected<TResult2>, customResolveValue?: TResolveAsyncValue | false): ThenableSync<TResult1>;
    thenLast<TResult1 = TValue, TResult2 = never>(onfulfilled?: TOnFulfilled<TValue, TResult1>, onrejected?: TOnRejected<TResult2>, customResolveValue?: TResolveAsyncValue | false): ThenableOrValue<TResult1>;
    static createResolved: typeof createResolved;
    static createRejected: typeof createRejected;
    static isThenable: typeof isThenable;
    static resolve: typeof resolveAsync;
}
export declare function resolveAsync<TValue = any, TResult1 = TValue, TResult2 = never>(input: ThenableOrIteratorOrValue<TValue>, onfulfilled?: TOnFulfilled<TValue, TResult1>, onrejected?: TOnRejected<TResult2>, dontThrowOnImmediateError?: boolean, customResolveValue?: TResolveAsyncValue, isError?: boolean): ThenableOrValue<TResult1>;
export declare function resolveAsyncFunc<TValue = any, TResult1 = TValue, TResult2 = never>(func: () => ThenableOrIteratorOrValue<TValue>, onfulfilled?: TOnFulfilled<TValue, TResult1>, onrejected?: TOnRejected<TResult2>, dontThrowOnImmediateReject?: boolean, customResolveValue?: TResolveAsyncValue): ThenableOrValue<TResult1>;
export declare function resolveAsyncAll<TValue = any, TResult1 = TValue, TResult2 = never>(input: Array<ThenableOrIteratorOrValue<TValue>>, onfulfilled?: TOnFulfilled<TValue[], TResult1>, onrejected?: TOnRejected<TResult2>, dontThrowOnImmediateError?: boolean, customResolveValue?: TResolveAsyncValue): ThenableOrValue<TResult1>;
export declare function resolveAsyncAny<TValue = any, TResult1 = TValue, TResult2 = never>(input: Array<ThenableOrIteratorOrValue<TValue>>, onfulfilled?: TOnFulfilled<TValue, TResult1>, onrejected?: TOnRejected<TResult2>, dontThrowOnImmediateError?: boolean, customResolveValue?: TResolveAsyncValue): ThenableOrValue<TResult1>;
