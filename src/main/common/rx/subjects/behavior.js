import {Subject} from './subject'

export function behavior(base) {
	// eslint-disable-next-line no-shadow
	return class BehaviorSubject extends base {
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
