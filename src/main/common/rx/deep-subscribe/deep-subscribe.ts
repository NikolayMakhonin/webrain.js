/* tslint:disable */
import {IUnsubscribe} from '../subjects/subject'
import {IRule} from './contracts/rules'
import {IRuleOrIterable, iterateRule, subscribeNextRule} from './iterate-rule'

export interface IDeepSubscribeOptions<TValue> {
	bind: (value: TValue) => IUnsubscribe
	immediate?: boolean
}

function deepSubscribe<TValue>(
	object: any,
	rule: IRule,
	options: IDeepSubscribeOptions<TValue>,
): IUnsubscribe {
	return _deepSubscribe<TValue>(
		object,
		iterateRule(rule)[Symbol.iterator](),
		options,
	)
}

function *_deepSubscribe<TValue>(
	object: any,
	ruleIterator: Iterator<IRuleOrIterable>,
	options: IDeepSubscribeOptions<TValue>,
	propertiesPath?: string,
): any {
	const subscribeNext = () => {
		let unsubscribePropertyName

		return subscribeNextRule(
			ruleIterator,
			nextRuleIterator => _deepSubscribe(object, nextRuleIterator, options, propertiesPath),
			rule => {
				function subscribeItem(item, debugPropertyName: string) {
					const newPropertiesPath = (propertiesPath ? propertiesPath + '.' : '')
						+ debugPropertyName + '(' + rule.description + ')'

					const subscribe = () => _deepSubscribe(
						item,
						ruleIterator,
						options,
						newPropertiesPath,
					)

					if (!(item instanceof Object)) {
						const unsubscribe = subscribe()
						if (unsubscribe) {
							throw new Error(`You should not return unsubscribe function (${unsubscribe}) for non Object value (${object}).\nFor subscribe value types use their object wrappers: Number, Boolean, String classes.\nValue property path: ${newPropertiesPath}`)
						}
						return
					}

					if (!unsubscribePropertyName) {
						unsubscribePropertyName = Math.random().toString(36)
					}

					let unsubscribe = item[unsubscribePropertyName]
					if (!unsubscribe) {
						unsubscribe = subscribe()

						Object.defineProperty(item, unsubscribePropertyName, {
							configurable: true,
							enumerable: false,
							writable: false,
							value: unsubscribe
						})
					}
				}

				function unsubscribeItem(item, debugPropertyName: string) {
					if (!(item instanceof Object)) {
						return
					}

					if (!unsubscribePropertyName) {
						return
					}

					const unsubscribe = item[unsubscribePropertyName]
					if (unsubscribe) {
						unsubscribe()
						delete item[unsubscribePropertyName]
					}
				}

				return rule.subscribe(
					object,
					options.immediate,
					subscribeItem,
					unsubscribeItem,
				)
			},
			() => {
				return options.bind(object)
			},
		)
	}

	try {
		return subscribeNext()
	} catch (ex) {
		ex.message += `\nObject property path: ${propertiesPath}`
		throw ex
	}
}
