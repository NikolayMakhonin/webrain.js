import { IMergeable, IMergeOptions, IMergeValue } from '../extensions/merge/contracts';
import { ISerializable, ISerializedObject, ISerializeValue } from '../extensions/serialization/contracts';
export declare class ArraySet<T extends Object> implements Set<T>, IMergeable<ArraySet<T>, T[] | Iterable<T>>, ISerializable {
    private readonly _array;
    private _size;
    constructor(array?: T[], size?: number);
    add(value: T): this;
    delete(value: T): boolean;
    clear(): this;
    readonly [Symbol.toStringTag]: string;
    readonly size: number;
    [Symbol.iterator](): IterableIterator<T>;
    entries(): IterableIterator<[T, T]>;
    forEach(callbackfn: (value: T, key: T, set: Set<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    keys(): IterableIterator<T>;
    values(): IterableIterator<T>;
    static from<T>(arrayOrIterable: T[] | Iterable<T>): ArraySet<T>;
    _canMerge(source: ArraySet<T>): boolean;
    _merge(merge: IMergeValue, older: ArraySet<T> | T[] | Iterable<T>, newer: ArraySet<T> | T[] | Iterable<T>, preferCloneOlder?: boolean, preferCloneNewer?: boolean, options?: IMergeOptions): boolean;
    static uuid: string;
    serialize(serialize: ISerializeValue): ISerializedObject;
    deSerialize(): void;
}
