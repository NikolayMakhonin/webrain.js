import { RuleBuilder } from '../../deep-subscribe/RuleBuilder';
import { CalcProperty } from './CalcProperty';
import { ValueKeys } from './contracts';
import { DependenciesBuilder, IDependencyPredicate } from './DependenciesBuilder';
export declare class CalcPropertyDependenciesBuilder<TTarget extends CalcProperty<any, TSource>, TSource, TValueKeys extends string | number = ValueKeys> extends DependenciesBuilder<TTarget, TSource, TValueKeys> {
    constructor(buildSourceRule?: (builder: RuleBuilder<any, TValueKeys>) => RuleBuilder<TSource, TValueKeys>);
    invalidateOn<TValue>(buildRule: (inputRuleBuilder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>, predicate?: IDependencyPredicate<TValue>): this;
    clearOn<TValue>(buildRule: (inputRuleBuilder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>, predicate?: IDependencyPredicate<TValue>): this;
}
