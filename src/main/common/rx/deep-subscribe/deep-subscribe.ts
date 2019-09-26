/* tslint:disable:no-shadowed-variable no-array-delete*/
import {isThenable} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {checkIsFuncOrNull, toSingleCall} from '../../helpers/helpers'
import {getObjectUniqueId} from '../../helpers/object-unique-id'
import {IUnsubscribe, IUnsubscribeOrVoid} from '../subjects/observable'
import {ILastValue, ISubscribeValue, IUnsubscribeValue, IValueSubscriber} from './contracts/common'
import {IRuleSubscribe} from './contracts/rule-subscribe'
import {IRule, RuleType} from './contracts/rules'
import {
	INextRuleIterable,
	IRuleIterator,
	IRuleOrIterable,
	iterateRule,
	subscribeNextRule,
} from './iterate-rule'
import {ObjectSubscriber} from './ObjectSubscriber'
import {RuleBuilder} from './RuleBuilder'

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

function unsubscribeNested(
	value: any,
	unsubscribers: Array<IUnsubscribe|IUnsubscribe[]>,
	unsubscribersCount: number[],
): void {
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
	valueSubscriber: IValueSubscriber<TValue>,
	immediate: boolean,
	ruleIterator: IRuleIterator,
	leafUnsubscribers: IUnsubscribe[],
	leafUnsubscribersCount: number[],
	propertiesPath: () => string,
	propertyName: string,
	parent: any,
	ruleDescription?: string,
	iteration?: IteratorResult<IRuleOrIterable>,
): IUnsubscribeOrVoid {
	if (!iteration && ruleIterator) {
		iteration = ruleIterator.next()
	}
	const isLeaf = !iteration || iteration.done
	if (!isLeaf && iteration.value.type === RuleType.Never) {
		return null
	}

	// region resolve value

	{
		// tslint:disable-next-line
		object = resolveAsync(object)
		if (isThenable(object)) {
			let unsubscribe
			resolveAsync(object, o => {
				if (!unsubscribe) {
					unsubscribe = subscribeNext<TValue>(
						o,
						valueSubscriber,
						immediate,
						ruleIterator,
						leafUnsubscribers,
						leafUnsubscribersCount,
						propertiesPath,
						propertyName,
						parent,
						ruleDescription,
						iteration,
					)
					// if (typeof unsubscribe !== 'function') {
					// 	throw new Error(`unsubscribe is not a function: ${unsubscribe}`)
					// }
				}
				return o
			}, err => { catchHandler(err, propertiesPath) })

			return () => {
				if (typeof unsubscribe === 'function') {
					unsubscribe()
				}
				unsubscribe = true
			}
		}

		// if (hasDefaultProperty(object as any)
		// 	&& (!iteration || iteration.value == null || iteration.value.subType !== SubscribeObjectType.ValueProperty)
		// ) {
		// 	const result = subscribeDefaultProperty<TValue>(
		// 		object as any,
		// 		true,
		// 		(item: TValue, nextPropertyName) => subscribeNext<TValue>(
		// 			item,
		// 			valueSubscriber,
		// 			immediate,
		// 			ruleIterator,
		// 			leafUnsubscribers,
		// 			leafUnsubscribersCount,
		// 			propertiesPath,
		// 			nextPropertyName != null ? nextPropertyName : propertyName,
		// 			nextPropertyName != null ? object : parent,
		// 			null,
		// 			iteration,
		// 		),
		// 	)
		// 	if (result) {
		// 		return result
		// 	}
		// }
	}

	// endregion

	function subscribeLeaf(
		value: TValue,
		propertyName: string,
		parent: any,
		ruleDescription: string,
		catchHandlerLeaf: (err: Error, propertyName: string) => void,
	): IUnsubscribeOrVoid {
		// @ts-ignore
		value = resolveAsync(value)
		if (isThenable(value)) {
			let unsubscribe
			resolveAsync(value, o => {
				if (!unsubscribe) {
					unsubscribe = subscribeLeaf(
						o,
						propertyName,
						parent,
						ruleDescription,
						catchHandlerLeaf,
					)
					// if (typeof unsubscribe !== 'function') {
					// 	throw new Error(`unsubscribe is not a function: ${unsubscribe}`)
					// }
				}
				return o
			}, err => { catchHandlerLeaf(err, propertyName) })

			// tslint:disable-next-line:no-identical-functions
			return () => {
				if (typeof unsubscribe === 'function') {
					unsubscribe()
				}
				unsubscribe = true
			}
		}

		// if (hasDefaultProperty(value as any)) {
		// 	const result = subscribeDefaultProperty<TValue>(
		// 		value as any,
		// 		true,
		// 		(item: TValue, nextPropertyName) =>
		// 			subscribeLeaf(
		// 				item,
		// 				nextPropertyName != null ? nextPropertyName : propertyName,
		// 				nextPropertyName != null ? value : parent,
		// 				null,
		// 				catchHandlerLeaf,
		// 			),
		// 	)
		// 	if (result) {
		// 		return result
		// 	}
		// }

		return valueSubscriber.subscribe(
			value,
			parent,
			propertyName,
			propertiesPath,
			ruleDescription,
		)
	}

	let unsubscribers: Array<IUnsubscribe|IUnsubscribe[]>
	let unsubscribersCount: number[]

	if (isLeaf) {
		return subscribeLeaf(
			object,
			propertyName,
			parent,
			ruleDescription,
			err => { catchHandler(err, propertiesPath) },
		)
	}

	function subscribeNode(rule: IRuleSubscribe, getNextRuleIterable: INextRuleIterable): IUnsubscribeOrVoid {
		const catchHandlerItem = (err, propertyName: string) => {
			catchHandler(err, () => (propertiesPath ? propertiesPath() + '.' : '')
				+ (propertyName == null ? '' : propertyName + '(' + rule.description + ')'))
		}

		const deepSubscribeItemNext = (
			item,
			propertyName: string,
			parent: any,
			iterator?: IRuleIterator,
			iteration?: IteratorResult<IRuleOrIterable>,
		) => {
			try {
				return subscribeNext(
					item,
					valueSubscriber,
					immediate,
					iterator,
					leafUnsubscribers,
					leafUnsubscribersCount,
					() => (propertiesPath ? propertiesPath() + '.' : '')
						+ (propertyName == null ? '' : propertyName + '(' + rule.description + ')'),
					propertyName,
					parent,
					rule.description,
					iteration,
				)
			} catch (err) {
				catchHandlerItem(err, propertyName)
				return null
			}
		}

		const deepSubscribeItemLeaf = (item, propertyName: string, parent: any): IUnsubscribeOrVoid => {
			try {
				return subscribeLeaf(
					item,
					propertyName,
					parent,
					rule.description,
					catchHandlerItem,
				)
			} catch (err) {
				catchHandlerItem(err, propertyName)
				return null
			}
		}

		const deepSubscribeItem = (
			item,
			propertyName: string,
			parent: any,
			iterator: IRuleIterator,
			iteration: IteratorResult<IRuleOrIterable>,
		): IUnsubscribeOrVoid => {
			if (!iteration || iteration.done) {
				return deepSubscribeItemLeaf(item, propertyName, parent)
			} else {
				return deepSubscribeItemNext(item, propertyName, parent, iterator, iteration)
			}
		}

		return checkIsFuncOrNull(rule.subscribe(
			object,
			immediate,
			(item, nextPropertyName: string) => {
				const iterator = getNextRuleIterable && getNextRuleIterable(item)[Symbol.iterator]()
				const iteration = iterator && iterator.next()
				const isLeaf = !iteration || iteration.done
				if (!isLeaf && iteration.value.type === RuleType.Never) {
					return
				}

				if (!isLeaf && typeof item === 'undefined') {
					return
				}

				let nextParent = object
				if (nextPropertyName == null) {
					nextPropertyName = propertyName
					nextParent = parent
				}

				if (isLeaf && !(item instanceof Object)) {
					checkIsFuncOrNull(deepSubscribeItem(
						item,
						nextPropertyName,
						nextParent,
						iterator,
						iteration,
					))
					return
				}

				let unsubscribe: IUnsubscribeOrVoid|IUnsubscribe[]
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
					nextPropertyName,
					nextParent,
					iterator,
					iteration,
				))

				if (unsubscribe) {
					if (item instanceof Object) {
						const chainUnsubscribe = unsubscribers[itemUniqueId]
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

					throw new Error('You should not return unsubscribe function for non Object value.\n'
						+ 'For subscribe value types use their object wrappers: Number, Boolean, String classes.\n'
						+ `Unsubscribe function: ${unsubscribe}\nValue: ${item}\n`
						+ `Value property path: ${(propertiesPath ? propertiesPath() + '.' : '')
							+ (nextPropertyName == null ? '' : nextPropertyName + '(' + rule.description + ')')}`)
				}
			},
			(item, nextPropertyName: string) => {
				const iterator = getNextRuleIterable && getNextRuleIterable(item)[Symbol.iterator]()
				const iteration = iterator && iterator.next()
				const isLeaf = !iteration || iteration.done
				if (!isLeaf && iteration.value.type === RuleType.Never) {
					return
				}

				if (!isLeaf && typeof item === 'undefined') {
					return
				}

				if (isLeaf && !(item instanceof Object)) {
					let nextParent = object
					if (nextPropertyName == null) {
						nextPropertyName = propertyName
						nextParent = parent
					}

					valueSubscriber.unsubscribe(item, nextParent, nextPropertyName)
				} else {
					unsubscribeNested(item, unsubscribers, unsubscribersCount)
				}
			},
		))
	}

	return subscribeNextRule(
		ruleIterator,
		iteration,
		nextRuleIterator => deepSubscribeRuleIterator(
			object,
			valueSubscriber,
			immediate,
			nextRuleIterator,
			leafUnsubscribers,
			leafUnsubscribersCount,
			propertiesPath,
			propertyName,
			parent,
		),
		subscribeNode,
	)
}

