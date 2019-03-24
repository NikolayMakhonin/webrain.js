/* eslint-disable prefer-destructuring */

export const Observable = class {
	constructor(fields) {
		Object.assign(this, fields)
	}

	call(func) {
		return func(this)
	}
}

export const SubjectBase = class extends Observable {
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

export class Subject extends SubjectBase {
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
		const hasObservers = this.subscribers && this.subscribers.length

		super.unsubscribe(subscriber)

		if (hasObservers && this._hasObserversObservable && this.subscribers.length === 0) {
			this._hasObserversObservable.emit(false)
		}

		return this
	}
}

export class BehaviorSubject extends Subject {
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

Object.defineProperty(Subject.prototype, 'hasObserversObservable', {
	get() {
		if (!this._hasObserversObservable) {
			this._hasObserversObservable = new BehaviorSubject(!!(this.subscribers && this.subscribers.length))
		}

		return this._hasObserversObservable
	}
})
