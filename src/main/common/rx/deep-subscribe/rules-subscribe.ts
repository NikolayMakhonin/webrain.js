/* tslint:disable:no-identical-functions */
import {checkIsFuncOrNull, isIterable, VALUE_PROPERTY_DEFAULT} from '../../helpers/helpers'
import {IListChanged, ListChangedType} from '../../lists/contracts/IListChanged'
import {IMapChanged, MapChangedType} from '../../lists/contracts/IMapChanged'
import {ISetChanged, SetChangedType} from '../../lists/contracts/ISetChanged'
import {IPropertyChanged} from '../object/IPropertyChanged'
import {IUnsubscribe} from '../subjects/subject'
import {ANY, COLLECTION_PREFIX, VALUE_PROPERTY_PREFIX} from './contracts/constants'
import {IRuleSubscribe, ISubscribeObject} from './contracts/rule-subscribe'
import {RuleType} from './contracts/rules'
import {Rule} from './rules'

function forEachSimple<TItem>(iterable: Iterable<TItem>, callbackfn: (item: TItem, debugPropertyName: string) => void) {
	for (const item of iterable) {
		callbackfn(item, COLLECTION_PREFIX)
	}
}

// region subscribeObject

function getFirstExistProperty(object: object, propertyNames: string[]) {
	for (let i = 0, len = propertyNames.length; i < len; i++) {
		const propertyName = propertyNames[i]
		if (Object.prototype.hasOwnProperty.call(object, propertyName)) {
			return propertyName
		}
	}
	return null
}

