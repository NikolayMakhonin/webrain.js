import {IRule, IRuleAny, IRuleRepeat, RuleType} from './contracts/rules'

export type IRuleOrIterable = IRule | IRuleIterable
export interface IRuleIterable extends Iterable<IRuleOrIterable> {

}

export function *iterateRule(rule: IRule, next: () => IRuleIterable = null): IRuleIterable {
	if (!rule) {
		if (next) {
			yield* next()
		}
		return
	}

	const nextRule = () => iterateRule(rule.next, next)

	switch (rule.type) {
		case RuleType.Property:
			yield rule
			yield* nextRule()
			break
		case RuleType.Any:
			const {rules} = (rule as IRuleAny)
			function *any() {
				for (let i = 0, len = rules.length; i < len; i++) {
					yield iterateRule(rules[i], nextRule)
				}
			}
			yield any()
			break
		case RuleType.Repeat:
			const {countMin, countMax, rule: subRule} = rule as IRuleRepeat
			function *repeatNext(count) {
				if (count >= countMax) {
					yield* nextRule()
					return
				}

				const nextIteration = () => iterateRule(subRule, () => repeatNext(count + 1))

				if (count < countMin) {
					yield* nextIteration()
				} else {
					yield [nextRule(), nextIteration()]
				}
			}

			yield* repeatNext(0)
			break
		default:
			throw new Error('Unknown RuleType: ' + rule.type)
	}
}
