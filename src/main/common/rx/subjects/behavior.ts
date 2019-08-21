import {ISubject, ISubscriber, IUnsubscribe, Subject} from './subject'

export interface IBehavior<T> {
	value: T
	unsubscribeValue: T
	subscribe(subscriber: ISubscriber<T>): IUnsubscribe
	emit(value: T): this
}

export function behavior<TBase>(base): any {
	return class Behavior<T> extends base implements IBehavior<T> {
		public value: T
		public unsubscribeValue: T

		constructor(value?: T) {
			super()
			if (typeof value !== 'undefined') {
				this.value = value
			}
		}

		public subscribe(subscriber: ISubscriber<T>): IUnsubscribe {
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
					// tslint:disable-next-line:no-shadowed-variable
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

		public emit(value) {
			this.value = value
			super.emit(value)
			return this
		}
	}
}

export interface IBehaviorSubject<T> extends ISubject<T>, IBehavior<T> {

}

export const BehaviorSubject:
	new<T>(value?: T) => IBehaviorSubject<T>
	= behavior(Subject)
