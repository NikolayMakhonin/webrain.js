import {IRule, IRuleAny, IRuleRepeat, RuleType} from './contracts/rules'

export type IRuleOrIterable = IRule | IRuleIterable
export interface IRuleIterable extends Iterable<IRuleOrIterable> {

}

export function *iterateRule(rule: IRule, next: IRuleIterable = null): IRuleIterable {
	if (!rule) {
		yield* (next || [])
		return
	}

	next = iterateRule(rule.next, next)

	switch (rule.type) {
		case RuleType.Property:
			yield rule
			yield* next
			break
		case RuleType.Any:
			const {rules} = (rule as IRuleAny)
			function *any() {
				for (let i = 0, len = rules.length; i < len; i++) {
					yield iterateRule(rules[i], next)
				}
			}
			yield any()
			break
		case RuleType.Repeat:
			const {countMin, countMax, rule: subRule} = rule as IRuleRepeat
			let count = 0
			function *repeatNext() {
				if (count >= countMax) {
					yield next
					return
				}

				count++
				yield iterateRule(rule, repeatNext())

				if (count >= countMin) {
					yield next
				}
			}
			yield repeatNext()
			break
		default:
			throw new Error('Unknown RuleType: ' + rule.type)
	}
}
