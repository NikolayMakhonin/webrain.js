/* tslint:disable:no-identical-functions */
import {checkIsFuncOrNull, isIterable} from '../../helpers/helpers'
import {VALUE_PROPERTY_DEFAULT} from '../../helpers/value-property'
import {IListChanged, ListChangedType} from '../../lists/contracts/IListChanged'
import {IMapChanged, MapChangedType} from '../../lists/contracts/IMapChanged'
import {ISetChanged, SetChangedType} from '../../lists/contracts/ISetChanged'
import {IPropertyChanged} from '../object/IPropertyChanged'
import {IUnsubscribe, IUnsubscribeOrVoid} from '../subjects/observable'
import {IPropertiesPath, ValueChangeType, ValueKeyType} from './contracts/common'
import {ANY} from './contracts/constants'
import {IChangeItem, IRuleSubscribe, ISubscribeObject} from './contracts/rule-subscribe'
import {IRule, RuleType} from './contracts/rules'
import {Rule} from './rules'

function forEachCollection<TItem>(
	iterable: Iterable<TItem>,
	changeItem: IChangeItem<TItem>,
	isSubscribe,
) {
	for (const item of iterable) {
		if (isSubscribe) {
			changeItem(null, void 0, item, ValueChangeType.Subscribe, ValueKeyType.CollectionAny)
		} else {
			changeItem(null, item, void 0, ValueChangeType.Unsubscribe, ValueKeyType.CollectionAny)
		}
	}
}

// region subscribeObjectValue

function getFirstExistProperty(object: object, propertyNames: string[]) {
	for (let i = 0, len = propertyNames.length; i < len; i++) {
		const propertyName = propertyNames[i]
		if (allowSubscribePrototype
			? propertyName in object
			: Object.prototype.hasOwnProperty.call(object, propertyName)
		) {
			return propertyName
		}
	}
	return null
}

function subscribeObjectValue<TValue>(
	propertyNames: string[],
	object: IPropertyChanged,
	immediateSubscribe: boolean,
	changeItem: IChangeItem<TValue>,
	propertiesPath: IPropertiesPath,
	rule?: IRule,
): IUnsubscribeOrVoid {
	if (!(object instanceof Object)) {
		changeItem(null, void 0, object as any, ValueChangeType.Subscribe, null)
		return null
	}

	if (object.constructor === Object
		|| Array.isArray(object)
	) {
		changeItem(null, void 0, object as any, ValueChangeType.Subscribe, null)
		return () => {
			changeItem(null, object as any, void 0, ValueChangeType.Unsubscribe, null)
		}
	}

	let subscribePropertyName

	const getSubscribePropertyName = () => {
		if (allowSubscribePrototype
			? !(VALUE_PROPERTY_DEFAULT in object)
			: !Object.prototype.hasOwnProperty.call(object, VALUE_PROPERTY_DEFAULT)
		) {
			return null
		}

		const propertyName = getFirstExistProperty(object, propertyNames)
		if (propertyName == null) {
			return VALUE_PROPERTY_DEFAULT
		}

		return propertyName
	}

	const subscribeProperty = (propertyName, isFirst: boolean) => {
		subscribePropertyName = propertyName
		if (propertyName == null) {
			changeItem(null, void 0, object as any, ValueChangeType.Subscribe, null)
		} else {
			const value = object[propertyName]
			if (typeof value !== 'undefined') {
				changeItem(propertyName, void 0, value, ValueChangeType.Subscribe, ValueKeyType.ValueProperty)
			}
			if (isFirst) {
				changeItem(propertyName, void 0, void 0, ValueChangeType.Subscribe, ValueKeyType.ValueProperty)
			}
		}
	}

	const unsubscribeProperty = (isLast: boolean) => {
		if (subscribePropertyName == null) {
			changeItem(null, object as any, void 0, ValueChangeType.Unsubscribe, null)
		} else {
			if (isLast) {
				changeItem(subscribePropertyName, void 0, void 0, ValueChangeType.Unsubscribe, ValueKeyType.ValueProperty)
			}
			const value = object[subscribePropertyName]
			if (typeof value !== 'undefined') {
				changeItem(subscribePropertyName, value, void 0,
					ValueChangeType.Unsubscribe, ValueKeyType.ValueProperty)
			}
		}
		subscribePropertyName = null
	}

	const {propertyChanged} = object
	let unsubscribe
	let subscribed
	if (propertyChanged) {
		unsubscribe = checkIsFuncOrNull(propertyChanged
			.subscribe(({name, oldValue, newValue}) => {
				if (!subscribed || !unsubscribe && oldValue === newValue) {
					return
				}

				const newSubscribePropertyName = getSubscribePropertyName()

				if (name === subscribePropertyName) {
					if (subscribePropertyName === newSubscribePropertyName
						&& subscribePropertyName != null
						&& unsubscribe != null
						&& typeof oldValue !== 'undefined'
						&& typeof newValue !== 'undefined'
					) {
						changeItem(subscribePropertyName, oldValue, newValue,
							ValueChangeType.Changed,
							ValueKeyType.ValueProperty)
						return
					}
					if (typeof oldValue !== 'undefined') {
						changeItem(subscribePropertyName, oldValue, void 0, ValueChangeType.Unsubscribe, ValueKeyType.ValueProperty)
					}
				} else if (subscribePropertyName !== newSubscribePropertyName) {
					unsubscribeProperty(false)
				} else {
					return
				}

				if (unsubscribe != null) {
					subscribeProperty(newSubscribePropertyName, false)
				}
			}, { propertiesPath, rule }))
	}

	if (immediateSubscribe) {
		subscribeProperty(getSubscribePropertyName(), true)
	} else if (unsubscribe == null) {
		return null
	}

	subscribed = true

	return () => {
		let _unsubscribe
		if (unsubscribe) {
			_unsubscribe = unsubscribe
			unsubscribe = null
		}

		unsubscribeProperty(true)

		if (_unsubscribe) {
			_unsubscribe()
		}
	}
}

