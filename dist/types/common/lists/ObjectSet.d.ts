import { IMergeable, IMergeOptions, IMergeValue } from '../extensions/merge/contracts';
import { ISerializable, ISerializedObject, ISerializeValue } from '../extensions/serialization/contracts';
export declare class ObjectSet implements Set<string>, IMergeable<ObjectSet, string[] | Iterable<string>>, ISerializable, ISerializable {
    private readonly _object;
    constructor(object?: object);
    add(value: string): this;
    delete(value: string): boolean;
    clear(): this;
    readonly [Symbol.toStringTag]: string;
    get size(): number;
    [Symbol.iterator](): IterableIterator<string>;
    entries(): IterableIterator<[string, string]>;
    forEach(callbackfn: (value: string, key: string, set: Set<string>) => void, thisArg?: any): void;
    has(value: string): boolean;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
    static from(arrayOrIterable: string[] | Iterable<string>): ObjectSet;
    _canMerge(source: ObjectSet): boolean;
    _merge(merge: IMergeValue, older: ObjectSet | string[] | Iterable<string>, newer: ObjectSet | string[] | Iterable<string>, preferCloneOlder?: boolean, preferCloneNewer?: boolean, options?: IMergeOptions): boolean;
    static uuid: string;
    serialize(serialize: ISerializeValue): ISerializedObject;
    deSerialize(): void;
}
