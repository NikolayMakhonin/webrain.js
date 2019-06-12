/* tslint:disable:ban-types */
import {
	IDeSerializeValue,
	ISerializable,
	ISerializedObject,
	ISerializedValueArray,
	ISerializeValue
} from '../serialization/contracts'
import {deSerializeArray, registerSerializer, serializeArray} from '../serialization/serializers'
import {getObjectUniqueId} from './helpers/object-unique-id'

export class ArraySet<T extends Object> implements Set<T>, ISerializable {
	private readonly _array: T[]
	private _size: number

	constructor(array?: T[], size?: number) {
		this._array = array || []
		this._size = size || Object.keys(this._array).length
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

	// region ISerializable

	public static uuid: string = '6988ebc9-cd06-4a9b-97a9-8415b8cf1dc4'

	public serialize(serialize: ISerializeValue): ISerializedObject {
		return {
			array: serialize(this._array, Object),
		}
	}

	// tslint:disable-next-line:no-empty
	public deSerialize(deSerialize: IDeSerializeValue, serializedValue: ISerializedObject) {

	}

	// endregion
}

registerSerializer(ArraySet, {
	uuid: '5d8afd61-6d86-46de-892c-4857e824b639',
	serializer: {
		serialize(
			serialize: ISerializeValue,
			value: ArraySet<any>,
		): ISerializedObject {
			return value.serialize(serialize)
		},
		deSerialize<T>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory?: (set?: T[]) => ArraySet<T>,
		): ArraySet<T> {
			const innerSet = deSerialize(serializedValue.array, Object, () => [])
			const value = valueFactory
				? valueFactory(innerSet)
				: new ArraySet<T>(innerSet)
			value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})
