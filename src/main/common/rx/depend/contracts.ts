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

export interface IFuncCallState<TThis,
	TArgs extends any[],
	TValue,
	> {
	readonly func: Func<TThis, TArgs, TValue>
	readonly _this: TThis
	readonly callWithArgs: TCall<TArgs>
	readonly valueIds: number[]
	deleteOrder: number

	status: FuncCallStatus

	valueAsync: Thenable<TValue>
	value: TValue
	error: any

	/** for detect recursive async loop */
	parentCallState: IFuncCallState<any, any, any>

	// for prevent multiple subscribe equal dependencies
	callId: number
	_subscribersFirst: ISubscriberLink<TThis, TArgs, TValue>
	_subscribersLast: ISubscriberLink<TThis, TArgs, TValue>
	_subscribersCalculating: ISubscriberLink<TThis, TArgs, TValue>
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
