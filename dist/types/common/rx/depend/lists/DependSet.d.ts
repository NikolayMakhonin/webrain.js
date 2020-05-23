import { IMergeable, IMergeOptions, IMergeValue } from '../../../extensions/merge/contracts';
import { ISerializable, ISerializedObject, ISerializeValue } from '../../../extensions/serialization/contracts';
export declare class DependSet<V> implements Set<V>, IMergeable<DependSet<V>, object>, ISerializable {
    private readonly _set;
    constructor(set?: Set<V>);
    readonly [Symbol.toStringTag]: string;
    dependAll(): String;
    dependValue(value: V): String;
    dependAnyValue(): String;
    has(value: V): boolean;
    get size(): number;
    entries(): IterableIterator<[V, V]>;
    keys(): IterableIterator<V>;
    values(): IterableIterator<V>;
    forEach(callbackfn: (value: V, key: V, set: Set<V>) => void, thisArg?: any): void;
    [Symbol.iterator](): IterableIterator<V>;
    add(value: V): this;
    delete(value: V): boolean;
    clear(): void;
    _canMerge(source: DependSet<V>): boolean;
    _merge(merge: IMergeValue, older: DependSet<V> | V[] | Iterable<V>, newer: DependSet<V> | V[] | Iterable<V>, preferCloneOlder?: boolean, preferCloneNewer?: boolean, options?: IMergeOptions): boolean;
    static uuid: string;
    serialize(serialize: ISerializeValue): ISerializedObject;
    deSerialize(): void;
}