// endregion

// region subscribeObject

const allowSubscribePrototype = true

export function hasDefaultProperty(object: object) {
	return object instanceof Object
		&& (
			allowSubscribePrototype
				? VALUE_PROPERTY_DEFAULT in object
				: Object.prototype.hasOwnProperty.call(object, VALUE_PROPERTY_DEFAULT)
		)
		&& object.constructor !== Object
		&& !Array.isArray(object)
}

function subscribeObject<TValue>(
	propertyNames: string|string[],
	propertyPredicate: (propertyName, object) => boolean,
	object: IPropertyChanged,
	immediateSubscribe: boolean,
	changeItem: IChangeItem<TValue>,
	propertiesPath: IPropertiesPath,
	rule?: IRule,
): IUnsubscribeOrVoid {
	if (!(object instanceof Object)) {
		return null
	}

	const {propertyChanged} = object
	let unsubscribe
	let subscribed
	if (propertyChanged) {
		unsubscribe = checkIsFuncOrNull(propertyChanged
			.subscribe(({name, oldValue, newValue}) => {
				if (!subscribed || !unsubscribe && oldValue === newValue) {
					return
				}

				 // PROF: 623 - 1.3%
				if (!propertyPredicate || propertyPredicate(name, object)) {
					if (unsubscribe
						&& typeof oldValue !== 'undefined'
						&& typeof newValue !== 'undefined'
					) {
						changeItem(name, oldValue, newValue,
							ValueChangeType.Changed,
							ValueKeyType.Property)
					} else {
						if (typeof oldValue !== 'undefined') {
							changeItem(name, oldValue, void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property)
						}
						if (unsubscribe && typeof newValue !== 'undefined') {
							changeItem(name, void 0, newValue, ValueChangeType.Subscribe, ValueKeyType.Property)
						}
					}
				}
			}, { propertiesPath, rule }))
	}

	const forEach = (isSubscribe: boolean) => {
		if (propertyNames == null) {
			for (const propertyName in object) {
				if ((allowSubscribePrototype || Object.prototype.hasOwnProperty.call(object, propertyName))
					&& (!propertyPredicate || propertyPredicate(propertyName, object))
				) {
					if (isSubscribe) {
						changeItem(propertyName, void 0, object[propertyName], ValueChangeType.Subscribe, ValueKeyType.Property)
					} else {
						changeItem(propertyName, object[propertyName], void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property)
					}
				}
			}
		} else {
			if (Array.isArray(propertyNames)) {
				for (let i = 0, len = propertyNames.length; i < len; i++) {
					const propertyName = propertyNames[i]
					if (!isSubscribe) {
						changeItem(propertyName, void 0, void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property)
					}
					if ((allowSubscribePrototype
						? propertyName in object
						: Object.prototype.hasOwnProperty.call(object, propertyName))
					) {
						const value = object[propertyName]
						if (typeof value !== 'undefined') {
							if (isSubscribe) {
								changeItem(propertyName, void 0, value, ValueChangeType.Subscribe, ValueKeyType.Property)
							} else {
								changeItem(propertyName, value, void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property)
							}
						}
					}
					if (isSubscribe) {
						changeItem(propertyName, void 0, void 0, ValueChangeType.Subscribe, ValueKeyType.Property)
					}
				}
			} else {
				if (!isSubscribe) {
					changeItem(propertyNames, void 0, void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property)
				}
				if ((allowSubscribePrototype
					? propertyNames in object
					: Object.prototype.hasOwnProperty.call(object, propertyNames))
				) {
					const value = object[propertyNames]
					if (typeof value !== 'undefined') {
						if (isSubscribe) {
							changeItem(propertyNames, void 0, value, ValueChangeType.Subscribe, ValueKeyType.Property)
						} else {
							changeItem(propertyNames, value, void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property)
						}
					}
				}
				if (isSubscribe) {
					changeItem(propertyNames, void 0, void 0, ValueChangeType.Subscribe, ValueKeyType.Property)
				}
			}
		}
	}

	if (immediateSubscribe) {
		forEach(true)
	} else if (unsubscribe == null) {
		return null
	}

	subscribed = true

	return () => {
		let _unsubscribe
		if (unsubscribe) {
			_unsubscribe = unsubscribe
			unsubscribe = null
		}

		forEach(false)

		if (_unsubscribe) {
			_unsubscribe()
		}
	}
}

