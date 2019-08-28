import {RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {CalcProperty} from './CalcProperty'
import {ValueKeys} from './contracts'
import {DependenciesBuilder} from './DependenciesBuilder'

export class CalcPropertyDependenciesBuilder<
	TTarget extends CalcProperty<any, TSource, any>,
	TSource,
	TValueKeys extends string | number = ValueKeys
> extends DependenciesBuilder<TTarget, TSource, TValueKeys> {
	constructor(
		buildSourceRule?: (builder: RuleBuilder<any, TValueKeys>)
			=> RuleBuilder<TSource, TValueKeys>,
	) {
		super(buildSourceRule)
	}

	public invalidateOn<TValue>(
		buildRule: (inputRuleBuilder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
		predicate?: (value, parent) => boolean,
	): this {
		this.actionOn(buildRule, target => {
			target.invalidate()
		}, predicate)
		return this
	}

	public clearOn<TValue>(
		buildRule: (inputRuleBuilder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
		predicate?: (value, parent) => boolean,
	): this {
		this.actionOn(buildRule, target => {
			target.clear()
		}, predicate)
		return this
	}
}
