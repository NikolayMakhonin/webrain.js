import {IUnsubscribe} from '../subjects/subject'
import {IRuleSubscribe} from './contracts/rule-subscribe'
import {IRule, IRuleAction, IRuleAny, IRuleRepeat, RuleType} from './contracts/rules'

type GetIterableFunction = () => Iterable<IRuleOrIterable>
export type IRuleOrIterable = IRuleAction | IRuleIterable | GetIterableFunction
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
			yield ruleNext
			break
		case RuleType.Any:
			const {rules} = (rule as IRuleAny)
			const any = function *() {
				for (let i = 0, len = rules.length; i < len; i++) {
					yield iterateRule(rules[i], ruleNext)
				}
			}
			yield any()
			break
		case RuleType.Repeat:
			const {countMin, countMax, rule: subRule} = rule as IRuleRepeat
			const repeatNext = function *(count) {
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
	subscribeNode: (rule: IRuleSubscribe, getRuleIterator: () => Iterator<IRuleOrIterable>) => IUnsubscribe,
	subscribeLeaf: () => IUnsubscribe,
) {
	const iteration = ruleIterator.next()
	if (iteration.done) {
		return subscribeLeaf()
	}

	const ruleOrIterable = iteration.value

	if (ruleOrIterable[Symbol.iterator]) {
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

	const nextIterable = ruleIterator.next().value as GetIterableFunction

	return subscribeNode(
		ruleOrIterable as IRuleSubscribe,
		() => nextIterable()[Symbol.iterator](),
	)
}
