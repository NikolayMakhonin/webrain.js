export class ObjectSet implements Set<string | number> {
	private readonly _object: object

	constructor(object: object) {
		this._object = object || {}
	}

	public add(value: string | number): this {
		this._object[value] = true
		return this
	}

	public delete(value: string | number): boolean {
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

	public readonly [Symbol.toStringTag]: 'Set'
	public get size(): number {
		return Object.keys(this._object).length
	}

	public [Symbol.iterator](): IterableIterator<string | number> {
		return Object.keys(this._object)[Symbol.iterator]()
	}

	public *entries(): IterableIterator<[string | number, string | number]> {
		const {_object} = this
		for (const value in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, value)) {
				yield [value, value]
			}
		}
	}

	public forEach(
		callbackfn: (value: string | number, key: string | number, set: Set<string | number>) => void,
		thisArg?: any,
	): void {
		const {_object} = this
		for (const value in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, value)) {
				callbackfn.call(thisArg, value, value, this)
			}
		}
	}

	public has(value: string | number): boolean {
		return Object.prototype.hasOwnProperty.call(this._object, value)
	}

	public keys(): IterableIterator<string | number> {
		return this[Symbol.iterator]()
	}

	public values(): IterableIterator<string | number> {
		return this[Symbol.iterator]()
	}
}
