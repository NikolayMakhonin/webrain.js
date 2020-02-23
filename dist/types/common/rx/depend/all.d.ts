import { ThenableOrValue } from '../../async/async';
import { Func, FuncCallStatus, IFuncCallState, ISubscriberLink, TCall } from './contracts';
export declare class SubscriberLinkPool {
    size: number;
    maxSize: number;
    stack: any[];
}
export declare const subscriberLinkPool: SubscriberLinkPool;
export declare let poolFirst: ISubscriberLink<any, any, any>;
export declare let poolLast: ISubscriberLink<any, any, any>;
export declare function getSubscriberLinkFromPool<TThis, TArgs extends any[], TValue>(): ISubscriberLink<TThis, TArgs, TValue>;
export declare function releaseSubscriberLink<TThis, TArgs extends any[], TValue>(obj: ISubscriberLink<TThis, TArgs, TValue>): void;
export declare function getSubscriberLink<TThis, TArgs extends any[], TValue>(state: IFuncCallState<TThis, TArgs, TValue>, subscriber: IFuncCallState<TThis, TArgs, TValue>, prev: ISubscriberLink<TThis, TArgs, TValue>, next: ISubscriberLink<TThis, TArgs, TValue>): ISubscriberLink<TThis, TArgs, TValue>;
export declare function subscriberLinkDelete<TThis, TArgs extends any[], TValue>(state: IFuncCallState<TThis, TArgs, TValue>, item: any): void;
export declare function unsubscribeDependencies<TThis, TArgs extends any[], TValue>(state: IFuncCallState<TThis, TArgs, TValue>): void;
export declare function _subscribe<TThis, TArgs extends any[], TValue>(state: IFuncCallState<TThis, TArgs, TValue>, subscriber: IFuncCallState<TThis, TArgs, TValue>): ISubscriberLink<TThis, TArgs, TValue>;
export declare function subscribeDependency<TThis, TArgs extends any[], TValue>(state: IFuncCallState<TThis, TArgs, TValue>, dependency: any): void;
export declare function update<TThis, TArgs extends any[], TValue>(state: IFuncCallState<TThis, TArgs, TValue>, status: FuncCallStatus, valueAsyncOrValueOrError?: any): void;
export declare function invalidate<TThis, TArgs extends any[], TValue>(state: IFuncCallState<TThis, TArgs, TValue>, status?: FuncCallStatus): void;
export declare function emit<TThis, TArgs extends any[], TValue>(state: IFuncCallState<TThis, TArgs, TValue>, status: any): void;
export declare class FuncCallState<TThis, TArgs extends any[], TValue> {
    constructor(func: Func<TThis, TArgs, TValue>, _this: TThis, callWithArgs: TCall<TArgs>);
    readonly func: Func<TThis, TArgs, TValue>;
    readonly _this: TThis;
    readonly callWithArgs: TCall<TArgs>;
    status: FuncCallStatus;
    hasValue: boolean;
    hasError: boolean;
    valueAsync: any;
    value: any;
    error: any;
    parentCallState: any;
    _subscribersFirst: any;
    _subscribersLast: any;
    callId: number;
    _unsubscribers: any;
    _unsubscribersLength: number;
}
export declare function createFuncCallState<TThis, TArgs extends any[], TValue>(func: Func<TThis, TArgs, TValue>, _this: TThis, callWithArgs: TCall<TArgs>): IFuncCallState<TThis, TArgs, TValue>;
export declare function _dependentFunc<TThis, TArgs extends any[], TValue>(state: IFuncCallState<TThis, TArgs, TValue>): any;
export declare function makeDependentIterator<TThis, TArgs extends any[], TValue, TFunc extends Func<TThis, TArgs, TValue>>(state: IFuncCallState<TThis, TArgs, TValue>, iterator: Iterator<TValue>, nested?: boolean): Iterator<TValue>;
export declare function isRefType(value: any): boolean;
interface ISemiWeakMap<K, V> {
    map: Map<K, V>;
    weakMap: WeakMap<K extends object ? K : never, V>;
}
export declare function createSemiWeakMap<K, V>(): ISemiWeakMap<K, V>;
export declare function semiWeakMapGet<K, V>(semiWeakMap: ISemiWeakMap<K, V>, key: K): V;
export declare function semiWeakMapSet<K, V>(semiWeakMap: ISemiWeakMap<K, V>, key: K, value: V): void;
export declare function createCallWithArgs<TArgs extends any[]>(...args: TArgs): TCall<TArgs>;
export declare function _getFuncCallState<TThis, TArgs extends any[], TValue>(func: Func<TThis, TArgs, TValue>, funcStateMap: Map<number, any>): Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>>;
export declare function createDependentFunc<TThis, TArgs extends any[], TValue>(getState: Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>>): () => any;
declare type TRootStateMap = WeakMap<Func<any, any, any>, Func<any, any, IFuncCallState<any, any, any>>>;
export declare function createMakeDependentFunc(rootStateMap: TRootStateMap): {
    <TThis, TArgs extends any[], TValue>(func: Func<TThis, TArgs, Iterator<TValue, any, undefined>>): Func<TThis, TArgs, ThenableOrValue<TValue>>;
    <TThis_1, TArgs_1 extends any[], TValue_1>(func: Func<TThis_1, TArgs_1, TValue_1>): Func<TThis_1, TArgs_1, TValue_1>;
};
export declare function createGetFuncCallState(rootStateMap: TRootStateMap): <TThis, TArgs extends any[], TValue>(func: Func<TThis, TArgs, TValue>) => Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>>;
export declare const getFuncCallState: <TThis, TArgs extends any[], TValue>(func: Func<TThis, TArgs, TValue>) => Func<TThis, TArgs, IFuncCallState<TThis, TArgs, TValue>>;
export declare const makeDependentFunc: {
    <TThis, TArgs extends any[], TValue>(func: Func<TThis, TArgs, Iterator<TValue, any, undefined>>): Func<TThis, TArgs, ThenableOrValue<TValue>>;
    <TThis_1, TArgs_1 extends any[], TValue_1>(func: Func<TThis_1, TArgs_1, TValue_1>): Func<TThis_1, TArgs_1, TValue_1>;
};
export {};
