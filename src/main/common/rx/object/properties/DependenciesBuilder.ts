import {IRule} from '../../deep-subscribe/contracts/rules'
import {deepSubscribeRule} from '../../deep-subscribe/deep-subscribe'
import {RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {IUnsubscribe} from '../../subjects/subject'
import {ValueKeys} from './contracts'

export type IDependencyAction<TTarget, TValue = any>
	= (target: TTarget, value: TValue, parent: any, propertyName: string) => void

export type IDependency<TTarget, TValue = any> = [IRule, IDependencyAction<TTarget, TValue>]

export class DependenciesBuilder<TTarget, TSource, TValueKeys extends string | number = ValueKeys> {
	public dependencies: Array<IDependency<TTarget>> = []

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

export function subscribeDependencies<TSubscribeObject, TActionTarget>(
	subscribeObject: TSubscribeObject,
	actionTarget: TActionTarget,
	dependencies: Array<IDependency<TActionTarget>>,
): IUnsubscribe {
	const unsubscribers = []
	for (let i = 0, len = dependencies.length; i < len; i++) {
		const [rule, action] = dependencies[i]
		unsubscribers.push(deepSubscribeRule(
			subscribeObject,
			(value, parent, propertyName) => {
				action(actionTarget, value, parent, propertyName)
				return null
			},
			true,
			rule,
		))
	}

	return () => {
		for (let i = 0, len = unsubscribers.length; i < len; i++) {
			unsubscribers[i]()
		}
	}
}
