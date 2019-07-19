import {TClass, TypeMetaCollectionWithId} from '../TypeMeta'
import {
	IDeSerializerVisitor, IDeSerializeValue,
	IObjectSerializer, ISerializable,
	ISerializedData,
	ISerializedDataOrValue, ISerializedObject,
	ISerializedTyped, ISerializedTypedValue,
	ISerializedValue, ISerializedValueArray,
	ISerializerVisitor, ISerializeValue,
	ITypeMetaSerializer, ITypeMetaSerializerCollection,
} from './contracts'

// region SerializerVisitor

export class SerializerVisitor implements ISerializerVisitor {
	public types: string[]
	public typesMap: { [uuid: string]: number }
	private _typeMeta: ITypeMetaSerializerCollection

	constructor(typeMeta: ITypeMetaSerializerCollection) {
		this._typeMeta = typeMeta
		this.serialize = this.serialize.bind(this)
	}

	private addType(uuid: string): number {
		// tslint:disable-next-line:prefer-const
		let {types, typesMap} = this
		if (!typesMap) {
			this.typesMap = {}
			this.types = types = []
		}

		let typeIndex = types[uuid]
		if (typeIndex == null) {
			typeIndex = types.length
			types[typeIndex] = uuid
		}

		return typeIndex
	}

	public serialize(value: any, valueType?: TClass): ISerializedValue {
		if (typeof value === 'undefined') {
			return value
		}

		if (value === null
			|| typeof value === 'number'
			|| typeof value === 'string'
			|| typeof value === 'boolean') {
			return value
		}

		const meta = this._typeMeta.getMeta(valueType || value.constructor)
		if (!meta) {
			throw new Error(`Class (${value.constructor.name}) have no type meta`)
		}

		const uuid = meta.uuid
		if (!uuid) {
			throw new Error(`Class (${value.constructor.name}) type meta have no uuid`)
		}

		const serializer = meta.serializer
		if (!serializer) {
			throw new Error(`Class (${value.constructor.name}) type meta have no serializer`)
		}

		if (!serializer.serialize) {
			throw new Error(`Class (${value.constructor.name}) serializer have no serialize method`)
		}

		const serializedTyped = {
			type: this.addType(uuid),
			data: serializer.serialize(this.serialize, value),
		}

		return serializedTyped
	}
}

export class DeSerializerVisitor implements IDeSerializerVisitor {
	private readonly _types: string[]
	private readonly _typeMeta: ITypeMetaSerializerCollection

	constructor(typeMeta: ITypeMetaSerializerCollection, types: string[]) {
		this._typeMeta = typeMeta
		this._types = types
		this.deSerialize = this.deSerialize.bind(this)
	}

	public deSerialize<TValue>(
		serializedValue: ISerializedValue,
		valueType?: TClass,
		valueFactory?: () => TValue,
	): TValue {
		if (typeof serializedValue === 'undefined') {
			return serializedValue
		}

		if (serializedValue === null
			|| typeof serializedValue === 'number'
			|| typeof serializedValue === 'string'
			|| typeof serializedValue === 'boolean') {
			return serializedValue as unknown as TValue
		}

		let type = valueType
		if (!type) {
			const typeIndex = (serializedValue as ISerializedTyped).type
			if (typeof typeIndex !== 'number') {
				throw new Error(`Serialized value have no type field: ${JSON.stringify(serializedValue, null, 4)}`)
			}

			const uuid = this._types[typeIndex]
			if (typeof uuid !== 'string') {
				throw new Error(`type uuid not found for index (${typeIndex}): ${JSON.stringify(serializedValue, null, 4)}`)
			}

			type = this._typeMeta.getType(uuid)

			if (!type) {
				throw new Error(`type not found for uuid (${uuid}): ${JSON.stringify(serializedValue, null, 4)}`)
			}
		}

		const meta = this._typeMeta.getMeta(type)
		if (!meta) {
			throw new Error(`Class (${type}) have no type meta`)
		}

		const serializer = meta.serializer
		if (!serializer) {
			throw new Error(`Class (${type}) type meta have no serializer`)
		}

		if (!serializer.deSerialize) {
			throw new Error(`Class (${type}) serializer have no deSerialize method`)
		}

		const value = serializer.deSerialize(
			this.deSerialize,
			(serializedValue as ISerializedTyped).data,
			valueFactory || meta.valueFactory,
		)

		return value
	}
}

