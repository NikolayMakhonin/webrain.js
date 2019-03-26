import {BehaviorSubject} from './behavior'
import {Subject} from './subject'

// eslint-disable-next-line no-shadow
function createHasSubscribersSubjectDefault(hasSubscribers) {
	const subject = new BehaviorSubject()
	subject.value = hasSubscribers
	subject.unsubscribeValue = null
	return subject
}

export function hasSubscribers(base, createHasSubscribersSubject = createHasSubscribersSubjectDefault) {
	return class HasSubscribers extends base {
		subscribe(subscriber) {
			if (!subscriber) {
				return null
			}

			// eslint-disable-next-line no-shadow
			const {hasSubscribers} = this

			const unsubscribe = super.subscribe(subscriber)

			if (!hasSubscribers && this._hasSubscribersSubject && this.hasSubscribers) {
				this._hasSubscribersSubject.emit(true)
			}

			return () => {
				// eslint-disable-next-line no-shadow
				const {hasSubscribers} = this

				unsubscribe()

				if (hasSubscribers && this._hasSubscribersSubject && !this.hasSubscribers) {
					this._hasSubscribersSubject.emit(false)
				}
			}
		}

		get hasSubscribersObservable() {
			let {_hasSubscribersSubject} = this
			if (!_hasSubscribersSubject) {
				this._hasSubscribersSubject = _hasSubscribersSubject = createHasSubscribersSubject(this.hasSubscribers)
			}

			return _hasSubscribersSubject
		}
	}
}

export const HasSubscribersSubject = hasSubscribers(Subject)
export const HasSubscribersBehaviorSubject = hasSubscribers(BehaviorSubject)