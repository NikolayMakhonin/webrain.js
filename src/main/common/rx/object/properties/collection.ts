import {SortedList} from '../../../lists/SortedList'
import {Property} from './property'

export class CollectionProperty<TItem, TCollection> extends Property<TCollection> {
	constructor(collectionFactory: (source?: Iterable<TItem>) => TCollection) {
		super(collectionFactory)
	}
}

export class SortedListProperty<TItem> extends CollectionProperty<TItem, SortedList<TItem>> {

}

export class MapProperty<K, V> extends CollectionProperty<[K, V], Map<K, V>> {

}

export class SetProperty<TItem> extends CollectionProperty<TItem, Set<TItem>> {

}
