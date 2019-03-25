import {Subject} from './subject'

export function behavior(base) {
	return class Behavior extends base {
		subscribe(subscriber) {
			if (!subscriber) {
				return null
			}

			let unsubscribe = super.subscribe(subscriber)

			const {value} = this
			if (typeof value !== 'undefined') {
				subscriber(value)
			}

			return () => {
				if (!unsubscribe) {
					return
				}

				try {
					// eslint-disable-next-line no-shadow
					const {value, unsubscribeValue} = this
					if (typeof unsubscribeValue !== 'undefined' && unsubscribeValue !== value) {
						subscriber(unsubscribeValue)
					}
				} finally {
					unsubscribe()
					unsubscribe = null
				}
			}
		}

		emit(value) {
			this.value = value
			super.emit(value)
			return this
		}
	}
}

export const BehaviorSubject = behavior(Subject)
