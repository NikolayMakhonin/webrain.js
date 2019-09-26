import { AsyncValueOf, ThenableOrIterator } from '../../../async/async';
import { Diff, TPrimitive } from '../../../helpers/typescript';
import { VALUE_PROPERTY_DEFAULT } from '../../../helpers/value-property';
import { ANY, COLLECTION_PREFIX } from './constants';
import { IRuleSubscribe } from './rule-subscribe';
import { IRepeatCondition, IRule } from './rules';
export declare type IRuleFactory<TObject, TValue, TValueKeys extends string | number> = (builder: IRuleBuilder<TObject, TValueKeys>) => IRuleBuilder<TValue, TValueKeys>;
export declare type MapValueOf<TMap> = TMap extends Map<any, infer TValue> ? AsyncValueOf<TValue> : never;
export declare type IterableValueOf<TIterable> = TIterable extends Iterable<infer TValue> ? AsyncValueOf<TValue> : never;
export declare type ObjectAnyValueOf<TObject> = TObject extends {
    [key in keyof TObject]: infer TValue;
} ? AsyncValueOf<TValue> : never;
export declare type ObjectValueOf<TObject, TKeys extends keyof TObject> = TObject extends {
    [key in TKeys]: infer TValue;
} ? AsyncValueOf<TValue> : never;
export declare type PropertyValueOf<TObject> = TObject extends {
    [VALUE_PROPERTY_DEFAULT]: infer TValue;
} ? AsyncValueOf<TValue> : TObject;
export declare type RULE_PATH_OBJECT_VALUE = '46007c49df234a768d312f74c892f0b1';
export declare type TRulePathSubObject<TObject, TValueKeys extends string | number> = TObject & {
    [key in TValueKeys]: TRulePathObject<TObject, TValueKeys>;
} & (TObject extends TPrimitive ? {} : {
    [key in Diff<keyof TObject, TValueKeys>]: TRulePathObject<TObject[key] extends ThenableOrIterator<infer V> ? V : TObject[key], TValueKeys>;
} & {
    [key in ANY]: TRulePathObject<AsyncValueOf<TObject[any]>, TValueKeys>;
}) & (TObject extends Iterable<infer TItem> ? {
    [key in COLLECTION_PREFIX]: TRulePathObject<AsyncValueOf<TItem>, TValueKeys>;
} : {}) & (TObject extends Map<string | number, infer TItem> ? {
    [key in Diff<any, TObject>]: TRulePathObject<AsyncValueOf<TItem>, TValueKeys>;
} : {});
export declare type TRulePathObject<TObject, TValueKeys extends string | number> = (TObject extends {
    [VALUE_PROPERTY_DEFAULT]: infer TValue;
} ? TRulePathSubObject<AsyncValueOf<TValue>, TValueKeys> : TRulePathSubObject<TObject, TValueKeys>) & {
    [key in RULE_PATH_OBJECT_VALUE]: TObject;
};
export declare type TRulePathObjectValueOf<TObject extends TRulePathObject<any, any>> = TObject extends {
    [key in RULE_PATH_OBJECT_VALUE]: any;
} ? TObject[RULE_PATH_OBJECT_VALUE] : never;
export declare type RuleGetValueFunc<TObject, TValue, TValueKeys extends string | number> = (o: TRulePathObject<TObject, TValueKeys>) => TValue;
export interface IRuleBuilder<TObject = any, TValueKeys extends string | number = never> {
    ruleFirst: IRule;
    ruleLast: IRule;
    result(): IRule;
    valuePropertyDefault<TValue>(): IRuleBuilder<TValue, TValueKeys>;
    rule<TValue>(rule: IRule): IRuleBuilder<TValue, TValueKeys>;
    ruleSubscribe<TValue>(ruleSubscribe: IRuleSubscribe<TObject, TValue>, description?: string): IRuleBuilder<TValue, TValueKeys>;
    nothing(): IRuleBuilder<TObject, TValueKeys>;
    never(): IRuleBuilder<any, TValueKeys>;
    /**
     * Object property, Array index
     */
    valuePropertyName<TValue = PropertyValueOf<TObject>>(propertyName: string): IRuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    valuePropertyNames<TValue = PropertyValueOf<TObject>>(...propertiesNames: string[]): IRuleBuilder<TValue, TValueKeys>;
    /**
     * valuePropertyNames - Object property, Array index
     */
    v<TValue = PropertyValueOf<TObject>>(...propertiesNames: string[]): IRuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    propertyName<TKeys extends keyof TObject, TValue = ObjectValueOf<TObject, TKeys>>(propertyName: TKeys): IRuleBuilder<TValue, TValueKeys>;
    propertyName<TValue>(propertyName: string): IRuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    propertyNames<TKeys extends keyof TObject | ANY, TValue = ObjectValueOf<TObject, TKeys extends ANY ? any : TKeys>>(...propertiesNames: TKeys[]): IRuleBuilder<TValue, TValueKeys>;
    propertyNames<TValue>(...propertiesNames: string[]): IRuleBuilder<TValue, TValueKeys>;
    /**
     * propertyNames
     * @param propertiesNames
     */
    p<TKeys extends keyof TObject | ANY, TValue = ObjectValueOf<TObject, TKeys extends ANY ? any : TKeys>>(...propertiesNames: TKeys[]): IRuleBuilder<TValue, TValueKeys>;
    p<TValue>(...propertiesNames: string[]): IRuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    propertyAny<TValue = ObjectAnyValueOf<TObject>>(): IRuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    propertyPredicate<TValue = ObjectAnyValueOf<TObject>>(predicate: (propertyName: string, object: any) => boolean, description: string): IRuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    propertyRegexp<TValue = ObjectAnyValueOf<TObject>>(regexp: RegExp): IRuleBuilder<TValue, TValueKeys>;
    /**
     * IListChanged & Iterable, ISetChanged & Iterable, IMapChanged & Iterable, Iterable
     */
    collection<TValue = IterableValueOf<TObject>>(): IRuleBuilder<TValue, TValueKeys>;
    /**
     * IMapChanged & Map, Map
     */
    mapKey<TKey, TValue = MapValueOf<TObject>>(key: TKey): IRuleBuilder<TValue, TValueKeys>;
    /**
     * IMapChanged & Map, Map
     */
    mapKeys<TKey, TValue = MapValueOf<TObject>>(...keys: TKey[]): IRuleBuilder<TValue, TValueKeys>;
    /**
     * IMapChanged & Map, Map
     */
    mapAny<TValue = MapValueOf<TObject>>(): IRuleBuilder<TValue, TValueKeys>;
    /**
     * IMapChanged & Map, Map
     */
    mapPredicate<TKey, TValue = MapValueOf<TObject>>(keyPredicate: (key: TKey, object: any) => boolean, description: string): IRuleBuilder<TValue, TValueKeys>;
    /**
     * IMapChanged & Map, Map
     */
    mapRegexp<TValue = MapValueOf<TObject>>(keyRegexp: RegExp): IRuleBuilder<TValue, TValueKeys>;
    /**
     * @deprecated because babel transform object.map property to unparseable code
     */
    path<TValue>(getValueFunc: (o: TObject) => TValue): IRuleBuilder<any, TValueKeys>;
    if<TValue>(...exclusiveConditionRules: Array<[(value: TValue) => boolean, IRuleFactory<TObject, TValue, TValueKeys>] | IRuleFactory<TObject, TValue, TValueKeys>>): IRuleBuilder<TValue, TValueKeys>;
    any<TValue>(...getChilds: Array<IRuleFactory<TObject, TValue, TValueKeys>>): IRuleBuilder<TValue, TValueKeys>;
    repeat<TValue>(countMin: number, countMax: number, condition: IRepeatCondition<TValue>, getChild: IRuleFactory<TObject, TValue, TValueKeys>): IRuleBuilder<TValue, TValueKeys>;
    clone(optionsOnly?: boolean): IRuleBuilder<TObject, TValueKeys>;
}
