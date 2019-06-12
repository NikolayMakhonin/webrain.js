import {IDeSerializeValue, ISerializedObject, ISerializeValue} from '../serialization/contracts'
import {registerSerializer} from '../serialization/serializers'

export class ObjectMap<V> implements Map<string, V> {
	private readonly _object: object

	constructor(object?: object) {
		this._object = object || {}
	}

	public set(key: string, value: V): this {
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

	public delete(key: string): boolean {
		const {_object} = this
		if (!Object.prototype.hasOwnProperty.call(_object, key)) {
			return false
		}

		delete _object[key]

		return true
	}

	public readonly [Symbol.toStringTag]: string = 'Map'
	public get size(): number {
		return Object.keys(this._object).length
	}

	public [Symbol.iterator](): IterableIterator<[string, V]> {
		return this.entries()
	}

	public *entries(): IterableIterator<[string, V]> {
		const {_object} = this
		for (const key in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, key)) {
				yield [key, _object[key]]
			}
		}
	}

	public forEach(
		callbackfn: (value: V, key: string, map: Map<string, V>) => void,
		thisArg?: any,
	): void {
		const {_object} = this
		for (const key in _object) {
			if (Object.prototype.hasOwnProperty.call(_object, key)) {
				callbackfn.call(thisArg, _object[key], key, this)
			}
		}
	}

	public get(key: string): V | undefined {
		return this._object[key]
	}

	public has(key: string): boolean {
		return Object.prototype.hasOwnProperty.call(this._object, key)
	}

	public keys(): IterableIterator<string> {
		return Object.keys(this._object)[Symbol.iterator]()
	}

	public values(): IterableIterator<V> {
		return Object.values(this._object)[Symbol.iterator]()
	}
	
	// region ISerializable

	public static uuid: string = '62388f07-b21a-4778-8b38-58f225cdbd42'

	public serialize(serialize: ISerializeValue): ISerializedObject {
		return {
			object: serialize(this._object),
		}
	}

	// tslint:disable-next-line:no-empty
	public deSerialize(deSerialize: IDeSerializeValue, serializedValue: ISerializedObject) {

	}

	// endregion
}

registerSerializer(ObjectMap, {
	uuid: ObjectMap.uuid,
	serializer: {
		serialize(
			serialize: ISerializeValue,
			value: ObjectMap<any>,
		): ISerializedObject {
			return value.serialize(serialize)
		},
		deSerialize<V>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory?: (map?: object) => ObjectMap<V>,
		): ObjectMap<V> {
			const innerMap = deSerialize<object>(serializedValue.object)
			const value = valueFactory
				? valueFactory(innerMap)
				: new ObjectMap<V>(innerMap)
			value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})
