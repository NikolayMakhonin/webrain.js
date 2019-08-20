/* tslint:disable */
import {IUnsubscribe} from '../subjects/subject'
import {IRule} from './contracts/rules'
import {IRuleOrIterable, iterateRule, subscribeNextRule} from './iterate-rule'
import {RuleBuilder} from "./RuleBuilder";
import {PeekIterator} from "./helpers/PeekIterator";
import {ISubscribeValue} from "./contracts/common";
import {getObjectUniqueId} from "../../lists/helpers/object-unique-id";
import {checkIsFuncOrNull, toSingleCall} from "../../helpers/helpers";

// const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0

function deepSubscribeRuleIterator<TValue>(
	object: any,
	subscribeValue: ISubscribeValue<TValue>,
	immediate: boolean,
	ruleIterator: PeekIterator<IRuleOrIterable>,
	leafUnsubscribers?: IUnsubscribe[],
	propertiesPath?: () => string,
	debugPropertyName?: string,
	debugParent?: any,
): IUnsubscribe {
	const subscribeNext = (object) => {
		let unsubscribers: IUnsubscribe[]

		if (!leafUnsubscribers) {
			leafUnsubscribers = []
		}

		const subscribeNested = (
			value: any,
			subscribe: () => IUnsubscribe,
			getUnsubscribers: () => IUnsubscribe[],
			newPropertiesPath?: () => string,
		): boolean => {
			if (!(value instanceof Object)) {
				const unsubscribe = checkIsFuncOrNull(subscribe())
				if (unsubscribe) {
					unsubscribe()
					throw new Error(`You should not return unsubscribe function for non Object value.\nFor subscribe value types use their object wrappers: Number, Boolean, String classes.\nUnsubscribe function: ${unsubscribe}\nValue: ${value}\nValue property path: ${newPropertiesPath ? newPropertiesPath() : (propertiesPath ? propertiesPath() : '')}`)
				}
				return false
			}

			const unsubscribers = getUnsubscribers()

			const itemUniqueId = getObjectUniqueId(value)

			let unsubscribe: IUnsubscribe = unsubscribers[itemUniqueId]
			if (!unsubscribe) {
				unsubscribers[itemUniqueId] = checkIsFuncOrNull(subscribe())

				// if (typeof unsubscribe === 'undefined') {
				//
				// 	!Warning defineProperty is slow
				// 	Object.defineProperty(item, unsubscribePropertyName, {
				// 		configurable: true,
				// 		enumerable: false,
				// 		writable: true,
				// 		value: checkUnsubscribe(subscribe()),
				// 	})
				//
				// 	item[unsubscribePropertyName] = checkUnsubscribe(subscribe())
				//
				// } else {
				// 	item[unsubscribePropertyName] = subscribe()
				// }
			}

			return true
		}

		const unsubscribeNested = (value: any, unsubscribers: IUnsubscribe[]): void => {
			if (!(value instanceof Object)) {
				return
			}

			if (!unsubscribers) {
				return
			}

			const itemUniqueId = getObjectUniqueId(value)

			const unsubscribe = unsubscribers[itemUniqueId]
			if (unsubscribe) {
				delete unsubscribers[itemUniqueId]
				unsubscribe()
				// item[unsubscribePropertyName] = null
			}
		}

		return subscribeNextRule(
			ruleIterator,
			nextRuleIterator => deepSubscribeRuleIterator<TValue>(object, subscribeValue, immediate, nextRuleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent),
			(rule, getNextRuleIterator) => {
				const subscribeItem = (item, debugPropertyName: string) => {
					const newPropertiesPath = debugPropertyName == null
						? null
						: () => (propertiesPath ? propertiesPath() + '.' : '')
							+ debugPropertyName + '(' + rule.description + ')'

					const subscribe = (): IUnsubscribe => deepSubscribeRuleIterator<TValue>(
						item,
						subscribeValue,
						immediate,
						getNextRuleIterator
							? getNextRuleIterator()
							: null,
						leafUnsubscribers,
						newPropertiesPath,
						debugPropertyName,
						object,
					)

					subscribeNested(item, subscribe, () => {
						if (!unsubscribers) {
							unsubscribers = rule.unsubscribers // + '_' + (nextUnsubscribePropertyId++)
						}
						return unsubscribers
					}, newPropertiesPath)
				}

				const unsubscribeItem = (item, debugPropertyName: string) => {
					unsubscribeNested(item, unsubscribers)
				}

				return checkIsFuncOrNull(rule.subscribe(
					object,
					immediate,
					subscribeItem,
					unsubscribeItem,
				))
			},
			() => {
				if (subscribeNested(object,
					() => subscribeValue(object, debugParent, debugPropertyName),
					() => leafUnsubscribers)
				) {
					return () => {
						unsubscribeNested(object, leafUnsubscribers)
					}
				}
				return null
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
	return toSingleCall(deepSubscribeRuleIterator<TValue>(
		object,
		subscribeValue,
		immediate,
		new PeekIterator(iterateRule(rule)[Symbol.iterator]()),
	))
}

export function deepSubscribe<TObject, TValue>(
	object: TObject,
	subscribeValue: ISubscribeValue<TValue>,
	immediate: boolean,
	ruleBuilder: (ruleBuilder: RuleBuilder<TObject>) => RuleBuilder<TValue>,
): IUnsubscribe {
	return toSingleCall(deepSubscribeRule(
		object,
		subscribeValue,
		immediate,
		ruleBuilder(new RuleBuilder<TObject>()).result
	))
}
