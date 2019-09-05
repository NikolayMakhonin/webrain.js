import { AsyncValueOf, ThenableOrIterator } from '../../async/async';
import { Diff, TPrimitive } from '../../helpers/typescript';
import { VALUE_PROPERTY_DEFAULT } from '../../helpers/value-property';
import { ANY, COLLECTION_PREFIX } from './contracts/constants';
import { IRuleSubscribe } from './contracts/rule-subscribe';
import { IRule } from './contracts/rules';
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
export declare class RuleBuilder<TObject = any, TValueKeys extends string | number = never> {
    result: IRule;
    private _ruleLast;
    constructor(rule?: IRule);
    rule<TValue>(rule: IRule): RuleBuilder<TValue, TValueKeys>;
    ruleSubscribe<TValue>(ruleSubscribe: IRuleSubscribe<TObject, TValue>, description: string): RuleBuilder<TValue, TValueKeys>;
    nothing(): RuleBuilder<TObject, TValueKeys>;
    /**
     * Object property, Array index
     */
    valuePropertyName<TValue = PropertyValueOf<TObject>>(propertyName: string): RuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    valuePropertyNames<TValue = PropertyValueOf<TObject>>(...propertiesNames: string[]): RuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    propertyName<TKeys extends keyof TObject, TValue = ObjectValueOf<TObject, TKeys>>(propertyName: TKeys): RuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    propertyNames<TKeys extends keyof TObject | ANY, TValue = ObjectValueOf<TObject, TKeys extends ANY ? any : TKeys>>(...propertiesNames: TKeys[]): RuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    propertyAll<TValue = ObjectAnyValueOf<TObject>>(): RuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    propertyPredicate<TValue = ObjectAnyValueOf<TObject>>(predicate: (propertyName: string, object: any) => boolean, description: string): RuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    propertyRegexp<TValue = ObjectAnyValueOf<TObject>>(regexp: RegExp): RuleBuilder<TValue, TValueKeys>;
    /**
     * IListChanged & Iterable, ISetChanged & Iterable, IMapChanged & Iterable, Iterable
     */
    collection<TValue = IterableValueOf<TObject>>(): RuleBuilder<TValue, TValueKeys>;
    /**
     * IMapChanged & Map, Map
     */
    mapKey<TKey, TValue = MapValueOf<TObject>>(key: TKey): RuleBuilder<TValue, TValueKeys>;
    /**
     * IMapChanged & Map, Map
     */
    mapKeys<TKey, TValue = MapValueOf<TObject>>(...keys: TKey[]): RuleBuilder<TValue, TValueKeys>;
    /**
     * IMapChanged & Map, Map
     */
    mapAll<TValue = MapValueOf<TObject>>(): RuleBuilder<TValue, TValueKeys>;
    /**
     * IMapChanged & Map, Map
     */
    mapPredicate<TKey, TValue = MapValueOf<TObject>>(keyPredicate: (key: TKey, object: any) => boolean, description: string): RuleBuilder<TValue, TValueKeys>;
    /**
     * IMapChanged & Map, Map
     */
    mapRegexp<TValue = MapValueOf<TObject>>(keyRegexp: RegExp): RuleBuilder<TValue, TValueKeys>;
    /**
     * @deprecated because babel transform object.map property to unparseable code
     */
    path<TValue>(getValueFunc: RuleGetValueFunc<TObject, TValue, TValueKeys>): RuleBuilder<TRulePathObjectValueOf<TValue>, TValueKeys>;
    any<TValue>(...getChilds: Array<(builder: RuleBuilder<TObject, TValueKeys>) => RuleBuilder<TValue, TValueKeys>>): RuleBuilder<TValue, TValueKeys>;
    repeat<TValue>(countMin: number, countMax: number, getChild: (builder: RuleBuilder<TObject, TValueKeys>) => RuleBuilder<TValue, TValueKeys>): RuleBuilder<TValue, TValueKeys>;
    clone(): RuleBuilder<TObject, TValueKeys>;
}
export declare function cloneRule(rule: IRule): IRule;
