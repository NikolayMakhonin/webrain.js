import {IUnsubscribeOrVoid} from '../../subjects/observable'
import {IRule} from './rules'

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
	propertiesPath: IPropertiesPath,
	rule: IRule,
	isUnsubscribed?: boolean,
) => IUnsubscribeOrVoid

export interface IPropertiesPath {
	value: any
	parent: IPropertiesPath
	key: any
	keyType: ValueKeyType
	rule: IRule
	readonly id: string

	toString(): string
}

export interface IValueSubscriber<TValue> {
	debugTarget: any
	change(
		key: any,
		oldValue: TValue,
		newValue: TValue,
		parent: any,
		changeType: ValueChangeType,
		keyType: ValueKeyType,
		propertiesPath: IPropertiesPath,
		rule: IRule,
	): IUnsubscribeOrVoid
}
