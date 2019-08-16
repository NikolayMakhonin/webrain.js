import {ThenableIterator, ThenableOrValue, TOnFulfilled} from '../../async/async'
import {TClass} from '../../helpers/helpers'
import {ITypeMetaWithId, TypeMetaCollectionWithId} from '../TypeMeta'

// region Serialized Value

export type ISerializedTypedValue = ISerializedPrimitive|ISerializedValueArray|ISerializedObject

export interface ISerializedTyped {
	type: number
	data: ISerializedTypedValue
}

export interface ISerializedRef {
	id: number
}

export interface ISerializedObject {
	[key: string]: ISerializedValue,
}

export type ISerializedPrimitive = string | number | boolean | null | undefined
export type ISerializedValue = ISerializedTyped | ISerializedRef | ISerializedPrimitive | ISerializedValueArray
export interface ISerializedValueArray extends Array<ISerializedValue> {

}

// endregion

// region Serialized Data

export type ISerializedDataOrValue = ISerializedData | ISerializedValue
export interface ISerializedData {
	types?: string[]
	objects?: ISerializedTyped[]
	data: ISerializedValue
}

// endregion

// region Serializers

export interface ISerializeOptions {
	arrayLength?: number
	arrayAsObject?: boolean
	objectKeepUndefined?: boolean
}

export interface ISerializeVisitorOptions<TValue> extends ISerializeOptions {
	valueType?: TClass<TValue>,
}

export interface IDeSerializeOptions {
	arrayAsObject?: boolean
	// waitDeserialize?: boolean
}

export interface IDeSerializeVisitorOptions<TValue> extends IDeSerializeOptions {
	valueType?: TClass<TValue>,
	valueFactory?: (...args) => TValue,
}

export type ISerializeValue = <TValue = any>(
	value: TValue,
	options?: ISerializeVisitorOptions<TValue>,
) => ISerializedValue
export type IDeSerializeValue = <TValue = any>(
	serializedValue: ISerializedValue,
	onfulfilled?: TOnFulfilled<TValue>,
	options?: IDeSerializeVisitorOptions<TValue>,
) => ThenableOrValue<TValue>

export interface ISerializerVisitor {
	serialize: ISerializeValue
}

export interface IDeSerializerVisitor {
	deSerialize: IDeSerializeValue
}

export interface IValueSerializer<TValue = any> {
	serialize(
		serialize: ISerializeValue,
		value: TValue,
		options?: ISerializeOptions,
	): ISerializedTypedValue
	deSerialize(
		deSerialize: IDeSerializeValue,
		serializedValue: ISerializedTypedValue,
		valueFactory: (...args) => TValue,
		options?: IDeSerializeOptions,
	): TValue|ThenableIterator<TValue>
}

export interface ISerializer {
	serialize<TValue>(
		value: TValue,
		options?: ISerializeVisitorOptions<TValue>,
	): ISerializedDataOrValue
}

export interface IDeSerializer {
	deSerialize<TValue = any>(
		serializedData: ISerializedDataOrValue,
		options?: IDeSerializeVisitorOptions<TValue>,
	): TValue
}

export interface ITypeMetaSerializer<TValue = any> extends ITypeMetaWithId {
	serializer: IValueSerializer<TValue>
	valueFactory?: (...args) => any
}

export interface ITypeMetaSerializerOverride<TValue = any> {
	uuid?: string
	serializer?: {
		serialize?(
			serialize: ISerializeValue,
			value: TValue,
			options?: ISerializeOptions,
		): ISerializedTypedValue
		deSerialize?(
			deSerialize: IDeSerializeValue,
			serializedValue: ISerializedTypedValue,
			valueFactory: (...args) => TValue,
			options?: IDeSerializeOptions,
		): TValue|ThenableIterator<TValue>,
	}
	valueFactory?: (...args) => any
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
		options?: ISerializeOptions,
	): ISerializedTypedValue
	deSerialize(
		deSerialize: IDeSerializeValue,
		serializedValue: ISerializedTypedValue,
		options?: IDeSerializeOptions,
	): void|ThenableIterator<any>
}

// endregion
