import {ValueChangeType, ValueKeyType} from '../../deep-subscribe/contracts/common'
import {IRule} from '../../deep-subscribe/contracts/rules'
import {deepSubscribeRule} from '../../deep-subscribe/deep-subscribe'
import {RuleBuilder} from '../../deep-subscribe/RuleBuilder'
import {IUnsubscribeOrVoid} from '../../subjects/observable'
import {ValueKeys} from './contracts'

export type IDependencyAction<TTarget, TValue = any>
	= (target: TTarget, value: TValue, parent: any, key: any, keyType: ValueKeyType) => void

export type IDependencyPredicate<TValue = any>
	= (value: TValue, parent: any, key: any, keyType: ValueKeyType) => boolean

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
		predicate?: IDependencyPredicate<TValue>,
	): this {
		const {buildSourceRule} = this

		let ruleBuilder = new RuleBuilder<TValue, TValueKeys>()
		if (buildSourceRule) {
			ruleBuilder = buildSourceRule(ruleBuilder as any) as any
		}
		ruleBuilder = buildRule(ruleBuilder as any)

		const ruleBase = ruleBuilder && ruleBuilder.result()
		if (ruleBase == null) {
			throw new Error('buildRule() return null or not initialized RuleBuilder')
		}

		this.dependencies.push([
			ruleBase,
			predicate
				? (target, value, parent, key, keyType) => {
					// prevent circular self dependency
					if (target === parent) {
						return
					}
					if (predicate(value, parent, key, keyType)) {
						action(target, value, parent, key, keyType)
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
): IUnsubscribeOrVoid {
	const unsubscribers = []
	for (let i = 0, len = dependencies.length; i < len; i++) {
		const [rule, action] = dependencies[i]
		unsubscribers.push(deepSubscribeRule({
			object: subscribeObject,
			changeValue(key, oldValue, newValue, parent, changeType, keyType) {
				action(actionTarget, newValue, parent, key, keyType)
			},
			rule: rule.clone(),
			debugTarget: actionTarget,
		}))
	}

	return () => {
		for (let i = 0, len = unsubscribers.length; i < len; i++) {
			unsubscribers[i]()
		}
	}
}
