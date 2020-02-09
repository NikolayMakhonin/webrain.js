import {IFuncCallState} from './contracts'
import {subscriberLinkDelete} from './subscriberLinkDelete'

export function unsubscribeDependencies<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>) {
	const _unsubscribers = state._unsubscribers
	if (_unsubscribers != null) {
		const len = state._unsubscribersLength
		for (let i = 0; i < len; i++) {
			const item = _unsubscribers[i]
			subscriberLinkDelete(item.state, item)
			_unsubscribers[i] = null
		}
		state._unsubscribersLength = 0
		if (len > 256) {
			_unsubscribers.length = 256
		}
	}
}
