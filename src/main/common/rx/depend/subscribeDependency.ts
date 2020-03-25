import {IFuncCallState, ISubscriberLink} from './contracts'
import {TFuncCallState} from './FuncCallState'
import {getSubscriberLink, releaseSubscriberLink} from './subscriber-link-pool'

export function subscriberLinkDelete<TState extends TFuncCallState>(
	item: ISubscriberLink<TState, any>,
) {
	const {prev, next, state} = item
	if (state == null) {
		return
	}
	if (item === state._subscribersCalculating) {
		state._subscribersCalculating = next
	}
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

// tslint:disable-next-line:no-shadowed-variable
export function unsubscribeDependencies(state: TFuncCallState, fromIndex: number = 0) {
	const _unsubscribers = state._unsubscribers
	if (_unsubscribers != null) {
		const len = state._unsubscribersLength
		for (let i = fromIndex; i < len; i++) {
			const item = _unsubscribers[i]
			_unsubscribers[i] = null
			subscriberLinkDelete(item)
		}
		state._unsubscribersLength = fromIndex
		if (fromIndex < 256 && len > 256) {
			_unsubscribers.length = 256
		}
	}
}

export function _subscribe<
	TState extends TFuncCallState,
	TSubscriber extends TFuncCallState,
>(
	state: TState,
	subscriber: TSubscriber,
) {
	const _subscribersLast = state._subscribersLast
	const subscriberLink = getSubscriberLink(state, subscriber, _subscribersLast, null)
	if (_subscribersLast == null) {
		state._subscribersFirst = subscriberLink
	} else {
		_subscribersLast.next = subscriberLink
	}
	state._subscribersLast = subscriberLink
	return subscriberLink
}
