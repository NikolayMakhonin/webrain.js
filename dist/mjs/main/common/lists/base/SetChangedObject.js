import { PropertyChangedObject } from '../../rx/object/PropertyChangedObject';
import { HasSubscribersSubject } from '../../rx/subjects/hasSubscribers';
export class SetChangedObject extends PropertyChangedObject {
  get setChanged() {
    let {
      _setChanged
    } = this;

    if (!_setChanged) {
      this._setChanged = _setChanged = new HasSubscribersSubject();
    }

    return _setChanged;
  }

  onSetChanged(event) {
    const {
      propertyChangedDisabled
    } = this.__meta;
    const {
      _setChanged
    } = this;

    if (propertyChangedDisabled || !_setChanged || !_setChanged.hasSubscribers) {
      return this;
    }

    _setChanged.emit(event);

    return this;
  }

  get _setChangedIfCanEmit() {
    const {
      propertyChangedDisabled
    } = this.__meta;
    const {
      _setChanged
    } = this;
    return !propertyChangedDisabled && _setChanged && _setChanged.hasSubscribers ? _setChanged : null;
  }

}