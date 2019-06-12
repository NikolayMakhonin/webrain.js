import {IDeSerializeValue, ISerializable, ISerializedObject, ISerializeValue} from '../serialization/contracts'
import {registerSerializer} from '../serialization/serializers'

export class ObjectSet implements Set<string>, ISerializable {
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

	// region ISerializable

	public static uuid: string = '6988ebc9-cd06-4a9b-97a9-8415b8cf1dc4'

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

registerSerializer(ObjectSet, {
	uuid: 'da346c2a-8dcd-415b-8a27-ed9523e03917',
	serializer: {
		serialize(
			serialize: ISerializeValue,
			value: ObjectSet,
		): ISerializedObject {
			return value.serialize(serialize)
		},
		deSerialize<T>(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedObject,
			valueFactory?: (object?: object) => ObjectSet,
		): ObjectSet {
			const innerSet = deSerialize<object>(serializedValue.object)
			const value = valueFactory
				? valueFactory(innerSet)
				: new ObjectSet(innerSet)
			value.deSerialize(deSerialize, serializedValue)
			return value
		},
	},
})
