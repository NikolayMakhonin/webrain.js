import {PropertyChangedObject} from '../../rx/object/PropertyChangedObject'
import {HasSubscribersSubject, IHasSubscribersSubject} from '../../rx/subjects/hasSubscribers'
import {IMapChangedEvent, IMapChangedObject} from '../contracts/IMapChanged'

export class MapChangedObject<K, V> extends PropertyChangedObject implements IMapChangedObject<K, V> {
	protected _mapChanged?: IHasSubscribersSubject<IMapChangedEvent<K, V>>
	get mapChanged(): IHasSubscribersSubject<IMapChangedEvent<K, V>> {
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
		const {__meta} = this
		const propertyChangedDisabled = __meta ? __meta.propertyChangedDisabled : null
		const {_mapChanged} = this
		return !propertyChangedDisabled && _mapChanged && _mapChanged.hasSubscribers
			? _mapChanged
			: null
	}
}
