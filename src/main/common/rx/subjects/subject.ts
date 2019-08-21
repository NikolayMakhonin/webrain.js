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
					_subscribers.splice(index, 1)
				}

				subscriber = null
			}
		}

		public emit(value: T): this {
			let {_subscribers} = this
			if (!_subscribers) {
				return this
			}

			_subscribers = _subscribers.slice()

			for (let i = 0, l = _subscribers.length; i < l; i++) {
				_subscribers[i](value)
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
