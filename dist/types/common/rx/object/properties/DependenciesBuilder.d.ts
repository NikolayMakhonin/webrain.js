import { IRule } from '../../deep-subscribe/contracts/rules';
import { RuleBuilder } from '../../deep-subscribe/RuleBuilder';
import { IUnsubscribe } from '../../subjects/observable';
import { ValueKeys } from './contracts';
export declare type IDependencyAction<TTarget, TValue = any> = (target: TTarget, value: TValue, parent: any, propertyName: string) => void;
export declare type IDependency<TTarget, TValue = any> = [IRule, IDependencyAction<TTarget, TValue>];
export declare class DependenciesBuilder<TTarget, TSource, TValueKeys extends string | number = ValueKeys> {
    dependencies: Array<IDependency<TTarget>>;
    buildSourceRule: (builder: RuleBuilder<any, TValueKeys>) => RuleBuilder<TSource, TValueKeys>;
    constructor(buildSourceRule?: (builder: RuleBuilder<any, TValueKeys>) => RuleBuilder<TSource, TValueKeys>);
    actionOn<TValue>(buildRule: (inputRuleBuilder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>, action: IDependencyAction<TTarget, TValue>, predicate?: (value: any, parent: any) => boolean): this;
}
export declare function subscribeDependencies<TSubscribeObject, TActionTarget>(subscribeObject: TSubscribeObject, actionTarget: TActionTarget, dependencies: Array<IDependency<TActionTarget>>): IUnsubscribe;
