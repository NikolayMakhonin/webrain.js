let nextObjectId: number = 1

const UNIQUE_ID_PROPERTY_NAME = 'uniqueId-22xvm5z032r'

export function hasObjectUniqueId(object: object): boolean {
	return object != null && Object.prototype.hasOwnProperty.call(object, UNIQUE_ID_PROPERTY_NAME)
}

export function canHaveUniqueId(object: object): boolean {
	return !Object.isFrozen(object) || hasObjectUniqueId(object)
}

export function getObjectUniqueId(object: object): number {
	if (!canHaveUniqueId(object)) {
		return null
	}

	if (!hasObjectUniqueId(object)) {
		const uniqueId = nextObjectId++
		Object.defineProperty(object, UNIQUE_ID_PROPERTY_NAME, {
			enumerable: false,
			configurable: false,
			writable: false,
			value: uniqueId,
		})
		return uniqueId
	}

	return object[UNIQUE_ID_PROPERTY_NAME]
}

// tslint:disable-next-line:ban-types
export function freezeWithUniqueId<T extends object>(object: T): T {
	getObjectUniqueId(object)
	return Object.freeze(object)
}

// tslint:disable-next-line:ban-types
export function isFrozenWithoutUniqueId(object: object): boolean {
	return !object || Object.isFrozen(object) && !hasObjectUniqueId(object)
}
