import { IUnsubscribeOrVoid } from '../subjects/observable';
import { IChangeValue, ILastValue } from './contracts/common';
import { IRule } from './contracts/rules';
import { RuleBuilder } from './RuleBuilder';
export declare function deepSubscribeRule<TValue>({ object, changeValue, lastValue, debugTarget, immediate, rule, }: {
    object: any;
    changeValue?: IChangeValue<TValue>;
    lastValue?: ILastValue<TValue>;
    debugTarget?: any;
    /** @deprecated Not implemented - always true */
    immediate?: boolean;
    rule: IRule;
}): IUnsubscribeOrVoid;
export declare function deepSubscribe<TObject, TValue, TValueKeys extends string | number = never>({ object, changeValue, lastValue, debugTarget, immediate, ruleBuilder, }: {
    object: TObject;
    changeValue?: IChangeValue<TValue>;
    lastValue?: ILastValue<TValue>;
    debugTarget?: any;
    /** @deprecated Not implemented - always true */
    immediate?: boolean;
    ruleBuilder: (ruleBuilder: RuleBuilder<TObject, TValueKeys>) => RuleBuilder<TValue, TValueKeys>;
}): IUnsubscribeOrVoid;
