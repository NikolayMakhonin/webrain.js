import {IUnsubscribe, Observable} from '../subjects/observable'

declare module '../subjects/observable' {
	interface Observable<T> {
		autoConnect(connectPredicate: (value) => boolean, connectFunc: () => () => void): IUnsubscribe
	}
}

Observable.prototype.autoConnect = function(connectPredicate, connectFunc) {
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