// endregion

// region subscribeIterable

function subscribeIterable<TItem>(
	object: Iterable<TItem>,
	immediateSubscribe: boolean,
	changeItem: IChangeItem<TItem>,
): IUnsubscribeOrVoid {
	if (!object || typeof object === 'string' || !isIterable(object)) {
		return null
	}

	if (immediateSubscribe) {
		forEachCollection(object, changeItem, true)
	} else {
		return null
	}
	
	return () => {
		forEachCollection(object, changeItem, false)
	}
}

// endregion

// region subscribeList

function subscribeList<TItem>(
	object: IListChanged<TItem> & Iterable<TItem>,
	immediateSubscribe: boolean,
	changeItem: IChangeItem<TItem>,
	propertiesPath: IPropertiesPath,
	rule?: IRule,
): IUnsubscribeOrVoid {
	if (!object || object[Symbol.toStringTag] !== 'List') {
		return null
	}

	const {listChanged} = object
	let unsubscribe
	let subscribed
	if (listChanged) {
		unsubscribe = checkIsFuncOrNull(listChanged
			.subscribe(({type, oldItems, newItems}) => {
				if (!subscribed) {
					return
				}

				switch (type) {
					case ListChangedType.Added:
						if (unsubscribe) {
							for (let i = 0, len = newItems.length; i < len; i++) {
								changeItem(null, void 0, newItems[i], ValueChangeType.Subscribe, ValueKeyType.CollectionAny)
							}
						}
						break
					case ListChangedType.Removed:
						for (let i = 0, len = oldItems.length; i < len; i++) {
							changeItem(null, oldItems[i], void 0, ValueChangeType.Unsubscribe, ValueKeyType.CollectionAny)
						}
						break
					case ListChangedType.Set:
						if (unsubscribe) {
							changeItem(null, oldItems[0], newItems[0],
								ValueChangeType.Changed,
								ValueKeyType.CollectionAny)
						} else if (oldItems[0] !== newItems[0]) {
							changeItem(null, oldItems[0], void 0, ValueChangeType.Unsubscribe, ValueKeyType.CollectionAny)
						}
						break
				}
			}, { propertiesPath, rule }))
	}

	if (immediateSubscribe) {
		forEachCollection(object, changeItem, true)
	} else if (unsubscribe == null) {
		return null
	}

	subscribed = true

	return () => {
		let _unsubscribe
		if (unsubscribe) {
			_unsubscribe = unsubscribe
			unsubscribe = null
		}

		forEachCollection(object, changeItem, false)

		if (_unsubscribe) {
			_unsubscribe()
		}
	}
}

