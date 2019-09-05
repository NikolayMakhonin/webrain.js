import { IObservable } from './observable';
export interface ISubject<T> extends IObservable<T> {
    readonly hasSubscribers: boolean;
    emit(value: T): this;
}
export declare type IUnsubscribe = () => void;
export declare type ISubscriber<T> = (value: T) => void;
export declare function subject(base: any): any;
export declare const Subject: new <T = any>() => ISubject<T>;