function deepSubscribeRuleIterator<TValue>(
	object: any,
	valueSubscriber: IValueSubscriber<TValue>,
	immediate: boolean,
	ruleIterator: IRuleIterator,
	leafUnsubscribers?: IUnsubscribe[],
	leafUnsubscribersCount?: number[],
	propertiesPath?: () => string,
	propertyName?: string,
	parent?: any,
): IUnsubscribeOrVoid {
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
			valueSubscriber,
			immediate,
			ruleIterator,
			leafUnsubscribers,
			leafUnsubscribersCount,
			propertiesPath,
			propertyName,
			parent,
		)
	} catch (err) {
		catchHandler(err, propertiesPath)
		return null
	}
}

export function deepSubscribeRule<TValue>({
	object,
	subscribeValue,
	unsubscribeValue,
	lastValue,
	immediate = true,
	rule,
}: {
	object: any,
	subscribeValue?: ISubscribeValue<TValue>,
	unsubscribeValue?: IUnsubscribeValue<TValue>,
	lastValue?: ILastValue<TValue>,
	/** @deprecated Not implemented - always true */
	immediate?: boolean,
	rule: IRule,
}): IUnsubscribeOrVoid {
	return toSingleCall(deepSubscribeRuleIterator<TValue>(
		object,
		new ObjectSubscriber(subscribeValue, unsubscribeValue, lastValue),
		immediate,
		iterateRule(object, rule)[Symbol.iterator](),
	))
}

export function deepSubscribe<TObject, TValue, TValueKeys extends string | number = never>({
	object,
	subscribeValue,
	unsubscribeValue,
	lastValue,
	immediate = true,
	ruleBuilder,
}: {
	object: TObject,
	subscribeValue?: ISubscribeValue<TValue>,
	unsubscribeValue?: IUnsubscribeValue<TValue>,
	lastValue?: ILastValue<TValue>,
	/** @deprecated Not implemented - always true */
	immediate?: boolean,
	ruleBuilder: (ruleBuilder: RuleBuilder<TObject, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
}): IUnsubscribeOrVoid {
	return toSingleCall(deepSubscribeRule({
		object,
		subscribeValue,
		unsubscribeValue,
		lastValue,
		immediate,
		rule: ruleBuilder(new RuleBuilder<TObject, TValueKeys>()).result(),
	}))
}
