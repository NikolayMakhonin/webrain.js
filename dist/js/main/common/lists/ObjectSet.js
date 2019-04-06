"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjectSet = void 0;

class ObjectSet {
  constructor(object) {
    this._object = object || {};
  }

  add(value) {
    this._object[value] = true;
    return this;
  }

  delete(value) {
    const {
      _object
    } = this;

    if (!Object.prototype.hasOwnProperty.call(_object, value)) {
      return false;
    }

    delete _object[value];
    return true;
  }

  clear() {
    const {
      _object
    } = this;

    for (const value in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, value)) {
        delete _object[value];
      }
    }

    return this;
  }

  get size() {
    return Object.keys(this._object).length;
  }

  *[Symbol.iterator]() {
    const {
      _object
    } = this;

    for (const value in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, value)) {
        yield value;
      }
    }
  }

  *entries() {
    const {
      _object
    } = this;

    for (const value in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, value)) {
        yield [value, value];
      }
    }
  }

  forEach(callbackfn, thisArg) {
    const {
      _object
    } = this;

    for (const value in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, value)) {
        callbackfn.call(thisArg, value, value, this);
      }
    }
  }

  has(value) {
    return Object.prototype.hasOwnProperty.call(this._object, value);
  }

  keys() {
    return Object.keys(this._object)[Symbol.iterator]();
  }

  values() {
    return Object.keys(this._object)[Symbol.iterator]();
  }

}

exports.ObjectSet = ObjectSet;