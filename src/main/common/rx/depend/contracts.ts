import {Thenable} from '../../async/async'

export type Func<TThis, TArgs extends any[], TValue = void> = (this: TThis, ...args: TArgs) => TValue
export type TCall<TArgs extends any[]> = <TThis, TValue>(_this: TThis, func: Func<TThis, TArgs, TValue>) => TValue

export interface ILinkItem<T> {
	value: T
	prev: ILinkItem<T>
	next: ILinkItem<T>
}

export enum FuncCallStatus {
	// Flags
	Flag_Invalidate = 1,
	Flag_Invalidating = 2,
	Flag_Invalidated = 4,
	Flag_Invalidate_Self = 8,
	Flag_Calculate = 16,
	Flag_Calculating = 32,
	Flag_Calculated = 64,
	Flag_Calculate_Async = 128,
	Flag_Calculate_Error = 256,

	// Statuses
	Status_Invalidating = Flag_Invalidate | Flag_Invalidating,
	Status_Invalidated = Flag_Invalidate | Flag_Invalidated,
	Status_Invalidating_Self = Flag_Invalidate | Flag_Invalidating | Flag_Invalidate_Self,
	Status_Invalidated_Self = Flag_Invalidate | Flag_Invalidated | Flag_Invalidate_Self,

	Status_Calculating = Flag_Calculate | Flag_Calculating,
	Status_Calculated = Flag_Calculate | Flag_Calculated,
	Status_Calculating_Async = Flag_Calculate | Flag_Calculating | Flag_Calculate_Async,
	Status_Calculated_Error = Flag_Calculate | Flag_Calculated | Flag_Calculate_Error,
}

export interface IFuncCallState<TThis,
	TArgs extends any[],
	TValue,
	> {
	readonly func: Func<TThis, TArgs, TValue>
	readonly _this: TThis
	readonly callWithArgs: TCall<TArgs>
	readonly valueIds: number[]
	deleteOrder: number

	status
	hasValue: boolean
	hasError: boolean

	valueAsync: Thenable<TValue>
	value: TValue
	error: any

	/** for prevent recalc dependent funcs if dependencies.changeResultId <= dependent.changeResultId */
	changeResultId: number

	/** for detect recursive async loop */
	parentCallState: IFuncCallState<any, any, any>

	// for prevent multiple subscribe equal dependencies
	callId: number
	_subscribersFirst: ISubscriberLink<TThis, TArgs, TValue>
	_subscribersLast: ISubscriberLink<TThis, TArgs, TValue>
	_unsubscribers: Array<ISubscriberLink<TThis, TArgs, TValue>>,
	_unsubscribersLength: number,

	// calculable
	readonly hasSubscribers: boolean
	readonly isHandling: boolean
}

export interface ISubscriberLink<TThis, TArgs extends any[], TValue>
	extends ILinkItem<IFuncCallState<TThis, TArgs, TValue>>
{
	state: IFuncCallState<TThis, TArgs, TValue>
	prev: ISubscriberLink<TThis, TArgs, TValue>,
	next: ISubscriberLink<TThis, TArgs, TValue>,
}

export interface IValueState {
	usageCount: number
	value: any
}
