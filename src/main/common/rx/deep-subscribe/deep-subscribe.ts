/* tslint:disable */
import {IUnsubscribe} from '../subjects/subject'
import {IRule} from './contracts/rules'
import {IRuleOrIterable, iterateRule, subscribeNextRule} from './iterate-rule'
import {RuleBuilder} from "./RuleBuilder";
import {PeekIterator} from "./helpers/PeekIterator";
import {checkUnsubscribe} from "./helpers/common";
import {ISubscribeValue} from "./contracts/common";
import {getObjectUniqueId} from "../../lists/helpers/object-unique-id";

// const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
let nextUnsubscribePropertyId = 0

function deepSubscribeRuleIterator<TValue>(
	object: any,
	subscribeValue: ISubscribeValue<TValue>,
	immediate: boolean,
	ruleIterator: PeekIterator<IRuleOrIterable>,
	propertiesPath?: () => string,
	debugPropertyName?: string,
	debugParent?: any,
): IUnsubscribe {
	const subscribeNext = (object) => {
		let unsubscribePropertyName: IUnsubscribe[]

		return subscribeNextRule(
			ruleIterator,
			nextRuleIterator => deepSubscribeRuleIterator<TValue>(object, subscribeValue, immediate, nextRuleIterator, propertiesPath, debugPropertyName, debugParent),
			(rule, getNextRuleIterator) => {
				const subscribeItem = (item, debugPropertyName: string) => {
					const newPropertiesPath = () => (propertiesPath ? propertiesPath() + '.' : '')
						+ debugPropertyName + '(' + rule.description + ')'

					const subscribe = (): IUnsubscribe => deepSubscribeRuleIterator<TValue>(
						item,
						subscribeValue,
						immediate,
						getNextRuleIterator
							? getNextRuleIterator()
							: null,
						newPropertiesPath,
						debugPropertyName,
						object,
					)

					if (!(item instanceof Object)) {
						const unsubscribe = checkUnsubscribe(subscribe())
						if (unsubscribe) {
							unsubscribe()
							throw new Error(`You should not return unsubscribe function for non Object value.\nFor subscribe value types use their object wrappers: Number, Boolean, String classes.\nUnsubscribe function: ${unsubscribe}\nValue: ${item}\nValue property path: ${newPropertiesPath()}`)
						}
						return
					}

					if (!unsubscribePropertyName) {
						unsubscribePropertyName = rule.unsubscribePropertyName // + '_' + (nextUnsubscribePropertyId++)
					}

					const itemUniqueId = getObjectUniqueId(item)

					let unsubscribe: IUnsubscribe = unsubscribePropertyName[itemUniqueId]
					if (!unsubscribe) {
						// if (typeof unsubscribe === 'undefined') {

							// !Warning defineProperty is slow
							// Object.defineProperty(item, unsubscribePropertyName, {
							// 	configurable: true,
							// 	enumerable: false,
							// 	writable: true,
							// 	value: checkUnsubscribe(subscribe()),
							// })

							// item[unsubscribePropertyName] = checkUnsubscribe(subscribe())

							unsubscribePropertyName[itemUniqueId] = checkUnsubscribe(subscribe())

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

					const itemUniqueId = getObjectUniqueId(item)

					const unsubscribe = unsubscribePropertyName[itemUniqueId]
					if (unsubscribe) {
						delete unsubscribePropertyName[itemUniqueId]
						unsubscribe()
						// item[unsubscribePropertyName] = null
					}
				}

				return checkUnsubscribe(rule.subscribe(
					object,
					immediate,
					subscribeItem,
					unsubscribeItem,
				))
			},
			() => {
				return subscribeValue(object, debugParent, debugPropertyName)
			},
		)
	}

	const catchHandler = (ex) => {
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

	try {
		// Resolve Promises
		if (object != null && typeof object.then === 'function') {
			let unsubscribe
			Promise
				.resolve(object)
				.then(o => {
					if (!unsubscribe) {
						unsubscribe = subscribeNext(o)
						// if (typeof unsubscribe !== 'function') {
						// 	throw new Error(`unsubscribe is not a function: ${unsubscribe}`)
						// }
					}
					return o
				})
				.catch(catchHandler)

			return () => {
				if (typeof unsubscribe === 'function') {
					unsubscribe()
				}
				unsubscribe = true
			}
		}

		return subscribeNext(object)
	} catch (ex) {
		catchHandler(ex)
	}
}

export function deepSubscribeRule<TValue>(
	object: any,
	subscribeValue: ISubscribeValue<TValue>,
	immediate: boolean,
	rule: IRule,
): IUnsubscribe {
	return deepSubscribeRuleIterator<TValue>(
		object,
		subscribeValue,
		immediate,
		new PeekIterator(iterateRule(rule)[Symbol.iterator]()),
	)
}

export function deepSubscribe<TObject, TValue>(
	object: TObject,
	subscribeValue: ISubscribeValue<TValue>,
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
