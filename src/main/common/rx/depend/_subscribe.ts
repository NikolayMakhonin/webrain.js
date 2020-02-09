import {IFuncCallState} from './contracts'
import {getSubscriberLink} from './getSubscriberLink'

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
