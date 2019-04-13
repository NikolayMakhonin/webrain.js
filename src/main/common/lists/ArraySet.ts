/* tslint:disable:ban-types */
import {getObjectUniqueId} from './helpers/object-unique-id'

export class ArraySet<T extends Object> implements Set<T> {
	private readonly _array: T[]
	private _size: number

	constructor(array?: T[]) {
		this._array = array || []
		this._size = this._array.length
	}

	public add(value: T): this {
		const {_array} = this
		const id = getObjectUniqueId(value)
		// if (Object.prototype.hasOwnProperty.call(_array, id)) {
		if (typeof _array[id] !== 'undefined') {
			return this
		}

		this._array[id] = value
		this._size++

		return this
	}

	public delete(value: T): boolean {
		const {_array} = this
		const id = getObjectUniqueId(value)
		// if (Object.prototype.hasOwnProperty.call(_array, id)) {
		if (typeof _array[id] === 'undefined') {
			return false
		}

		// tslint:disable-next-line:no-array-delete
		delete _array[id]
		this._size--

		return true
	}

	public clear(): this {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				// tslint:disable-next-line:no-array-delete
				delete _array[id]
			}
		}

		this._size = 0

		return this
	}

	public readonly [Symbol.toStringTag]: string = 'Set'
	public get size(): number {
		return this._size
	}

	public *[Symbol.iterator](): IterableIterator<T> {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				yield _array[id]
			}
		}
	}

	public *entries(): IterableIterator<[T, T]> {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				const value = _array[id]
				yield [value, value]
			}
		}
	}

	public forEach(
		callbackfn: (value: T, key: T, set: Set<T>) => void,
		thisArg?: any,
	): void {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				const value = _array[id]
				callbackfn.call(thisArg, value, value, this)
			}
		}
	}

	public has(value: T): boolean {
		return Object.prototype.hasOwnProperty.call(this._array, getObjectUniqueId(value))
	}

	public keys(): IterableIterator<T> {
		return this[Symbol.iterator]()
	}

	public values(): IterableIterator<T> {
		return this[Symbol.iterator]()
	}
}
