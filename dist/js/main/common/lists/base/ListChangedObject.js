"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListChangedObject = void 0;

var _PropertyChangedObject = require("../../rx/object/PropertyChangedObject");

var _hasSubscribers = require("../../rx/subjects/hasSubscribers");

class ListChangedObject extends _PropertyChangedObject.PropertyChangedObject {
  get listChanged() {
    let {
      _listChanged
    } = this;

    if (!_listChanged) {
      this._listChanged = _listChanged = new _hasSubscribers.HasSubscribersSubject();
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

exports.ListChangedObject = ListChangedObject;