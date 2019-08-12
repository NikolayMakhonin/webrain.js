import {TClass} from '../../helpers/helpers'
import {ITypeMeta, ITypeMetaCollection} from '../TypeMeta'
import {TMergeableClass} from './mergers'

// region Mergers

export interface IMergeOptions {
	selfAsValueBase?: boolean
	selfAsValueOlder?: boolean
	selfAsValueNewer?: boolean
}

export interface IMergeVisitorOptions<TTarget, TSource> extends IMergeOptions {
	valueType?: TClass<TTarget>
	valueFactory?: (source: TTarget|TSource) => TTarget
}

export type IMergeValue = <TTarget = any, TSource = any>(
	base: TTarget,
	older: TTarget|TSource,
	newer: TTarget|TSource,
	set?: (value: TTarget) => void,
	preferCloneOlder?: boolean,
	preferCloneNewer?: boolean,
	options?: IMergeVisitorOptions<TTarget, TSource>,
) => boolean

export interface IMergerVisitor {
	merge: IMergeValue
}

export type IValueMerge<TTarget = any, TSource = any> = (
	merge: IMergeValue,
	base: TTarget,
	older: TTarget|TSource,
	newer: TTarget|TSource,
	set?: (value: TTarget) => void,
	preferCloneOlder?: boolean,
	preferCloneNewer?: boolean,
	options?: IMergeOptions,
) => boolean

export interface IValueMerger<TTarget = any, TSource = any> {
	/** @return true, false, null - is equals */
	canMerge?: (target: TTarget, source: TTarget|TSource) => boolean
	merge?: IValueMerge<TTarget, TSource>
}

export interface IMerger {
	merge<TTarget = any, TSource = any>(
		base: TTarget,
		older: TTarget|TSource,
		newer: TTarget|TSource,
		set?: (value: TTarget) => void,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeVisitorOptions<TTarget, TSource>,
	): boolean
}

export interface ITypeMetaMerger<TTarget = any, TSource = any> extends ITypeMeta {
	preferClone?: boolean|((target: TTarget) => boolean)
	valueFactory?: (source: TTarget|TSource) => TTarget
	merger?: IValueMerger<TTarget, TSource>
}

export interface ITypeMetaMergerCollection extends ITypeMetaCollection<ITypeMetaMerger<any, any>> {
	putType<TTarget, TSource>(
		type: TClass<TTarget>,
		meta: ITypeMetaMerger<TTarget, TSource>,
	): ITypeMetaMerger<TTarget, TSource>
	putMergeableType<TTarget extends IMergeable<TTarget, TSource>, TSource = any>(
		type: TMergeableClass<TTarget, TSource>,
		meta?: ITypeMetaMerger<TTarget, TSource>,
	): ITypeMetaMerger<TTarget, TSource>
}

export interface IObjectMerger extends IMerger {
	typeMeta: ITypeMetaMergerCollection
}

// endregion

// region Mergeable

export interface IMergeable<TTarget, TSource = any> {
	/** @return true, false, null - is non strict equals */
	_canMerge(source: TTarget|TSource): boolean
	_merge(
		merge: IMergeValue,
		older: TTarget|TSource,
		newer: TTarget|TSource,
		preferCloneOlder?: boolean,
		preferCloneNewer?: boolean,
		options?: IMergeOptions,
	): boolean
}

// endregion
