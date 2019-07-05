import {SortedList} from '../../../lists/SortedList'
import {ISetOptions, Property} from './property'
import {ArrayMap} from "../../../lists/ArrayMap";

export class CollectionProperty<TItem, TCollection> extends Property<TCollection> {
	constructor(defaultOptions: ISetOptions<TCollection>) {
		super(defaultOptions)
	}
}

export class SortedListProperty<TItem> extends CollectionProperty<TItem, SortedList<TItem>> {
	constructor(defaultOptions: ISetOptions<SortedList<TItem>>) {
		super({
			fillFunc(target: SortedList<TItem>, source: SortedList<TItem>) {
				target
			},
			...defaultOptions,
		})
	}
}

export class MapProperty<K, V> extends CollectionProperty<[K, V], Map<K, V>> {
	constructor(defaultOptions: ISetOptions<Map<K, V>>) {
		super(defaultOptions)
	}
}

export class SetProperty<TItem> extends CollectionProperty<TItem, Set<TItem>> {
	constructor(defaultOptions: ISetOptions<Set<TItem>>) {
		super(defaultOptions)
	}
}
