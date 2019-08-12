import {ArrayMap} from '../../../../../../../src/main/common/lists/ArrayMap'
import {SortedList} from '../../../../../../../src/main/common/lists/SortedList'
import {ISetOptions, Property} from '../../../../../../../src/main/common/rx/object/properties/property'

export interface ICollectionSetOptions<TItem, TCollection> extends ISetOptions<TCollection> {
	fillOptions?: FillCollectionOptions<TItem, TCollection>,
}

export class CollectionProperty<TItem, TCollection extends Iterable<TItem>> extends Property<TCollection> {
	constructor(defaultOptions: ICollectionSetOptions<TItem, TCollection>) {
		super({
			fillFunc: (target: TCollection, source: TCollection): boolean => {
				const {_defaultOptions} = this
				if (!_defaultOptions) {
					return false
				}

				const {fillOptions} = _defaultOptions as ICollectionSetOptions<TItem, TCollection>
				if (!fillOptions) {
					return false
				}

				FillCollection
					.fillFrom(source, fillOptions)
					.fillTo(target)

				return true
			},
			...defaultOptions,
		})
	}
}

export class SortedListProperty<TItem> extends CollectionProperty<TItem, SortedList<TItem>> {
	constructor(defaultOptions: ICollectionSetOptions<TItem, SortedList<TItem>>) {
		super({
			fillFunc: (target: SortedList<TItem>, source: SortedList<TItem>) => {
				const {_defaultOptions} = this
				if (!_defaultOptions) {
					return false
				}

				const {fillOptions} = _defaultOptions as ICollectionSetOptions<TItem, SortedList<TItem>>
				if (!fillOptions) {
					return false
				}

				FillCollection
					.fillFrom(source, fillOptions)
					.fillTo(target)
			},
			...defaultOptions,
		})
	}
}

export class MapProperty<K, V> extends CollectionProperty<[K, V], Map<K, V>> {
	constructor(defaultOptions: ICollectionSetOptions<[K, V], Map<K, V>>) {
		super(defaultOptions)
	}
}

export class SetProperty<TItem> extends CollectionProperty<TItem, Set<TItem>> {
	constructor(defaultOptions: ICollectionSetOptions<TItem,Set<TItem>>) {
		super(defaultOptions)
	}
}
