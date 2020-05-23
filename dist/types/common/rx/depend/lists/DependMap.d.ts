import { IMergeable, IMergeOptions, IMergeValue } from '../../../extensions/merge/contracts';
import { ISerializable, ISerializedObject, ISerializeValue } from '../../../extensions/serialization/contracts';
export declare class DependMap<K, V> implements Map<K, V>, IMergeable<DependMap<K, V>, object>, ISerializable {
    private readonly _map;
    constructor(map?: Map<K, V>);
    readonly [Symbol.toStringTag]: string;
    dependAll(): String;
    dependKey(key: K): String;
    dependAnyKey(): String;
    dependValue(key: K): String;
    dependAnyValue(): String;
    get(key: K): V | undefined;
    has(key: K): boolean;
    get size(): number;
    entries(): IterableIterator<[K, V]>;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    set(key: K, value: V): this;
    delete(key: K): boolean;
    clear(): void;
    _canMerge(source: DependMap<K, V>): boolean;
    _merge(merge: IMergeValue, older: DependMap<K, V> | object, newer: DependMap<K, V> | object, preferCloneOlder?: boolean, preferCloneNewer?: boolean, options?: IMergeOptions): boolean;
    static uuid: string;
    serialize(serialize: ISerializeValue): ISerializedObject;
    deSerialize(): void;
}
