import {Thenable} from '../../async/async'

export type Func<TThis, TArgs extends any[], TValue = void> = (this: TThis, ...args: TArgs) => TValue
export type TCall<TArgs extends any[]> = <TThis, TValue>(this: TThis, func: Func<TThis, TArgs, TValue>) => TValue

export interface ILinkItem<T> {
	value: T
	prev: ILinkItem<T>
	next: ILinkItem<T>
	delete?: () => void
}

export enum FuncCallStatus {
	Invalidating = 1,
	Invalidated = 2,
	Calculating = 3,
	CalculatingAsync = 4,
	Calculated = 5,
	Error = 6,
}

export interface IFuncCallState<TThis,
	TArgs extends any[],
	TValue,
	> {
	readonly func: Func<TThis, TArgs, TValue>
	readonly _this: TThis
	readonly dependentFunc: Func<TThis, TArgs, TValue>

	status: FuncCallStatus
	hasValue: boolean
	hasError: boolean

	valueAsync: Thenable<TValue>
	value: TValue
	error: any

	/** for detect recursive async loop */
	parentCallState: IFuncCallState<any, any, any>

	// for prevent multiple subscribe equal dependencies
	callId: number

	_subscribersFirst: ISubscriberLink<TThis, TArgs, TValue>
	_subscribersLast: ISubscriberLink<TThis, TArgs, TValue>
	_unsubscribers: Array<ISubscriberLink<TThis, TArgs, TValue>>,
	_unsubscribersLength: number,
}

export interface ISubscriberLink<TThis, TArgs extends any[], TValue>
	extends ILinkItem<IFuncCallState<TThis, TArgs, TValue>> {
	state: IFuncCallState<TThis, TArgs, TValue>
	prev: ISubscriberLink<TThis, TArgs, TValue>,
	next: ISubscriberLink<TThis, TArgs, TValue>,
}
