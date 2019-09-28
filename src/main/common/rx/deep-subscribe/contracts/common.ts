import {IUnsubscribe, IUnsubscribeOrVoid} from '../../subjects/observable'

// export type IChangeValue<TValue> = (value: TValue, parent: any, propertyName: string) => IUnsubscribeOrVoid
export type ISubscribeValue<TValue> = (value: TValue, parent: any, propertyName: string) => IUnsubscribeOrVoid
export type IUnsubscribeValue<TValue> = (
	value: TValue, parent: any, propertyName: string, isUnsubscribed: boolean,
) => void
export type ILastValue<TValue> = (value: TValue, parent: any, propertyName: string) => void

export enum ValueChangeType {
	None = 0,
	Unsubscribe,
	Subscribe,
	Changed = Unsubscribe | Subscribe,
}

export enum ValueKeyType {
	Property,
	ValueProperty,
	MapKey,
	CollectionAny,
}

export type ChangeValue<TValue> = (
	key: any,
	oldItem: TValue,
	newItem: TValue,
	changeType: ValueChangeType,
	keyType: ValueKeyType,
) => IUnsubscribeOrVoid

export interface IValueSubscriber<TValue> {
	change(
		key: any,
		oldValue: TValue,
		newValue: TValue,
		parent: any,
		changeType: ValueChangeType,
		keyType: ValueKeyType,
		propertiesPath: () => string,
		ruleDescription: string,
	): IUnsubscribeOrVoid
}
