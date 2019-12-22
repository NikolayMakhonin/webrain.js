import { ANY } from './contracts/constants';
import { IRuleBuilder, IRuleFactory, IterableValueOf, MapValueOf, ObjectAnyValueOf, ObjectValueOf, PropertyValueOf } from './contracts/IRuleBuilder';
import { IRuleSubscribe } from './contracts/rule-subscribe';
import { IRepeatCondition, IRule } from './contracts/rules';
export declare class RuleBuilder<TObject = any, TValueKeys extends string | number = never> implements IRuleBuilder<TObject, TValueKeys> {
    ruleFirst: IRule;
    ruleLast: IRule;
    valuePropertyDefaultName: string;
    autoInsertValuePropertyDefault: boolean;
    constructor({ rule, valuePropertyDefaultName, autoInsertValuePropertyDefault, }?: {
        rule?: IRule;
        valuePropertyDefaultName?: string;
        autoInsertValuePropertyDefault?: boolean;
    });
    noAutoRules(): this;
    result(): IRule;
    valuePropertyDefault<TValue>(): RuleBuilder<TValue, TValueKeys>;
    rule<TValue>(rule: IRule): RuleBuilder<TValue, TValueKeys>;
    ruleSubscribe<TValue>(ruleSubscribe: IRuleSubscribe<TObject, TValue>): RuleBuilder<TValue, TValueKeys>;
    nothing(): RuleBuilder<TObject, TValueKeys>;
    never(): RuleBuilder<any, TValueKeys>;
    /**
     * Object property, Array index
     */
    valuePropertyName<TValue = PropertyValueOf<TObject>>(propertyName: string): RuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    valuePropertyNames<TValue = PropertyValueOf<TObject>>(...propertiesNames: string[]): RuleBuilder<TValue, TValueKeys>;
    /**
     * valuePropertyNames - Object property, Array index
     */
    v<TValue = PropertyValueOf<TObject>>(...propertiesNames: string[]): RuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    propertyName<TKeys extends keyof TObject, TValue = ObjectValueOf<TObject, TKeys>>(propertyName: TKeys): RuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    propertyNames<TKeys extends (keyof TObject) | ANY, TValue = ObjectValueOf<TObject, TKeys extends ANY ? any : TKeys>>(...propertiesNames: TKeys[]): RuleBuilder<TValue, TValueKeys>;
    /**
     * propertyNames
     * @param propertiesNames
     */
    p<TKeys extends (keyof TObject) | ANY, TValue = ObjectValueOf<TObject, TKeys extends ANY ? any : TKeys>>(...propertiesNames: TKeys[]): RuleBuilder<TValue, TValueKeys>;
    /**
     * Object property, Array index
     */
    propertyAny<TValue = ObjectAnyValueOf<TObject>>(): RuleBuilder<TValue, TValueKeys>;
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
    mapAny<TValue = MapValueOf<TObject>>(): RuleBuilder<TValue, TValueKeys>;
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
    path<TValue>(getValueFunc: (o: TObject) => TValue): RuleBuilder<any, TValueKeys>;
    if<TValue>(...exclusiveConditionRules: Array<[(value: TValue) => boolean, IRuleFactory<TObject, TValue, TValueKeys>] | IRuleFactory<TObject, TValue, TValueKeys>>): RuleBuilder<TValue, TValueKeys>;
    any<TValue>(...getChilds: Array<IRuleFactory<TObject, TValue, TValueKeys>>): RuleBuilder<TValue, TValueKeys>;
    repeat<TValue>(countMin: number, countMax: number, condition: IRepeatCondition<TValue>, getChild: IRuleFactory<TObject, TValue, TValueKeys>): RuleBuilder<TValue, TValueKeys>;
    clone(optionsOnly?: boolean): RuleBuilder<TObject, TValueKeys>;
}
