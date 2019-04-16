let nextObjectId: number = 0

const UNIQUE_ID_PROPERTY_NAME = 'uniqueId-22xvm5z032r'

Object.defineProperty(Object.prototype, UNIQUE_ID_PROPERTY_NAME, {
	enumerable: false,
	configurable: false,
	get() {
		const uniqueId = nextObjectId++
		Object.defineProperty(this, UNIQUE_ID_PROPERTY_NAME, {
			enumerable: false,
			configurable: false,
			writable: false,
			value: uniqueId,
		})

		return uniqueId
	},
})

// tslint:disable-next-line:ban-types
export function getObjectUniqueId(object: Object): number {
	return object[UNIQUE_ID_PROPERTY_NAME]
}
