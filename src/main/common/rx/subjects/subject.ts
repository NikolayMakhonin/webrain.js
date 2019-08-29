import {IObservable, Observable} from './observable'

export interface ISubject<T> extends IObservable<T> {
	readonly hasSubscribers: boolean
	emit(value: T): this
}

export type IUnsubscribe = () => void
export type ISubscriber<T> = (value: T) => void

export function subject(base): any {
	// eslint-disable-next-line no-shadow
	// tslint:disable-next-line:no-shadowed-variable
	return class Subject<T> extends base implements ISubject<T> {
		private _subscribers: Array<ISubscriber<T>>

		get hasSubscribers() {
			return !!(this._subscribers && this._subscribers.length)
		}

		public subscribe(subscriber: ISubscriber<T>): IUnsubscribe {
			if (!subscriber) {
				return null
			}

			let {_subscribers} = this
			if (!_subscribers) {
				this._subscribers = _subscribers = [subscriber]
			} else {
				_subscribers[_subscribers.length] = subscriber
			}

			return () => {
				if (!subscriber) {
					return
				}

				const index = _subscribers.indexOf(subscriber)

				if (index >= 0) {
					for (let i = index + 1, len = _subscribers.length; i < len; i++) {
						_subscribers[i - 1] = _subscribers[i]
					}
					_subscribers.length--
				}

				subscriber = null
			}
		}

		public emit(value: T): this {
			const {_subscribers} = this
			if (!_subscribers) {
				return this
			}

			const len = _subscribers.length
			const subscribers = new Array(len)

			for (let i = 0; i < len; i++) {
				subscribers[i] = _subscribers[i]
			}
			for (let i = 0; i < len; i++) {
				subscribers[i](value)
			}

			return this
		}
	}
}

export const Subject:
	new<T = any>() => ISubject<T>
	= subject(Observable)

// export function createSubjectClass(base, ...extensions) {
// 	for (const extension of extensions) {
// 		base = extension(base)
// 	}
//
// 	return base
// }
