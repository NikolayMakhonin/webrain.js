/* tslint:disable:no-identical-functions */
import {isIterable} from '../../../../../helpers/helpers'
import {VALUE_PROPERTY_DEFAULT} from '../../../../../helpers/value-property'
import {IUnsubscribe, IUnsubscribeOrVoid} from '../../../../subjects/observable'
import {ValueKeyType} from './contracts/common'
import {ANY} from './contracts/constants'
import {IChangeItem, IRuleSubscribe, ISubscribeObject} from './contracts/rule-subscribe'
import {RuleType} from './contracts/rules'
import {Rule} from './rules'

function forEachCollection<TObject extends Iterable<TValue>, TValue>(
	object: TObject,
	changeItem: IChangeItem<TObject, TValue>,
) {
	for (const item of object) {
		changeItem(item, object, null, ValueKeyType.CollectionAny)
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

export function subscribeObjectValue<TObject extends object, TValue>(
	propertyNames: string[],
	object: TObject,
	changeItem: IChangeItem<TObject, TValue>,
): void {
	if (!(object instanceof Object)) {
		changeItem(object as any, object, null, null)
		return null
	}

	if (object.constructor === Object || Array.isArray(object)) {
		changeItem(object as any, object, null, null)
	}

	if (allowSubscribePrototype
		? !(VALUE_PROPERTY_DEFAULT in object)
		: !Object.prototype.hasOwnProperty.call(object, VALUE_PROPERTY_DEFAULT)
	) {
		return null
	}

	let propertyName = getFirstExistProperty(object, propertyNames)
	if (propertyName == null) {
		propertyName = VALUE_PROPERTY_DEFAULT
	}

	if (propertyName == null) {
		changeItem(object as any, object, null, null)
	} else {
		const value = object[propertyName]
		if (typeof value !== 'undefined') {
			changeItem(value, object, propertyName, ValueKeyType.ValueProperty)
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

export function subscribeObject<TObject extends object, TValue>(
	propertyNames: string|string[],
	propertyPredicate: (propertyName, object) => boolean,
	object: TObject,
	changeItem: IChangeItem<TObject, TValue>,
): IUnsubscribeOrVoid {
	if (!(object instanceof Object)) {
		return null
	}

	if (propertyNames == null) {
		for (const propertyName in object) {
			if ((allowSubscribePrototype || Object.prototype.hasOwnProperty.call(object, propertyName))
				&& (!propertyPredicate || propertyPredicate(propertyName, object))
			) {
				changeItem(object[propertyName] as any, object, propertyName, ValueKeyType.Property)
			}
		}
	} else {
		if (Array.isArray(propertyNames)) {
			for (let i = 0, len = propertyNames.length; i < len; i++) {
				const propertyName = propertyNames[i]

				if ((allowSubscribePrototype
					? propertyName in object
					: Object.prototype.hasOwnProperty.call(object, propertyName))
				) {
					const value = object[propertyName]
					if (typeof value !== 'undefined') {
						changeItem(value, object, propertyName, ValueKeyType.Property)
					}
				}
			}
		} else {
			if ((allowSubscribePrototype
				? propertyNames in object
				: Object.prototype.hasOwnProperty.call(object, propertyNames))
			) {
				const value = object[propertyNames]
				if (typeof value !== 'undefined') {
					changeItem(value, object, propertyNames, ValueKeyType.Property)
				}
			}
		}
	}
}

// endregion

// region subscribeMap

export function subscribeMap<TObject extends Map<K, V>, K, V>(
	keys: K[],
	keyPredicate: (key, object) => boolean,
	object: TObject,
	changeItem: IChangeItem<TObject, V>,
): void {
	if (!object || object[Symbol.toStringTag] !== 'Map' && !(object instanceof Map)) {
		return null
	}

	if (keys) {
		for (let i = 0, len = keys.length; i < len; i++) {
			const key = keys[i]

			if (object.has(key)) {
				changeItem(object.get(key), object, key, ValueKeyType.MapKey)
			}
		}
	} else {
		for (const entry of object) {
			if (!keyPredicate || keyPredicate(entry[0], object)) {
				changeItem(entry[1], object, entry[0], ValueKeyType.MapKey)
			}
		}
	}
}

// endregion

// region subscribeCollection

export function subscribeCollection<TObject extends Iterable<TValue>, TValue>(
	object: TObject,
	changeItem: IChangeItem<TObject, TValue>,
): void {
	if (!isIterable(object)) {
		return null
	}

	if (Array.isArray(object)) {
		for (let i = 0, len = object.length; i < len; i++) {
			changeItem(object[i], object, i, ValueKeyType.Index)
		}
	} else if (object instanceof Map || object[Symbol.toStringTag] === 'Map') {
		subscribeMap(null, null, object as any, changeItem)
	} else {
		forEachCollection(object, changeItem)
	}

	return null
}

// endregion

// region subscribeChange

export function subscribeChange<TObject extends Iterable<TValue>, TValue>(
	object: TObject,
	// changeItem: IChangeItem<TObject, TValue>,
): IUnsubscribeOrVoid {
	if (!isIterable(object)) {
		return null
	}

	object[Symbol.iterator]()
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

export class RuleSubscribe<TObject = any, TChild = any>
	extends Rule
	implements IRuleSubscribe<TObject, TChild>
{
	public readonly subscribe: ISubscribeObject<TObject, TChild>
	public readonly unsubscribers: IUnsubscribe[]
	public readonly unsubscribersCount: number[]

	public constructor(
		subscribe: ISubscribeObject<TObject, TChild>,
		subType: SubscribeObjectType,
		description: string,
	) {
		super(RuleType.Action, description)
		this.subscribe = subscribe
		this.subType = subType
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

export function createSubscribeObject<TObject extends object, TValue>(
	subType: SubscribeObjectType,
	propertyPredicate: (propertyName: string, object) => boolean,
	...propertyNames: string[]
): ISubscribeObject<TObject, TValue> {
	if (propertyNames && !propertyNames.length) {
		propertyNames = null
	}

	if (propertyPredicate) {
		if (typeof propertyPredicate !== 'function') {
			throw new Error(`propertyPredicate (${propertyPredicate}) is not a function`)
		}
	} else if (subType === SubscribeObjectType.Property) {
		propertyPredicate = createPropertyPredicate(propertyNames)
		if (!propertyPredicate) {
			propertyNames = null
		}
	}

	switch (subType) {
		case SubscribeObjectType.Property:
			return (object, changeItem) => subscribeObject<TObject, TValue>(
				propertyNames,
				propertyPredicate,
				object,
				changeItem,
			)
		case SubscribeObjectType.ValueProperty:
			return (object, changeItem) => {
				subscribeObjectValue<TObject, TValue>(
					propertyNames,
					object,
					changeItem,
				)
			}
		default:
			throw new Error(`Unknown SubscribeObjectType: ${subType}`)
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

export function createSubscribeMap<TObject extends Map<K, V>, K, V>(
	keyPredicate: (key: K, object) => boolean,
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

	return (object, changeItem) => {
		subscribeMap(
			keys,
			keyPredicate,
			object,
			changeItem,
		)
	}
}

// endregion
