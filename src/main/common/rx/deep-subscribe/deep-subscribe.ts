/* tslint:disable */
import {isThenable} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {IUnsubscribe} from '../subjects/observable'
import {IRule} from './contracts/rules'
import {IRuleIterator, iterateRule, subscribeNextRule} from './iterate-rule'
import {RuleBuilder} from "./RuleBuilder"
import {ISubscribeValue} from "./contracts/common"
import {getObjectUniqueId} from "../../lists/helpers/object-unique-id"
import {checkIsFuncOrNull, toSingleCall} from "../../helpers/helpers"
import {hasDefaultProperty, subscribeDefaultProperty} from './rules-subscribe'

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

function deepSubscribeAsync<TValue>(
	object: any,
	subscribeValue: ISubscribeValue<TValue>,
	immediate: boolean,
	ruleIterator: IRuleIterator,
	leafUnsubscribers: IUnsubscribe[],
	propertiesPath: () => string,
	debugPropertyName: string,
	debugParent: any
) {
	let unsubscribe
	resolveAsync(object, o => {
		if (!unsubscribe) {
			unsubscribe = subscribeNext(
				o,
				subscribeValue,
				immediate,
				ruleIterator,
				leafUnsubscribers,
				propertiesPath,
				debugPropertyName,
				debugParent,
			)
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
		// unsubscribers[itemUniqueId] = null // faster but there is a danger of memory overflow with nulls
		delete unsubscribers[itemUniqueId]
		unsubscribe()
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
	ruleDescription?: string,
) {
	function subscribeLeafDefaultProperty(
		value,
		debugPropertyName: string,
		debugParent: any,
		ruleDescription: string,
	) {
		return subscribeDefaultProperty<TValue>(
			value,
			true,
			(val) => subscribeLeaf(
				val,
				debugPropertyName,
				debugParent,
				ruleDescription,
			),
		) || subscribeLeaf(
			value,
			debugPropertyName,
			debugParent,
			ruleDescription,
		)
	}

	function setUnsubscribeLeaf(
		itemUniqueId: number,
		unsubscribeValue: IUnsubscribe,
	): IUnsubscribe {
		const unsubscribe = () => {
			// PROF: 371 - 0.8%
			if (unsubscribeValue) {
				// leafUnsubscribers[itemUniqueId] = null // faster but there is a danger of memory overflow with nulls
				delete leafUnsubscribers[itemUniqueId]
				const _unsubscribeValue = unsubscribeValue
				unsubscribeValue = null
				_unsubscribeValue()
			}
		}

		leafUnsubscribers[itemUniqueId] = unsubscribe

		return unsubscribe
	}

	function subscribeLeaf(
		value: TValue,
		debugPropertyName: string,
		debugParent: any,
		ruleDescription: string,
	) {
		if (!(value instanceof Object)) {
			const unsubscribeValue = checkIsFuncOrNull(subscribeValue(value, debugParent, debugPropertyName))
			if (unsubscribeValue) {
				unsubscribeValue()

				throw new Error(`You should not return unsubscribe function for non Object value.\n`
					+ `For subscribe value types use their object wrappers: Number, Boolean, String classes.\n`
					+ `Unsubscribe function: ${unsubscribeValue}\nValue: ${value}\n`
					+ `Value property path: ${(propertiesPath ? propertiesPath() + '.' : '')
						+ (debugPropertyName == null ? '' : debugPropertyName + '(' + ruleDescription + ')')}`)
			}
			return null
		}

		const itemUniqueId = getObjectUniqueId(value as any)

		let unsubscribe: IUnsubscribe = leafUnsubscribers[itemUniqueId]
		if (unsubscribe) {
			return unsubscribe
		}

		let unsubscribeValue = checkIsFuncOrNull(subscribeValue(value, debugParent, debugPropertyName))
		if (unsubscribeValue) {
			return setUnsubscribeLeaf(itemUniqueId, unsubscribeValue)
		}
	}

	let unsubscribers: IUnsubscribe[]

	let iteration
	if (!ruleIterator || (iteration = ruleIterator.next()).done) {
		const subscribeLeafFunc = hasDefaultProperty(object)
			? subscribeLeafDefaultProperty
			: subscribeLeaf

		return subscribeLeafFunc(
			object,
			debugPropertyName,
			object,
			ruleDescription,
		)
	}

	return subscribeNextRule(
		ruleIterator,
		iteration,
		nextRuleIterator => deepSubscribeRuleIterator(object, subscribeValue, immediate, nextRuleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent),
		(rule, getNextRuleIterator) => {
			let deepSubscribeItem: (item, debugPropertyName: string) => () => void
			if (getNextRuleIterator) {
				deepSubscribeItem = (item, debugPropertyName: string) => deepSubscribeRuleIterator(
					item,
					subscribeValue,
					immediate,
					getNextRuleIterator(),
					leafUnsubscribers,
					() => (propertiesPath ? propertiesPath() + '.' : '')
						+ (debugPropertyName == null ? '' : debugPropertyName + '(' + rule.description + ')'),
					debugPropertyName,
					object,
				)
			} else {
				const deepSubscribeItemAsync = (item, debugPropertyName: string) => {
					return deepSubscribeAsync(
						item,
						subscribeValue,
						immediate,
						null,
						leafUnsubscribers,
						() => (propertiesPath ? propertiesPath() + '.' : '')
							+ (debugPropertyName == null ? '' : debugPropertyName + '(' + rule.description + ')'),
						debugPropertyName,
						object,
					)
				}

				const catchHandlerLeaf = (err, debugPropertyName: string) => {
					catchHandler(err, () => (propertiesPath ? propertiesPath() + '.' : '')
						+ (debugPropertyName == null ? '' : debugPropertyName + '(' + rule.description + ')'))
				}

				deepSubscribeItem = (item, debugPropertyName: string) => {
					try {
						item = resolveAsync(item)
						if (isThenable(item)) {
							return deepSubscribeItemAsync(item, debugPropertyName)
						}

						const subscribeLeafFunc = hasDefaultProperty(item)
							? subscribeLeafDefaultProperty
							: subscribeLeaf

						return subscribeLeafFunc(
							item,
							debugPropertyName,
							object,
							rule.description,
						)
					} catch (err) {
						catchHandlerLeaf(err, debugPropertyName)
						return null
					}
				}
			}

			return checkIsFuncOrNull(rule.subscribe(
				object,
				immediate,
				(item, debugPropertyName: string) => {
					// PROF: 1212 - 2.6%
					let unsubscribe: IUnsubscribe
					let itemUniqueId: number

					if (item instanceof Object) {
						if (!unsubscribers) {
							unsubscribers = rule.unsubscribers // + '_' + (nextUnsubscribePropertyId++)
						}
						itemUniqueId = getObjectUniqueId(item)
						unsubscribe = unsubscribers[itemUniqueId]
						if (unsubscribe) {
							return
						}
					}

					unsubscribe = checkIsFuncOrNull(deepSubscribeItem(
						item,
						debugPropertyName,
					))

					if (unsubscribe) {
						if (item instanceof Object) {
							unsubscribers[itemUniqueId] = unsubscribe
							return
						}
						unsubscribe()

						throw new Error(`You should not return unsubscribe function for non Object value.\n`
							+ `For subscribe value types use their object wrappers: Number, Boolean, String classes.\n`
							+ `Unsubscribe function: ${unsubscribe}\nValue: ${item}\n`
							+ `Value property path: ${(propertiesPath ? propertiesPath() + '.' : '')
								+ (debugPropertyName == null ? '' : debugPropertyName + '(' + rule.description + ')')}`)
					}
				},
				(item, debugPropertyName: string) => {
       				// PROF: 431 - 0.9%
					unsubscribeNested(item, unsubscribers)
				},
			))
		},
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
	// PROF: 1158 - 2.4%

	if (!immediate) {
		throw new Error('immediate == false is deprecated')
	}

	if (!leafUnsubscribers) {
		leafUnsubscribers = []
	}

	try {
		object = resolveAsync(object)
		const subscribeNextFunc = isThenable(object)
			? deepSubscribeAsync
			: subscribeNext

		return subscribeNextFunc(
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
