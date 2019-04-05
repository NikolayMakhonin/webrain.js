export class ObservableMap<TValue> implements Map<string | number, TValue> {
	private readonly _object: object

	constructor(object: object) {
		this._object = object || {}
	}

	public set(key: string | number, value: TValue): this {
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

	public [Symbol.iterator](): IterableIterator<[string | number, TValue]> {
		return undefined
	}

	public entries(): IterableIterator<[string | number, TValue]> {
		return undefined
	}

	public forEach(callbackfn: (value: TValue, key: string | number, map: Map<string | number, TValue>) => void, thisArg?: any): void {
	}

	public get(key: string | number): TValue | undefined {
		return this._object[key]
	}

	public has(key: string | number): boolean {
		return Object.prototype.hasOwnProperty.call(this._object, key)
	}

	public keys(): IterableIterator<string | number> {
		return (Object.keys(this._object) as Array<string | number>)[Symbol.iterator]
	}

	public values(): IterableIterator<TValue> {
		return undefined
	}

}
