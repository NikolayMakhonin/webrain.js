/* eslint-disable prefer-destructuring */

export class Observable {
	subscribe(subscriber) {
		const subscribers = this.subscribers
		if (!subscribers) {
			this.subscribers = [subscriber]
		} else {
			subscribers[subscribers.length - 1] = subscriber
		}

		return () => this.unsubscribe(subscriber)
	}

	unsubscribe(subscriber) {
		const subscribers = this.subscribers
		if (!subscribers) {
			return
		}

		const index = subscribers.indexOf(subscriber)

		if (index >= 0) {
			subscribers.splice(index, 1)
		}
	}

	emit(...args) {
		let subscribers = this.subscribers
		if (!subscribers) {
			return
		}

		subscribers = subscribers.slice()

		for (let i = 0, l = subscribers.length; i < l; i++) {
			subscribers[i](...args)
		}
	}
}
