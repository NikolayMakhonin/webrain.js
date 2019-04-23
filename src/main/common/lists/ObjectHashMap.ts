import {getObjectUniqueId} from './helpers/object-unique-id'

export class ObjectHashMap<K, V> implements Map<K, V> {
	private readonly _object: {
		[id: number]: [K, V],
	}

	constructor(object?: object) {
		this._object = object || {} as any
	}

	public set(key: K, value: V): this {
		const id = getObjectUniqueId(key)
		this._object[id] = [key, value]
		return this
	}

	public clear(): this {
		const {_object} = this
		for (const id in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, id)) {
				delete _object[id]
			}
		}

		return this
	}

	public delete(key: K): boolean {
		const {_object} = this
		const id = getObjectUniqueId(key)
		if (!Object.prototype.hasOwnProperty.call(_object, id)) {
			return false
		}

		delete _object[id]

		return true
	}

	public readonly [Symbol.toStringTag]: string = 'Map'
	public get size(): number {
		return Object.keys(this._object).length
	}

	public [Symbol.iterator](): IterableIterator<[K, V]> {
		return this.entries()
	}

	public *entries(): IterableIterator<[K, V]> {
		const {_object} = this
		for (const id in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, id)) {
				yield _object[id]
			}
		}
	}

	public forEach(
		callbackfn: (value: V, key: K, map: Map<K, V>) => void,
		thisArg?: any,
	): void {
		const {_object} = this
		for (const id in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, id)) {
				const entry = _object[id]
				callbackfn.call(thisArg, entry[1], entry[0], this)
			}
		}
	}

	public get(key: K): V | undefined {
		const id = getObjectUniqueId(key)
		const entry = this._object[id]
		return entry && entry[1]
	}

	public has(key: K): boolean {
		const id = getObjectUniqueId(key)
		return Object.prototype.hasOwnProperty.call(this._object, id)
	}

	public *keys(): IterableIterator<K> {
		const {_object} = this
		for (const id in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, id)) {
				const entry = _object[id]
				yield entry[0]
			}
		}
	}

	public *values(): IterableIterator<V> {
		const {_object} = this
		for (const id in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, id)) {
				const entry = _object[id]
				yield entry[1]
			}
		}
	}
}
