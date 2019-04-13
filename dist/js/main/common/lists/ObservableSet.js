"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservableSet = void 0;

var _SetChangedObject = require("./base/SetChangedObject");

var _ISetChanged = require("./contracts/ISetChanged");

var _Symbol$toStringTag = Symbol.toStringTag;
var _Symbol$iterator = Symbol.iterator;

class ObservableSet extends _SetChangedObject.SetChangedObject {
  constructor(set) {
    super();
    this[_Symbol$toStringTag] = 'Set';
    this._set = set || new Set();
  }

  add(value) {
    const {
      _set
    } = this;
    const oldSize = _set.size;

    this._set.add(value);

    const size = _set.size;

    if (size > oldSize) {
      const {
        _setChangedIfCanEmit
      } = this;

      if (_setChangedIfCanEmit) {
        _setChangedIfCanEmit.emit({
          type: _ISetChanged.SetChangedType.Added,
          newItems: [value]
        });
      }

      this.onPropertyChanged({
        name: 'size',
        oldValue: oldSize,
        newValue: size
      });
    }

    return this;
  }

  delete(value) {
    const {
      _set
    } = this;
    const oldSize = _set.size;

    this._set.delete(value);

    const size = _set.size;

    if (size < oldSize) {
      const {
        _setChangedIfCanEmit
      } = this;

      if (_setChangedIfCanEmit) {
        _setChangedIfCanEmit.emit({
          type: _ISetChanged.SetChangedType.Removed,
          oldItems: [value]
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
      _setChangedIfCanEmit
    } = this;

    if (_setChangedIfCanEmit) {
      const oldItems = Array.from(this);

      this._set.clear();

      _setChangedIfCanEmit.emit({
        type: _ISetChanged.SetChangedType.Removed,
        oldItems
      });
    } else {
      this._set.clear();
    }

    this.onPropertyChanged({
      name: 'size',
      oldValue: size,
      newValue: 0
    });
  } // region Unchanged Set methods


  get size() {
    return this._set.size;
  }

  [_Symbol$iterator]() {
    return this._set[Symbol.iterator]();
  }

  entries() {
    return this._set.entries();
  }

  forEach(callbackfn, thisArg) {
    this._set.forEach((k, v, s) => callbackfn.call(thisArg, k, v, this));
  }

  has(value) {
    return this._set.has(value);
  }

  keys() {
    return this._set.keys();
  }

  values() {
    return this._set.values();
  } // endregion


}

exports.ObservableSet = ObservableSet;