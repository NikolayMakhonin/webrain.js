import {BehaviorSubject} from './behavior'

// eslint-disable-next-line no-shadow
function createHasSubscribersSubjectDefault(hasSubscribers) {
	const subject = new BehaviorSubject()
	subject.value = hasSubscribers
	return subject
}

export function hasSubscribers(base, createHasSubscribersSubject = createHasSubscribersSubjectDefault) {
	// eslint-disable-next-line no-shadow
	class HasSubscribersSubject extends base {
		subscribe(subscriber) {
			// eslint-disable-next-line no-shadow
			const {hasSubscribers} = this

			const result = super.subscribe(subscriber)

			if (!hasSubscribers && this._hasSubscribersSubject) {
				this._hasSubscribersSubject.emit(true)
			}

			return () => {
				// eslint-disable-next-line no-shadow
				const {hasSubscribers} = this

				result()

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


	return HasSubscribersSubject
}
