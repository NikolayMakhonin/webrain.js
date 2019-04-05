import {PropertyChangedObject} from '../../rx/object/PropertyChangedObject'
import {HasSubscribersSubject, IHasSubscribersSubject} from '../../rx/subjects/hasSubscribers'
import {ISetChangedEvent} from '../contracts/ISetChanged'

export class SetChangedObject<T> extends PropertyChangedObject {
	protected _setChanged?: IHasSubscribersSubject<ISetChangedEvent<T>>
	public get setChanged(): IHasSubscribersSubject<ISetChangedEvent<T>> {
		let {_setChanged} = this
		if (!_setChanged) {
			this._setChanged = _setChanged = new HasSubscribersSubject()
		}
		return _setChanged
	}

	public onSetChanged(event: ISetChangedEvent<T>): this {
		const {_propertyChangedDisabled, _setChanged} = this
		if (_propertyChangedDisabled || !_setChanged || !_setChanged.hasSubscribers) {
			return this
		}

		_setChanged.emit(event)

		return this
	}

	protected get _setChangedIfCanEmit() {
		const {_propertyChangedDisabled, _setChanged} = this
		return !_propertyChangedDisabled && _setChanged && _setChanged.hasSubscribers
			? _setChanged
			: null
	}
}
