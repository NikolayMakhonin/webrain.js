import {BehaviorSubject, IBehavior} from './behavior'
import {IObservable} from './observable'
import {ISubject, ISubscriber, IUnsubscribe, Subject} from './subject'

export interface IHasSubscribers<T> {
	readonly hasSubscribersObservable: IObservable<boolean>
	subscribe(subscriber: ISubscriber<T>): IUnsubscribe
}

// eslint-disable-next-line no-shadow
// tslint:disable-next-line:no-shadowed-variable
function createHasSubscribersSubjectDefault(hasSubscribers: boolean): ISubject<boolean> {
	const subject = new BehaviorSubject(hasSubscribers)
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

		private _hasSubscribersSubject: ISubject<boolean>

		public get hasSubscribersObservable(): IObservable<boolean> {
			let {_hasSubscribersSubject} = this
			if (!_hasSubscribersSubject) {
				this._hasSubscribersSubject = _hasSubscribersSubject = createHasSubscribersSubject(this.hasSubscribers)
			}

			return _hasSubscribersSubject
		}
	}
}

export interface IHasSubscribersSubject<T> extends ISubject<T>, IHasSubscribers<T> {

}

export const HasSubscribersSubject:
	new<T>() => IHasSubscribersSubject<T>
	= hasSubscribers(Subject)

export interface IHasSubscribersBehaviorSubject<T> extends ISubject<T>, IBehavior<T>, IHasSubscribers<T> {

}

export const HasSubscribersBehaviorSubject:
	new<T>() => IHasSubscribersBehaviorSubject<T>
	= hasSubscribers(BehaviorSubject)
