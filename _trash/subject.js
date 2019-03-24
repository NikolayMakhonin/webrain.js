import {BehaviorSubject, Subject} from '../src/main/common/rx/subject'

Subject.prototype.extendReplayLast = function (initValue) {
	let lastValue = initValue
	const {subscribe, emit} = this

	this.emit = value => {
		lastValue = value
		return emit(value)
	}

	this.subscribe = subscriber => {
		subscriber(lastValue)
		return subscribe(subscriber)
	}

	return this
}

Subject.prototype.extendHasSubscribers = function (initValue) {
	let count = 0
	const {subscribe} = this

	Object.defineProperty(Subject.prototype, 'hasObserversObservable', {
		get() {
			if (!this._hasObserversObservable) {
				this._hasObserversObservable = new BehaviorSubject(!!(this.subscribers && this.subscribers.length))
			}

			return this._hasObserversObservable
		}
	})

	this.subscribe = subscriber => {
		count++
		subscriber(lastValue)
		const unsubscribe = subscribe(subscriber)
		return () => {
			unsubscribe()
			count--
		}
	}

	return this
}
