/* tslint:disable */
import {isThenable} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {IUnsubscribe} from '../subjects/subject'
import {IRule} from './contracts/rules'
import {IRuleIterator, iterateRule, subscribeNextRule} from './iterate-rule'
import {RuleBuilder} from "./RuleBuilder"
import {ISubscribeValue} from "./contracts/common"
import {getObjectUniqueId} from "../../lists/helpers/object-unique-id"
import {checkIsFuncOrNull, toSingleCall} from "../../helpers/helpers"
import {subscribeDefaultProperty} from './rules-subscribe'

// const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0

function catchHandler(ex, propertiesPath?: () => string) {
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

function deepSubscribeAsync(object: any, subscribeNext: (object) => IUnsubscribe, propertiesPath?: () => string) {
	let unsubscribe
	resolveAsync(object, o => {
		if (!unsubscribe) {
			unsubscribe = subscribeNext(o)
			// if (typeof unsubscribe !== 'function') {
			// 	throw new Error(`unsubscribe is not a function: ${unsubscribe}`)
			// }
		}
		return o
	}, err => catchHandler(err, propertiesPath))

	return () => {
		if (typeof unsubscribe === 'function') {
			unsubscribe()
		}
		unsubscribe = true
	}
}

function subscribeNested(
	value: any,
	subscribe: () => IUnsubscribe,
	getUnsubscribers: () => IUnsubscribe[],
	newPropertiesPath: () => string,
): boolean {
	if (!(value instanceof Object)) {
		const unsubscribe = checkIsFuncOrNull(subscribe())
		if (unsubscribe) {
			unsubscribe()
			throw new Error(`You should not return unsubscribe function for non Object value.\nFor subscribe value types use their object wrappers: Number, Boolean, String classes.\nUnsubscribe function: ${unsubscribe}\nValue: ${value}\nValue property path: ${newPropertiesPath ? newPropertiesPath() : ''}`)
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

function unsubscribeNested(value: any, unsubscribers: IUnsubscribe[]): void {
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

function subscribeNext<TValue>(
	object: any,
	subscribeValue: ISubscribeValue<TValue>,
	immediate: boolean,
	ruleIterator: IRuleIterator,
	leafUnsubscribers: IUnsubscribe[],
	propertiesPath: () => string,
	debugPropertyName: string,
	debugParent: any,
) {
	let unsubscribers: IUnsubscribe[]

	const subscribeLeaf = (value) => {
		if (subscribeNested(value,
			() => subscribeValue(value, debugParent, debugPropertyName),
			() => leafUnsubscribers,
			propertiesPath)
		) {
			return () => {
				unsubscribeNested(value, leafUnsubscribers)
			}
		}
	}

	return subscribeNextRule(
		ruleIterator,
		nextRuleIterator => deepSubscribeRuleIterator(object, subscribeValue, immediate, nextRuleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent),
		(rule, getNextRuleIterator) => {
			const subscribeItem = (item, debugPropertyName: string) => {
				const newPropertiesPath = debugPropertyName == null
					? propertiesPath
					: () => (propertiesPath ? propertiesPath() + '.' : '')
						+ debugPropertyName + '(' + rule.description + ')'

				const subscribe = (): IUnsubscribe => deepSubscribeRuleIterator(
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

			// noinspection JSUnusedLocalSymbols
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
		() => subscribeDefaultProperty(
			object,
			immediate,
			subscribeLeaf,
		) || subscribeLeaf(object),
	)
}

function deepSubscribeRuleIterator<TValue>(
	object: any,
	subscribeValue: ISubscribeValue<TValue>,
	immediate: boolean,
	ruleIterator: IRuleIterator,
	leafUnsubscribers?: IUnsubscribe[],
	propertiesPath?: () => string,
	debugPropertyName?: string,
	debugParent?: any,
): IUnsubscribe {
	if (!immediate) {
		throw new Error('immediate == false is deprecated')
	}

	if (!leafUnsubscribers) {
		leafUnsubscribers = []
	}

	object = resolveAsync(object)
	if (isThenable(object)) {
		return deepSubscribeAsync(
			object,
			o => subscribeNext(
				o,
				subscribeValue,
				immediate,
				ruleIterator,
				leafUnsubscribers,
				propertiesPath,
				debugPropertyName,
				debugParent,
			),
			propertiesPath
		)
	}

	try {
		return subscribeNext(
			object,
			subscribeValue,
			immediate,
			ruleIterator,
			leafUnsubscribers,
			propertiesPath,
			debugPropertyName,
			debugParent,
		)
	} catch (err) {
		catchHandler(err, propertiesPath)
		return null
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
		iterateRule(rule)[Symbol.iterator](),
	))
}

export function deepSubscribe<TObject, TValue, TValueKeys extends string | number = never>(
	object: TObject,
	subscribeValue: ISubscribeValue<TValue>,
	immediate: boolean,
	ruleBuilder: (ruleBuilder: RuleBuilder<TObject, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
): IUnsubscribe {
	return toSingleCall(deepSubscribeRule(
		object,
		subscribeValue,
		immediate,
		ruleBuilder(new RuleBuilder<TObject, TValueKeys>()).result
	))
}
