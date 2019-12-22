import { IMergeable, IMergeOptions, IMergeValue } from '../extensions/merge/contracts';
import { ISerializable, ISerializedObject, ISerializeValue } from '../extensions/serialization/contracts';
import { SetChangedObject } from './base/SetChangedObject';
import { IObservableSet } from './contracts/ISetChanged';
export declare class ObservableSet<T = any> extends SetChangedObject<T> implements IObservableSet<T>, IMergeable<ObservableSet<T>, T[] | Iterable<T>>, ISerializable {
    private readonly _set;
    constructor(set?: Set<T>);
    add(value: T): this;
    delete(value: T): boolean;
    clear(): void;
    readonly [Symbol.toStringTag]: string;
    get size(): number;
    [Symbol.iterator](): IterableIterator<T>;
    entries(): IterableIterator<[T, T]>;
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    keys(): IterableIterator<T>;
    values(): IterableIterator<T>;
    _canMerge(source: ObservableSet<T>): boolean;
    _merge(merge: IMergeValue, older: ObservableSet<T> | T[] | Iterable<T>, newer: ObservableSet<T> | T[] | Iterable<T>, preferCloneOlder?: boolean, preferCloneNewer?: boolean, options?: IMergeOptions): boolean;
    static uuid: string;
    serialize(serialize: ISerializeValue): ISerializedObject;
    deSerialize(): void;
}
