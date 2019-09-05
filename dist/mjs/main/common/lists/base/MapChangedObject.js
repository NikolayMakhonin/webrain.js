import { PropertyChangedObject } from '../../rx/object/PropertyChangedObject';
import { HasSubscribersSubject } from '../../rx/subjects/hasSubscribers';
export class MapChangedObject extends PropertyChangedObject {
  get mapChanged() {
    let {
      _mapChanged
    } = this;

    if (!_mapChanged) {
      this._mapChanged = _mapChanged = new HasSubscribersSubject();
    }

    return _mapChanged;
  }

  onMapChanged(event) {
    const {
      _mapChanged
    } = this;

    if (!_mapChanged || !_mapChanged.hasSubscribers) {
      return this;
    }

    _mapChanged.emit(event);

    return this;
  }

  get _mapChangedIfCanEmit() {
    const {
      __meta
    } = this;
    const propertyChangedDisabled = __meta ? __meta.propertyChangedDisabled : null;
    const {
      _mapChanged
    } = this;
    return !propertyChangedDisabled && _mapChanged && _mapChanged.hasSubscribers ? _mapChanged : null;
  }

}