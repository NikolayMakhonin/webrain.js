import {IFuncCallState} from './_createDependentFunc'

export type Func<TThis, TArgs extends any[], TValue = void> = (this: TThis, ...args: TArgs) => TValue
export type TCall<TArgs extends any[]> = <TThis, TValue>(this: TThis, func: Func<TThis, TArgs, TValue>) => TValue

export interface ILinkItem<T> {
	value: T
	prev: ILinkItem<T>
	next: ILinkItem<T>
	delete?: () => void
}

export interface ISubscriberLink<TThis, TArgs extends any[], TValue>
	extends ILinkItem<IFuncCallState<TThis, TArgs, TValue>> {
	state: IFuncCallState<TThis, TArgs, TValue>
	prev: ISubscriberLink<TThis, TArgs, TValue>,
	next: ISubscriberLink<TThis, TArgs, TValue>,
}
