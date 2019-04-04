import {PropertyChangedObject} from '../rx/object/PropertyChangedObject'
import {HasSubscribersSubject, IHasSubscribersSubject} from '../rx/subjects/hasSubscribers'
import {ICollectionChangedEvent} from './contracts/ICollectionChanged'

export class CollectionChangedObject<T> extends PropertyChangedObject {
	protected _collectionChanged?: IHasSubscribersSubject<ICollectionChangedEvent<T>>
	public get collectionChanged(): IHasSubscribersSubject<ICollectionChangedEvent<T>> {
		let {_collectionChanged} = this
		if (!_collectionChanged) {
			this._collectionChanged = _collectionChanged = new HasSubscribersSubject()
		}
		return _collectionChanged
	}

	public onCollectionChanged(event: ICollectionChangedEvent<T>): this {
		const {_collectionChanged} = this
		if (!_collectionChanged || !_collectionChanged.hasSubscribers) {
			return this
		}

		_collectionChanged.emit(event)

		return this
	}

	protected get _collectionChangedIfCanEmit() {
		const {_propertyChangedDisabled, _collectionChanged} = this
		return !_propertyChangedDisabled && _collectionChanged && _collectionChanged.hasSubscribers
			? _collectionChanged
			: null
	}
}
