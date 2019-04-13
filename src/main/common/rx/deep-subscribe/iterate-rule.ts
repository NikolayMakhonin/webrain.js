import {IUnsubscribe} from '../subjects/subject'
import {IRuleSubscribe} from './contracts/rule-subscribe'
import {IRule, IRuleAction, IRuleAny, IRuleRepeat, RuleType} from './contracts/rules'

export type IRuleOrIterable = IRuleAction | IRuleIterable
export interface IRuleIterable extends Iterable<IRuleOrIterable> {

}

export function *iterateRule(rule: IRule, next: () => IRuleIterable = null): IRuleIterable {
	if (!rule) {
		if (next) {
			yield* next()
		}
		return
	}

	const ruleNext = () => iterateRule(rule.next, next)

	switch (rule.type) {
		case RuleType.Action:
			yield rule
			yield* ruleNext()
			break
		case RuleType.Any:
			const {rules} = (rule as IRuleAny)
			function *any() {
				for (let i = 0, len = rules.length; i < len; i++) {
					yield iterateRule(rules[i], ruleNext)
				}
			}
			yield any()
			break
		case RuleType.Repeat:
			const {countMin, countMax, rule: subRule} = rule as IRuleRepeat
			function *repeatNext(count) {
				if (count >= countMax) {
					yield* ruleNext()
					return
				}

				const nextIteration = newCount => {
					return iterateRule(subRule, () => repeatNext(newCount))
				}

				if (count < countMin) {
					yield* nextIteration(count + 1)
				} else {
					yield [ruleNext(), nextIteration(count + 1)]
				}
			}

			yield* repeatNext(0)
			break
		default:
			throw new Error('Unknown RuleType: ' + rule.type)
	}
}

export function subscribeNextRule(
	ruleIterator: Iterator<IRuleOrIterable>,
	fork: (ruleIterator: Iterator<IRuleOrIterable>) => IUnsubscribe,
	subscribeNode: (rule: IRuleSubscribe) => IUnsubscribe,
	subscribeLeaf: () => IUnsubscribe,
) {
	const iteration = ruleIterator.next()
	if (iteration.done) {
		return subscribeLeaf()
	}

	const ruleOrIterable = iteration.value

	if (ruleOrIterable[Symbol.iterator]) {
		let unsubscribers: IUnsubscribe[]
		for (const ruleIterable of ruleOrIterable as Iterable<IRuleOrIterable>) {
			const unsubscribe = fork(ruleIterable[Symbol.iterator]())
			if (unsubscribe != null) {
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

	return subscribeNode(ruleOrIterable as IRuleSubscribe)
}
