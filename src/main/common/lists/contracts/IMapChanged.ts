import {HasSubscribersSubject, IHasSubscribersSubject} from '../../rx/subjects/hasSubscribers'

export enum MapChangedType {
	/**
	 * is set properties: oldItem
	 */
	Removed,
	/**
	 * is set properties: newItem
	 */
	Added,
	/**
	 * is set properties: newItem, oldItem
	 */
	Set,
}

export interface IMapChangedEvent<K, V> {
	readonly type: MapChangedType

	readonly key: K
	readonly oldValue?: V
	readonly newValue?: V
}

export interface IMapChanged<K, V> {
	readonly mapChanged: IHasSubscribersSubject<IMapChangedEvent<K, V>>
	onMapChanged(event: IMapChangedEvent<K, V>): this
}
