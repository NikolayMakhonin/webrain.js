import {Thenable} from '../../async/async'

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

export type TFuncCallState = IFuncCallState<any, any, any, any>
export interface IFuncCallState<
	TThis,
	TArgs extends any[],
	TValue,
	TNewThis
> {
	readonly func: Func<TNewThis, TArgs, TValue>
	readonly _this: TThis
	readonly callWithArgs: TCall<TArgs>
	readonly getThis: TGetThis<TThis, TArgs, TValue, TNewThis>
	readonly valueIds: number[]
	deleteOrder: number

	status: FuncCallStatus

	valueAsync: Thenable<TValue>
	value: TValue
	error: any

	/** for detect recursive async loop */
	parentCallState: TFuncCallState

	// for prevent multiple subscribe equal dependencies
	callId: number
	_subscribersFirst: ISubscriberLink<this, any>
	_subscribersLast: ISubscriberLink<this, any>
	_subscribersCalculating: ISubscriberLink<this, any>
	_unsubscribers: Array<ISubscriberLink<any, this>>,
	_unsubscribersLength: number,

	// calculable
	readonly hasSubscribers: boolean
	readonly isHandling: boolean
}

export type TSubscriberLink = ISubscriberLink<any, any>
export interface ISubscriberLink<
	TState extends TFuncCallState,
	TSubscriber extends TFuncCallState,
>
	extends ILinkItem<TSubscriber>
{
	state: TState,
	prev: ISubscriberLink<TState, any>,
	next: ISubscriberLink<TState, any>,
}

export interface IValueState {
	usageCount: number
	value: any
}

export type TGetThis<
	TThis,
	TArgs extends any[],
	TValue,
	TNewThis
> = (state: IFuncCallState<TThis, TArgs, TValue, TNewThis>) => TNewThis
