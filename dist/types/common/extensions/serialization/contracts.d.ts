import { ThenableIterator, ThenableOrIteratorOrValue, ThenableOrValue, TOnFulfilled } from '../../async/async';
import { TClass } from '../../helpers/helpers';
import { ITypeMetaWithId, TypeMetaCollectionWithId } from '../TypeMeta';
export declare type ISerializedTypedValue = ISerializedPrimitive | ISerializedValueArray | ISerializedObject;
export interface ISerializedTyped {
    type: number;
    data: ISerializedTypedValue;
}
export interface ISerializedRef {
    id: number;
}
export interface ISerializedObject {
    [key: string]: ISerializedValue;
}
export declare type ISerializedPrimitive = string | number | boolean | null | undefined;
export declare type ISerializedValue = ISerializedTyped | ISerializedRef | ISerializedPrimitive | ISerializedValueArray;
export interface ISerializedValueArray extends Array<ISerializedValue> {
}
export declare type ISerializedDataOrValue = ISerializedData | ISerializedValue;
export interface ISerializedData {
    types?: string[];
    objects?: ISerializedTyped[];
    data: ISerializedValue;
}
export interface ISerializeOptions {
    arrayLength?: number;
    arrayAsObject?: boolean;
    objectKeepUndefined?: boolean;
}
export interface ISerializeVisitorOptions<TValue> extends ISerializeOptions {
    valueType?: TClass<TValue>;
}
export interface IDeSerializeOptions {
    arrayAsObject?: boolean;
}
export interface IDeSerializeVisitorOptions<TValue> extends IDeSerializeOptions {
    valueType?: TClass<TValue>;
    valueFactory?: (...args: any[]) => TValue;
}
export declare type ISerializeValue = <TValue = any>(value: TValue, options?: ISerializeVisitorOptions<TValue>) => ISerializedValue;
export declare type IDeSerializeValue = <TValue = any>(serializedValue: ISerializedValue, onfulfilled?: TOnFulfilled<TValue>, options?: IDeSerializeVisitorOptions<TValue>) => ThenableOrValue<TValue>;
export interface ISerializerVisitor {
    serialize: ISerializeValue;
}
export interface IDeSerializerVisitor {
    deSerialize: IDeSerializeValue;
}
export interface IValueSerializer<TValue = any> {
    serialize(serialize: ISerializeValue, value: TValue, options?: ISerializeOptions): ISerializedTypedValue;
    deSerialize(deSerialize: IDeSerializeValue, serializedValue: ISerializedTypedValue, valueFactory: (...args: any[]) => TValue, options?: IDeSerializeOptions): ThenableOrIteratorOrValue<TValue>;
}
export interface ISerializer {
    serialize<TValue>(value: TValue, options?: ISerializeVisitorOptions<TValue>): ISerializedDataOrValue;
}
export interface IDeSerializer {
    deSerialize<TValue = any>(serializedData: ISerializedDataOrValue, options?: IDeSerializeVisitorOptions<TValue>): TValue;
}
export interface ITypeMetaSerializer<TValue = any> extends ITypeMetaWithId {
    serializer: IValueSerializer<TValue>;
    valueFactory?: (...args: any[]) => any;
}
export interface ITypeMetaSerializerOverride<TValue = any> {
    uuid?: string;
    serializer?: {
        serialize?(serialize: ISerializeValue, value: TValue, options?: ISerializeOptions): ISerializedTypedValue;
        deSerialize?(deSerialize: IDeSerializeValue, serializedValue: ISerializedTypedValue, valueFactory: (...args: any[]) => TValue, options?: IDeSerializeOptions): TValue | ThenableIterator<TValue>;
    };
    valueFactory?: (...args: any[]) => any;
}
export interface ITypeMetaSerializerCollection extends TypeMetaCollectionWithId<ITypeMetaSerializer> {
    getMeta<TValue>(type: TClass<TValue>): ITypeMetaSerializer<TValue>;
    putType<TValue>(type: TClass<TValue>, meta: ITypeMetaSerializer<TValue>): ITypeMetaSerializer<TValue>;
    deleteType<TValue>(type: TClass<TValue>): ITypeMetaSerializer<TValue>;
}
export interface IObjectSerializer extends ISerializer, IDeSerializer {
    typeMeta: ITypeMetaSerializerCollection;
}
export interface ISerializable {
    serialize(serialize: ISerializeValue, options?: ISerializeOptions): ISerializedTypedValue;
    deSerialize(deSerialize: IDeSerializeValue, serializedValue: ISerializedTypedValue, options?: IDeSerializeOptions): void | ThenableIterator<any>;
}
