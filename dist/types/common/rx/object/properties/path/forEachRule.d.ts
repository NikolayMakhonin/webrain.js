import { ValueKeyType } from './builder/contracts/common';
import { IChangeItem, IRuleSubscribe } from './builder/contracts/rule-subscribe';
import { IRuleAction } from './builder/contracts/rules';
import { IRule } from './builder/contracts/rules';
export declare type INextRuleIterable = (object: any) => IRuleIterable;
export declare type IRuleOrIterable = IRuleAction | IRuleIterable | INextRuleIterable;
export interface IRuleIterable extends Iterable<IRuleOrIterable> {
}
declare type IResolveRuleSubscribe<TObject, TValue> = (rule: IRuleSubscribe, object: TObject, next: IChangeItem<TObject, TValue>, parent: any, key: any, keyType: ValueKeyType) => any;
export declare function forEachRule<TObject, TValue>(rule: IRule, object: TObject, next: IChangeItem<TObject, TValue>, parent: any, key: any, keyType: ValueKeyType, resolveRuleSubscribe: IResolveRuleSubscribe<TObject, TValue>): void;
export {};
