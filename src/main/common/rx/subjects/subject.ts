import {IObservable, ISubscriber, IUnsubscribe, Observable} from './observable'

export interface ISubject<T> extends IObservable<T> {
	readonly hasSubscribers: boolean
	emit(value: T): this
}

export function subject(base): any {
	// eslint-disable-next-line no-shadow
	// tslint:disable-next-line:no-shadowed-variable
	return class Subject<T> extends base implements ISubject<T> {
		private _subscribers: Array<ISubscriber<T>>
		private _subscribersInProcess: Array<ISubscriber<T>>

		get hasSubscribers() {
			return !!(this._subscribers && this._subscribers.length)
		}

		get subscribersCount() {
			return this._subscribers && this._subscribers.length
		}

		public subscribe(subscriber: ISubscriber<T>, description?: any): IUnsubscribe {
			if (!subscriber) {
				return null
			}

			if (description) {
				(subscriber as any).description = description
			}

			const {_subscribers} = this
			if (!_subscribers) {
				this._subscribers = [subscriber]
			} else {
				_subscribers[_subscribers.length] = subscriber
			}

			return () => {
				if (!subscriber) {
					return
				}

				// tslint:disable-next-line:no-shadowed-variable
				const {_subscribers} = this
				const len = _subscribers.length
				const index = _subscribers.indexOf(subscriber)
				if (index >= 0) {
					if (this._subscribersInProcess === _subscribers) {
						const subscribers = new Array(len - 1)

						for (let i = 0; i < index; i++) {
							subscribers[i] = _subscribers[i]
						}
						for (let i = index + 1; i < len; i++) {
							subscribers[i - 1] = _subscribers[i]
						}

						this._subscribers = subscribers
					} else {
						for (let i = index + 1; i < len; i++) {
							_subscribers[i - 1] = _subscribers[i]
						}
						_subscribers.length = len - 1
					}
				}

				subscriber = null
			}
		}

		public emit(value: T): this {
			const {_subscribers} = this
			if (!_subscribers) {
				return this
			}

			if (this._subscribersInProcess !== _subscribers) {
				this._subscribersInProcess = _subscribers
			}

			for (let i = 0, len = _subscribers.length; i < len; i++) {
				_subscribers[i](value)
			}

			if (this._subscribersInProcess === _subscribers) {
				this._subscribersInProcess = null
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
