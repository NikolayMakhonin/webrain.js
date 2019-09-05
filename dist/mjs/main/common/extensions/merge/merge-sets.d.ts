import { IMergeMapWrapper } from './merge-maps';
export declare class MergeSetWrapper<V> implements IMergeMapWrapper<V, V> {
    private readonly _set;
    constructor(set: Set<V>);
    delete(key: V): void;
    forEachKeys(callbackfn: (key: V) => void): void;
    get(key: V): V;
    has(key: V): boolean;
    set(key: V, value: V): void;
}
export declare function createMergeSetWrapper<V>(target: object | Set<V> | V[] | Iterable<V>, source: object | Set<V> | V[] | Iterable<V>, arrayOrIterableToSet?: (array: any) => object | Set<V>): any;
