import {IUnsubscribe, IUnsubscribeOrVoid} from '../../subjects/observable'
import {IRuleAction} from './rules'

export enum ItemChangeType {
	None = 0,
	Unsubscribe,
	Subscribe,
	Changed = Unsubscribe | Subscribe,
}

export enum ItemKeyType {
	Property,
	ValueProperty,
	MapKey,
	CollectionAny,
}

export type ChangeItem<TItem> = (
	key: any,
	oldItem: TItem,
	newItem: TItem,
	changeType: ItemChangeType,
	keyType: ItemKeyType,
) => void

export type ISubscribeObject<TObject, TChild> = (
	object: TObject,
	immediateSubscribe: boolean,
	changeItem: ChangeItem<TChild>,
) => IUnsubscribeOrVoid

export interface IRuleSubscribe<TObject = any, TChild = any> extends IRuleAction {
	readonly subscribe: ISubscribeObject<TObject, TChild>
	unsubscribers: IUnsubscribe[]
	unsubscribersCount: number[]
}
