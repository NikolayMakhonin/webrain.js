import { IMergeable, IMergeOptions, IMergeValue } from '../extensions/merge/contracts';
import { ISerializable, ISerializedObject, ISerializeValue } from '../extensions/serialization/contracts';
import { MapChangedObject } from './base/MapChangedObject';
import { IObservableMap } from './contracts/IMapChanged';
export declare class ObservableMap<K, V> extends MapChangedObject<K, V> implements IObservableMap<K, V>, IMergeable<ObservableMap<K, V>, object>, ISerializable {
    private readonly _map;
    constructor(map?: Map<K, V>);
    set(key: K, value: V): this;
    delete(key: K): boolean;
    clear(): void;
    readonly [Symbol.toStringTag]: string;
    get size(): number;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    get(key: K): V | undefined;
    entries(): IterableIterator<[K, V]>;
    forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
    has(key: K): boolean;
    keys(): IterableIterator<K>;
    values(): IterableIterator<V>;
    _canMerge(source: ObservableMap<K, V>): boolean;
    _merge(merge: IMergeValue, older: ObservableMap<K, V> | object, newer: ObservableMap<K, V> | object, preferCloneOlder?: boolean, preferCloneNewer?: boolean, options?: IMergeOptions): boolean;
    static uuid: string;
    serialize(serialize: ISerializeValue): ISerializedObject;
    deSerialize(): void;
}
