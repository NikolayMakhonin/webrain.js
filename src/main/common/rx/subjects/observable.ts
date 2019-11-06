export type IUnsubscribe = () => void
export type IUnsubscribeOrVoid = IUnsubscribe | void
export type ISubscriber<T> = (value: T) => void

export interface IObservable<T> {
	subscribe(subscriber: ISubscriber<T>, description?: any): IUnsubscribe
}

export abstract class Observable<T = any> implements IObservable<T> {
	public call(func: (observable: this) => any): any {
		return func(this)
	}

	public abstract subscribe(subscriber: ISubscriber<T>, description?: any): IUnsubscribe
}
