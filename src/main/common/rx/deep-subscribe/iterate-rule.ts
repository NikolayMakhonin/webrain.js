import {isIterable} from '../../helpers/helpers'
import {IUnsubscribe} from '../subjects/observable'
import {IRuleSubscribe} from './contracts/rule-subscribe'
import {IRule, IRuleAction, IRuleAny, IRuleRepeat, RuleType} from './contracts/rules'

type GetIterableFunction = (object: any) => IRuleIterable

export type IRuleOrIterable = IRuleAction | IRuleIterable | GetIterableFunction
export interface IRuleIterable extends Iterable<IRuleOrIterable> {}
export type IRuleIterator = Iterator<IRuleOrIterable>

type INextRule = (object: any) => IRuleIterable

export function *iterateRule(object: any, rule: IRule, next: INextRule = null): IRuleIterable {
	if (!rule) {
		if (next) {
			yield* next(object)
		}
		return
	}

	const ruleNext: INextRule = rule.next || next
		? (nextObject: any) => iterateRule(nextObject, rule.next, next)
		: null

	if (rule.condition && !rule.condition(object)) {
		if (ruleNext) {
			yield* ruleNext(object)
		}
		return
	}

	switch (rule.type) {
		case RuleType.Nothing:
			if (ruleNext) {
				yield* ruleNext(object)
			}
			break
		case RuleType.Action:
			yield rule
			yield ruleNext
			break
		case RuleType.Any:
			const {rules} = (rule as IRuleAny)
			if (rules.length <= 1) {
				throw new Error(`RuleType.Any rules.length=${rules.length}`)
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
			const {countMin, countMax, rule: subRule} = rule as IRuleRepeat
			if (countMax < countMin || countMax <= 0) {
				throw new Error(`RuleType.Repeat countMin=${countMin} countMax=${countMax} rule=${rule}`)
			}

			const repeatNext = function*(nextObject: any, count: number): IRuleIterable {
				if (count >= countMax) {
					if (ruleNext) {
						yield* ruleNext(nextObject)
					}
					return
				}

				const nextIteration = (newCount: number): IRuleIterable => {
					return iterateRule(nextObject, subRule, nextIterationObject => repeatNext(nextIterationObject, newCount))
				}

				if (count < countMin) {
					yield* nextIteration(count + 1)
				} else {
					yield [ruleNext ? ruleNext(nextObject) : [], nextIteration(count + 1)]
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
	object: any,
	ruleIterator: IRuleIterator,
	iteration: IteratorResult<IRuleOrIterable, null>,
	fork: (ruleIterator: IRuleIterator) => IUnsubscribe,
	subscribeNode: (rule: IRuleSubscribe, getRuleIterator: () => IRuleIterator) => IUnsubscribe,
): IUnsubscribe {
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
		nextIterable
			? () => nextIterable(object)[Symbol.iterator]()
			: null,
	)
}
