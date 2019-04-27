import {ITypeMeta} from './TypeMeta'

// import {ISerializable} from './contracts'

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

// region Serialized Data

export type ISerializedDataOrValue = ISerializedData | ISerializedValue
export interface ISerializedData {
	types?: string[]
	data?: ISerializedValue
}

export type ISerializedTypedValue = ISerializedPrimitive|ISerializedValueArray|ISerializedObject

export interface ISerializedTyped {
	type: number
	data: ISerializedTypedValue
}

export interface ISerializedObject {
	[key: string]: ISerializedValue,
}

export type ISerializedPrimitive = string | number | boolean | null | undefined
export type ISerializedValue = ISerializedTyped | ISerializedPrimitive | ISerializedValueArray
export interface ISerializedValueArray extends Array<ISerializedValue> {

}

// endregion

// region IValueSerializer

export interface ISerializer {
	serialize(value: any): ISerializedDataOrValue
}

export interface IDeSerializer {
	deSerialize<TValue>(
		serializedValue: ISerializedDataOrValue,
		valueFactory?: () => TValue,
	): TValue
}

export interface IValueSerializer {
	uuid: string
	serialize(
		serializer: ISerializer,
		value: any,
	): ISerializedTypedValue
	deSerialize<TValue>(
		deSerializer: IDeSerializer,
		serializedValue: ISerializedTypedValue,
		valueFactory?: () => TValue,
	): TValue
}

// endregion

// region ObjectSerializer

export interface ITypeMetaSerializer extends ITypeMeta {
	serializer: IValueSerializer
}

export interface IObjectSerializer {
	addType(uuid: string): number
}

const VALUE_SERIALIZER_PROPERTY_NAME = 'valueSerializer_' + Math.random().toString(36)

export class Serializer implements ISerializer {
	public types: string[]
	public typesMap: { [uuid: string]: number }

	public addType(uuid: string): number {
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

		const valueSerializer = value.constructor[VALUE_SERIALIZER_PROPERTY_NAME] as IValueSerializer
		if (!valueSerializer) {
			throw new Error(`Class (${value.constructor}) have no value serializer`)
		}

		const uuid = valueSerializer.uuid
		if (!uuid) {
			throw new Error(`Class (${value.constructor}) serializer have no uuid`)
		}

		const typeIndex = this.addType(uuid)

		return {
			type: typeIndex,
			data: valueSerializer.serialize(this, value),
		}
	}
}

export class ObjectSerializer implements IDeSerializer {
	private data: ISerializedValue



	public deSerialize<TValue>(
		serializedValue: ISerializedDataOrValue,
		valueFactory?: () => TValue,
	): TValue {
		if (!serializedValue || typeof serializedValue !== 'object') {
			return serializedValue as TValue
		}

		const {types, data} = serializedValue as ISerializedData

		return undefined;
	}

	public serialize(value: any): ISerializedDataOrValue {
		const serializer = new Serializer()
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
}

export class ObjectDeSerializer implements ISerializer {
}

// endregion

// Serializer.prototype.serializers = {
// 	[type]
// }
