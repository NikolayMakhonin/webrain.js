"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservableMap = void 0;

var _MapChangedObject = require("./base/MapChangedObject");

var _IMapChanged = require("./contracts/IMapChanged");

var _Symbol$toStringTag = Symbol.toStringTag;
var _Symbol$iterator = Symbol.iterator;

class ObservableMap extends _MapChangedObject.MapChangedObject {
  constructor(map) {
    super();
    this[_Symbol$toStringTag] = 'Map';
    this._map = map || new Map();
  }

  set(key, value) {
    const {
      _map
    } = this;
    const oldSize = _map.size;

    const oldValue = _map.get(key);

    _map.set(key, value);

    const size = _map.size;

    if (size > oldSize) {
      const {
        _mapChangedIfCanEmit
      } = this;

      if (_mapChangedIfCanEmit) {
        _mapChangedIfCanEmit.emit({
          type: _IMapChanged.MapChangedType.Added,
          key,
          newValue: value
        });
      }

      this.onPropertyChanged({
        name: 'size',
        oldValue: oldSize,
        newValue: size
      });
    } else {
      const {
        _mapChangedIfCanEmit
      } = this;

      if (_mapChangedIfCanEmit) {
        _mapChangedIfCanEmit.emit({
          type: _IMapChanged.MapChangedType.Set,
          key,
          oldValue,
          newValue: value
        });
      }
    }

    return this;
  }

  delete(key) {
    const {
      _map
    } = this;
    const oldSize = _map.size;

    const oldValue = _map.get(key);

    this._map.delete(key);

    const size = _map.size;

    if (size < oldSize) {
      const {
        _mapChangedIfCanEmit
      } = this;

      if (_mapChangedIfCanEmit) {
        _mapChangedIfCanEmit.emit({
          type: _IMapChanged.MapChangedType.Removed,
          key,
          oldValue
        });
      }

      this.onPropertyChanged({
        name: 'size',
        oldValue: oldSize,
        newValue: size
      });
      return true;
    }

    return false;
  }

  clear() {
    const {
      size
    } = this;

    if (size === 0) {
      return;
    }

    const {
      _mapChangedIfCanEmit
    } = this;

    if (_mapChangedIfCanEmit) {
      const oldItems = Array.from(this.entries());

      this._map.clear();

      for (let i = 0, len = oldItems.length; i < len; i++) {
        const oldItem = oldItems[i];

        _mapChangedIfCanEmit.emit({
          type: _IMapChanged.MapChangedType.Removed,
          key: oldItem[0],
          oldValue: oldItem[1]
        });
      }
    } else {
      this._map.clear();
    }

    this.onPropertyChanged({
      name: 'size',
      oldValue: size,
      newValue: 0
    });
  } // region Unchanged Map methods


  get size() {
    return this._map.size;
  }

  [_Symbol$iterator]() {
    return this._map[Symbol.iterator]();
  }

  get(key) {
    return this._map.get(key);
  }

  entries() {
    return this._map.entries();
  }

  forEach(callbackfn, thisArg) {
    this._map.forEach((k, v, s) => callbackfn.call(thisArg, k, v, this));
  }

  has(key) {
    return this._map.has(key);
  }

  keys() {
    return this._map.keys();
  }

  values() {
    return this._map.values();
  } // endregion


}

exports.ObservableMap = ObservableMap;