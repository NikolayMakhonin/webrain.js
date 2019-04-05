import {PropertyChangedObject} from '../../rx/object/PropertyChangedObject'
import {HasSubscribersSubject, IHasSubscribersSubject} from '../../rx/subjects/hasSubscribers'
import {IListChangedEvent} from '../contracts/IListChanged'

export class ListChangedObject<T> extends PropertyChangedObject {
	protected _listChanged?: IHasSubscribersSubject<IListChangedEvent<T>>
	public get listChanged(): IHasSubscribersSubject<IListChangedEvent<T>> {
		let {_listChanged} = this
		if (!_listChanged) {
			this._listChanged = _listChanged = new HasSubscribersSubject()
		}
		return _listChanged
	}

	public onListChanged(event: IListChangedEvent<T>): this {
		const {_listChanged} = this
		if (!_listChanged || !_listChanged.hasSubscribers) {
			return this
		}

		_listChanged.emit(event)

		return this
	}

	protected get _listChangedIfCanEmit() {
		const {_propertyChangedDisabled, _listChanged} = this
		return !_propertyChangedDisabled && _listChanged && _listChanged.hasSubscribers
			? _listChanged
			: null
	}
}