// endregion

// region subscribeSet

function subscribeSet<TItem>(
	object: ISetChanged<TItem> & Iterable<TItem>,
	immediateSubscribe: boolean,
	changeItem: IChangeItem<TItem>,
	propertiesPath: IPropertiesPath,
	rule?: IRule,
): IUnsubscribeOrVoid {
	if (!object || object[Symbol.toStringTag] !== 'Set' && !(object instanceof Set)) {
		return null
	}

	const {setChanged} = object
	let unsubscribe
	let subscribed
	if (setChanged) {
		unsubscribe = checkIsFuncOrNull(setChanged
			.subscribe(({type, oldItems, newItems}) => {
				if (!subscribed) {
					return
				}

				switch (type) {
					case SetChangedType.Added:
						if (unsubscribe) {
							for (let i = 0, len = newItems.length; i < len; i++) {
								changeItem(null, void 0, newItems[i], ValueChangeType.Subscribe, ValueKeyType.CollectionAny)
							}
						}
						break
					case SetChangedType.Removed:
						for (let i = 0, len = oldItems.length; i < len; i++) {
							changeItem(null, oldItems[i], void 0, ValueChangeType.Unsubscribe, ValueKeyType.CollectionAny)
						}
						break
				}
			}, { propertiesPath, rule }))
	}

	if (immediateSubscribe) {
		forEachCollection(object, changeItem, true)
	} else if (unsubscribe == null) {
		return null
	}

	subscribed = true

	return () => {
		let _unsubscribe
		if (unsubscribe) {
			_unsubscribe = unsubscribe
			unsubscribe = null
		}

		forEachCollection(object, changeItem, false)

		if (_unsubscribe) {
			_unsubscribe()
		}
	}
}

// endregion

// region subscribeMap

