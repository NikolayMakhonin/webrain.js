import {HasSubscribersSubject, IHasSubscribersSubject} from '../../rx/subjects/hasSubscribers'

export enum CollectionChangedType {
	/**
	 * is set properties: index, oldItems
	 */
	Removed,
	/**
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
	 * is set properties: index, newIndex, newItems[1]
	 */
	Moved,
	/**
	 * is set properties: index, newIndex, newSize
	 */
	Shift,
	/**
	 * is set properties: oldSize, newSize
	 */
	ReSize,
}

export interface ICollectionChangedEvent<T> {
	readonly type: CollectionChangedType

	/** index of the first old item */
	readonly index?: number
	/** move with replace [shiftIndex .. size) -> index */
	readonly shiftIndex?: number

	readonly oldItems?: T[]
	readonly newItems?: T[]

	readonly oldSize?: number
	readonly newSize?: number
}

export interface ICollectionChanged<T> {
	readonly collectionChanged: IHasSubscribersSubject<ICollectionChangedEvent<T>>
	onCollectionChanged(event: ICollectionChangedEvent<T>): this
}
