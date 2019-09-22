/* tslint:disable */
import {isThenable} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {IUnsubscribe} from '../subjects/observable'
import {IRule} from './contracts/rules'
import {IRuleIterator, IRuleOrIterable, iterateRule, subscribeNextRule} from './iterate-rule'
import {RuleBuilder} from "./RuleBuilder"
import {ISubscribeValue} from "./contracts/common"
import {getObjectUniqueId} from "../../helpers/object-unique-id"
import {checkIsFuncOrNull, toSingleCall} from "../../helpers/helpers"
import {hasDefaultProperty, subscribeDefaultProperty, SubscribeObjectType} from './rules-subscribe'

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

function unsubscribeNested(value: any, unsubscribers: IUnsubscribe[], unsubscribersCount: number[]): void {
	if (!(value instanceof Object)) {
		return
	}

	if (!unsubscribers) {
		return
	}

	const itemUniqueId = getObjectUniqueId(value)

	const unsubscribeCount = unsubscribersCount[itemUniqueId]
	if (!unsubscribeCount) {
		return
	}

	if (unsubscribeCount > 1) {
		unsubscribersCount[itemUniqueId] = unsubscribeCount - 1
	} else {
		const unsubscribe = unsubscribers[itemUniqueId]
		// unsubscribers[itemUniqueId] = null // faster but there is a danger of memory overflow with nulls
		delete unsubscribers[itemUniqueId]
		delete unsubscribersCount[itemUniqueId]

		if (Array.isArray(unsubscribe)) {
			for (let i = 0, len = unsubscribe.length; i < len; i++) {
				unsubscribe[i]()
			}
		} else {
			unsubscribe()
		}
	}
}

