import {getObjectUniqueId} from './helpers/object-unique-id'

export class ArrayMap<K, V> implements Map<K, V> {
	private readonly _array: Array<[K, V]>

	constructor(array?: []) {
		this._array = array || []
	}

	public set(key: K, value: V): this {
		const id = getObjectUniqueId(key)
		this._array[id] = [key, value]
		return this
	}

	public clear(): this {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				delete _array[id]
			}
		}

		return this
	}

	public delete(key: K): boolean {
		const {_array} = this
		const id = getObjectUniqueId(key)
		if (!Object.prototype.hasOwnProperty.call(_array, id)) {
			return false
		}

		delete _array[id]

		return true
	}

	public readonly [Symbol.toStringTag]: string = 'Map'
	public get size(): number {
		return Object.keys(this._array).length
	}

	public [Symbol.iterator](): IterableIterator<[K, V]> {
		return this.entries()
	}

	public *entries(): IterableIterator<[K, V]> {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				yield _array[id]
			}
		}
	}

	public forEach(
		callbackfn: (value: V, key: K, map: Map<K, V>) => void,
		thisArg?: any,
	): void {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				const entry = _array[id]
				callbackfn.call(thisArg, entry[1], entry[0], this)
			}
		}
	}

	public get(key: K): V | undefined {
		const id = getObjectUniqueId(key)
		const entry = this._array[id]
		return entry && entry[1]
	}

	public has(key: K): boolean {
		const id = getObjectUniqueId(key)
		return Object.prototype.hasOwnProperty.call(this._array, id)
	}

	public *keys(): IterableIterator<K> {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				const entry = _array[id]
				yield entry[0]
			}
		}
	}

	public *values(): IterableIterator<V> {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				const entry = _array[id]
				yield entry[1]
			}
		}
	}
}
