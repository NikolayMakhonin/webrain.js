import { IUnsubscribe, IUnsubscribeOrVoid } from '../../../../subjects/observable';
import { IChangeItem, IRuleSubscribe, ISubscribeObject } from './contracts/rule-subscribe';
import { Rule } from './rules';
export declare function subscribeObjectValue<TObject extends object, TValue>(propertyNames: string[], object: TObject, changeItem: IChangeItem<TObject, TValue>): void;
export declare function hasDefaultProperty(object: object): boolean;
export declare function subscribeObject<TObject extends object, TValue>(propertyNames: string | string[], propertyPredicate: (propertyName: any, object: any) => boolean, object: TObject, changeItem: IChangeItem<TObject, TValue>): IUnsubscribeOrVoid;
export declare function subscribeMap<TObject extends Map<K, V>, K, V>(keys: K[], keyPredicate: (key: any, object: any) => boolean, object: TObject, changeItem: IChangeItem<TObject, V>): void;
export declare function subscribeCollection<TObject extends Iterable<TValue>, TValue>(object: TObject, changeItem: IChangeItem<TObject, TValue>): void;
export declare function subscribeChange<TObject extends Iterable<TValue>, TValue>(object: TObject): IUnsubscribeOrVoid;
export declare enum SubscribeObjectType {
    Property = 0,
    ValueProperty = 1
}
export declare class RuleSubscribe<TObject = any, TChild = any> extends Rule implements IRuleSubscribe<TObject, TChild> {
    readonly subscribe: ISubscribeObject<TObject, TChild>;
    readonly unsubscribers: IUnsubscribe[];
    readonly unsubscribersCount: number[];
    constructor(subscribe: ISubscribeObject<TObject, TChild>, subType: SubscribeObjectType, description: string);
    clone(): IRuleSubscribe<TObject, TChild>;
}
export declare function createSubscribeObject<TObject extends object, TValue>(subType: SubscribeObjectType, propertyPredicate: (propertyName: string, object: any) => boolean, ...propertyNames: string[]): ISubscribeObject<TObject, TValue>;
export declare function createSubscribeMap<TObject extends Map<K, V>, K, V>(keyPredicate: (key: K, object: any) => boolean, ...keys: K[]): (object: any, changeItem: any) => void;
