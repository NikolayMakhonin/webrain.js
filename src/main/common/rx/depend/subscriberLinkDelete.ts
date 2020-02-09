import {IFuncCallState} from './contracts'
import {releaseSubscriberLink} from './pool'

export function subscriberLinkDelete<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>, item) {
	if (state == null) {
		return
	}
	const {prev, next} = item
	if (prev == null) {
		if (next == null) {
			state._subscribersFirst = null
			state._subscribersLast = null
		} else {
			state._subscribersFirst = next
			next.prev = null
			item.next = null
		}
	} else {
		if (next == null) {
			state._subscribersLast = prev
			prev.next = null
		} else {
			prev.next = next
			next.prev = prev
			item.next = null
		}
		item.prev = null
	}
	item.state = null
	item.value = null
	releaseSubscriberLink(item)
}
