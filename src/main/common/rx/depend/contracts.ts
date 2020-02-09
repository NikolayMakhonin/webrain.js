import {Thenable} from '../../async/async'
import {FuncCallState} from './FuncCallState'
import {ObjectPool} from './ObjectPool'

export type Func<TThis, TArgs extends any[], TValue = void> = (this: TThis, ...args: TArgs) => TValue
export type TCall<TArgs extends any[]> = <TThis, TValue>(this: TThis, func: Func<TThis, TArgs, TValue>) => TValue

export enum FuncCallStatus {
	Invalidating,
	Invalidated,
	Calculating,
	CalculatingAsync,
	Calculated,
	Error,
}

export type ISubscriber<TThis, TArgs extends any[], TValue>
	= (this: IFuncCallState<TThis, TArgs, TValue>, ...args: TArgs) => void

export interface ILinkItem<T> {
	value: T
	prev: ILinkItem<T>
	next: ILinkItem<T>
	delete?: () => void
}

export interface ISubscriberLink<TThis, TArgs extends any[], TValue>
	extends ILinkItem<IFuncCallState<TThis, TArgs, TValue>> {
	pool: ObjectPool<ISubscriberLink<any, any, any>>
	state: FuncCallState<TThis, TArgs, TValue>
	prev: ISubscriberLink<TThis, TArgs, TValue>,
	next: ISubscriberLink<TThis, TArgs, TValue>,
}

export interface IFuncCallState<
	TThis,
	TArgs extends any[],
	TValue,
> {
	readonly func: Func<TThis, TArgs, TValue>
	readonly _this: TThis
	readonly args: TArgs

	status: FuncCallStatus
	hasValue: boolean
	hasError: boolean

	valueAsync: Thenable<TValue>
	value: TValue
	error: any

	/** for detect recursive async loop */
	parentCallState: IFuncCallState<any, any, any>

	update(status: FuncCallStatus, valueAsyncOrValueOrError?: TValue | Iterator<TValue> | any): void

	subscribe(subscriber: IFuncCallState<TThis, TArgs, TValue>): ISubscriberLink<TThis, TArgs, TValue>

	// for prevent multiple subscribe equal dependencies
	callId: number
	// TODO: parent subscribe for invalidate (clear status & value & error & unsubscribe dependencies)
	// TODO: detect cyclic dependencies
	subscribeDependency(dependency: IFuncCallState<any, any, any>): void
	unsubscribeDependencies(): void

	/** clear status, value, error & unsubscribe dependencies */
	invalidate(): void
}