function subscribeNext<TValue>(
	object: any,
	subscribeValue: ISubscribeValue<TValue>,
	immediate: boolean,
	ruleIterator: IRuleIterator,
	leafUnsubscribers: IUnsubscribe[],
	leafUnsubscribersCount: number[],
	propertiesPath: () => string,
	debugPropertyName: string,
	debugParent: any,
	ruleDescription?: string,
	iteration?: IteratorResult<IRuleOrIterable>,
) {
	if (!iteration && ruleIterator) {
		iteration = ruleIterator.next()
	}

	// region resolve value

	{
		object = resolveAsync(object) as any
		if (isThenable(object)) {
			let unsubscribe
			resolveAsync(object, o => {
				if (!unsubscribe) {
					unsubscribe = subscribeNext<TValue>(
						o,
						subscribeValue,
						immediate,
						ruleIterator,
						leafUnsubscribers,
						leafUnsubscribersCount,
						propertiesPath,
						debugPropertyName,
						debugParent,
						ruleDescription,
						iteration,
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

		if (hasDefaultProperty(object as any)
			&& iteration.value.subType !== SubscribeObjectType.ValueProperty
		) {
			const result = subscribeDefaultProperty<TValue>(
				object as any,
				true,
				(item: TValue) => subscribeNext<TValue>(
					item,
					subscribeValue,
					immediate,
					ruleIterator,
					leafUnsubscribers,
					leafUnsubscribersCount,
					propertiesPath,
					debugPropertyName,
					debugParent,
					ruleDescription,
		         iteration,
				),
			)
			if (result) {
				return result
			}
		}
	}

	// endregion

	function setUnsubscribeLeaf(
		itemUniqueId: number,
		unsubscribeValue: IUnsubscribe,
	): IUnsubscribe {
		const unsubscribe = () => {
			const leafUnsubscribeCount = leafUnsubscribersCount[itemUniqueId]
			if (!leafUnsubscribeCount) {
				return
			}

			if (leafUnsubscribeCount > 1) {
				leafUnsubscribersCount[itemUniqueId] = leafUnsubscribeCount - 1
			} else {
				// leafUnsubscribers[itemUniqueId] = null // faster but there is a danger of memory overflow with nulls
				delete leafUnsubscribers[itemUniqueId]
				delete leafUnsubscribersCount[itemUniqueId]

				// PROF: 371 - 0.8%
				if (unsubscribeValue) {
					const _unsubscribeValue = unsubscribeValue
					unsubscribeValue = null
					_unsubscribeValue()
				}
			}
		}

		leafUnsubscribers[itemUniqueId] = unsubscribe
		leafUnsubscribersCount[itemUniqueId] = 1

		return unsubscribe
	}

	function subscribeLeaf(
		value: TValue,
		debugPropertyName: string,
		debugParent: any,
		ruleDescription: string,
		catchHandlerLeaf: (err: Error, debugPropertyName: string) => void,
	) {
		value = resolveAsync(value) as any
		if (isThenable(value)) {
			let unsubscribe
			resolveAsync(value, o => {
				if (!unsubscribe) {
					unsubscribe = subscribeLeaf(
						o,
						debugPropertyName,
						debugParent,
						ruleDescription,
						catchHandlerLeaf,
					)
					// if (typeof unsubscribe !== 'function') {
					// 	throw new Error(`unsubscribe is not a function: ${unsubscribe}`)
					// }
				}
				return o
			}, err => catchHandlerLeaf(err, debugPropertyName))

			return () => {
				if (typeof unsubscribe === 'function') {
					unsubscribe()
				}
				unsubscribe = true
			}
		}

		if (hasDefaultProperty(value as any)) {
			const result = subscribeDefaultProperty<TValue>(
				value as any,
				true,
				(item: TValue) =>
					subscribeLeaf(item, debugPropertyName, debugParent, ruleDescription, catchHandlerLeaf),
			)
			if (result) {
				return result
			}
		}

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
			return null // TODO: return () => subscribeValue(void 0, null, debugPropertyName)
		}

		const itemUniqueId = getObjectUniqueId(value as any)

		let unsubscribe: IUnsubscribe = leafUnsubscribers[itemUniqueId]
		if (unsubscribe) {
			leafUnsubscribersCount[itemUniqueId]++
			return unsubscribe
		}

		let unsubscribeValue = checkIsFuncOrNull(subscribeValue(value, debugParent, debugPropertyName))
		if (unsubscribeValue) {
			return setUnsubscribeLeaf(itemUniqueId, unsubscribeValue)
		}
	}

	let unsubscribers: Array<IUnsubscribe|Array<IUnsubscribe>>
	let unsubscribersCount: number[]

	if (!iteration || iteration.done) {
		return subscribeLeaf(
			object,
			debugPropertyName,
			object,
			ruleDescription,
			err => catchHandler(err, propertiesPath),
		)
	}

	function subscribeNode(rule, getNextRuleIterator) {
		let deepSubscribeItem: (item, debugPropertyName: string) => () => void
		const catchHandlerItem = (err, debugPropertyName: string) => {
			catchHandler(err, () => (propertiesPath ? propertiesPath() + '.' : '')
				+ (debugPropertyName == null ? '' : debugPropertyName + '(' + rule.description + ')'))
		}

		if (getNextRuleIterator) {
			deepSubscribeItem = (item, debugPropertyName: string) => {
				try {
					return subscribeNext(
						item,
						subscribeValue,
						immediate,
						getNextRuleIterator(),
						leafUnsubscribers,
						leafUnsubscribersCount,
						() => (propertiesPath ? propertiesPath() + '.' : '')
							+ (debugPropertyName == null ? '' : debugPropertyName + '(' + rule.description + ')'),
						debugPropertyName,
						object,
					)
				} catch (err) {
					catchHandlerItem(err, debugPropertyName)
					return null
				}
			}
		} else {
			deepSubscribeItem = (item, debugPropertyName: string) => {
				try {
					return subscribeLeaf(
						item,
						debugPropertyName,
						object,
						rule.description,
						catchHandlerItem,
					)
				} catch (err) {
					catchHandlerItem(err, debugPropertyName)
					return null
				}
			}
		}

		return checkIsFuncOrNull(rule.subscribe(
			object,
			immediate,
			(item, debugPropertyName: string) => {
				// PROF: 1212 - 2.6%
				let unsubscribe: IUnsubscribe|Array<IUnsubscribe>
				let itemUniqueId: number

				if (item instanceof Object) {
					if (!unsubscribers) {
						unsubscribers = rule.unsubscribers // + '_' + (nextUnsubscribePropertyId++)
						unsubscribersCount = rule.unsubscribersCount
					}
					itemUniqueId = getObjectUniqueId(item)
					unsubscribe = unsubscribers[itemUniqueId]
					if (unsubscribe) {
						unsubscribersCount[itemUniqueId]++
						return
					}
				}

				unsubscribe = checkIsFuncOrNull(deepSubscribeItem(
					item,
					debugPropertyName,
				))

				if (unsubscribe) {
					if (item instanceof Object) {
						let chainUnsubscribe = unsubscribers[itemUniqueId]
						if (chainUnsubscribe) {
							if (Array.isArray(chainUnsubscribe)) {
								chainUnsubscribe.push(unsubscribe)
								return
							}
							unsubscribers[itemUniqueId] = [chainUnsubscribe, unsubscribe]
						} else {
							unsubscribers[itemUniqueId] = unsubscribe
						}
						unsubscribersCount[itemUniqueId] = 1
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
				unsubscribeNested(item, unsubscribers, unsubscribersCount)
			},
		))
	}

	return subscribeNextRule(
		ruleIterator,
		iteration,
		nextRuleIterator => deepSubscribeRuleIterator(
			object,
			subscribeValue,
			immediate,
			nextRuleIterator,
			leafUnsubscribers,
			leafUnsubscribersCount,
			propertiesPath,
			debugPropertyName,
			debugParent,
		),
		subscribeNode,
	)
}

function deepSubscribeRuleIterator<TValue>(
	object: any,
	subscribeValue: ISubscribeValue<TValue>,
	immediate: boolean,
	ruleIterator: IRuleIterator,
	leafUnsubscribers?: IUnsubscribe[],
	leafUnsubscribersCount?: number[],
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

	if (!leafUnsubscribersCount) {
		leafUnsubscribersCount = []
	}

	try {
		return subscribeNext(
			object,
			subscribeValue,
			immediate,
			ruleIterator,
			leafUnsubscribers,
			leafUnsubscribersCount,
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
