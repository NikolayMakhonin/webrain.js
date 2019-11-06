import {Debugger} from '../../Debugger'
import {ValueKeyType} from '../../deep-subscribe/contracts/common'
import {RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {CalcProperty} from './CalcProperty'
import {ValueKeys} from './contracts'
import {DependenciesBuilder, IDependencyPredicate} from './DependenciesBuilder'

export class CalcPropertyDependenciesBuilder<
	TTarget extends CalcProperty<any, TSource>,
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
		predicate?: IDependencyPredicate<TValue>,
	): this {
		this.actionOn(buildRule, (target, value, parent, key: any, keyType: ValueKeyType) => {
			Debugger.Instance.onDependencyChanged(target, value, parent, key, keyType)
			target.invalidate()
		}, predicate)
		return this
	}

	public clearOn<TValue>(
		buildRule: (inputRuleBuilder: RuleBuilder<TSource, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
		predicate?: IDependencyPredicate<TValue>,
	): this {
		this.actionOn(buildRule, (target, value, parent, key: any, keyType: ValueKeyType) => {
			Debugger.Instance.onDependencyChanged(target, value, parent, key, keyType)
			target.clear()
		}, predicate)
		return this
	}
}
