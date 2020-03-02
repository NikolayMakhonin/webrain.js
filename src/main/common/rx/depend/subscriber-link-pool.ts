import {IFuncCallState, ISubscriberLink} from './contracts'

export class SubscriberLinkPool {
	public size = 0
	public maxSize = 1000000
	public stack = []
}

export const subscriberLinkPool = new SubscriberLinkPool()
export let poolFirst: ISubscriberLink<any, any, any>
export let poolLast: ISubscriberLink<any, any, any>

export function getSubscriberLinkFromPool<TThis,
	TArgs extends any[],
	TValue,
	>(): ISubscriberLink<TThis, TArgs, TValue> {
	// Pool as Linked List
	// const result = poolLast
	// if (result != null) {
	// 	const {prev} = result
	// 	if (prev == null) {
	// 		poolFirst = null
	// 		poolLast = null
	// 	} else {
	// 		prev.next = null
	// 		poolLast = prev
	// 	}
	// }
	// return result

	// Pool as Array
	// this.usedSize++
	const lastIndex = subscriberLinkPool.size - 1
	if (lastIndex >= 0) {
		const obj = subscriberLinkPool.stack[lastIndex]
		subscriberLinkPool.stack[lastIndex] = null
		subscriberLinkPool.size = lastIndex
		if (obj == null) {
			throw new Error('obj == null')
		}
		return obj
	}
	return null
}

// tslint:disable-next-line:no-shadowed-variable
export function releaseSubscriberLink<TThis,
	TArgs extends any[],
	TValue,
	>(obj: ISubscriberLink<TThis, TArgs, TValue>) {
	// Pool as Linked List
	// if (poolLast == null) {
	// 	poolFirst = obj
	// 	obj.prev = null
	// } else {
	// 	poolLast.next = obj
	// 	obj.prev = poolLast
	// }
	// obj.next = null
	// poolLast = obj

	// Pool as Array
	// this.usedSize--
	if (subscriberLinkPool.size < subscriberLinkPool.maxSize) {
		subscriberLinkPool.stack[subscriberLinkPool.size] = obj
		subscriberLinkPool.size++
	}
}

// tslint:disable-next-line:no-shadowed-variable
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