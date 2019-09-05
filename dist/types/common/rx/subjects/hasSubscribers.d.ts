import { IBehavior } from './behavior';
import { IObservable, ISubscriber, IUnsubscribe } from './observable';
import { ISubject } from './subject';
export interface IHasSubscribers<T> {
    readonly hasSubscribersObservable: IObservable<boolean>;
    subscribe(subscriber: ISubscriber<T>): IUnsubscribe;
}
declare function createHasSubscribersSubjectDefault(hasSubscribers: boolean): ISubject<boolean>;
export declare function hasSubscribers(base: any, createHasSubscribersSubject?: typeof createHasSubscribersSubjectDefault): any;
export interface IHasSubscribersSubject<T> extends ISubject<T>, IHasSubscribers<T> {
}
export declare const HasSubscribersSubject: new <T>() => IHasSubscribersSubject<T>;
export interface IHasSubscribersBehaviorSubject<T> extends ISubject<T>, IBehavior<T>, IHasSubscribers<T> {
}
export declare const HasSubscribersBehaviorSubject: new <T>() => IHasSubscribersBehaviorSubject<T>;
export {};
