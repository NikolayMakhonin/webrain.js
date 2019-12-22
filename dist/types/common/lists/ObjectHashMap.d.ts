import { IMergeable, IMergeOptions, IMergeValue } from '../extensions/merge/contracts';
import { ISerializable, ISerializedObject, ISerializeValue } from '../extensions/serialization/contracts';
interface TNumberObject<K, V> {
    [id: number]: [K, V];
}
export declare class ObjectHashMap<K extends object, V> implements Map<K, V>, IMergeable<ObjectHashMap<K, V>, TNumberObject<K, V>>, ISerializable {
    private readonly _object;
    constructor(object?: TNumberObject<K, V>);
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
    _canMerge(source: ObjectHashMap<K, V>): boolean;
    _merge(merge: IMergeValue, older: ObjectHashMap<K, V> | TNumberObject<K, V>, newer: ObjectHashMap<K, V> | TNumberObject<K, V>, preferCloneOlder?: boolean, preferCloneNewer?: boolean, options?: IMergeOptions): boolean;
    static uuid: string;
    serialize(serialize: ISerializeValue): ISerializedObject;
    deSerialize(): void;
}
export {};
