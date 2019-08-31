let nextObjectId: number = 1

const UNIQUE_ID_PROPERTY_NAME = 'uniqueId-22xvm5z032r'

export function hasObjectUniqueId(object: object): boolean {
	return object != null && Object.prototype.hasOwnProperty.call(object, UNIQUE_ID_PROPERTY_NAME)
}

export function canHaveUniqueId(object: object): boolean {
	return !Object.isFrozen(object) || hasObjectUniqueId(object)
}

export function getObjectUniqueId(object: object): number {
	// PROF: 129 - 0.3%

	if (object == null) {
		return null
	}

	const id = object[UNIQUE_ID_PROPERTY_NAME]

	if (id != null) {
		return id
	}

	if (Object.isFrozen(object)) {
		return null
	}

	const uniqueId = nextObjectId++
	Object.defineProperty(object, UNIQUE_ID_PROPERTY_NAME, {
		enumerable: false,
		configurable: false,
		writable: false,
		value: uniqueId,
	})
	return uniqueId
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
