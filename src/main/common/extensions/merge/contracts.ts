import {ITypeMeta, ITypeMetaCollection, TClass} from '../TypeMeta'

// region Mergers

export interface IMergeOptions {
	preferClone: boolean
}

export type IMergeValue = <TTarget extends any, TSource extends any>(
	base: TTarget,
	older: TSource,
	newer?: TSource,
	set?: (value: TTarget) => void,
	valueType?: TClass,
	valueFactory?: () => TTarget,
	preferClone?: boolean,
) => boolean

export interface IMergerVisitor {
	merge: IMergeValue
}

export interface IValueMerger<TTarget, TSource> {
	merge(
		merge: IMergeValue,
		base: TTarget,
		older: TSource,
		newer?: TSource,
		set?: (value: TTarget) => void,
	): boolean
}

export interface IMerger {
	merge<TTarget extends any, TSource extends any>(
		base: TTarget,
		older: TSource,
		newer?: TSource,
		valueType?: TClass,
		set?: (value: TTarget) => void,
		valueFactory?: () => TTarget,
		preferClone?: boolean,
	): boolean
}

export interface ITypeMetaMerger<TTarget, TSource> extends ITypeMeta {
	merger: IValueMerger<TTarget, TSource>
	canBeSource?: (value: TSource) => boolean
	preferClone?: boolean
	valueFactory?: () => TTarget
}

export interface ITypeMetaMergerCollection extends ITypeMetaCollection<ITypeMetaMerger<any, any>> {

}

export interface IObjectMerger extends IMerger {
	typeMeta: ITypeMetaMergerCollection
}

// endregion

// region Mergeable

export interface IMergeable<TTarget, TSource> {
	merge(
		merge: IMergeValue,
		older: TSource,
		newer?: TSource,
		set?: (value: TTarget) => void,
	): boolean
}

// endregion
