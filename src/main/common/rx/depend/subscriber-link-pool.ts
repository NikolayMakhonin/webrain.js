import {ObjectPool} from '../../lists/ObjectPool'
import {ISubscriberLink, TFuncCallState, TSubscriberLink} from './contracts'

export const subscriberLinkPool = new ObjectPool<TSubscriberLink>(1000000)

// tslint:disable-next-line:no-shadowed-variable
export function releaseSubscriberLink(obj: TSubscriberLink) {
	subscriberLinkPool.release(obj)
}

// tslint:disable-next-line:no-shadowed-variable
export function getSubscriberLink<
	TState extends TFuncCallState,
	TSubscriber extends TFuncCallState,
>(
	state: TState,
	subscriber: TSubscriber,
	prev: ISubscriberLink<TState, any>,
	next: ISubscriberLink<TState, any>,
): ISubscriberLink<TState, TSubscriber> {
	const item: ISubscriberLink<TState, TSubscriber> = subscriberLinkPool.get()
	if (item != null) {
		item.state = state
		item.value = subscriber
		item.prev = prev
		item.next = next
		return item
	}
	return {
		state,
		value: subscriber,
		prev,
		next,
	}
}
