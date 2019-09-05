import { IMergeOptions, IMergeValue } from './contracts';
export interface IMergeMapWrapper<K, V> {
    has(key: K): boolean;
    get(key: K): V;
    set(key: K, value: V): void;
    delete(key: K): void;
    forEachKeys(callbackfn: (key: K) => void): void;
}
export declare function mergeMapWrappers<K, V>(merge: IMergeValue, base: IMergeMapWrapper<K, V>, older: IMergeMapWrapper<K, V>, newer: IMergeMapWrapper<K, V>, preferCloneOlder?: boolean, preferCloneNewer?: boolean, options?: IMergeOptions): boolean;
export declare class MergeObjectWrapper implements IMergeMapWrapper<string, any> {
    private readonly _object;
    private readonly _keyAsValue;
    constructor(object: {
        [key: string]: any;
    }, keyAsValue?: boolean);
    delete(key: string): void;
    forEachKeys(callbackfn: (key: string) => void): void;
    get(key: string): any;
    has(key: string): boolean;
    set(key: string, value: any): void;
}
export declare class MergeMapWrapper<K, V> implements IMergeMapWrapper<K, V> {
    private readonly _map;
    constructor(map: Map<K, V>);
    delete(key: K): void;
    forEachKeys(callbackfn: (key: K) => void): void;
    get(key: K): V;
    has(key: K): boolean;
    set(key: K, value: V): void;
}
export declare function createMergeMapWrapper<K, V>(target: object | V[] | Map<K, V>, source: object | V[] | Map<K, V>, arrayOrIterableToMap?: (array: any) => object | Map<K, V>): any;
export declare function mergeMaps<TObject extends object>(createSourceMapWrapper: (target: any, source: any) => IMergeMapWrapper<any, any>, merge: IMergeValue, base: TObject, older: TObject, newer: TObject, preferCloneOlder?: boolean, preferCloneNewer?: boolean, options?: IMergeOptions): boolean;
