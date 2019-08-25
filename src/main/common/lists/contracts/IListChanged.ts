import {IHasSubscribersSubject} from '../../rx/subjects/hasSubscribers'
import {IPropertyChangedObject} from './IPropertyChanged'

export enum ListChangedType {
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

export interface IListChangedEvent<T> {
	readonly type: ListChangedType

	readonly index?: number
	readonly shiftIndex?: number
	readonly oldItems?: T[]
	readonly newItems?: T[]
	readonly moveIndex?: number
	readonly moveSize?: number
}

export interface IListChanged<T> {
	readonly listChanged: IHasSubscribersSubject<IListChangedEvent<T>>
}

export interface IListChangedObject<T> extends IListChanged<T>, IPropertyChangedObject {
	readonly listChanged: IHasSubscribersSubject<IListChangedEvent<T>>
	onListChanged(event: IListChangedEvent<T>): this
}

// export interface IObservableList<T> extends IListChanged<T>, IList<T> {
// }
