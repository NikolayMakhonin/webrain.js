import {isIterable} from '../../helpers/helpers'
import {IUnsubscribe, IUnsubscribeOrVoid} from '../subjects/observable'
import {IRuleSubscribe} from './contracts/rule-subscribe'
import {IRule, IRuleAction, IRuleAny, IRuleIf, IRuleRepeat, RuleRepeatAction, RuleType} from './contracts/rules'
import {RuleNever} from './rules'

export type INextRuleIterable = (object: any) => IRuleIterable
export type IRuleOrIterable = IRuleAction | IRuleIterable | INextRuleIterable
export interface IRuleIterable extends Iterable<IRuleOrIterable> {}
export type IRuleIterator = Iterator<IRuleOrIterable>

export function *iterateRule(object: any, rule: IRule, next: INextRuleIterable = null): IRuleIterable {
	if (!rule) {
		if (next) {
			yield* next(object)
		}
		return
	}

	const ruleNext: INextRuleIterable = rule.next || next
		? (nextObject: any) => iterateRule(nextObject, rule.next, next)
		: null

	switch (rule.type) {
		case RuleType.Nothing:
			if (ruleNext) {
				yield* ruleNext(object)
			}
			break
		case RuleType.Never:
			yield rule
			break
		case RuleType.Action:
			yield rule
			yield ruleNext
			break
		case RuleType.If: {
			const {conditionRules} = (rule as IRuleIf)
			const len = conditionRules.length
			let i = 0
			for (; i < len; i++) {
				const conditionRule = conditionRules[i]
				if (Array.isArray(conditionRule)) {
					if (conditionRule[0](object)) {
						yield* iterateRule(object, conditionRule[1], ruleNext)
						break
					}
				} else {
					yield* iterateRule(object, conditionRule, ruleNext)
					break
				}
			}

			if (i === len && ruleNext) {
				yield* ruleNext(object)
			}
			break
		}
		case RuleType.Any:
			const {rules} = (rule as IRuleAny)
			if (!rules.length) {
				yield RuleNever.instance
				break
				// throw new Error(`RuleType.Any rules.length=${rules.length}`)
			}
			if (rules.length === 1) {
				yield [iterateRule(object, rules[0], ruleNext)]
			}

			const any = function *() {
				for (let i = 0, len = rules.length; i < len; i++) {
					const subRule = rules[i]
					if (!subRule) {
						throw new Error(`RuleType.Any rule=${subRule}`)
					}
					yield iterateRule(object, subRule, ruleNext)
				}
			}
			yield any()
			break
		case RuleType.Repeat: {
			const {countMin, countMax, condition, rule: subRule} = rule as IRuleRepeat

			// if (countMin === 0 && countMin === countMax) {
			// 	// == RuleType.Nothing
			// 	if (ruleNext) {
			// 		yield* ruleNext(object)
			// 	}
			// 	break
			// }

			if (countMax < countMin || countMax < 0) {
				// == RuleType.Never
				yield RuleNever.instance
				break
			}

			const repeatNext = function*(nextObject: any, index: number): IRuleIterable {
				let repeatAction = condition ? condition(nextObject, index) : RuleRepeatAction.All
				if (index < countMin) {
					repeatAction = repeatAction & ~RuleRepeatAction.Fork
				}
				if (index >= countMax) {
					repeatAction = repeatAction & ~RuleRepeatAction.Next
				}

				if ((repeatAction & RuleRepeatAction.Fork) === 0) {
					if ((repeatAction & RuleRepeatAction.Next) === 0) {
						yield RuleNever.instance
						return
					}
					yield* nextIteration(index + 1)
					return
				}

				if ((repeatAction & RuleRepeatAction.Next) === 0) {
					if (ruleNext) {
						yield* ruleNext(nextObject)
					}
					return
				}

				yield [ruleNext ? ruleNext(nextObject) : [], nextIteration(index + 1)]

				function nextIteration(newCount: number): IRuleIterable {
					return iterateRule(nextObject, subRule, nextIterationObject =>
						repeatNext(nextIterationObject, newCount))
				}
			}

			yield* repeatNext(object, 0)
			break
		}
		default:
			throw new Error('Unknown RuleType: ' + rule.type)
	}
}

export function subscribeNextRule(
	ruleIterator: IRuleIterator,
	iteration: IteratorResult<IRuleOrIterable, null>,
	fork: (ruleIterator: IRuleIterator) => IUnsubscribeOrVoid,
	subscribeNode: (rule: IRuleSubscribe, getRuleIterable: INextRuleIterable) => IUnsubscribeOrVoid,
): IUnsubscribeOrVoid {
	const ruleOrIterable = iteration.value

	if (isIterable(ruleOrIterable)) {
		let unsubscribers: IUnsubscribe[]

		// for (let step, innerIterator = ruleOrIterable[Symbol.iterator](); !(step = innerIterator.next()).done;) {
		// 	const ruleIterable = step.value
		// 	const unsubscribe = fork(ruleIterable[Symbol.iterator]())
		// 	if (unsubscribe != null) {
		// 		if (!unsubscribers) {
		// 			unsubscribers = [unsubscribe]
		// 		} else {
		// 			unsubscribers.push(unsubscribe)
		// 		}
		// 	}
		// }

		for (const ruleIterable of ruleOrIterable as Iterable<IRuleOrIterable>) {
			const unsubscribe = fork(ruleIterable[Symbol.iterator]())
			if (unsubscribe) {
				if (!unsubscribers) {
					unsubscribers = [unsubscribe]
				} else {
					unsubscribers.push(unsubscribe)
				}
			}
		}

		if (!unsubscribers) {
			return null
		}

		return () => {
			for (let i = 0, len = unsubscribers.length; i < len; i++) {
				unsubscribers[i]()
			}
		}
	}

	const nextIterable = ruleIterator.next().value as INextRuleIterable

	return subscribeNode(
		ruleOrIterable as IRuleSubscribe,
		nextIterable,
			// ? () => nextIterable(object)[Symbol.iterator]()
			// : null,
	)
}
