import {IPropertyChangedObject} from '../../rx/object/IPropertyChanged'
import {IHasSubscribersSubject} from '../../rx/subjects/hasSubscribers'

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
}

export interface IMapChangedObject<K, V> extends IMapChanged<K, V>, IPropertyChangedObject {
	readonly mapChanged: IHasSubscribersSubject<IMapChangedEvent<K, V>>
	onMapChanged(event: IMapChangedEvent<K, V>): this
}

export interface IObservableMap<K, V> extends IMapChangedObject<K, V>, Map<K, V> {
}
