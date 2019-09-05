import { IPropertyChanged } from '../object/IPropertyChanged';
import { IUnsubscribe } from '../subjects/observable';
import { IRuleSubscribe, ISubscribeObject } from './contracts/rule-subscribe';
import { Rule } from './rules';
export declare function hasDefaultProperty(object: object): boolean;
export declare function subscribeDefaultProperty<TValue>(object: IPropertyChanged, immediateSubscribe: boolean, subscribeItem: (item: TValue, debugPropertyName: string) => IUnsubscribe): IUnsubscribe;
export declare enum SubscribeObjectType {
    Property = 0,
    ValueProperty = 1
}
export declare abstract class RuleSubscribe<TObject = any, TChild = any> extends Rule implements IRuleSubscribe<TObject, TChild> {
    subscribe: ISubscribeObject<TObject, TChild>;
    readonly unsubscribers: IUnsubscribe[];
    protected constructor();
    clone(): IRuleSubscribe<TObject, TChild>;
}
export declare class RuleSubscribeObject<TObject, TValue> extends RuleSubscribe<TObject, TValue> implements IRuleSubscribe<TObject, TValue> {
    constructor(type: SubscribeObjectType, propertyPredicate?: (propertyName: string, object: any) => boolean, ...propertyNames: string[]);
}
export declare class RuleSubscribeMap<TObject extends Map<K, V>, K, V> extends RuleSubscribe<TObject, V> implements IRuleSubscribe<TObject, V> {
    constructor(keyPredicate?: (key: K, object: any) => boolean, ...keys: K[]);
}
export declare class RuleSubscribeCollection<TObject extends Iterable<TItem>, TItem> extends RuleSubscribe<TObject, TItem> implements IRuleSubscribe<TObject, TItem> {
    constructor();
}
