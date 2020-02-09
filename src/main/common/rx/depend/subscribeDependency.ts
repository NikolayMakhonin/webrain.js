import {_subscribe} from './_subscribe'
import {IFuncCallState} from './contracts'

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
