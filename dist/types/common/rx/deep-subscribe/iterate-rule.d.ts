import { IUnsubscribe } from '../subjects/observable';
import { IRuleSubscribe } from './contracts/rule-subscribe';
import { IRule, IRuleAction } from './contracts/rules';
declare type GetIterableFunction = () => Iterable<IRuleOrIterable>;
export declare type IRuleOrIterable = IRuleAction | IRuleIterable | GetIterableFunction;
export interface IRuleIterable extends Iterable<IRuleOrIterable> {
}
export declare type IRuleIterator = Iterator<IRuleOrIterable>;
export declare function iterateRule(rule: IRule, next?: () => IRuleIterable): IRuleIterable;
export declare function subscribeNextRule(ruleIterator: IRuleIterator, iteration: IteratorResult<IRuleOrIterable>, fork: (ruleIterator: IRuleIterator) => IUnsubscribe, subscribeNode: (rule: IRuleSubscribe, getRuleIterator: () => IRuleIterator) => IUnsubscribe): IUnsubscribe;
export {};
