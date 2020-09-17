import { IObservable } from './observable';
export interface ISubject<T> extends IObservable<T> {
    readonly hasSubscribers: boolean;
    emit(value: T): this;
}
export declare function subject(base: any): any;
export declare const Subject: new <T = any>() => ISubject<T>;
