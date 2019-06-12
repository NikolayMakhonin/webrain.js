import {IDeSerializeValue, ISerializedObject, ISerializeValue} from '../serialization/contracts'
import {registerSerializer} from '../serialization/serializers'
import {getObjectUniqueId} from './helpers/object-unique-id'

export class ArrayMap<K, V> implements Map<K, V> {
	private readonly _array: Array<[K, V]>

	constructor(array?: Array<[K, V]>) {
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

	// tslint:disable-next-line:no-identical-functions
	public *values(): IterableIterator<V> {
		const {_array} = this
		for (const id in _array) {
			if (Object.prototype.hasOwnProperty.call(_array, id)) {
				const entry = _array[id]
				yield entry[1]
			}
		}
	}

	// region ISerializable

	public static uuid: string = 'ef0ced8a-58f7-4381-b850-3b09c0a42eed'

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

registerSerializer(ArrayMap, {
	uuid: ArrayMap.uuid,
	serializer: {
		serialize(
			serialize: ISerializeValue,
			value: ArrayMap<any, any>,
		): ISerializedObject {
			return value.serialize(serialize)
		},
		deSerialize<K, V>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory?: (map?: Array<[K, V]>) => ArrayMap<K, V>,
		): ArrayMap<K, V> {
			const innerMap = deSerialize<Array<[K, V]>>(serializedValue.array, Object, () => [])
			const value = valueFactory
				? valueFactory(innerMap)
				: new ArrayMap<K, V>(innerMap)
			value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})