// endregion

// region TypeMetaSerializerCollection

export type TSerializableClass<TObject extends ISerializable>
	= (new (...args: any[]) => TObject) & { readonly uuid: string }

export class TypeMetaSerializerCollection
	extends TypeMetaCollectionWithId<ITypeMetaSerializer<any>>
	implements ITypeMetaSerializerCollection {
	
	constructor(proto?: ITypeMetaSerializerCollection) {
		super(proto || TypeMetaSerializerCollection.default)
	}

	public static default: TypeMetaSerializerCollection = new TypeMetaSerializerCollection()

	private static makeTypeMetaSerializer<TObject extends ISerializable>(
		type: TSerializableClass<TObject>,
		valueFactory?: () => TObject,
	): ITypeMetaSerializer<TObject> {
		return {
			uuid: type.uuid,
			serializer: {
				serialize(
					serialize: ISerializeValue,
					value: ISerializable,
				): ISerializedTypedValue {
					return value.serialize(serialize)
				},
				deSerialize<TValue>(
					deSerialize: IDeSerializeValue,
					serializedValue: ISerializedTypedValue,
					valueFactory2?: () => TValue,
				): TValue {
					const value = valueFactory2() as unknown as TObject
					value.deSerialize(deSerialize, serializedValue)
					return value as unknown as TValue
				},
			},
			valueFactory: valueFactory || (() => new (type as new () => TObject)()),
		}
	}

	public putSerializableType<TObject extends ISerializable>(
		type: TSerializableClass<TObject>,
		valueFactory?: () => TObject,
	): ITypeMetaSerializer<TObject> {
		return this.putType(type, TypeMetaSerializerCollection.makeTypeMetaSerializer(type, valueFactory))
	}
}

export function registerSerializable<TObject extends ISerializable>(
	type: TSerializableClass<TObject>,
	valueFactory?: () => TObject,
) {
	TypeMetaSerializerCollection.default.putSerializableType(type, valueFactory)
}

export function registerSerializer<TValue>(
	type: TClass,
	meta: ITypeMetaSerializer<TValue>,
) {
	TypeMetaSerializerCollection.default.putType(type, meta)
}

// endregion

// region ObjectSerializer

export class ObjectSerializer implements IObjectSerializer {
	public typeMeta: ITypeMetaSerializerCollection

	constructor(typeMeta?: ITypeMetaSerializerCollection) {
		this.typeMeta = new TypeMetaSerializerCollection(typeMeta)
	}

	public static default: ObjectSerializer = new ObjectSerializer()

	public serialize(value: any, valueType?: TClass): ISerializedDataOrValue {
		const serializer = new SerializerVisitor(this.typeMeta)
		const serializedValue = serializer.serialize(value, valueType)

		if (!serializedValue || typeof serializedValue !== 'object') {
			return serializedValue
		}

		const serializedData: ISerializedData = {
			data: serializedValue,
		}

		if (serializer.types) {
			serializedData.types = serializer.types
		}

		return serializedData
	}

	public deSerialize<TValue>(
		serializedValue: ISerializedDataOrValue,
		valueType?: TClass,
		valueFactory?: () => TValue,
	): TValue {
		if (!serializedValue || typeof serializedValue !== 'object') {
			return serializedValue as TValue
		}

		const {types, data} = serializedValue as ISerializedData

		if (!Array.isArray(types)) {
			throw new Error(`serialized value types field is not array: ${types}`)
		}

		const deSerializer = new DeSerializerVisitor(this.typeMeta, types)

		const value = deSerializer.deSerialize(data, valueType, valueFactory)

		return value
	}
}

// endregion

// region Primitive Serializers

// Handled in SerializerVisitor:
// undefined
// null
// number
// string
// boolean

// region Helpers

