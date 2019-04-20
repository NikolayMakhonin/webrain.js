import {SortedList} from '../../../lists/SortedList'
import {
	ICollectionFactorySerializer,
	ICollectionSerializer,
	ISerializable, ISerializedArray,
	ISerializedObject,
} from '../../serialization/contracts'
import {Property} from './property'

export class CollectionProperty<TValue> extends Property<TValue> {
	protected readonly _collectionFactory: (source: Iterable<TValue>) => TValue

	constructor(collectionFactory: (source?: Iterable<TValue>) => TValue) {
		super(collectionFactory)
	}
}

export class CollectionPropertySerializable<TItem, TCollection> extends Property<TCollection> implements ISerializable {
	protected readonly _collectionSerializer: ICollectionSerializer<TCollection>

	constructor(collectionFactorySerializer: ICollectionFactorySerializer<TItem, TCollection>) {
		super(collectionFactorySerializer.create)

		this._collectionSerializer = collectionFactorySerializer
	}

	// region ISerializable

	public serialize(): ISerializedObject {
		return {
			value: this._collectionSerializer.serialize(this.value),
		}
	}

	public deSerialize(serializedObject: ISerializedObject & { value?: ISerializedArray }) {
		this.value = this._collectionSerializer.deSerialize(serializedObject.value)
	}

	// endregion
}

export class SortedListPropertySerializable<TItem> extends CollectionPropertySerializable<TItem, SortedList<TItem>> {

}

export class MapPropertySerializable<K, V> extends CollectionPropertySerializable<[K, V], Map<K, V>> {

}

export class SetPropertySerializable<TItem> extends CollectionPropertySerializable<TItem, Set<TItem>> {

}
