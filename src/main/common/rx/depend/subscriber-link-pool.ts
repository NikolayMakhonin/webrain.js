import {ObjectPool} from '../../lists/ObjectPool'
import {IFuncCallState, ISubscriberLink} from './contracts'

export const subscriberLinkPool = new ObjectPool<ISubscriberLink<any, any, any>>(1000000)

// tslint:disable-next-line:no-shadowed-variable
export function releaseSubscriberLink<TThis,
	TArgs extends any[],
	TValue,
	>(obj: ISubscriberLink<TThis, TArgs, TValue>) {
	subscriberLinkPool.release(obj)
}

// tslint:disable-next-line:no-shadowed-variable
export function getSubscriberLink<
	TThis,
	TArgs extends any[],
	TValue,
>(
	state: IFuncCallState<TThis, TArgs, TValue>,
	subscriber: IFuncCallState<TThis, TArgs, TValue>,
	prev: ISubscriberLink<TThis, TArgs, TValue>,
	next: ISubscriberLink<TThis, TArgs, TValue>,
): ISubscriberLink<TThis, TArgs, TValue> {
	const item: ISubscriberLink<TThis, TArgs, TValue> = subscriberLinkPool.get()
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