export function serializeArray(
	serialize: ISerializeValue,
	value: any[],
	length?: number,
): ISerializedValueArray {
	if (length == null) {
		length = value.length
	}

	const serializedValue = []
	for (let i = 0; i < length; i++) {
		serializedValue[i] = serialize(value[i])
	}

	return serializedValue
}

export function deSerializeArray<T>(
	deSerialize: IDeSerializeValue,
	serializedValue: ISerializedValueArray,
	valueFactory?: () => T[],
): T[] {
	const value = valueFactory ? valueFactory() : []
	for (let i = 0, len = serializedValue.length; i < len; i++) {
		value[i] = deSerialize(serializedValue[i])
	}
	return value
}

export function serializeIterable(
	serialize: ISerializeValue,
	value: Iterable<any>,
): ISerializedValueArray {
	const serializedValue = []
	for (const item of value) {
		serializedValue.push(serialize(item))
	}
	return serializedValue
}

export function deSerializeIterable(
	serializedValue: ISerializedValueArray,
	add: (item: any) => void,
): void {
	for (let i = 0, len = serializedValue.length; i < len; i++) {
		add(serializedValue[i])
	}
}

// endregion

// region Object

registerSerializer<object>(Object, {
	uuid: '88968a59-178c-4e73-a99f-801e8cdfc37d',
	serializer: {
		serialize(serialize: ISerializeValue, value: object): ISerializedObject {
			const serializedValue = {}
			for (const key in value) {
				if (Object.prototype.hasOwnProperty.call(value, key)) {
					serializedValue[key] = serialize(value[key])
				}
			}
			return serializedValue
		},
		deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedTypedValue,
			valueFactory?: () => object,
		): object {
			const value = valueFactory ? valueFactory() : {}
			for (const key in serializedValue as ISerializedObject) {
				if (Object.prototype.hasOwnProperty.call(serializedValue, key)) {
					value[key] = deSerialize(serializedValue[key])
				}
			}
			return value
		},
	},
})

// endregion

// region Array

registerSerializer<any[]>(Array, {
	uuid: 'f8c84ed0-8463-4f45-b14a-228967dfb0de',
	serializer: {
		serialize(serialize: ISerializeValue, value: any[]): ISerializedValueArray {
			return serializeArray(serialize, value)
		},
		deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedValueArray,
			valueFactory?: () => any[],
		): any[] {
			return deSerializeArray(deSerialize, serializedValue, valueFactory)
		},
	},
})

// endregion

// region Set

registerSerializer<Set<any>>(Set, {
	uuid: '17b11d99-ce03-4349-969e-4f9291d0778c',
	serializer: {
		serialize(serialize: ISerializeValue, value: Set<any>): ISerializedValueArray {
			return serializeIterable(serialize, value)
		},
		deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedValueArray,
			valueFactory?: () => Set<any>,
		): Set<any> {
			const value = valueFactory ? valueFactory() : new Set()
			deSerializeIterable(serializedValue, o => value.add(deSerialize(o)))
			return value
		},
	},
})

// endregion

// region Map

registerSerializer<Map<any, any>>(Map, {
	uuid: 'fdf40f21-59b7-4cb2-804f-3d18ebb19b57',
	serializer: {
		serialize(serialize: ISerializeValue, value: Map<any, any>): ISerializedValueArray {
			return serializeIterable(item => [
				serialize(item[0]),
				serialize(item[1]),
			], value)
		},
		deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedValueArray,
			valueFactory?: () => Map<any, any>,
		): Map<any, any> {
			const value = valueFactory ? valueFactory() : new Map()
			deSerializeIterable(
				serializedValue,
				item => value.set(
					deSerialize(item[0]),
					deSerialize(item[1]),
				))
			return value
		},
	},
})

// endregion

// region Date

registerSerializer<Date>(Date, {
	uuid: '7a6c01db-a6b8-4822-a9a5-86e4d3a4460b',
	serializer: {
		serialize(serialize: ISerializeValue, value: Date): number {
			return value.getTime()
		},
		deSerialize(
			deSerialize: IDeSerializeValue,
			serializedValue: number,
			valueFactory?: () => Date,
		): Date {
			return new Date(serializedValue)
		},
	},
})

// endregion

// endregion
