import {ISubscriberLink} from './contracts'

let subscriberLinkPoolSize: number = 0
const subscriberLinkPoolMaxSize: number = 1000000
const subscriberLinkPool = []

export function getSubscriberLinkFromPool<TThis,
	TArgs extends any[],
	TValue,
	>(): ISubscriberLink<TThis, TArgs, TValue> {
	// this.usedSize++
	const lastIndex = subscriberLinkPoolSize - 1
	if (lastIndex >= 0) {
		const obj = subscriberLinkPool[lastIndex]
		subscriberLinkPool[lastIndex] = null
		subscriberLinkPoolSize = lastIndex
		if (obj == null) {
			throw new Error('obj == null')
		}
		return obj
	}
	return null
}

export function releaseSubscriberLink<TThis,
	TArgs extends any[],
	TValue,
	>(obj: ISubscriberLink<TThis, TArgs, TValue>) {
	if (obj == null) {
		throw new Error('obj == null')
	}
	// this.usedSize--
	if (subscriberLinkPoolSize < subscriberLinkPoolMaxSize) {
		subscriberLinkPool[subscriberLinkPoolSize] = obj
		subscriberLinkPoolSize++
	}
}
