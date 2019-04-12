/* tslint:disable:no-identical-functions */
import {IListChanged, ListChangedType} from '../../lists/contracts/IListChanged'
import {IMapChanged} from '../../lists/contracts/IMapChanged'
import {IPropertyChanged} from '../../lists/contracts/IPropertyChanged'
import {ISetChanged} from '../../lists/contracts/ISetChanged'
import {IUnsubscribe} from '../subjects/subject'
import {ANY, ANY_DISPLAY, COLLECTION_PREFIX} from './contracts/constants'
import {IRuleSubscribe, ISubscribeObject} from './contracts/rule-subscribe'
import {IRule, RuleType} from './contracts/rules'

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
	const {propertyChanged} = object
	let unsubscribe

	if (propertyChanged) {
		unsubscribe = propertyChanged
			.subscribe(event => {
				if (!propertyPredicate || propertyPredicate(event.name, object)) {
					unsubscribeItem(event.oldValue, event.name + '')
					subscribeItem(event.newValue, event.name + '')
				}
			})
	}

	function forEach(callbackfn: (item: TValue, debugPropertyName: string) => void) {
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
	} else if (!unsubscribe) {
		return null
	}

	return () => {
		if (unsubscribe) {
			unsubscribe()
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
	if (!object[Symbol.iterator]) {
		return null
	}

	function forEach(callbackfn: (item: TItem, debugPropertyName: string) => void) {
		for (const item of object) {
			callbackfn(item, ANY_DISPLAY)
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
	const {listChanged} = object
	let unsubscribe
	if (listChanged) {
		unsubscribe = listChanged
			.subscribe(({type, oldItems, newItems}) => {
				switch (type) {
					case ListChangedType.Added:
						for (let i = 0, len = newItems.length; i < len; i++) {
							subscribeItem(newItems[i], ANY_DISPLAY)
						}
						break
					case ListChangedType.Removed:
						for (let i = 0, len = oldItems.length; i < len; i++) {
							unsubscribeItem(oldItems[i], ANY_DISPLAY)
						}
						break
					case ListChangedType.Set:
						unsubscribeItem(oldItems[0], ANY_DISPLAY)
						subscribeItem(newItems[0], ANY_DISPLAY)
						break
				}
			})
	}

	function forEach(callbackfn: (item: TItem, debugPropertyName: string) => void) {
		for (const item of object) {
			callbackfn(item, ANY_DISPLAY)
		}
	}

	if (immediateSubscribe) {
		forEach(subscribeItem)
	} else if (!unsubscribe) {
		return null
	}

	return () => {
		if (unsubscribe) {
			unsubscribe()
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
	const {setChanged} = object
	let unsubscribe
	if (setChanged) {
		unsubscribe = setChanged
			.subscribe(({oldItems, newItems}) => {
				for (let i = 0, len = oldItems.length; i < len; i++) {
					unsubscribeItem(oldItems[i], ANY_DISPLAY)
				}
				for (let i = 0, len = newItems.length; i < len; i++) {
					subscribeItem(newItems[i], ANY_DISPLAY)
				}
			})
	}

	function forEach(callbackfn: (item: TItem, debugPropertyName: string) => void) {
		for (const item of object) {
			callbackfn(item, ANY_DISPLAY)
		}
	}

	if (immediateSubscribe) {
		forEach(subscribeItem)
	} else if (!unsubscribe) {
		return null
	}

	return () => {
		if (unsubscribe) {
			unsubscribe()
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
	const {mapChanged} = object
	let unsubscribe

	if (mapChanged) {
		unsubscribe = mapChanged
			.subscribe(({key, oldValue, newValue}) => {
				if (!keyPredicate || keyPredicate(key, object)) {
					unsubscribeItem(oldValue, COLLECTION_PREFIX + key)
					subscribeItem(newValue, COLLECTION_PREFIX + key)
				}
			})
	}

	function forEach(callbackfn: (item: V, debugPropertyName: string) => void) {
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
	} else if (!unsubscribe) {
		return null
	}

	return () => {
		if (unsubscribe) {
			unsubscribe()
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
				// && Object.prototype.hasOwnProperty.call(object, propName)
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
				// && Object.prototype.hasOwnProperty.call(object, propName)
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
				&& object.has(k)
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
			return object.has(k)
				&& keys.indexOf(k) >= 0
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
