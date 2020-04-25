import {IUnsubscribe, IUnsubscribeOrVoid} from '../../../../../subjects/observable'
import {ValueChangeType, ValueKeyType} from './common'
import {IRuleAction} from './rules'

export type IChangeItem<TItem> = (
	item: TItem,
	key: any,
	keyType: ValueKeyType,
) => void
export type ISubscribeObject<TObject, TChild> = (
	object: TObject,
	changeItem: IChangeItem<TChild>,
) => IUnsubscribeOrVoid

export interface IRuleSubscribe<TObject = any, TChild = any> extends IRuleAction {
	readonly subscribe: ISubscribeObject<TObject, TChild>
}
