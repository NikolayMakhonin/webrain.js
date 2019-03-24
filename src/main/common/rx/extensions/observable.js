import {Observable} from '../subject'

Observable.prototype.unsubscribeValue = function (unsubscribeValue) {
	const base = this

	return new Observable({
		subscribe(subscriber) {
			const unsubscribe = base.subscribe(subscriber)

			let unsubscribed
			return () => {
				if (unsubscribed) {
					return
				}
				unsubscribed = true

				subscriber(unsubscribeValue)
				unsubscribe()
			}
		}
	})
}

Observable.prototype.autoConnect = function (connectPredicate, connectFunc) {
	let disconnect
	return this.subscribe(value => {
		if (connectPredicate && connectPredicate(value) || !connectPredicate && value) {
			if (!disconnect) {
				disconnect = connectFunc()
			}
		} else if (disconnect) {
			disconnect()
		}
	})
}
