import {HasSubscribersSubject, IHasSubscribersSubject} from '../../rx/subjects/hasSubscribers'

export enum CollectionChangedType {
	/**
	 * is set properties: oldIndex, oldItems
	 */
	Removed,
	/**
	 * is set properties: newIndex, newItems
	 */
	Added,
	/**
	 * is set properties: oldIndex == newIndex, oldItems[1], newItems[1]
	 */
	Set,
	/**
	 * properties is not set
	 */
	Resorted,
	/**
	 * is set properties: oldIndex, newIndex, newItems[1]
	 */
	Moved,
	/**
	 * is set properties: oldIndex, newIndex
	 */
	Shift,
}

export interface ICollectionChangedEvent<T> {
	readonly type: CollectionChangedType
	/** index of the first old item */
	readonly oldIndex?: number
	/** index of the first new item */
	readonly newIndex?: number
	readonly oldItems?: T[]
	readonly newItems?: T[]
}

export interface ICollectionChanged<T> {
	readonly collectionChanged: IHasSubscribersSubject<ICollectionChangedEvent<T>>
	onCollectionChanged(event: ICollectionChangedEvent<T>): this
}
