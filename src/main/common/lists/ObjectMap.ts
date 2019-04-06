export class ObjectMap<V> implements Map<string | number, V> {
	private readonly _object: object

	constructor(object: object) {
		this._object = object || {}
	}

	public set(key: string | number, value: V): this {
		this._object[key] = value
		return this
	}

	public clear(): this {
		const {_object} = this
		for (const key in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, key)) {
				delete _object[key]
			}
		}

		return this
	}

	public delete(key: string | number): boolean {
		const {_object} = this
		if (!Object.prototype.hasOwnProperty.call(_object, key)) {
			return false
		}

		delete _object[key]

		return true
	}

	public readonly [Symbol.toStringTag]: 'Map'
	public get size(): number {
		return Object.keys(this._object).length
	}

	public [Symbol.iterator](): IterableIterator<[string | number, V]> {
		return this.entries()
	}

	public *entries(): IterableIterator<[string | number, V]> {
		const {_object} = this
		for (const key in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, key)) {
				yield [key, _object[key]]
			}
		}
	}

	public forEach(
		callbackfn: (value: V, key: string | number, map: Map<string | number, V>) => void,
		thisArg?: any,
	): void {
		const {_object} = this
		for (const key in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, key)) {
				callbackfn.call(thisArg, _object[key], key, this)
			}
		}
	}

	public get(key: string | number): V | undefined {
		return this._object[key]
	}

	public has(key: string | number): boolean {
		return Object.prototype.hasOwnProperty.call(this._object, key)
	}

	public keys(): IterableIterator<string | number> {
		return Object.keys(this._object)[Symbol.iterator]()
	}

	public values(): IterableIterator<V> {
		return Object.values(this._object)[Symbol.iterator]()
	}

}
