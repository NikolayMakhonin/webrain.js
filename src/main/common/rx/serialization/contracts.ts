export type ISerializedValue = ISerializedObject | ISerializedArray | string | number | boolean
export interface ISerializedArray extends Array<ISerializedValue> {

}
export interface ISerializedObject {
	[key: string]: ISerializedValue
}
export type WriteValue<TValue> = (value: TValue) => ISerializedValue
export type ReadValue<TValue> = (serializedValue: ISerializedValue, valueFactory: () => TValue) => TValue

export interface ISerializable {
	serialize(): ISerializedValue
	deSerialize(serializedValue: ISerializedValue)
}

export interface ICollectionSerializer<TCollection> {
	serialize(collection: TCollection): ISerializedArray
	deSerialize(serializedArray: ISerializedArray): TCollection
}

export interface ICollectionFactorySerializer<TItem, TCollection> extends ICollectionSerializer<TCollection> {
	create(source?: Iterable<TItem>): TCollection
}
