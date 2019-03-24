export const Observable = class {
	constructor(fields) {
		Object.assign(this, fields)
	}

	call(func) {
		return func(this)
	}
}
