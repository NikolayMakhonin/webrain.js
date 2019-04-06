"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjectMap = void 0;

class ObjectMap {
  constructor(object) {
    this._object = object || {};
  }

  set(key, value) {
    this._object[key] = value;
    return this;
  }

  clear() {
    const {
      _object
    } = this;

    for (const key in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, key)) {
        delete _object[key];
      }
    }

    return this;
  }

  delete(key) {
    const {
      _object
    } = this;

    if (!Object.prototype.hasOwnProperty.call(_object, key)) {
      return false;
    }

    delete _object[key];
    return true;
  }

  get size() {
    return Object.keys(this._object).length;
  }

  [Symbol.iterator]() {
    return this.entries();
  }

  *entries() {
    const {
      _object
    } = this;

    for (const key in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, key)) {
        yield [key, _object[key]];
      }
    }
  }

  forEach(callbackfn, thisArg) {
    const {
      _object
    } = this;

    for (const key in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, key)) {
        callbackfn.call(thisArg, _object[key], key, this);
      }
    }
  }

  get(key) {
    return this._object[key];
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this._object, key);
  }

  keys() {
    return Object.keys(this._object)[Symbol.iterator]();
  }

  values() {
    return Object.values(this._object)[Symbol.iterator]();
  }

}

exports.ObjectMap = ObjectMap;