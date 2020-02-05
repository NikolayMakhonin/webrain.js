import {Thenable} from '../../async/async'
import {IUnsubscribe} from '../subjects/observable'

export type Func<TThis, TArgs extends any[], TValue = void> = (this: TThis, ...args: TArgs) => TValue
export type TCall<TArgs extends any[]> = <TThis, TValue>(_this: TThis, func: Func<TThis, TArgs, TValue>) => TValue

export enum FuncCallStatus {
	Invalidating = 'Invalidating',
	Invalidated = 'Invalidated',
	Calculating = 'Calculating',
	CalculatingAsync = 'CalculatingAsync',
	Calculated = 'Calculated',
	Error = 'Error',
}

export type ISubscriber<TThis, TArgs extends any[], TValue>
	= (this: IFuncCallState<TThis, TArgs, TValue>, ...args: TArgs) => void

export interface IFuncCallState<
	TThis,
	TArgs extends any[],
	TValue,
> {
	status: FuncCallStatus
	hasValue: boolean
	hasError: boolean

	valueAsync: Thenable<TValue>
	value: TValue
	error: any

	/** for detect recursive async loop */
	parentStateAsync: IFuncCallState<any, any, any>

	update(status: FuncCallStatus, valueAsyncOrValueOrError?: TValue | Iterator<TValue> | any): void

	subscribe(handler: ISubscriber<TThis, TArgs, TValue>): IUnsubscribe

	// TODO: parent subscribe for invalidate (clear status & value & error & unsubscribe dependencies)
	// TODO: detect cyclic dependencies
	subscribeDependency(dependency: IFuncCallState<any, any, any>): void

	unsubscribeDependencies(): void

	/** clear status, value, error & unsubscribe dependencies */
	invalidate(): void
}