function subscribeObjectValue<TValue>(
	propertyNames: string[],
	object: IPropertyChanged,
	immediateSubscribe: boolean,
	subscribeItem: (item: TValue, debugPropertyName: string) => void,
	unsubscribeItem: (item: TValue, debugPropertyName: string) => void,
): IUnsubscribe {
	if (!(object instanceof Object)
		|| object.constructor === Object
		|| Array.isArray(object)
	) {
		subscribeItem(object as any, null)
		return () => {
			unsubscribeItem(object as any, null)
		}
	}

	let subscribePropertyName

	const getSubscribePropertyName = () => {
		if (!Object.prototype.hasOwnProperty.call(object, VALUE_PROPERTY_DEFAULT)) {
			return null
		}

		const propertyName = getFirstExistProperty(object, propertyNames)
		if (propertyName == null) {
			return VALUE_PROPERTY_DEFAULT
		}

		return propertyName
	}

	const subscribeProperty = propertyName => {
		subscribePropertyName = propertyName
		if (propertyName == null) {
			subscribeItem(object as any, null)
		} else {
			subscribeItem(object[propertyName], VALUE_PROPERTY_PREFIX + propertyName)
		}
	}

	const unsubscribeProperty = () => {
		if (subscribePropertyName == null) {
			unsubscribeItem(object as any, null)
		} else {
			unsubscribeItem(object[subscribePropertyName], VALUE_PROPERTY_PREFIX + subscribePropertyName)
		}
		subscribePropertyName = null
	}

	const {propertyChanged} = object
	let unsubscribe

	if (propertyChanged) {
		unsubscribe = checkIsFuncOrNull(propertyChanged
			.subscribe(({name, oldValue}) => {
				const newSubscribePropertyName = getSubscribePropertyName()

				if (name === subscribePropertyName) {
					if (typeof oldValue !== 'undefined') {
						unsubscribeItem(oldValue, VALUE_PROPERTY_PREFIX + subscribePropertyName)
					}
				} else if (subscribePropertyName !== newSubscribePropertyName) {
					unsubscribeProperty()
				}

				if (unsubscribe != null) {
					subscribeProperty(newSubscribePropertyName)
				}
			}))
	}

	if (immediateSubscribe) {
		subscribeProperty(getSubscribePropertyName())
	} else if (unsubscribe == null) {
		return null
	}

	return () => {
		if (unsubscribe) {
			unsubscribe()
			unsubscribe = null
		}
		unsubscribeProperty()
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

export function subscribeDefaultProperty<TValue>(
	object: IPropertyChanged,
	immediateSubscribe: boolean,
	subscribeItem: (item: TValue, debugPropertyName: string) => IUnsubscribe,
) {
	let unsubscribe
	return subscribeObject<TValue>(
		VALUE_PROPERTY_DEFAULT,
		o => o === VALUE_PROPERTY_DEFAULT,
		object,
		immediateSubscribe,
		(item, debugPropertyName) => {
			unsubscribe = subscribeItem(item, debugPropertyName)
		},
		() => {
			if (unsubscribe) {
				unsubscribe()
			}
		})
}

function subscribeObject<TValue>(
	propertyNames: string|string[],
	propertyPredicate: (propertyName, object) => boolean,
	object: IPropertyChanged,
	immediateSubscribe: boolean,
	subscribeItem: (item: TValue, debugPropertyName: string) => void,
	unsubscribeItem: (item: TValue, debugPropertyName: string) => void,
): IUnsubscribe {
	if (!(object instanceof Object)) {
		return null
	}

	let unsubscribe
	if (propertyNames !== VALUE_PROPERTY_DEFAULT && hasDefaultProperty(object)) {
		unsubscribe = subscribeDefaultProperty(
			object,
			immediateSubscribe,
			item => subscribeObject(
				propertyNames,
				propertyPredicate,
				item as any,
				immediateSubscribe,
				subscribeItem,
				unsubscribeItem),
		)

		if (unsubscribe) {
			return unsubscribe
		}
	}

	const {propertyChanged} = object

	if (propertyChanged) {
		unsubscribe = checkIsFuncOrNull(propertyChanged
			.subscribe(({name, oldValue, newValue}) => {
				 // PROF: 623 - 1.3%
				if (!propertyPredicate || propertyPredicate(name, object)) {
					if (typeof oldValue !== 'undefined') {
						unsubscribeItem(oldValue, name + '')
					}
					if (unsubscribe && typeof newValue !== 'undefined') {
						subscribeItem(newValue, name + '')
					}
				}
			}))
	}

	const forEach = (callbackfn: (item: TValue, debugPropertyName: string) => void) => {
		if (propertyNames) {
			if (Array.isArray(propertyNames)) {
				for (let i = 0, len = propertyNames.length; i < len; i++) {
					const propertyName = propertyNames[i]
					if (allowSubscribePrototype
						? propertyName in object
						: Object.prototype.hasOwnProperty.call(object, propertyName)) {
						callbackfn(object[propertyName], propertyName)
					}
				}
			} else {
				if (allowSubscribePrototype
					? propertyNames in object
					: Object.prototype.hasOwnProperty.call(object, propertyNames)) {
					callbackfn(object[propertyNames], propertyNames)
				}
			}
		} else {
			for (const propertyName in object) {
				if ((allowSubscribePrototype || Object.prototype.hasOwnProperty.call(object, propertyName))
					&& (!propertyPredicate || propertyPredicate(propertyName, object))
				) {
					callbackfn(object[propertyName], propertyName)
				}
			}
		}
	}
	
	if (immediateSubscribe) {
		forEach(subscribeItem)
	} else if (unsubscribe == null) {
		return null
	}

	return () => {
		if (unsubscribe) {
			unsubscribe()
			unsubscribe = null
		}
		forEach(unsubscribeItem)
	}
}

// endregion

// region subscribeIterable

function subscribeIterable<TItem>(
	object: Iterable<TItem>,
	immediateSubscribe: boolean,
	subscribeItem: (item: TItem, debugPropertyName: string) => void,
	unsubscribeItem: (item: TItem, debugPropertyName: string) => void,
): IUnsubscribe {
	if (!object || !isIterable(object)) {
		return null
	}

	const forEach = (callbackfn: (item: TItem, debugPropertyName: string) => void) => {
		for (const item of object) {
			callbackfn(item, COLLECTION_PREFIX)
		}
	}

	if (immediateSubscribe) {
		forEach(subscribeItem)
	} else {
		return null
	}
	
	return () => {
		forEach(unsubscribeItem)
	}
}

// endregion

// region subscribeList

function subscribeList<TItem>(
	object: IListChanged<TItem> & Iterable<TItem>,
	immediateSubscribe: boolean,
	subscribeItem: (item: TItem, debugPropertyName: string) => void,
	unsubscribeItem: (item: TItem, debugPropertyName: string) => void,
): IUnsubscribe {
	if (!object || object[Symbol.toStringTag] !== 'List') {
		return null
	}

	const {listChanged} = object
	let unsubscribe
	if (listChanged) {
		unsubscribe = checkIsFuncOrNull(listChanged
			.subscribe(({type, oldItems, newItems}) => {
				switch (type) {
					case ListChangedType.Added:
						if (unsubscribe) {
							for (let i = 0, len = newItems.length; i < len; i++) {
								subscribeItem(newItems[i], COLLECTION_PREFIX)
							}
						}
						break
					case ListChangedType.Removed:
						for (let i = 0, len = oldItems.length; i < len; i++) {
							unsubscribeItem(oldItems[i], COLLECTION_PREFIX)
						}
						break
					case ListChangedType.Set:
						unsubscribeItem(oldItems[0], COLLECTION_PREFIX)
						if (unsubscribe) {
							subscribeItem(newItems[0], COLLECTION_PREFIX)
						}
						break
				}
			}))
	}

	if (immediateSubscribe) {
		forEachSimple(object, subscribeItem)
	} else if (unsubscribe == null) {
		return null
	}

	return () => {
		if (unsubscribe) {
			unsubscribe()
			unsubscribe = null
		}
		forEachSimple(object, unsubscribeItem)
	}
}

// endregion

// region subscribeSet

function subscribeSet<TItem>(
	object: ISetChanged<TItem> & Iterable<TItem>,
	immediateSubscribe: boolean,
	subscribeItem: (item: TItem, debugPropertyName: string) => void,
	unsubscribeItem: (item: TItem, debugPropertyName: string) => void,
): IUnsubscribe {
	if (!object || object[Symbol.toStringTag] !== 'Set' && !(object instanceof Set)) {
		return null
	}

	const {setChanged} = object
	let unsubscribe
	if (setChanged) {
		unsubscribe = checkIsFuncOrNull(setChanged
			.subscribe(({type, oldItems, newItems}) => {
				switch (type) {
					case SetChangedType.Added:
						if (unsubscribe) {
							for (let i = 0, len = newItems.length; i < len; i++) {
								subscribeItem(newItems[i], COLLECTION_PREFIX)
							}
						}
						break
					case SetChangedType.Removed:
						for (let i = 0, len = oldItems.length; i < len; i++) {
							unsubscribeItem(oldItems[i], COLLECTION_PREFIX)
						}
						break
				}
			}))
	}

	if (immediateSubscribe) {
		forEachSimple(object, subscribeItem)
	} else if (unsubscribe == null) {
		return null
	}

	return () => {
		if (unsubscribe) {
			unsubscribe()
			unsubscribe = null
		}
		forEachSimple(object, unsubscribeItem)
	}
}

// endregion

// region subscribeMap

function subscribeMap<K, V>(
	keys: K[],
	keyPredicate: (key, object) => boolean,
	object: IMapChanged<K, V> & Map<K, V>,
	immediateSubscribe: boolean,
	subscribeItem: (item: V, debugPropertyName: string) => void,
	unsubscribeItem: (item: V, debugPropertyName: string) => void,
): IUnsubscribe {
	if (!object || object[Symbol.toStringTag] !== 'Map' && !(object instanceof Map)) {
		return null
	}

	const {mapChanged} = object
	let unsubscribe

	if (mapChanged) {
		unsubscribe = checkIsFuncOrNull(mapChanged
			.subscribe(({type, key, oldValue, newValue}) => {
				if (!keyPredicate || keyPredicate(key, object)) {
					switch (type) {
						case MapChangedType.Added:
							if (unsubscribe) {
								subscribeItem(newValue, COLLECTION_PREFIX + key)
							}
							break
						case MapChangedType.Removed:
							unsubscribeItem(oldValue, COLLECTION_PREFIX + key)
							break
						case MapChangedType.Set:
							unsubscribeItem(oldValue, COLLECTION_PREFIX + key)
							if (unsubscribe) {
								subscribeItem(newValue, COLLECTION_PREFIX + key)
							}
							break
					}
				}
			}))
	}

	const forEach = (callbackfn: (item: V, debugPropertyName: string) => void) => {
		if (keys) {
			for (let i = 0, len = keys.length; i < len; i++) {
				const key = keys[i]
				if (object.has(key)) {
					callbackfn(object.get(key), COLLECTION_PREFIX + key)
				}
			}
		} else {
			for (const entry of object) {
				if (!keyPredicate || keyPredicate(entry[0], object)) {
					callbackfn(entry[1], COLLECTION_PREFIX + entry[0])
				}
			}
		}
	}

	if (immediateSubscribe) {
		forEach(subscribeItem)
	} else if (unsubscribe == null) {
		return null
	}

	return () => {
		if (unsubscribe) {
			unsubscribe()
			unsubscribe = null
		}
		forEach(unsubscribeItem)
	}
}

// endregion

// region subscribeCollection

function subscribeCollection<TItem>(
	object: Iterable<TItem>,
	immediateSubscribe: boolean,
	subscribeItem: (item: TItem, debugPropertyName: string) => void,
	unsubscribeItem: (item: TItem, debugPropertyName: string) => void,
): IUnsubscribe {
	if (!object) {
		return null
	}

	const unsubscribeList = subscribeList(object as any, immediateSubscribe, subscribeItem, unsubscribeItem)
	const unsubscribeSet = subscribeSet(object as any, immediateSubscribe, subscribeItem, unsubscribeItem)
	const unsubscribeMap = subscribeMap(null, null, object as any, immediateSubscribe, subscribeItem, unsubscribeItem)
	let unsubscribeIterable
	if (!unsubscribeList && !unsubscribeSet && !unsubscribeMap) {
		unsubscribeIterable = subscribeIterable(object as any, immediateSubscribe, subscribeItem, unsubscribeItem)
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
	public subscribe: ISubscribeObject<TObject, TChild>
	public readonly unsubscribers: IUnsubscribe[]

	protected constructor() {
		super(RuleType.Action)
	}

	public clone(): IRuleSubscribe<TObject, TChild> {
		const clone = super.clone() as IRuleSubscribe<TObject, TChild>
		const {subscribe} = this

		if (subscribe != null) {
			(clone as any).subscribe = subscribe
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
		propertyPredicate?: (propertyName: string, object) => boolean,
		...propertyNames: string[]
	) {
		super()

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
				this.subscribe = subscribeObject.bind(
					null,
					propertyNames,
					propertyPredicate,
				)
				break
			case SubscribeObjectType.ValueProperty:
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
		keyPredicate?: (key: K, object) => boolean,
		...keys: K[]
	) {
		super()

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
	constructor() {
		super()

		this.subscribe = subscribeCollection
	}
}

// endregion
