import {IUnsubscribe} from '../../subjects/observable'

export type ISubscribeValue<TValue> = (value: TValue, parent: any, propertyName: string) => IUnsubscribe

export interface IValueSubscriber<TValue> {
	subscribe(
		value: TValue,
		parent: any,
		propertyName: string,
		propertiesPath: () => string,
		ruleDescription: string,
	): IUnsubscribe|void
	unsubscribe(value: TValue, parent: any, propertyName: string): void
}
