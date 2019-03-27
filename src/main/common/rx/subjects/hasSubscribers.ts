import {BehaviorSubject, IBehavior} from './behavior'
import {IObservable} from './observable'
import {ISubject, ISubscriber, IUnsubscribe, Subject} from './subject'

export interface IHasSubscribers<T> {
	readonly hasSubscribersObservable: IObservable<boolean>
	subscribe(subscriber: ISubscriber<T>): IUnsubscribe
}

// eslint-disable-next-line no-shadow
// tslint:disable-next-line:no-shadowed-variable
function createHasSubscribersSubjectDefault(hasSubscribers: boolean) {
	const subject = new BehaviorSubject()
	subject.value = hasSubscribers
	subject.unsubscribeValue = null
	return subject
}

export function hasSubscribers(base, createHasSubscribersSubject = createHasSubscribersSubjectDefault): any {
	return class HasSubscribers<T> extends base implements IHasSubscribers<T> {
		public subscribe(subscriber: ISubscriber<T>): IUnsubscribe {
			if (!subscriber) {
				return null
			}

			// eslint-disable-next-line no-shadow
			// tslint:disable-next-line:no-shadowed-variable
			const {hasSubscribers} = this

			const unsubscribe = super.subscribe(subscriber)

			if (!hasSubscribers && this._hasSubscribersSubject && this.hasSubscribers) {
				this._hasSubscribersSubject.emit(true)
			}

			return () => {
				// eslint-disable-next-line no-shadow
				// tslint:disable-next-line:no-shadowed-variable
				const {hasSubscribers} = this

				unsubscribe()

				if (hasSubscribers && this._hasSubscribersSubject && !this.hasSubscribers) {
					this._hasSubscribersSubject.emit(false)
				}
			}
		}

		public get hasSubscribersObservable() {
			let {_hasSubscribersSubject} = this
			if (!_hasSubscribersSubject) {
				this._hasSubscribersSubject = _hasSubscribersSubject = createHasSubscribersSubject(this.hasSubscribers)
			}

			return _hasSubscribersSubject
		}
	}
}

export const HasSubscribersSubject:
	new<T>() => IObservable<T> & ISubject<T> & IHasSubscribers<T>
	= hasSubscribers(Subject)

export const HasSubscribersBehaviorSubject:
	new<T>() => IObservable<T> & ISubject<T> & IBehavior<T> & IHasSubscribers<T>
	= hasSubscribers(BehaviorSubject)
