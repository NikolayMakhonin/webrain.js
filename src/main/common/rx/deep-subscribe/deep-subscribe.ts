/* tslint:disable */
import {IUnsubscribe} from '../subjects/subject'
import {IRule} from './contracts/rules'
import {IRuleOrIterable, iterateRule, subscribeNextRule} from './iterate-rule'
import {RuleBuilder} from "./RuleBuilder";
import {IRuleSubscribe} from "./contracts/rule-subscribe";

// const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
let nextUnsubscribePropertyId = 0

function deepSubscribeRuleIterator<TValue>(
	object: any,
	subscribeValue: (value: TValue) => IUnsubscribe,
	immediate: boolean,
	ruleIterator: Iterator<IRuleOrIterable>,
	propertiesPath?: () => string,
): IUnsubscribe {
	const subscribeNext = () => {
		let unsubscribePropertyName: string

		return subscribeNextRule(
			ruleIterator,
			nextRuleIterator => deepSubscribeRuleIterator<TValue>(object, subscribeValue, immediate, nextRuleIterator, propertiesPath),
			(rule, getNextRuleIterator) => {
				const subscribeItem = (item, debugPropertyName: string) => {
					const newPropertiesPath = () => (propertiesPath ? propertiesPath() + '.' : '')
						+ debugPropertyName + '(' + rule.description + ')'

					const subscribe = (): IUnsubscribe => deepSubscribeRuleIterator<TValue>(
						item,
						subscribeValue,
						immediate,
						getNextRuleIterator(),
						newPropertiesPath,
					)

					if (!(item instanceof Object)) {
						const unsubscribe = subscribe()
						if (unsubscribe) {
							throw new Error(`You should not return unsubscribe function for non Object value.\nFor subscribe value types use their object wrappers: Number, Boolean, String classes.\nUnsubscribe function: ${unsubscribe}\nValue: ${item}\nValue property path: ${newPropertiesPath()}`)
						}
						return
					}

					if (!unsubscribePropertyName) {
						unsubscribePropertyName = rule.unsubscribePropertyName // + '_' + (nextUnsubscribePropertyId++)
					}

					let unsubscribe: IUnsubscribe = item[unsubscribePropertyName]
					if (!unsubscribe) {
						// if (typeof unsubscribe === 'undefined') {
							Object.defineProperty(item, unsubscribePropertyName, {
								configurable: true,
								enumerable: false,
								writable: true,
								value: subscribe()
							})
						// } else {
						// 	item[unsubscribePropertyName] = subscribe()
						// }
					}
				}

				const unsubscribeItem = (item, debugPropertyName: string) => {
					if (!(item instanceof Object)) {
						return
					}

					if (!unsubscribePropertyName) {
						return
					}

					const unsubscribe = item[unsubscribePropertyName]
					if (unsubscribe) {
						delete item[unsubscribePropertyName]
						unsubscribe()
						// item[unsubscribePropertyName] = null
					}
				}

				return rule.subscribe(
					object,
					immediate,
					subscribeItem,
					unsubscribeItem,
				)
			},
			() => {
				return subscribeValue(object)
			},
		)
	}

	try {
		return subscribeNext()
	} catch (ex) {
		if (ex.propertiesPath) {
			throw ex
		}

		const propertiesPathStr = propertiesPath
			? propertiesPath()
			: ''
		ex.propertiesPath = propertiesPathStr
		ex.message += `\nObject property path: ${propertiesPathStr}`

		throw ex
	}
}

export function deepSubscribeRule<TValue>(
	object: any,
	subscribeValue: (value: TValue) => IUnsubscribe,
	immediate: boolean,
	rule: IRule,
): IUnsubscribe {
	return deepSubscribeRuleIterator<TValue>(
		object,
		subscribeValue,
		immediate,
		iterateRule(rule)[Symbol.iterator](),
	)
}

export function deepSubscribe<TObject, TValue>(
	object: TObject,
	subscribeValue: (value: TValue) => IUnsubscribe,
	immediate: boolean,
	ruleBuilder: (ruleBuilder: RuleBuilder<TObject>) => RuleBuilder<TValue>,
): IUnsubscribe {
	return deepSubscribeRule(
		object,
		subscribeValue,
		immediate,
		ruleBuilder(new RuleBuilder<TObject>()).rule
	)
}
