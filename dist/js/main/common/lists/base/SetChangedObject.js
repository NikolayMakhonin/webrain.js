"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetChangedObject = void 0;

var _PropertyChangedObject = require("../../rx/object/PropertyChangedObject");

var _hasSubscribers = require("../../rx/subjects/hasSubscribers");

class SetChangedObject extends _PropertyChangedObject.PropertyChangedObject {
  get setChanged() {
    let {
      _setChanged
    } = this;

    if (!_setChanged) {
      this._setChanged = _setChanged = new _hasSubscribers.HasSubscribersSubject();
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

exports.SetChangedObject = SetChangedObject;