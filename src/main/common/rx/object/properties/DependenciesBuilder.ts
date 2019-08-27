import {IRule} from '../../deep-subscribe/contracts/rules'
import {RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {ValueKeys} from './contracts'

export class DependenciesBuilder<TTarget, TSource, TValueKeys extends string | number = ValueKeys> {
	public dependencies: Array<[IRule, (target: TTarget, value: any, parent: any) => void]> = []

	public actionOn<TValue>(
		buildRule: (inputRuleBuilder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
		action: (target: TTarget, value: TValue, parent: any) => void,
		predicate?: (value, parent) => boolean,
	): this {
		const ruleBuilder = buildRule(new RuleBuilder<TSource, TValueKeys>())
		const ruleBase = ruleBuilder && ruleBuilder.result
		if (ruleBase == null) {
			throw new Error('buildRule() return null or not initialized RuleBuilder')
		}
		this.dependencies.push([
			ruleBase,
			predicate
				? (target, value, parent) => {
					if (predicate(value, parent)) {
						action(target, value, parent)
					}
				}
				: action,
		])

		return this
	}
}
