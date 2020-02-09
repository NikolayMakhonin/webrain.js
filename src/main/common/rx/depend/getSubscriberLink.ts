import {IFuncCallState, ISubscriberLink} from './contracts'
import {getSubscriberLinkFromPool} from './pool'

export function getSubscriberLink<TThis,
	TArgs extends any[],
	TValue,
	>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	subscriber: IFuncCallState<TThis, TArgs, TValue>,
	prev: ISubscriberLink<TThis, TArgs, TValue>,
	next: ISubscriberLink<TThis, TArgs, TValue>,
): ISubscriberLink<TThis, TArgs, TValue> {
	const item = getSubscriberLinkFromPool<TThis, TArgs, TValue>()
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
