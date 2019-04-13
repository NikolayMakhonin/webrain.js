import {Observable} from '../subjects/observable'
import {IUnsubscribe} from '../subjects/subject'

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
