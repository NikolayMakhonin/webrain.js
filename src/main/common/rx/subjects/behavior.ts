import {equals, TClass} from '../../helpers/helpers'
import {ISubscriber, IUnsubscribe} from './observable'
import {ISubject, Subject} from './subject'

export interface IBehavior<T> {
	value: T
	unsubscribeValue: T
	subscribe(subscriber: ISubscriber<T>, description?: any): IUnsubscribe
	emit(value: T): this
}

export function behavior<TBase>(base: TClass<TBase>): any {
	return class Behavior<T> extends (base as any) implements IBehavior<T> {
		public value: T
		public unsubscribeValue: T

		constructor(value?: T) {
			// eslint-disable-next-line constructor-super
			super()
			if (typeof value !== 'undefined') {
				this.value = value
			}
		}

		public subscribe(subscriber: ISubscriber<T>, description?: any): IUnsubscribe {
			if (!subscriber) {
				return null
			}

			if (description) {
				(subscriber as any).description = description
			}

			let unsubscribe = super.subscribe(subscriber)

			const {value} = this
			if (typeof value !== 'undefined') {
				subscriber(value)
			}

			return () => {
				const _unsubscribe = unsubscribe
				if (!_unsubscribe) {
					return
				}
				unsubscribe = null

				try {
					// eslint-disable-next-line @typescript-eslint/no-shadow
					const {value, unsubscribeValue} = this
					if (typeof unsubscribeValue !== 'undefined' && !equals(unsubscribeValue, value)) {
						subscriber(unsubscribeValue)
					}
				} finally {
					_unsubscribe()
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
	new<T>(value?: T) => IBehaviorSubject<T> =
	behavior(Subject)
