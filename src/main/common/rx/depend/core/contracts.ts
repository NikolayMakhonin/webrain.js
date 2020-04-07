import {IThenable, ThenableOrValue} from '../../../async/async'
import {IDeferredCalcOptions} from '../../deferred-calc/DeferredCalc'
import {TFuncCall} from './CallState'

export type Func<TThis, TArgs extends any[], TValue = void> = (this: TThis, ...args: TArgs) => TValue
export type TCall<TArgs extends any[]> = <TThis, TValue>(_this: TThis, func: Func<TThis, TArgs, TValue>) => TValue

export interface ILinkItem<T> {
	value: T
	prev: ILinkItem<T>
	next: ILinkItem<T>
}

export enum CallStatus {
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
export type TResultOuter<TResultInner> = TResultInner extends Iterator<infer V> ? ThenableOrValue<V> : TResultInner
export type TInnerValue<TResultInner> = TResultInner extends Iterator<infer V> ? V : TResultInner

export interface IDeferredOptions {
	delayBeforeCalc?: number,
	minTimeBetweenCalc?: number,
	autoInvalidateInterval?: number,
}

export interface ICallState<
	TThisOuter,
	TArgs extends any[],
	TResultInner,
> {
	readonly func: Func<unknown, TArgs, unknown>
	readonly _this: TThisOuter
	readonly callWithArgs: TCall<TArgs>
	readonly funcCall: TFuncCall<TThisOuter, TArgs, TResultInner>

	readonly valueIds: Int32Array

	status: CallStatus

	valueAsync: IThenable<TInnerValue<TResultInner>>
	value: TInnerValue<TResultInner>
	error: any

	readonly data: {
		[key: string]: any;
		[key: number]: any;
	}
	readonly deferredOptions: IDeferredOptions

	// region calculable

	readonly hasSubscribers: boolean
	readonly isHandling: boolean

	// endregion

	// region methods

	getValue(
		dontThrowOnError?: boolean,
	): TResultOuter<TResultInner>

	invalidate(): void

	// endregion
}