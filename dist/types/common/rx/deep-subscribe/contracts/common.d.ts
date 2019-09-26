import { IUnsubscribe, IUnsubscribeOrVoid } from '../../subjects/observable';
export declare type ISubscribeValue<TValue> = (value: TValue, parent: any, propertyName: string) => IUnsubscribeOrVoid;
export declare type IUnsubscribeValue<TValue> = (value: TValue, parent: any, propertyName: string, isUnsubscribed: boolean) => void;
export declare type ILastValue<TValue> = (value: TValue, parent: any, propertyName: string) => void;
export interface IValueSubscriber<TValue> {
    subscribe(value: TValue, parent: any, propertyName: string, propertiesPath: () => string, ruleDescription: string): IUnsubscribe;
    unsubscribe(value: TValue, parent: any, propertyName: string): void;
}
