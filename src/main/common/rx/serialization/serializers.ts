import {
	IDeSerializerVisitor,
	IObjectSerializer,
	ISerializedData,
	ISerializedDataOrValue,
	ISerializedTyped,
	ISerializedValue,
	ISerializerVisitor,
	ITypeMetaSerializer,
} from './contracts'
import {ITypeMetaCollection, TypeMetaCollection} from './TypeMeta'

// export interface IWriter {
// 	write(value: any): this
// }
//
// export interface IReader {
// 	read<TValue>(valueFactory?: () => TValue & ISerializable): TValue
// }
//
// export interface ISerializer extends IWriter, IReader { }

// каждый сериализуемый класс должен содержать поле с его UUID
// UUID устанавливается вручную
// при сериализации UUID сохраняются в отдельный список,
// а в данных используется индекс (для уменьшения размера сериализованных данных)

// region SerializerVisitor

export class SerializerVisitor implements ISerializerVisitor {
	public types: string[]
	public typesMap: { [uuid: string]: number }
	private _typeMeta: ITypeMetaCollection<ITypeMetaSerializer>

	constructor(typeMeta: ITypeMetaCollection<ITypeMetaSerializer>) {
		this._typeMeta = typeMeta
	}

	private addType(uuid: string): number {
		let {types, typesMap} = this
		if (!typesMap) {
			this.typesMap = typesMap = {}
			this.types = types = []
		}

		let typeIndex = types[uuid]
		if (typeIndex == null) {
			typeIndex = types.length
			types[typeIndex] = uuid
		}

		return typeIndex
	}

	public serialize(value: any): ISerializedValue {
		if (typeof value === 'undefined') {
			return value
		}

		if (value === null
			|| typeof value === 'number'
			|| typeof value === 'string'
			|| typeof value === 'boolean') {
			return value
		}

		const meta = this._typeMeta.getMeta(value.constructor)
		if (!meta) {
			throw new Error(`Class (${value.constructor}) have no type meta`)
		}

		const uuid = meta.uuid
		if (!uuid) {
			throw new Error(`Class (${value.constructor}) type meta have no uuid`)
		}

		const serializer = meta.serializer
		if (!serializer) {
			throw new Error(`Class (${value.constructor}) type meta have no serializer`)
		}

		if (!serializer.serialize) {
			throw new Error(`Class (${value.constructor}) serializer have no serialize method`)
		}

		const serializedTyped = {
			type: this.addType(uuid),
			data: serializer.serialize(this, value),
		}

		return serializedTyped
	}
}

export class DeSerializerVisitor implements IDeSerializerVisitor {
	private readonly _types: string[]
	private readonly _typeMeta: ITypeMetaCollection<ITypeMetaSerializer>

	constructor(typeMeta: ITypeMetaCollection<ITypeMetaSerializer>, types: string[]) {
		this._typeMeta = typeMeta
		this._types = types
	}

	public deSerialize<TValue>(serializedValue: ISerializedValue, valueFactory?: () => TValue): TValue {
		if (typeof serializedValue === 'undefined') {
			return serializedValue
		}

		if (serializedValue === null
			|| typeof serializedValue === 'number'
			|| typeof serializedValue === 'string'
			|| typeof serializedValue === 'boolean') {
			return serializedValue as unknown as TValue
		}

		const typeIndex = (serializedValue as ISerializedTyped).type
		if (typeof typeIndex !== 'number') {
			throw new Error(`Serialized value have no type field: ${JSON.stringify(serializedValue, null, 4)}`)
		}

		const uuid = this._types[typeIndex]
		if (typeof uuid !== 'string') {
			throw new Error(`type uuid not found for index (${typeIndex}): ${JSON.stringify(serializedValue, null, 4)}`)
		}

		const type = this._typeMeta.getType(uuid)
		if (!type) {
			throw new Error(`type not found for uuid (${uuid}): ${JSON.stringify(serializedValue, null, 4)}`)
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

		const value = serializer.deSerialize<TValue>(
			this,
			(serializedValue as ISerializedTyped).data,
			valueFactory || meta.valueFactory,
		)

		return value
	}
}

// endregion

// region ObjectSerializer

export class ObjectSerializer implements IObjectSerializer {
	public typeMeta: ITypeMetaCollection<ITypeMetaSerializer>

	constructor(typeMeta?: ITypeMetaCollection<ITypeMetaSerializer>) {
		this.typeMeta = new TypeMetaCollection<ITypeMetaSerializer>(typeMeta)
	}

	public serialize(value: any): ISerializedDataOrValue {
		const serializer = new SerializerVisitor(this.typeMeta)
		const serializedValue = serializer.serialize(value)

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

		const value = deSerializer.deSerialize(data, valueFactory)

		return value
	}
}

// endregion
