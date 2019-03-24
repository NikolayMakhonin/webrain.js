import {Subject, SubjectBase} from "../subject";

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
