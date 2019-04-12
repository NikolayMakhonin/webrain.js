export class ObjectSet implements Set<string> {
	private readonly _object: object

	constructor(object?: object) {
		this._object = object || {}
	}

	public add(value: string): this {
		this._object[value] = true
		return this
	}

	public delete(value: string): boolean {
		const {_object} = this
		if (!Object.prototype.hasOwnProperty.call(_object, value)) {
			return false
		}

		delete _object[value]

		return true
	}

	public clear(): this {
		const {_object} = this
		for (const value in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, value)) {
				delete _object[value]
			}
		}

		return this
	}

	public readonly [Symbol.toStringTag]: string = 'Set'
	public get size(): number {
		return Object.keys(this._object).length
	}

	public [Symbol.iterator](): IterableIterator<string> {
		return Object.keys(this._object)[Symbol.iterator]()
	}

	public *entries(): IterableIterator<[string, string]> {
		const {_object} = this
		for (const value in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, value)) {
				yield [value, value]
			}
		}
	}

	public forEach(
		callbackfn: (value: string, key: string, set: Set<string>) => void,
		thisArg?: any,
	): void {
		const {_object} = this
		for (const value in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, value)) {
				callbackfn.call(thisArg, value, value, this)
			}
		}
	}

	public has(value: string): boolean {
		return Object.prototype.hasOwnProperty.call(this._object, value)
	}

	public keys(): IterableIterator<string> {
		return this[Symbol.iterator]()
	}

	public values(): IterableIterator<string> {
		return this[Symbol.iterator]()
	}
}
