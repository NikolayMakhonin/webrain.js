import { IMergeable, IMergeOptions, IMergeValue } from '../extensions/merge/contracts';
import { ISerializable, ISerializedObject, ISerializeValue } from '../extensions/serialization/contracts';
export declare class ObjectMap<V> implements Map<string, V>, IMergeable<ObjectMap<V>, object>, ISerializable {
    private readonly _object;
    constructor(object?: object);
    set(key: string, value: V): this;
    clear(): this;
    delete(key: string): boolean;
    readonly [Symbol.toStringTag]: string;
    readonly size: number;
    [Symbol.iterator](): IterableIterator<[string, V]>;
    entries(): IterableIterator<[string, V]>;
    forEach(callbackfn: (value: V, key: string, map: Map<string, V>) => void, thisArg?: any): void;
    get(key: string): V | undefined;
    has(key: string): boolean;
    keys(): IterableIterator<string>;
    values(): IterableIterator<V>;
    _canMerge(source: ObjectMap<V> | object): boolean;
    _merge(merge: IMergeValue, older: ObjectMap<V> | object, newer: ObjectMap<V> | object, preferCloneOlder?: boolean, preferCloneNewer?: boolean, options?: IMergeOptions): boolean;
    static uuid: string;
    serialize(serialize: ISerializeValue): ISerializedObject;
    deSerialize(): void;
}
