import { PropertyChangedObject } from '../../rx/object/PropertyChangedObject';
import { HasSubscribersSubject } from '../../rx/subjects/hasSubscribers';
export class ListChangedObject extends PropertyChangedObject {
  get listChanged() {
    let {
      _listChanged
    } = this;

    if (!_listChanged) {
      this._listChanged = _listChanged = new HasSubscribersSubject();
    }

    return _listChanged;
  }

  onListChanged(event) {
    const {
      _listChanged
    } = this;

    if (!_listChanged || !_listChanged.hasSubscribers) {
      return this;
    }

    _listChanged.emit(event);

    return this;
  }

  get _listChangedIfCanEmit() {
    const {
      propertyChangedDisabled
    } = this.__meta;
    const {
      _listChanged
    } = this;
    return !propertyChangedDisabled && _listChanged && _listChanged.hasSubscribers ? _listChanged : null;
  }

}