import {IFuncCallState} from './contracts'
import {getSubscriberLink, releaseSubscriberLink} from './subscriber-link-pool'

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

// tslint:disable-next-line:no-shadowed-variable
export function unsubscribeDependencies<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>) {
	const _unsubscribers = state._unsubscribers
	if (_unsubscribers != null) {
		const len = state._unsubscribersLength
		for (let i = 0; i < len; i++) {
			const item = _unsubscribers[i]
			_unsubscribers[i] = null
			// subscriberLinkDelete(item.state, item)
			// region inline call
			{
				// tslint:disable-next-line:no-shadowed-variable
				const {prev, next, state} = item
				if (state == null) {
					return
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
			// endregion
		}
		state._unsubscribersLength = 0
		if (len > 256) {
			_unsubscribers.length = 256
		}
	}
}

export function _subscribe<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>, subscriber: IFuncCallState<TThis, TArgs, TValue>) {
	const _subscribersLast = state._subscribersLast
	const subscriberLink = getSubscriberLink<TThis, TArgs, TValue>(state, subscriber, _subscribersLast, null)
	if (_subscribersLast == null) {
		state._subscribersFirst = subscriberLink
	} else {
		_subscribersLast.next = subscriberLink
	}
	state._subscribersLast = subscriberLink
	return subscriberLink
}

// tslint:disable-next-line:no-shadowed-variable
export function subscribeDependency<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>, dependency) {
	if (dependency.callId > state.callId) {
		return
	}
	const subscriberLink = _subscribe(dependency, state)
	const _unsubscribers = state._unsubscribers
	if (_unsubscribers == null) {
		state._unsubscribers = [subscriberLink]
		state._unsubscribersLength = 1
	} else {
		_unsubscribers[state._unsubscribersLength++] = subscriberLink
	}
}