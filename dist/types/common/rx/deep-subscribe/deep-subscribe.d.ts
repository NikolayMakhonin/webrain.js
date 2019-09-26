import { IUnsubscribeOrVoid } from '../subjects/observable';
import { ILastValue, ISubscribeValue, IUnsubscribeValue } from './contracts/common';
import { IRule } from './contracts/rules';
import { RuleBuilder } from './RuleBuilder';
export declare function deepSubscribeRule<TValue>({ object, subscribeValue, unsubscribeValue, lastValue, immediate, rule, }: {
    object: any;
    subscribeValue?: ISubscribeValue<TValue>;
    unsubscribeValue?: IUnsubscribeValue<TValue>;
    lastValue?: ILastValue<TValue>;
    /** @deprecated Not implemented - always true */
    immediate?: boolean;
    rule: IRule;
}): IUnsubscribeOrVoid;
export declare function deepSubscribe<TObject, TValue, TValueKeys extends string | number = never>({ object, subscribeValue, unsubscribeValue, lastValue, immediate, ruleBuilder, }: {
    object: TObject;
    subscribeValue?: ISubscribeValue<TValue>;
    unsubscribeValue?: IUnsubscribeValue<TValue>;
    lastValue?: ILastValue<TValue>;
    /** @deprecated Not implemented - always true */
    immediate?: boolean;
    ruleBuilder: (ruleBuilder: RuleBuilder<TObject, TValueKeys>) => RuleBuilder<TValue, TValueKeys>;
}): IUnsubscribeOrVoid;
