import { ISubscriber, IUnsubscribe } from './observable';
import { ISubject } from './subject';
export interface IBehavior<T> {
    value: T;
    unsubscribeValue: T;
    subscribe(subscriber: ISubscriber<T>): IUnsubscribe;
    emit(value: T): this;
}
export declare function behavior<TBase>(base: any): any;
export interface IBehaviorSubject<T> extends ISubject<T>, IBehavior<T> {
}
export declare const BehaviorSubject: new <T>(value?: T) => IBehaviorSubject<T>;
