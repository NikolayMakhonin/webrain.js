import { IUnsubscribeOrVoid } from '../../subjects/observable';
export declare type ILastValue<TValue> = (value: TValue, parent: any, key: any, keyType: ValueKeyType) => void;
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
export declare type IChangeValue<TValue> = (key: any, oldValue: TValue, newValue: TValue, parent: any, changeType: ValueChangeType, keyType: ValueKeyType, isUnsubscribed?: boolean) => IUnsubscribeOrVoid;
export interface IValueSubscriber<TValue> {
    change(key: any, oldValue: TValue, newValue: TValue, parent: any, changeType: ValueChangeType, keyType: ValueKeyType, propertiesPath: () => string, ruleDescription: string): IUnsubscribeOrVoid;
}