function subscribeMap<K, V>(
	keys: K[],
	keyPredicate: (key, object) => boolean,
	object: IMapChanged<K, V> & Map<K, V>,
	immediateSubscribe: boolean,
	changeItem: IChangeItem<V>,
	propertiesPath: IPropertiesPath,
	rule?: IRule,
): IUnsubscribeOrVoid {
	if (!object || object[Symbol.toStringTag] !== 'Map' && !(object instanceof Map)) {
		return null
	}

	const {mapChanged} = object
	let unsubscribe
	let subscribed
	if (mapChanged) {
		unsubscribe = checkIsFuncOrNull(mapChanged
			.subscribe(({type, key, oldValue, newValue}) => {
				if (!subscribed || !unsubscribe && oldValue === newValue) {
					return
				}

				if (!keyPredicate || keyPredicate(key, object)) {
					switch (type) {
						case MapChangedType.Added:
							if (unsubscribe) {
								changeItem(key, void 0, newValue, ValueChangeType.Subscribe, ValueKeyType.MapKey)
							}
							break
						case MapChangedType.Removed:
							changeItem(key, oldValue, void 0, ValueChangeType.Unsubscribe, ValueKeyType.MapKey)
							break
						case MapChangedType.Set:
							if (unsubscribe) {
								changeItem(key, oldValue, newValue, ValueChangeType.Changed, ValueKeyType.MapKey)
							} else {
								changeItem(key, oldValue, void 0, ValueChangeType.Unsubscribe, ValueKeyType.MapKey)
							}
							break
					}
				}
			}, { propertiesPath, rule }))
	}

	const forEach = (isSubscribe: boolean) => {
		if (keys) {
			for (let i = 0, len = keys.length; i < len; i++) {
				const key = keys[i]
				if (!isSubscribe) {
					changeItem(key, void 0, void 0, ValueChangeType.Unsubscribe, ValueKeyType.MapKey)
				}
				if (object.has(key)) {
					if (isSubscribe) {
						changeItem(key, void 0, object.get(key), ValueChangeType.Subscribe, ValueKeyType.MapKey)
					} else {
						changeItem(key, object.get(key), void 0, ValueChangeType.Unsubscribe, ValueKeyType.MapKey)
					}
				}
				if (isSubscribe) {
					changeItem(key, void 0, void 0, ValueChangeType.Subscribe, ValueKeyType.MapKey)
				}
			}
		} else {
			for (const entry of object) {
				if (!keyPredicate || keyPredicate(entry[0], object)) {
					if (isSubscribe) {
						changeItem(entry[0], void 0, entry[1], ValueChangeType.Subscribe, ValueKeyType.MapKey)
					} else {
						changeItem(entry[0], entry[1], void 0, ValueChangeType.Unsubscribe, ValueKeyType.MapKey)
					}
				}
			}
		}
	}

	if (immediateSubscribe) {
		forEach(true)
	} else if (unsubscribe == null) {
		return null
	}

	subscribed = true

	return () => {
		let _unsubscribe
		if (unsubscribe) {
			_unsubscribe = unsubscribe
			unsubscribe = null
		}

		forEach(false)

		if (_unsubscribe) {
			_unsubscribe()
		}
	}
}

// endregion

// region subscribeCollection

function subscribeCollection<TItem>(
	object: Iterable<TItem>,
	immediateSubscribe: boolean,
	changeItem: IChangeItem<TItem>,
	propertiesPath: IPropertiesPath,
	rule?: IRule,
): IUnsubscribeOrVoid {
	if (!object) {
		return null
	}

	const unsubscribeList = subscribeList(object as any, immediateSubscribe, changeItem, propertiesPath, rule)
	const unsubscribeSet = subscribeSet(object as any, immediateSubscribe, changeItem, propertiesPath, rule)
	const unsubscribeMap = subscribeMap(null, null, object as any,
		immediateSubscribe, changeItem, propertiesPath, rule)
	let unsubscribeIterable
	if (!unsubscribeList && !unsubscribeSet && !unsubscribeMap) {
		unsubscribeIterable = subscribeIterable(object as any, immediateSubscribe, changeItem)
		if (!unsubscribeIterable) {
			return null
		}
	}

	return () => {
		if (unsubscribeList) {
			unsubscribeList()
		}
		if (unsubscribeSet) {
			unsubscribeSet()
		}
		if (unsubscribeMap) {
			unsubscribeMap()
		}
		if (unsubscribeIterable) {
			unsubscribeIterable()
		}
	}
}

// endregion

// endregion

// region RuleSubscribeObject

function createPropertyPredicate(propertyNames: string[]) {
	if (!propertyNames || !propertyNames.length) {
		return null
	}

	if (propertyNames.length === 1) {
		const propertyName = propertyNames[0] + ''

		if (propertyName === ANY) {
			return null
		}

		return (propName: string) => {
			// PROF: 226 - 0.5%
			return propName === propertyName
		}
	} else {
		const propertyNamesMap = {}
		for (let i = 0, len = propertyNames.length; i < len; i++) {
			const propertyName = propertyNames[i] + ''

			if (propertyName === ANY) {
				return null
			}

			propertyNamesMap[propertyName] = true
		}

		return (propName: string) => {
			return !!propertyNamesMap[propName]
		}
	}
}

