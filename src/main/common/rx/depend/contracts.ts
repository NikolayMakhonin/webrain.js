import {IThenable, ThenableOrValue} from '../../async/async'
import {TFuncCallState} from './FuncCallState'

export type Func<TThis, TArgs extends any[], TValue = void> = (this: TThis, ...args: TArgs) => TValue
export type TCall<TArgs extends any[]> = <TThis, TValue>(_this: TThis, func: Func<TThis, TArgs, TValue>) => TValue

export interface ILinkItem<T> {
	value: T
	prev: ILinkItem<T>
	next: ILinkItem<T>
}

export enum FuncCallStatus {
	Flag_None = 0,

	Flag_Invalidating = 1,
	Flag_Invalidated = 2,
	Mask_Invalidate = 3,
	Flag_Recalc = 4,

	Flag_Parent_Invalidating = 8,
	Flag_Parent_Invalidated = 16,
	Mask_Parent_Invalidate = 24,
	Flag_Parent_Recalc = 32,

	Flag_Check = 128,
	Flag_Calculating = 256,
	Flag_Async = 512,
	Flag_Calculated = 1024,
	Mask_Calculate = 1920,

	Flag_HasValue = 2048,

	Flag_HasError = 4096,

	Flag_InternalError = 8192,
}
export type TIteratorOrValue<T> = Iterator<T> | T
export type TOuterResult<TInnerResult> = TInnerResult extends Iterator<infer V> ? ThenableOrValue<V> : TInnerResult
export type TInnerValue<TInnerResult> = TInnerResult extends Iterator<infer V> ? V : TInnerResult

export type TGetThis<
	TThisOuter,
	TArgs extends any[],
	TInnerResult,
	TThisInner
> = (this: IFuncCallState<TThisOuter, TArgs, TInnerResult, TThisInner>) => TThisInner

export interface IFuncCallState<
	TThisOuter,
	TArgs extends any[],
	TInnerResult,
	TThisInner
> {
	readonly thisOuter: TThisOuter
	readonly getThisInner: TGetThis<TThisOuter, TArgs, TInnerResult, TThisInner>
	readonly callWithArgs: TCall<TArgs>

	readonly valueIds: number[]
	deleteOrder: number

	status: FuncCallStatus

	valueAsync: IThenable<TInnerValue<TInnerResult>>
	value: TInnerValue<TInnerResult>
	error: any

	// region calculable

	readonly hasSubscribers: boolean
	readonly isHandling: boolean

	// endregion

	// region methods

	subscribeDependency<TDependency extends TFuncCallState>(
		dependency: TDependency,
	): void

	getValue(
		dontThrowOnError?: boolean,
	): TOuterResult<TInnerResult>

	invalidate(): void

	// endregion
}

export interface IValueState {
	usageCount: number
	value: any
}
