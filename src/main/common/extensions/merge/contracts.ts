import {ITypeMeta, ITypeMetaCollection, TClass} from '../TypeMeta'
import {TMergeableClass} from './mergers'

// region Mergers

export type IMergeValue = <TTarget extends any, TSource extends any>(
	base: TTarget,
	older: TSource,
	newer?: TSource,
	set?: (value: TTarget) => void,
	valueType?: TClass<TTarget>,
	valueFactory?: (source: TSource) => TTarget,
	preferCloneOlder?: boolean,
	preferCloneNewer?: boolean,
) => boolean

export interface IMergerVisitor {
	merge: IMergeValue
}

export interface IValueMerger<TTarget extends any, TSource extends any> {
	/** @return true, false, null - is equals */
	canMerge?: (target: TTarget, source: TSource) => boolean
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
		valueType?: TClass<TTarget>,
		set?: (value: TTarget) => void,
		valueFactory?: (source: TSource) => TTarget,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
	): boolean
}

export interface ITypeMetaMerger<TTarget extends any, TSource extends any> extends ITypeMeta {
	preferClone?: boolean
	valueFactory?: (source: TSource) => TTarget
	merger: IValueMerger<TTarget, TSource>
}

export interface ITypeMetaMergerCollection extends ITypeMetaCollection<ITypeMetaMerger<any, any>> {
	putType<TTarget, TSource>(
		type: TClass<TTarget>,
		meta: ITypeMetaMerger<TTarget, TSource>,
	): ITypeMetaMerger<TTarget, TSource>
	putMergeableType<TTarget extends IMergeable<TTarget, TSource>, TSource extends any>(
		type: TMergeableClass<TTarget, TSource>,
		valueFactory?: (source: TSource) => TTarget,
	): ITypeMetaMerger<TTarget, TSource>
}

export interface IObjectMerger extends IMerger {
	typeMeta: ITypeMetaMergerCollection
}

// endregion

// region Mergeable

export interface IMergeable<TTarget, TSource extends any> {
	/** @return true, false, null - is equals */
	canMerge?: (source: TSource) => boolean
	merge(
		merge: IMergeValue,
		older: TSource,
		newer?: TSource,
	): boolean
}

// endregion
