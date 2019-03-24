import {Observable} from './observable'

export function subject(base) {
	// eslint-disable-next-line no-shadow
	return class Subject extends base {
		get hasSubscribers() {
			return !!(this._subscribers && this._subscribers.length)
		}

		subscribe(subscriber) {
			let {_subscribers} = this
			if (!_subscribers) {
				this._subscribers = _subscribers = [subscriber]
			} else {
				_subscribers[_subscribers.length] = subscriber
			}

			let unsubscribed

			return () => {
				if (unsubscribed) {
					return
				}
				unsubscribed = true

				// unsubscribe
				// eslint-disable-next-line no-shadow
				const index = _subscribers.indexOf(subscriber)

				if (index >= 0) {
					_subscribers.splice(index, 1)
				}
			}
		}

		emit(value) {
			let {_subscribers} = this
			if (!_subscribers) {
				return this
			}

			_subscribers = _subscribers.slice()

			for (let i = 0, l = _subscribers.length; i < l; i++) {
				_subscribers[i](value)
			}

			return this
		}
	}
}

export const Subject = subject(Observable)

export function createSubjectClass(base, ...extensions) {
	for (const extension of extensions) {
		base = extension(base)
	}

	return base
}
