import {IUnsubscribe} from '../../subjects/subject'
import {IRule} from './rules'

export type ISubscribeObject<TObject, TChild> = (
	object: TObject,
	immediateSubscribe: boolean,
	subscribeItem: (item: TChild, debugPropertyName: string) => void,
	unsubscribeItem: (item: TChild, debugPropertyName: string) => void,
) => IUnsubscribe

export interface IRuleSubscribe<TObject, TChild> extends IRule {
	readonly subscribe: ISubscribeObject<TObject, TChild>
}
