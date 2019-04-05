import {PropertyChangedObject} from '../../rx/object/PropertyChangedObject'
import {HasSubscribersSubject, IHasSubscribersSubject} from '../../rx/subjects/hasSubscribers'
import {IMapChangedEvent} from '../contracts/IMapChanged'

export class MapChangedObject<K, V> extends PropertyChangedObject {
	protected _mapChanged?: IHasSubscribersSubject<IMapChangedEvent<K, V>>
	public get mapChanged(): IHasSubscribersSubject<IMapChangedEvent<K, V>> {
		let {_mapChanged} = this
		if (!_mapChanged) {
			this._mapChanged = _mapChanged = new HasSubscribersSubject()
		}
		return _mapChanged
	}

	public onMapChanged(event: IMapChangedEvent<K, V>): this {
		const {_mapChanged} = this
		if (!_mapChanged || !_mapChanged.hasSubscribers) {
			return this
		}

		_mapChanged.emit(event)

		return this
	}

	protected get _mapChangedIfCanEmit() {
		const {_propertyChangedDisabled, _mapChanged} = this
		return !_propertyChangedDisabled && _mapChanged && _mapChanged.hasSubscribers
			? _mapChanged
			: null
	}
}
