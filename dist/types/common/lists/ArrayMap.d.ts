import { IMergeable, IMergeOptions, IMergeValue } from '../extensions/merge/contracts';
import { ISerializable, ISerializedObject, ISerializeValue } from '../extensions/serialization/contracts';
export declare class ArrayMap<K extends object, V> implements Map<K, V>, IMergeable<ArrayMap<K, V>, ArrayMap<K, V>>, ISerializable {
    private readonly _array;
    constructor(array?: Array<[K, V]>);
    set(key: K, value: V): this;
    clear(): this;
    delete(key: K): boolean;
    readonly [Symbol.toStringTag]: string;
    get size(): number;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    entries(): IterableIterator<[K, V]>;
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    get(key: K): V | undefined;
    has(key: K): boolean;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    _canMerge(source: ArrayMap<K, V>): boolean;
    _merge(merge: IMergeValue, older: ArrayMap<K, V> | object, newer: ArrayMap<K, V> | object, preferCloneOlder?: boolean, preferCloneNewer?: boolean, options?: IMergeOptions): boolean;
    static uuid: string;
    serialize(serialize: ISerializeValue): ISerializedObject;
    deSerialize(): void;
}
