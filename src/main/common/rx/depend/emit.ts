import {IFuncCallState} from './contracts'
import {getSubscriberLink} from './getSubscriberLink'
import {invalidate} from './invalidate'
import {releaseSubscriberLink} from './pool'

export function emit<TThis,
	TArgs extends any[],
	TValue,
	>(state: IFuncCallState<TThis, TArgs, TValue>, status) {
	if (state._subscribersFirst == null) {
		return
	}

	let clonesFirst
	let clonesLast
	for (let link = state._subscribersFirst; link; link = link.next) {
		const cloneLink = getSubscriberLink(state, link.value, null, link.next)
		if (clonesLast == null) {
			clonesFirst = cloneLink
		} else {
			clonesLast.next = cloneLink
		}
		clonesLast = cloneLink
	}
	for (let link = clonesFirst; link;) {
		invalidate(link.value, status)
		link.value = null
		const next = link.next
		link.next = null
		releaseSubscriberLink(link)
		link = next
	}
}
