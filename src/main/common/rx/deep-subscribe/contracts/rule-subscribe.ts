import {IUnsubscribe} from '../../subjects/subject'
import {IRuleAction} from './rules'

export type ISubscribeObject<TObject, TChild> = (
	object: TObject,
	immediateSubscribe: boolean,
	subscribeItem: (item: TChild, debugPropertyName: string) => void,
	unsubscribeItem: (item: TChild, debugPropertyName: string) => void,
) => IUnsubscribe

export interface IRuleSubscribe<TObject = any, TChild = any> extends IRuleAction {
	readonly subscribe: ISubscribeObject<TObject, TChild>
	unsubscribers: IUnsubscribe[]
}
