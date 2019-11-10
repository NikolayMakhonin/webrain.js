import {IUnsubscribeOrVoid} from '../../subjects/observable'
import {PropertiesPath} from '../helpers/PropertiesPath'
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
	propertiesPath: PropertiesPath,
	rule: IRule,
	isUnsubscribed?: boolean,
) => IUnsubscribeOrVoid

export interface IValueSubscriber<TValue> {
	debugTarget: any
	change(
		key: any,
		oldValue: TValue,
		newValue: TValue,
		parent: any,
		changeType: ValueChangeType,
		keyType: ValueKeyType,
		propertiesPath: PropertiesPath,
		rule: IRule,
	): IUnsubscribeOrVoid
}
