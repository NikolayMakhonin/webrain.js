"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapChangedObject = void 0;

var _PropertyChangedObject = require("../../rx/object/PropertyChangedObject");

var _hasSubscribers = require("../../rx/subjects/hasSubscribers");

class MapChangedObject extends _PropertyChangedObject.PropertyChangedObject {
  get mapChanged() {
    let {
      _mapChanged
    } = this;

    if (!_mapChanged) {
      this._mapChanged = _mapChanged = new _hasSubscribers.HasSubscribersSubject();
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
      _propertyChangedDisabled,
      _mapChanged
    } = this;
    return !_propertyChangedDisabled && _mapChanged && _mapChanged.hasSubscribers ? _mapChanged : null;
  }

}

exports.MapChangedObject = MapChangedObject;