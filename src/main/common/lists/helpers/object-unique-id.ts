let nextObjectId: number = 0

Object.defineProperty(Object.prototype, 'uniqueId', {
	enumerable: false,
	configurable: false,
	get() {
		const uniqueId = nextObjectId++
		Object.defineProperty(this, 'uniqueId', {
			enumerable: false,
			configurable: false,
			get() {
				return uniqueId
			},
		})

		return uniqueId
	},
})
