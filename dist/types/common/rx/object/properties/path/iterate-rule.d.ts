import { IUnsubscribeOrVoid } from '../../../subjects/observable';
import { IRuleSubscribe } from './builder/contracts/rule-subscribe';
import { IRule, IRuleAction } from './builder/contracts/rules';
export declare type INextRuleIterable = (object: any) => IRuleIterable;
export declare type IRuleOrIterable = IRuleAction | IRuleIterable | INextRuleIterable;
export interface IRuleIterable extends Iterable<IRuleOrIterable> {
}
export declare type IRuleIterator = Iterator<IRuleOrIterable>;
export declare function compressForks(ruleOrForkIterable: IRuleIterable, iterator?: IRuleIterator, iteration?: IteratorResult<IRuleOrIterable, null>): IRuleIterable;
export declare function iterateRule(object: any, rule: IRule, next?: INextRuleIterable): IRuleIterable;
export declare function subscribeNextRule(ruleIterator: IRuleIterator, iteration: IteratorResult<IRuleOrIterable, null>, fork: (ruleIterator: IRuleIterator) => IUnsubscribeOrVoid, subscribeNode: (rule: IRuleSubscribe, getRuleIterable: INextRuleIterable) => IUnsubscribeOrVoid): IUnsubscribeOrVoid;
