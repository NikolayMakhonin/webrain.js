import {ValueKeyType} from './builder/contracts/common'
import {IChangeItem, IRuleSubscribe} from './builder/contracts/rule-subscribe'
import {IRuleAction} from './builder/contracts/rules'
import {IRuleAny, IRuleIf, IRuleRepeat, RuleRepeatAction} from './builder/contracts/rules'
import {IRule, RuleType} from './builder/contracts/rules'

export type INextRuleIterable = (object: any) => IRuleIterable
export type IRuleOrIterable = IRuleAction | IRuleIterable | INextRuleIterable
export interface IRuleIterable extends Iterable<IRuleOrIterable> {}

const repeatNext = function<TObject, TValue>(
	object: TObject,
	index: number,
	repeatRule: IRuleRepeat,
	ruleNext,
	parent: any,
	key: any,
	keyType: ValueKeyType,
	resolveRuleSubscribe: IResolveRuleSubscribe<TObject, TValue>,
): void {
	let repeatAction = repeatRule.condition
		? repeatRule.condition(object, index)
		: RuleRepeatAction.All

	if (index < repeatRule.countMin) {
		repeatAction = repeatAction & ~RuleRepeatAction.Fork
	}
	if (index >= repeatRule.countMax) {
		repeatAction = repeatAction & ~RuleRepeatAction.Next
	}

	if ((repeatAction & RuleRepeatAction.Fork) === 0) {
		if ((repeatAction & RuleRepeatAction.Next) === 0) {
			return
		}
		forEachRule(
			repeatRule.rule,
			object,
			repeatRuleNext,
			parent,
			key,
			keyType,
			resolveRuleSubscribe,
		)
		return
	}

	if ((repeatAction & RuleRepeatAction.Next) === 0) {
		if (ruleNext) {
			ruleNext(object, key, keyType)
		}
		return
	}

	if (ruleNext) {
		ruleNext(object, key, keyType)
	}

	forEachRule<TObject, TValue>(
		repeatRule.rule,
		object,
		repeatRuleNext,
		parent,
		key,
		keyType,
		resolveRuleSubscribe,
	)

	function repeatRuleNext(nextIterationObject: TValue): void {
		repeatNext(
			nextIterationObject as any as TObject,
			index + 1,
			repeatRule,
			ruleNext,
			parent,
			key,
			keyType,
			resolveRuleSubscribe,
		)
	}
}

type IResolveRuleSubscribe<TObject, TValue>
	= (
		rule: IRuleSubscribe,
		object: TObject,
		next: IChangeItem<TObject, TValue>,
		parent: any,
		key: any,
		keyType: ValueKeyType,
	) => any

export function forEachRule<TObject, TValue>(
	rule: IRule,
	object: TObject,
	next: IChangeItem<TObject, TValue>,
	parent: any,
	key: any,
	keyType: ValueKeyType,
	resolveRuleSubscribe: IResolveRuleSubscribe<TObject, TValue>,
): void {
	while (true) {
		if (rule == null) {
			if (next != null) {
				next(object as any, parent, key, keyType)
			}
			return
		}

		const ruleNext = rule.next || next
			? (
				nextObject: any,
				nextParent: any,
				nextKey: any,
				nextKeyType: ValueKeyType,
			) => forEachRule(rule.next, nextObject, next, nextParent, nextKey, nextKeyType, resolveRuleSubscribe)
			: null

		switch (rule.type) {
			case RuleType.Nothing:
				rule = rule.next
				break
			case RuleType.Never:
				return
			case RuleType.Action:
				resolveRuleSubscribe(
					rule as IRuleSubscribe,
					object,
					ruleNext,
					parent,
					key,
					keyType,
				)
				return
			case RuleType.If: {
				const {conditionRules} = (rule as IRuleIf)
				const len = conditionRules.length
				let i = 0
				for (; i < len; i++) {
					const conditionRule = conditionRules[i]
					if (Array.isArray(conditionRule)) {
						if (conditionRule[0](object)) {
							forEachRule(conditionRule[1], object, ruleNext, parent, key, keyType, resolveRuleSubscribe)
							break
						}
					} else {
						forEachRule(conditionRule, object, ruleNext, parent, key, keyType, resolveRuleSubscribe)
						break
					}
				}

				if (i !== len || ruleNext == null) {
					return
				}

				rule = rule.next
				break
			}
			case RuleType.Any:
				const {rules} = (rule as IRuleAny)
				if (!rules.length) {
					return
				}
				if (rules.length === 1) {
					forEachRule(rules[0], object, ruleNext, parent, key, keyType, resolveRuleSubscribe)
				}

				for (let i = 0, len = rules.length; i < len; i++) {
					const subRule = rules[i]
					if (!subRule) {
						throw new Error(`RuleType.Any rule=${subRule}`)
					}
					forEachRule(subRule, object, ruleNext, parent, key, keyType, resolveRuleSubscribe)
				}

				return
			case RuleType.Repeat: {
				const {countMin, countMax} = rule as IRuleRepeat

				if (countMax < countMin || countMax < 0) {
					return
				}

				repeatNext(object, 0, rule as IRuleRepeat, ruleNext, parent, key, keyType, resolveRuleSubscribe)

				return
			}
			default:
				throw new Error('Unknown RuleType: ' + rule.type)
		}
	}
}
