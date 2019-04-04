"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectionChangedObject = void 0;

var _PropertyChangedObject = require("../rx/object/PropertyChangedObject");

var _hasSubscribers = require("../rx/subjects/hasSubscribers");

class CollectionChangedObject extends _PropertyChangedObject.PropertyChangedObject {
  get collectionChanged() {
    let {
      _collectionChanged
    } = this;

    if (!_collectionChanged) {
      this._collectionChanged = _collectionChanged = new _hasSubscribers.HasSubscribersSubject();
    }

    return _collectionChanged;
  }

  onCollectionChanged(event) {
    const {
      _collectionChanged
    } = this;

    if (!_collectionChanged || !_collectionChanged.hasSubscribers) {
      return this;
    }

    _collectionChanged.emit(event);

    return this;
  }

  get _collectionChangedIfCanEmit() {
    const {
      _propertyChangedDisabled,
      _collectionChanged
    } = this;
    return !_propertyChangedDisabled && _collectionChanged && _collectionChanged.hasSubscribers ? _collectionChanged : null;
  }

}

exports.CollectionChangedObject = CollectionChangedObject;