import { IMergeable, IMergeValue, IMergeVisitorOptions } from '../../../extensions/merge/contracts';
import { ObjectMerger } from '../../../extensions/merge/mergers';
import { IDeSerializeValue, ISerializable, ISerializedObject, ISerializeValue } from '../../../extensions/serialization/contracts';
import { ObservableClass } from '../ObservableClass';
export interface IPropertyOptions<TTarget, TSource> {
    merger?: ObjectMerger;
    mergeOptions?: IMergeVisitorOptions<TTarget, TSource>;
}
export declare class Property<TValue, TMergeSource = TValue> extends ObservableClass implements IMergeable<Property<TValue, TMergeSource>, any>, ISerializable {
    protected merger?: ObjectMerger;
    protected mergeOptions?: IMergeVisitorOptions<TValue, TMergeSource>;
    constructor(options?: IPropertyOptions<TValue, TMergeSource>, initValue?: TValue);
    value: TValue;
    readonly [Symbol.toStringTag]: string;
    set(value: Property<TValue | TMergeSource, any> | TValue | TMergeSource, clone?: boolean, options?: IMergeVisitorOptions<TValue, TMergeSource>): boolean;
    fill(value: Property<TValue | TMergeSource, any> | TValue | TMergeSource, preferClone?: boolean, options?: IMergeVisitorOptions<TValue, TMergeSource>): boolean;
    merge(older: Property<TValue | TMergeSource, any> | TValue | TMergeSource, newer: Property<TValue | TMergeSource, any> | TValue | TMergeSource, preferCloneOlder?: boolean, preferCloneNewer?: boolean, options?: IMergeVisitorOptions<TValue, TMergeSource>): boolean;
    private mergeValue;
    private _mergeValue;
    _canMerge(source: Property<TValue, TMergeSource> | TValue | TMergeSource): boolean;
    _merge(merge: IMergeValue, older: Property<TValue | TMergeSource, any> | TValue | TMergeSource, newer: Property<TValue | TMergeSource, any> | TValue | TMergeSource, preferCloneOlder?: boolean, preferCloneNewer?: boolean): boolean;
    static uuid: string;
    serialize(serialize: ISerializeValue): ISerializedObject;
    deSerialize(deSerialize: IDeSerializeValue, serializedValue: ISerializedObject): void;
}
