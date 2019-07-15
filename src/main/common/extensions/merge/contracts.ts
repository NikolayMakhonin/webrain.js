import {ITypeMeta, ITypeMetaCollection, TClass} from '../TypeMeta'

// region Mergers

export type IMergeValue = <TValue>(base: TValue, older: TValue, newer?: TValue, valueType?: TClass) => TValue

export interface IMergerVisitor {
	merge: IMergeValue
}

export interface IValueMerger<TValue> {
	merge(
		merge: IMergeValue,
		base: TValue,
		older: TValue,
		newer?: TValue,
	): TValue
}

export interface IMerger {
	merge<TValue>(
		base: TValue,
		older: TValue,
		newer?: TValue,
		valueType?: TClass,
	): TValue
}

export interface ITypeMetaMerger<TValue> extends ITypeMeta {
	merger: IValueMerger<TValue>
	valueFactory?: () => any
}

export interface ITypeMetaMergerCollection extends ITypeMetaCollection<ITypeMetaMerger<any>> {

}

export interface IObjectMerger extends IMerger {
	typeMeta: ITypeMetaMergerCollection
}

// endregion

// region Mergeable

export interface IMergeable<TObject> {
	merge(
		older: TObject,
		newer?: TObject,
	): this
}

// endregion
