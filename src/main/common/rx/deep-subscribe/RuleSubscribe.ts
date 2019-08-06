/* tslint:disable:no-identical-functions */
import {isIterable} from '../../helpers/helpers'
import {IListChanged, ListChangedType} from '../../lists/contracts/IListChanged'
import {IMapChanged, MapChangedType} from '../../lists/contracts/IMapChanged'
import {IPropertyChanged} from '../../lists/contracts/IPropertyChanged'
import {ISetChanged, SetChangedType} from '../../lists/contracts/ISetChanged'
import {IUnsubscribe} from '../subjects/subject'
import {ANY, COLLECTION_PREFIX} from './contracts/constants'
import {IRuleSubscribe, ISubscribeObject} from './contracts/rule-subscribe'
import {IRule, RuleType} from './contracts/rules'
import {checkUnsubscribe} from './helpers/common'

// function propertyPredicateAll(propertyName: string, object) {
// 	return Object.prototype.hasOwnProperty.call(object, propertyName)
// }

// region subscribeObject

function subscribeObject<TValue>(
	propertyNames: string[],
	propertyPredicate: (propertyName, object) => boolean,
	object: IPropertyChanged,
	immediateSubscribe: boolean,
	subscribeItem: (item: TValue, debugPropertyName: string) => void,
	unsubscribeItem: (item: TValue, debugPropertyName: string) => void,
): IUnsubscribe {
	if (!(object instanceof Object)) {
		return null
	}

	const {propertyChanged} = object
	let unsubscribe

	if (propertyChanged) {
		unsubscribe = checkUnsubscribe(propertyChanged
			.subscribe(({name, oldValue, newValue}) => {
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
			for (let i = 0, len = propertyNames.length; i < len; i++) {
				const propertyName = propertyNames[i]
				if (Object.prototype.hasOwnProperty.call(object, propertyName)) {
					callbackfn(object[propertyName], propertyName)
				}
			}
		} else {
			for (const propertyName in object) {
				if (Object.prototype.hasOwnProperty.call(object, propertyName)
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
		unsubscribe = checkUnsubscribe(listChanged
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

	const forEach = (callbackfn: (item: TItem, debugPropertyName: string) => void) => {
		for (const item of object) {
			callbackfn(item, COLLECTION_PREFIX)
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
		unsubscribe = checkUnsubscribe(setChanged
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

	const forEach = (callbackfn: (item: TItem, debugPropertyName: string) => void) => {
		for (const item of object) {
			callbackfn(item, COLLECTION_PREFIX)
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
		unsubscribe = checkUnsubscribe(mapChanged
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
) {
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

		return (propName: string, object) => {
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

		return (propName: string, object) => {
			return !!propertyNamesMap[propName]
		}
	}
}

export class RuleSubscribeObject<TObject, TValue> implements IRuleSubscribe<TObject, TValue> {
	public readonly type: RuleType = RuleType.Action
	public readonly subscribe: ISubscribeObject<TObject, TValue>
	public description: string
	public next: IRule

	constructor(
		propertyPredicate?: (propertyName: string, object) => boolean,
		...propertyNames: string[]
	) {
		if (propertyNames && !propertyNames.length) {
			propertyNames = null
		}

		if (propertyPredicate) {
			if (typeof propertyPredicate !== 'function') {
				throw new Error(`propertyPredicate (${propertyPredicate}) is not a function`)
			}
		} else {
			propertyPredicate = createPropertyPredicate(propertyNames)
			if (!propertyPredicate) {
				propertyNames = null
			}
		}

		this.subscribe = subscribeObject.bind(
			null,
			propertyNames,
			propertyPredicate,
		)
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

		return (k: TKey, object) => {
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

		return (k: TKey, object) => {
			return keys.indexOf(k) >= 0
		}
	}
}

export class RuleSubscribeMap<TObject extends Map<K, V>, K, V> implements IRuleSubscribe<TObject, V> {
	public readonly type: RuleType = RuleType.Action
	public readonly subscribe: ISubscribeObject<Map<K, V>, V>
	public description: string
	public next: IRule

	constructor(
		keyPredicate?: (key: K, object) => boolean,
		...keys: K[]
	) {
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

export class RuleSubscribeCollection<TObject extends Iterable<TItem>, TItem> implements IRuleSubscribe<TObject, TItem> {
	public readonly type: RuleType = RuleType.Action
	public readonly subscribe: ISubscribeObject<TObject, TItem>
	public description: string
	public next: IRule

	constructor() {
		this.subscribe = subscribeCollection
	}
}

// endregion