export enum SubscribeObjectType {
	Property,
	ValueProperty,
}

export abstract class RuleSubscribe<TObject = any, TChild = any>
	extends Rule
	implements IRuleSubscribe<TObject, TChild>
{
	public readonly subscribe: ISubscribeObject<TObject, TChild>
	public readonly unsubscribers: IUnsubscribe[]
	public readonly unsubscribersCount: number[]

	protected constructor(description: string) {
		super(RuleType.Action, description)
	}

	public clone(): IRuleSubscribe<TObject, TChild> {
		const clone = super.clone() as IRuleSubscribe<TObject, TChild>
		const {subscribe} = this

		if (subscribe != null) {
			(clone as any).subscribe = subscribe
		}
		if (this.unsubscribers) {
			(clone as any).unsubscribers = []
		}
		if (this.unsubscribersCount) {
			(clone as any).unsubscribersCount = []
		}

		return clone
	}
}

export class RuleSubscribeObject<TObject, TValue>
	extends RuleSubscribe<TObject, TValue>
	implements IRuleSubscribe<TObject, TValue>
{
	constructor(
		type: SubscribeObjectType,
		propertyPredicate: (propertyName: string, object) => boolean,
		description: string,
		...propertyNames: string[]
	) {
		super(description)

		if (propertyNames && !propertyNames.length) {
			propertyNames = null
		}

		if (propertyPredicate) {
			if (typeof propertyPredicate !== 'function') {
				throw new Error(`propertyPredicate (${propertyPredicate}) is not a function`)
			}
		} else if (type === SubscribeObjectType.Property) {
			propertyPredicate = createPropertyPredicate(propertyNames)
			if (!propertyPredicate) {
				propertyNames = null
			}
		}

		switch (type) {
			case SubscribeObjectType.Property:
				// @ts-ignore
				this.subscribe = subscribeObject.bind(
					null,
					propertyNames,
					propertyPredicate,
				)
				break
			case SubscribeObjectType.ValueProperty:
				this.subType = type
				// @ts-ignore
				this.subscribe = subscribeObjectValue.bind(
					null,
					propertyNames,
				)
				break
			default:
				throw new Error(`Unknown SubscribeObjectType: ${type}`)
		}
	}
}

// endregion

// region RuleSubscribeMap

function createKeyPredicate<TKey>(keys: TKey[]) {
	if (!keys || !keys.length) {
		return null
	}

	if (keys.length === 1) {
		const key = keys[0]

		// @ts-ignore
		if (key === ANY) {
			return null
		}

		return (k: TKey) => {
			return k === key
		}
	} else {
		for (let i = 0, len = keys.length; i < len; i++) {
			const key = keys[i]
			// @ts-ignore
			if (key === ANY) {
				return null
			}
		}

		return (k: TKey) => {
			return keys.indexOf(k) >= 0
		}
	}
}

export class RuleSubscribeMap<TObject extends Map<K, V>, K, V>
	extends RuleSubscribe<TObject, V>
	implements IRuleSubscribe<TObject, V>
{
	constructor(
		keyPredicate: (key: K, object) => boolean,
		description: string,
		...keys: K[]
	) {
		super(description)

		if (keys && !keys.length) {
			keys = null
		}

		if (keyPredicate) {
			if (typeof keyPredicate !== 'function') {
				throw new Error(`keyPredicate (${keyPredicate}) is not a function`)
			}
		} else {
			keyPredicate = createKeyPredicate(keys)
			if (!keyPredicate) {
				keys = null
			}
		}

		// @ts-ignore
		this.subscribe = subscribeMap.bind(
			null,
			keys,
			keyPredicate,
		)
	}
}

// endregion

// region RuleSubscribeCollection

export class RuleSubscribeCollection<TObject extends Iterable<TItem>, TItem>
	extends RuleSubscribe<TObject, TItem>
	implements IRuleSubscribe<TObject, TItem>
{
	constructor(description: string) {
		super(description)

		// @ts-ignore
		this.subscribe = subscribeCollection
	}
}

// endregion
