export declare type ThenableOrValue<T> = T | Thenable<T>;
export declare type ThenableOrIterator<T> = ThenableIterator<T> | ThenableOrIteratorOrValueNested<T>;
export declare type ThenableOrIteratorOrValue<T> = T | ThenableOrIterator<T>;
export declare type AsyncValueOf<T> = T extends ThenableOrIterator<infer V> ? V : T;
export interface ThenableOrIteratorOrValueNested<T> extends Thenable<ThenableOrIteratorOrValue<T>> {
}
export interface ThenableIterator<T> extends Iterator<ThenableOrIteratorOrValue<T | any>> {
}
export declare type TOnFulfilled<TValue = any, TResult = any> = (value: TValue) => ThenableOrIteratorOrValue<TResult>;
export declare type TOnRejected<TResult = any> = (error: any) => ThenableOrIteratorOrValue<TResult>;
export declare type TResolve<TValue> = (value?: ThenableOrIteratorOrValue<TValue>) => void;
export declare type TReject = (error?: any) => void;
export declare type TResolveAsyncValue<TValue = any, TResult = any> = (value: TValue) => ThenableOrIteratorOrValue<TResult>;
export interface Thenable<T = any> {
    then<TResult1 = T, TResult2 = never>(onfulfilled?: TOnFulfilled<T, TResult1>, onrejected?: TOnRejected<TResult2>): Thenable<TResult1 | TResult2>;
}
export declare function isThenable(value: any): boolean;
export declare function isAsync(value: any): boolean;
export declare enum ResolveResult {
    None = 0,
    Immediate = 1,
    Deferred = 2,
    Error = 4,
    ImmediateError = 5,
    DeferredError = 6
}
export declare function resolveIterator<T>(iterator: ThenableIterator<T>, isError: boolean, onImmediate: (value: ThenableOrIteratorOrValue<T>, isError: boolean) => void, onDeferred: (value: ThenableOrIteratorOrValue<T>, isError: boolean) => void, customResolveValue: TResolveAsyncValue<T>): ResolveResult;
export declare function resolveThenable<T>(thenable: ThenableOrIteratorOrValueNested<T>, isError: boolean, onImmediate: (value: ThenableOrIteratorOrValue<T>, isError: boolean) => void, onDeferred: (value: ThenableOrIteratorOrValue<T>, isError: boolean) => void): ResolveResult;
export declare function resolveValue<T>(value: ThenableOrIteratorOrValue<T>, onImmediate: (value: T, isError: boolean) => void, onDeferred: (value: T, isError: boolean) => void, customResolveValue?: TResolveAsyncValue<T>): ResolveResult;
export declare function resolveValueFunc<T>(func: () => ThenableOrIteratorOrValue<T>, onImmediate: (value: T, isError: boolean) => void, onDeferred: (value: T, isError: boolean) => void, customResolveValue: TResolveAsyncValue<T>): ResolveResult;
