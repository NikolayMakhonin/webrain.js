import { IUnsubscribeOrVoid } from '../../subjects/observable';
import { IRule } from './rules';
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
    CollectionAny = 3,
    ChangeCount = 4
}
export declare type IChangeValue<TValue> = (key: any, oldValue: TValue, newValue: TValue, parent: any, changeType: ValueChangeType, keyType: ValueKeyType, propertiesPath: IPropertiesPath, rule: IRule, isUnsubscribed?: boolean) => IUnsubscribeOrVoid;
export interface IPropertiesPath {
    value: any;
    parent: IPropertiesPath;
    key: any;
    keyType: ValueKeyType;
    rule: IRule;
    readonly id: string;
    toString(): string;
}
export interface IValueSubscriber<TValue> {
    debugTarget: any;
    change(key: any, oldValue: TValue, newValue: TValue, parent: any, changeType: ValueChangeType, keyType: ValueKeyType, propertiesPath: IPropertiesPath, rule: IRule): IUnsubscribeOrVoid;
}
