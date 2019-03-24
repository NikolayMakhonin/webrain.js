/* eslint-disable prefer-destructuring */

export const Observable = class {
	constructor(fields) {
		Object.assign(this, fields)
	}

	call(func) {
		return func(this)
	}
}

export const Subject = class extends Observable {
	subscribe(subscriber) {
		const subscribers = this.subscribers
		if (!subscribers) {
			this.subscribers = [subscriber]
		} else {
			subscribers[subscribers.length] = subscriber
		}

		let unsubscribed

		return () => {
			if (unsubscribed) {
				return
			}
			unsubscribed = true

			this.unsubscribe(subscriber)
		}
	}

	unsubscribe(subscriber) {
		const subscribers = this.subscribers
		if (!subscribers) {
			return this
		}

		const index = subscribers.indexOf(subscriber)

		if (index >= 0) {
			subscribers.splice(index, 1)
		}

		return this
	}

	emit(value) {
		let subscribers = this.subscribers
		if (!subscribers) {
			return this
		}

		subscribers = subscribers.slice()

		for (let i = 0, l = subscribers.length; i < l; i++) {
			subscribers[i](value)
		}

		return this
	}
}

// export class Subject extends SubjectBase {
// 	get hasObservers() {
// 		return !!(this.subscribers && this.subscribers.length)
// 	}
//
// 	subscribe(subscriber) {
// 		const result = super.subscribe(subscriber)
//
// 		if (this._hasObserversObservable && this.subscribers.length === 1) {
// 			this._hasObserversObservable.emit(true)
// 		}
//
// 		return result
// 	}
//
// 	unsubscribe(subscriber) {
// 		const hasObservers = this.subscribers && this.subscribers.length
//
// 		super.unsubscribe(subscriber)
//
// 		if (hasObservers && this._hasObserversObservable && this.subscribers.length === 0) {
// 			this._hasObserversObservable.emit(false)
// 		}
//
// 		return this
// 	}
// }

// export class BehaviorSubject extends Subject {
// 	constructor(value) {
// 		super()
// 		this.value = value
// 	}
//
// 	subscribe(subscriber) {
// 		const result = super.subscribe(subscriber)
// 		subscriber(this.value)
// 		return result
// 	}
//
// 	emit(value) {
// 		this.value = value
// 		super.emit(value)
// 		return this
// 	}
// }
//
// Object.defineProperty(Subject.prototype, 'hasObserversObservable', {
// 	get() {
// 		if (!this._hasObserversObservable) {
// 			this._hasObserversObservable = new BehaviorSubject(!!(this.subscribers && this.subscribers.length))
// 		}
//
// 		return this._hasObserversObservable
// 	}
// })

export function behavior(base) {
	// eslint-disable-next-line no-shadow
	return class BehaviorSubject extends base {
		constructor(value) {
			super()
			this.value = value
		}

		subscribe(subscriber) {
			const result = super.subscribe(subscriber)
			subscriber(this.value)
			return result
		}

		emit(value) {
			this.value = value
			super.emit(value)
			return this
		}
	}
}

export const BehaviorSubject = behavior(Subject)

export function hasObservers(base) {
	class HasObserversSubject extends base {
		get hasObservers() {
			return !!(this.subscribers && this.subscribers.length)
		}

		subscribe(subscriber) {
			const result = super.subscribe(subscriber)

			if (this._hasObserversObservable && this.subscribers.length === 1) {
				this._hasObserversObservable.emit(true)
			}

			return result
		}

		unsubscribe(subscriber) {
			// eslint-disable-next-line no-shadow
			const hasObservers = this.subscribers && this.subscribers.length

			super.unsubscribe(subscriber)

			if (hasObservers && this._hasObserversObservable && this.subscribers.length === 0) {
				this._hasObserversObservable.emit(false)
			}

			return this
		}
	}

	Object.defineProperty(HasObserversSubject.prototype, 'hasObserversObservable', {
		get() {
			if (!this._hasObserversObservable) {
				this._hasObserversObservable = new BehaviorSubject(!!(this.subscribers && this.subscribers.length))
			}

			return this._hasObserversObservable
		}
	})

	return HasObserversSubject
}

export function CreateClass(base, extensions) {
	for (const extension of extensions) {
		base = extension(base)
	}

	return base
}
