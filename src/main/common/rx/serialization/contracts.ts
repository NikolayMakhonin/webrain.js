import {ITypeMeta, ITypeMetaCollection} from './TypeMeta'

// region Serialized Value

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

// region Serialized Data

export type ISerializedDataOrValue = ISerializedData | ISerializedValue
export interface ISerializedData {
	types?: string[]
	data?: ISerializedValue
}

// endregion

// region Serializers

export interface ISerializerVisitor {
	serialize(value: any): ISerializedValue
}

export interface IDeSerializerVisitor {
	deSerialize<TValue>(
		serializedValue: ISerializedValue,
		valueFactory?: () => TValue,
	): TValue
}

export interface IValueSerializer {
	serialize(
		serializer: ISerializerVisitor,
		value: any,
	): ISerializedTypedValue
	deSerialize<TValue>(
		deSerializer: IDeSerializerVisitor,
		serializedValue: ISerializedTypedValue,
		valueFactory?: () => TValue,
	): TValue
}

export interface ISerializer {
	serialize(value: any): ISerializedDataOrValue
}

export interface IDeSerializer {
	deSerialize<TValue>(
		serializedData: ISerializedDataOrValue,
		valueFactory?: () => TValue,
	): TValue
}

export interface ITypeMetaSerializer extends ITypeMeta {
	serializer: IValueSerializer
	valueFactory?: () => any
}

export interface IObjectSerializer extends ISerializer, IDeSerializer {
	typeMeta: ITypeMetaCollection<ITypeMetaSerializer>
}

// endregion

// export type WriteValue<TValue> = (value: TValue) => ISerializedValue
// export type ReadValue<TValue> = (serializedValue: ISerializedValue, valueFactory: () => TValue) => TValue
//
// export interface ISerializable {
// 	serialize(): ISerializedValue
// 	deSerialize(serializedValue: ISerializedValue)
// }
//
// export interface ICollectionSerializer<TCollection> {
// 	serialize(collection: TCollection): ISerializedValueArray
// 	deSerialize(serializedArray: ISerializedValueArray): TCollection
// }
//
// export interface ICollectionFactorySerializer<TItem, TCollection> extends ICollectionSerializer<TCollection> {
// 	create(source?: Iterable<TItem>): TCollection
// }
