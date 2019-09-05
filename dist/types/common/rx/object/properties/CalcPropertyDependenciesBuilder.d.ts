import { RuleBuilder } from '../../deep-subscribe/RuleBuilder';
import { CalcProperty } from './CalcProperty';
import { ValueKeys } from './contracts';
import { DependenciesBuilder } from './DependenciesBuilder';
export declare class CalcPropertyDependenciesBuilder<TTarget extends CalcProperty<any, TSource, any>, TSource, TValueKeys extends string | number = ValueKeys> extends DependenciesBuilder<TTarget, TSource, TValueKeys> {
    constructor(buildSourceRule?: (builder: RuleBuilder<any, TValueKeys>) => RuleBuilder<TSource, TValueKeys>);
    invalidateOn<TValue>(buildRule: (inputRuleBuilder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>, predicate?: (value: any, parent: any) => boolean): this;
    clearOn<TValue>(buildRule: (inputRuleBuilder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>, predicate?: (value: any, parent: any) => boolean): this;
}
