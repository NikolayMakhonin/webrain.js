import {ITypeMetaWithId, TClass, TypeMetaCollectionWithId} from '../TypeMeta'

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

export type ISerializeValue = (value: any, valueType?: TClass) => ISerializedValue
export type IDeSerializeValue = <TValue>(
	serializedValue: ISerializedValue,
	valueType?: TClass,
	valueFactory?: () => TValue,
) => TValue

export interface ISerializerVisitor {
	serialize: ISerializeValue
}

export interface IDeSerializerVisitor {
	deSerialize: IDeSerializeValue
}

export interface IValueSerializer<TValue> {
	serialize(
		serialize: ISerializeValue,
		value: TValue,
	): ISerializedTypedValue
	deSerialize(
		deSerialize: IDeSerializeValue,
		serializedValue: ISerializedTypedValue,
		valueFactory?: () => TValue,
	): TValue
}

export interface ISerializer {
	serialize(value: any, valueType?: TClass): ISerializedDataOrValue
}

export interface IDeSerializer {
	deSerialize<TValue>(
		serializedData: ISerializedDataOrValue,
		valueType?: TClass,
		valueFactory?: () => TValue,
	): TValue
}

export interface ITypeMetaSerializer<TValue> extends ITypeMetaWithId {
	serializer: IValueSerializer<TValue>
	valueFactory?: () => any
}

export interface ITypeMetaSerializerCollection extends TypeMetaCollectionWithId<ITypeMetaSerializer<any>> {

}

export interface IObjectSerializer extends ISerializer, IDeSerializer {
	typeMeta: ITypeMetaSerializerCollection
}

// endregion

// region Serializable

export interface ISerializable {
	serialize(
		serialize: ISerializeValue,
	): ISerializedTypedValue
	deSerialize(
		deSerialize: IDeSerializeValue,
		serializedValue: ISerializedTypedValue,
	)
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
