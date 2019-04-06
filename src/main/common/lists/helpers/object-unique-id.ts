let nextObjectId: number = 0

export const UNIQUE_ID_PROPERTY_NAME = 'uniqueId-22xvm5z032r'

Object.defineProperty(Object.prototype, UNIQUE_ID_PROPERTY_NAME, {
	enumerable: false,
	configurable: false,
	get() {
		const uniqueId = nextObjectId++
		Object.defineProperty(this, UNIQUE_ID_PROPERTY_NAME, {
			enumerable: false,
			configurable: false,
			get() {
				return uniqueId
			},
		})

		return uniqueId
	},
})
