import {HasSubscribersSubject, IHasSubscribersSubject} from '../../rx/subjects/hasSubscribers'

export enum SetChangedType {
	/**
	 * is set properties: oldItem
	 */
	Removed,
	/**
	 * is set properties: newItem
	 */
	Added,
}

export interface ISetChangedEvent<T> {
	readonly type: SetChangedType

	readonly oldItems?: T[]
	readonly newItems?: T[]
}

export interface ISetChanged<T> {
	readonly setChanged: IHasSubscribersSubject<ISetChangedEvent<T>>
	onSetChanged(event: ISetChangedEvent<T>): this
}
