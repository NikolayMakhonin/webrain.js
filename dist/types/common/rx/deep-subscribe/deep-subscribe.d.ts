import { IUnsubscribe } from '../subjects/observable';
import { IRule } from './contracts/rules';
import { RuleBuilder } from "./RuleBuilder";
import { ISubscribeValue } from "./contracts/common";
export declare function deepSubscribeRule<TValue>(object: any, subscribeValue: ISubscribeValue<TValue>, immediate: boolean, rule: IRule): IUnsubscribe;
export declare function deepSubscribe<TObject, TValue, TValueKeys extends string | number = never>(object: TObject, subscribeValue: ISubscribeValue<TValue>, immediate: boolean, ruleBuilder: (ruleBuilder: RuleBuilder<TObject, TValueKeys>) => RuleBuilder<TValue, TValueKeys>): IUnsubscribe;
