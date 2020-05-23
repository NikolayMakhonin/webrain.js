import { ThenableIterator, ThenableOrValue, TOnFulfilled } from '../../async/async';
import { ThenableSync } from '../../async/ThenableSync';
import { TClass } from '../../helpers/helpers';
import { TypeMetaCollectionWithId } from '../TypeMeta';
import { IDeSerializerVisitor, IDeSerializeValue, IDeSerializeVisitorOptions, IObjectSerializer, ISerializable, ISerializedDataOrValue, ISerializedObject, ISerializedRef, ISerializedTyped, ISerializedValue, ISerializedValueArray, ISerializeOptions, ISerializerVisitor, ISerializeValue, ISerializeVisitorOptions, ITypeMetaSerializer, ITypeMetaSerializerCollection, ITypeMetaSerializerOverride } from './contracts';
export declare class SerializerVisitor implements ISerializerVisitor {
    types: string[];
    typesMap: {
        [uuid: string]: number;
    };
    objects: ISerializedTyped[];
    objectsMap: Array<ISerializedTyped | ISerializedRef>;
    private _typeMeta;
    constructor(typeMeta: ITypeMetaSerializerCollection);
    private addType;
    private addObject;
    private serializeObject;
    getNextSerialize(options: ISerializeVisitorOptions<any>): ISerializeValue;
    serialize<TValue = any>(value: TValue, options?: ISerializeVisitorOptions<TValue>): ISerializedValue;
}
export declare class DeSerializerVisitor implements IDeSerializerVisitor {
    private readonly _types;
    private readonly _objects;
    private readonly _instances;
    private _countDeserialized;
    private readonly _typeMeta;
    constructor(typeMeta: ITypeMetaSerializerCollection, types: string[], objects: ISerializedTyped[]);
    assertEnd(): void;
    getNextDeSerialize(options: IDeSerializeVisitorOptions<any>): IDeSerializeValue;
    deSerialize<TValue = any>(serializedValue: ISerializedValue, onfulfilled?: TOnFulfilled<TValue>, options?: IDeSerializeVisitorOptions<TValue>): ThenableOrValue<TValue>;
}
export declare type TSerializableClass<TObject extends ISerializable> = (new (...args: any[]) => TObject) & {
    readonly uuid: string;
};
export declare class TypeMetaSerializerCollection extends TypeMetaCollectionWithId<ITypeMetaSerializer> implements ITypeMetaSerializerCollection {
    constructor(proto?: ITypeMetaSerializerCollection);
    static default: TypeMetaSerializerCollection;
    private static makeTypeMetaSerializer;
    putSerializableType<TObject extends ISerializable>(type: TSerializableClass<TObject>, meta?: ITypeMetaSerializerOverride<TObject>): ITypeMetaSerializer<TObject>;
}
export declare function registerSerializable<TObject extends ISerializable>(type: TSerializableClass<TObject>, meta?: ITypeMetaSerializerOverride<TObject>): void;
export declare function registerSerializer<TValue = any>(type: TClass<TValue>, meta: ITypeMetaSerializer<TValue>): void;
export declare class ObjectSerializer implements IObjectSerializer {
    typeMeta: ITypeMetaSerializerCollection;
    constructor(typeMeta?: ITypeMetaSerializerCollection);
    static default: ObjectSerializer;
    serialize<TValue>(value: TValue, options?: ISerializeVisitorOptions<TValue>): ISerializedDataOrValue;
    deSerialize<TValue = any>(serializedValue: ISerializedDataOrValue, options?: IDeSerializeVisitorOptions<TValue>): TValue;
}
export declare function serializeArray(serialize: ISerializeValue, value: any[], length?: number): ISerializedValueArray;
export declare function deSerializeArray<T>(deSerialize: IDeSerializeValue, serializedValue: ISerializedValueArray, value: T[]): T[];
export declare function serializeIterable(serialize: ISerializeValue, value: Iterable<any>): ISerializedValueArray;
export declare function deSerializeIterableOrdered(serializedValue: ISerializedValueArray, add: (item: any) => void | ThenableSync): ThenableIterator<any>;
export declare function deSerializeIterable(serializedValue: ISerializedValueArray, add: (item: any) => void): void;
export declare function serializeObject(serialize: ISerializeValue, value: object, options?: ISerializeOptions): ISerializedObject;
export declare function deSerializeObject<T extends object>(deSerialize: IDeSerializeValue, serializedValue: ISerializedObject, value: T): T;
export declare function serializePrimitiveAsObject<T extends object>(serialize: ISerializeValue, object: T): ISerializedValue;
export declare function deSerializePrimitiveAsObject<T extends object>(deSerialize: IDeSerializeValue, serializedValue: ISerializedObject, valueFactory: (...args: any[]) => T): T;
