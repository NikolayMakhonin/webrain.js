import {IUnsubscribeOrVoid} from '../../subjects/observable'

export type ILastValue<TValue> = (value: TValue, parent: any, key: any, keyType: ValueKeyType) => void

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

export type IChangeValue<TValue> = (
	key: any,
	oldValue: TValue,
	newValue: TValue,
	parent: any,
	changeType: ValueChangeType,
	keyType: ValueKeyType,
	isUnsubscribed?: boolean,
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
