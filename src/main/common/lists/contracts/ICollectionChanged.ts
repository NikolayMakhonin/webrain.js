import {HasSubscribersSubject, IHasSubscribersSubject} from '../../rx/subjects/hasSubscribers'

export enum CollectionChangedType {
	/**
	 * Removed @items from @index and shift [shiftIndex .. size) -> index
	 */
	Removed,
	/**
	 * Shift [index .. size) -> shiftIndex and added @items to @index
	 * is set properties: newIndex, newItems
	 */
	Added,
	/**
	 * is set properties: index == newIndex, oldItems[1], newItems[1]
	 */
	Set,
	/**
	 * properties is not set
	 */
	Resorted,
	/**
	 * Moved @moveSize items from index to @moveIndex
	 */
	Moved,
}

export interface ICollectionChangedEvent<T> {
	readonly type: CollectionChangedType

	readonly index?: number
	readonly shiftIndex?: number
	readonly oldItems?: T[]
	readonly newItems?: T[]
	readonly moveIndex?: number
	readonly moveSize?: number
}

export interface ICollectionChanged<T> {
	readonly collectionChanged: IHasSubscribersSubject<ICollectionChangedEvent<T>>
	onCollectionChanged(event: ICollectionChangedEvent<T>): this
}
