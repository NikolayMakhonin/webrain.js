import {PropertyChangedObject} from '../../rx/object/PropertyChangedObject'
import {HasSubscribersSubject, IHasSubscribersSubject} from '../../rx/subjects/hasSubscribers'
import {ISetChangedEvent, ISetChangedObject} from '../contracts/ISetChanged'

export class SetChangedObject<T> extends PropertyChangedObject implements ISetChangedObject<T> {
	protected _setChanged?: IHasSubscribersSubject<ISetChangedEvent<T>>
	public get setChanged(): IHasSubscribersSubject<ISetChangedEvent<T>> {
		let {_setChanged} = this
		if (!_setChanged) {
			this._setChanged = _setChanged = new HasSubscribersSubject()
		}
		return _setChanged
	}

	public onSetChanged(event: ISetChangedEvent<T>): this {
		const {propertyChangedDisabled} = this.__meta
		const {_setChanged} = this
		if (propertyChangedDisabled || !_setChanged || !_setChanged.hasSubscribers) {
			return this
		}

		_setChanged.emit(event)

		return this
	}

	protected get _setChangedIfCanEmit() {
		const {propertyChangedDisabled} = this.__meta
		const {_setChanged} = this
		return !propertyChangedDisabled && _setChanged && _setChanged.hasSubscribers
			? _setChanged
			: null
	}
}
