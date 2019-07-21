import {ITypeMeta, ITypeMetaCollection, TClass} from '../TypeMeta'
import {TMergeableClass} from './mergers'

// region Mergers

export type IMergeValue = <TTarget extends any, TSource extends any>(
	base: TTarget,
	older: TSource,
	newer?: TSource,
	set?: (value: TTarget) => void,
	valueType?: TClass<TTarget>,
	valueFactory?: () => TTarget,
	preferClone?: boolean,
) => boolean

export interface IMergerVisitor {
	merge: IMergeValue
}

export interface IValueMerger<TTarget extends any, TSource extends any> {
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
		valueFactory?: () => TTarget,
		preferClone?: boolean,
	): boolean
}

export interface ITypeMetaMerger<TTarget extends any, TSource extends any> extends ITypeMeta {
	merger: IValueMerger<TTarget, TSource>
	canBeSource?: (value: TSource) => boolean
	preferClone?: boolean
	valueFactory?: () => TTarget
}

export interface ITypeMetaMergerCollection extends ITypeMetaCollection<ITypeMetaMerger<any, any>> {
	putType<TTarget, TSource>(
		type: TClass<TTarget>,
		meta: ITypeMetaMerger<TTarget, TSource>,
	): ITypeMetaMerger<TTarget, TSource>
	putMergeableType<TTarget extends IMergeable<TTarget, TSource>, TSource extends any>(
		type: TMergeableClass<TTarget, TSource>,
		valueFactory?: () => TTarget,
	): ITypeMetaMerger<TTarget, TSource>
}

export interface IObjectMerger extends IMerger {
	typeMeta: ITypeMetaMergerCollection
}

// endregion

// region Mergeable

export interface IMergeable<TTarget, TSource extends any> {
	merge(
		merge: IMergeValue,
		older: TSource,
		newer?: TSource,
		set?: (value: TTarget) => void,
	): boolean
}

// endregion
