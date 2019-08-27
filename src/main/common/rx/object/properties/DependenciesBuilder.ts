import {IRule} from '../../deep-subscribe/contracts/rules'
import {RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {ValueKeys} from './contracts'

export type IDependencyAction<TTarget, TValue = any>
	= (target: TTarget, value: TValue, parent: any, propertyName: string) => void

export class DependenciesBuilder<TTarget, TSource, TValueKeys extends string | number = ValueKeys> {
	public dependencies: Array<[IRule, IDependencyAction<TTarget>]> = []

	public buildSourceRule: (builder: RuleBuilder<any, TValueKeys>)
		=> RuleBuilder<TSource, TValueKeys>

	constructor(
		buildSourceRule?: (builder: RuleBuilder<any, TValueKeys>)
			=> RuleBuilder<TSource, TValueKeys>,
	) {
		this.buildSourceRule = buildSourceRule
	}

	public actionOn<TValue>(
		buildRule: (inputRuleBuilder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
		action: IDependencyAction<TTarget, TValue>,
		predicate?: (value, parent) => boolean,
	): this {
		const {buildSourceRule} = this

		let ruleBuilder = new RuleBuilder<TValue, TValueKeys>()
		if (buildSourceRule) {
			ruleBuilder = buildSourceRule(ruleBuilder as any) as any
		}
		ruleBuilder = buildRule(ruleBuilder as any)

		const ruleBase = ruleBuilder && ruleBuilder.result
		if (ruleBase == null) {
			throw new Error('buildRule() return null or not initialized RuleBuilder')
		}

		this.dependencies.push([
			ruleBase,
			predicate
				? (target, value, parent, propertyName) => {
					if (predicate(value, parent)) {
						action(target, value, parent, propertyName)
					}
				}
				: action,
		])

		return this
	}
}
