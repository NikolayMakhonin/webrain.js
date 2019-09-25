import {IUnsubscribe, IUnsubscribeOrVoid} from '../../subjects/observable'

export type ISubscribeValue<TValue> = (value: TValue, parent: any, propertyName: string) => IUnsubscribeOrVoid
export type IUnsubscribeValue<TValue> = (
	value: TValue, parent: any, propertyName: string, isUnsubscribed: boolean,
) => void
export type ILastValue<TValue> = (value: TValue, parent: any, propertyName: string) => void

export interface IValueSubscriber<TValue> {
	subscribe(
		value: TValue,
		parent: any,
		propertyName: string,
		propertiesPath: () => string,
		ruleDescription: string,
	): IUnsubscribe

	unsubscribe(
		value: TValue,
		parent: any,
		propertyName: string,
		// propertiesPath: () => string,
		// ruleDescription: string,
	): void
}
