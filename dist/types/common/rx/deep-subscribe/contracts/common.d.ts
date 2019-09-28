import { IUnsubscribeOrVoid } from '../../subjects/observable';
export declare type ISubscribeValue<TValue> = (value: TValue, parent: any, propertyName: string) => IUnsubscribeOrVoid;
export declare type IUnsubscribeValue<TValue> = (value: TValue, parent: any, propertyName: string, isUnsubscribed: boolean) => void;
export declare type ILastValue<TValue> = (value: TValue, parent: any, propertyName: string) => void;
export declare enum ValueChangeType {
    None = 0,
    Unsubscribe = 1,
    Subscribe = 2,
    Changed = 3
}
export declare enum ValueKeyType {
    Property = 0,
    ValueProperty = 1,
    MapKey = 2,
    CollectionAny = 3
}
export declare type ChangeValue<TValue> = (key: any, oldItem: TValue, newItem: TValue, changeType: ValueChangeType, keyType: ValueKeyType) => IUnsubscribeOrVoid;
export interface IValueSubscriber<TValue> {
    change(key: any, oldValue: TValue, newValue: TValue, parent: any, changeType: ValueChangeType, keyType: ValueKeyType, propertiesPath: () => string, ruleDescription: string): IUnsubscribeOrVoid;
}
