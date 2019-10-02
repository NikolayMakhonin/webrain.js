/* tslint:disable:no-shadowed-variable no-array-delete*/
import {isThenable} from '../../async/async'
import {resolveAsync} from '../../async/ThenableSync'
import {checkIsFuncOrNull, toSingleCall} from '../../helpers/helpers'
import {getObjectUniqueId} from '../../helpers/object-unique-id'
import {IUnsubscribe, IUnsubscribeOrVoid} from '../subjects/observable'
import {
	IChangeValue,
	ILastValue,
	IValueSubscriber,
	ValueChangeType,
	ValueKeyType,
} from './contracts/common'
import {IRuleSubscribe} from './contracts/rule-subscribe'
import {IRule, RuleType} from './contracts/rules'
import {INextRuleIterable, IRuleIterator, IRuleOrIterable, iterateRule, subscribeNextRule} from './iterate-rule'
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

function subscribeNext<TValue>(
	object: any,
	valueSubscriber: IValueSubscriber<TValue>,
	immediate: boolean,
	ruleIterator: IRuleIterator,
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
					unsubscribe = checkIsFuncOrNull(subscribeNext<TValue>(
						o,
						valueSubscriber,
						immediate,
						ruleIterator,
						propertiesPath,
						propertyName,
						parent,
						ruleDescription,
						iteration,
					))
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
	}

	// endregion

	let unsubscribers: Array<IUnsubscribe|IUnsubscribe[]>
	let unsubscribersCount: number[]

	if (isLeaf) {
		return valueSubscriber.change(
			propertyName,
			void 0,
			object,
			parent,
			ValueChangeType.Subscribe,
			null,
			propertiesPath,
			ruleDescription,
		)
	}

	function subscribeNode(rule: IRuleSubscribe, getNextRuleIterable: INextRuleIterable): IUnsubscribeOrVoid {
		const catchHandlerItem = (err, propertyName: string) => {
			catchHandler(err, () => (propertiesPath ? propertiesPath() + '.' : '')
				+ (propertyName == null ? '' : propertyName + '(' + rule.description + ')'))
		}

		const changeNext = (
			key: any,
			oldItem: any,
			newItem: any,
			changeType: ValueChangeType,
			keyType: ValueKeyType,
			parent: any,
			iterator?: IRuleIterator,
			iteration?: IteratorResult<IRuleOrIterable>,
		): void => {
			if ((changeType & ValueChangeType.Unsubscribe) !== 0
				&& oldItem instanceof Object && unsubscribers
			) {
				const itemUniqueId = getObjectUniqueId(oldItem)

				const unsubscribeCount = unsubscribersCount[itemUniqueId]
				if (unsubscribeCount) {
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
			}

			if ((changeType & ValueChangeType.Subscribe) !== 0) {
				let unsubscribe: IUnsubscribeOrVoid | IUnsubscribe[]
				let itemUniqueId: number

				if (newItem instanceof Object) {
					if (!unsubscribers) {
						unsubscribers = rule.unsubscribers // + '_' + (nextUnsubscribePropertyId++)
						unsubscribersCount = rule.unsubscribersCount
					}
					itemUniqueId = getObjectUniqueId(newItem)
					unsubscribe = unsubscribers[itemUniqueId]
				}

				if (unsubscribe) {
					unsubscribersCount[itemUniqueId]++
				} else {
					unsubscribe = checkIsFuncOrNull(subscribeNext(
						newItem,
						valueSubscriber,
						immediate,
						iterator,
						() => (propertiesPath ? propertiesPath() + '.' : '')
							+ (key + '(' + rule.description + ')'),
						key,
						parent,
						rule.description,
						iteration,
					))

					if (unsubscribe) {
						if (!(newItem instanceof Object)) {
							unsubscribe()

							throw new Error('You should not return unsubscribe function for non Object value.\n'
								+ 'For subscribe value types use their object wrappers: Number, Boolean, String classes.\n'
								+ `Unsubscribe function: ${unsubscribe}\nValue: ${newItem}\n`
								+ `Value property path: ${(propertiesPath ? propertiesPath() + '.' : '')
								+ (key + '(' + rule.description + ')')}`)
						} else {
							const chainUnsubscribe = unsubscribers[itemUniqueId]
							if (!chainUnsubscribe) {
								unsubscribers[itemUniqueId] = unsubscribe
								unsubscribersCount[itemUniqueId] = 1
							} else {
								if (Array.isArray(chainUnsubscribe)) {
									chainUnsubscribe.push(unsubscribe)
								} else {
									unsubscribers[itemUniqueId] = [chainUnsubscribe, unsubscribe]
									unsubscribersCount[itemUniqueId] = 1
								}
							}
						}
					}
				}
			}
		}

		const changeLeaf = (
			key: any,
			oldItem: any,
			newItem: any,
			changeType: ValueChangeType,
			keyType: ValueKeyType,
			parent: any,
		): void => {
			checkIsFuncOrNull(valueSubscriber.change(
				key,
				oldItem,
				newItem,
				parent,
				changeType,
				keyType,
				() => (propertiesPath ? propertiesPath() + '.' : '')
					+ (propertyName == null ? '' : propertyName + '(' + rule.description + ')'),
				rule.description,
			))
		}

		const changeItem = (
			key: any,
			oldItem: any,
			newItem: any,
			changeType: ValueChangeType,
			keyType: ValueKeyType,
		): void => {
			let oldIsLeaf
			if ((changeType & ValueChangeType.Unsubscribe) !== 0) {
				const oldItemIterator = getNextRuleIterable && getNextRuleIterable(oldItem)[Symbol.iterator]()
				const oldItemIteration = oldItemIterator && oldItemIterator.next()
				const isLeaf = !oldItemIteration || oldItemIteration.done
				if (isLeaf
					|| oldItemIteration.value.type !== RuleType.Never
						&& typeof oldItem !== 'undefined'
				) {
					oldIsLeaf = isLeaf && !(oldItem instanceof Object)
				}
			}

			let newIsLeaf
			let newItemIterator
			let newItemIteration
			if ((changeType & ValueChangeType.Subscribe) !== 0) {
				newItemIterator = getNextRuleIterable && getNextRuleIterable(newItem)[Symbol.iterator]()
				newItemIteration = newItemIterator && newItemIterator.next()
				const isLeaf = !newItemIteration || newItemIteration.done
				if (isLeaf
					|| newItemIteration.value.type !== RuleType.Never
						&& typeof newItem !== 'undefined'
				) {
					newIsLeaf = isLeaf && !(newItem instanceof Object)
				}
			}

			let itemParent = object
			if (keyType == null) {
				key = propertyName
				itemParent = parent
			}

			if (oldIsLeaf === newIsLeaf) {
				if (newIsLeaf != null) {
					if (newIsLeaf) {
						changeLeaf(key, oldItem, newItem, changeType, keyType, itemParent)
					} else {
						changeNext(key, oldItem, newItem, changeType, keyType, itemParent, newItemIterator, newItemIteration)
					}
				}
			} else {
				if (oldIsLeaf != null) {
					if (oldIsLeaf) {
						changeLeaf(key, oldItem, void 0, ValueChangeType.Unsubscribe, keyType, itemParent)
					} else {
						changeNext(key, oldItem, void 0, ValueChangeType.Unsubscribe, keyType, itemParent,
							newItemIterator, newItemIteration)
					}
				}
				if (newIsLeaf != null) {
					if (newIsLeaf) {
						changeLeaf(key, void 0, newItem, ValueChangeType.Subscribe, keyType, itemParent)
					} else {
						changeNext(key, void 0, newItem, ValueChangeType.Subscribe, keyType, itemParent,
							newItemIterator, newItemIteration)
					}
				}
			}
		}

		return checkIsFuncOrNull(rule.subscribe(
			object,
			immediate,
			(key, oldItem, newItem, changeType, keyType) => {
				oldItem = resolveAsync(oldItem)
				newItem = resolveAsync(newItem)
				if (!isThenable(oldItem) && !isThenable(newItem)) {
					try {
						changeItem(key, oldItem, newItem, changeType, keyType)
					} catch (err) {
						catchHandlerItem(err, key)
					}
					return
				}

				resolveAsync(
					resolveAsync(oldItem, o => {
						oldItem = o
						return newItem
					}, null, true),
					o => {
						newItem = o
						changeItem(key, oldItem, newItem, changeType, keyType)
					},
					err => { catchHandlerItem(err, key) })
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
	propertiesPath?: () => string,
	propertyName?: string,
	parent?: any,
): IUnsubscribeOrVoid {
	if (!immediate) {
		throw new Error('immediate == false is deprecated')
	}

	try {
		return subscribeNext(
			object,
			valueSubscriber,
			immediate,
			ruleIterator,
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
	changeValue,
	lastValue,
	immediate = true,
	rule,
}: {
	object: any,
	changeValue?: IChangeValue<TValue>,
	lastValue?: ILastValue<TValue>,
	/** @deprecated Not implemented - always true */
	immediate?: boolean,
	rule: IRule,
}): IUnsubscribeOrVoid {
	return toSingleCall(deepSubscribeRuleIterator<TValue>(
		object,
		new ObjectSubscriber(changeValue, lastValue),
		immediate,
		iterateRule(object, rule)[Symbol.iterator](),
	))
}

export function deepSubscribe<TObject, TValue, TValueKeys extends string | number = never>({
	object,
	changeValue,
	lastValue,
	immediate = true,
	ruleBuilder,
}: {
	object: TObject,
	changeValue?: IChangeValue<TValue>,
	lastValue?: ILastValue<TValue>,
	/** @deprecated Not implemented - always true */
	immediate?: boolean,
	ruleBuilder: (ruleBuilder: RuleBuilder<TObject, TValueKeys>) => RuleBuilder<TValue, TValueKeys>,
}): IUnsubscribeOrVoid {
	return toSingleCall(deepSubscribeRule({
		object,
		changeValue,
		lastValue,
		immediate,
		rule: ruleBuilder(new RuleBuilder<TObject, TValueKeys>()).result(),
	}))
}
