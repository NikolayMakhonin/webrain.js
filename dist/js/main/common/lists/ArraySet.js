"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArraySet = void 0;

var _objectUniqueId = require("./helpers/object-unique-id");

/* tslint:disable:ban-types */
var _Symbol$toStringTag = Symbol.toStringTag;
var _Symbol$iterator = Symbol.iterator;

class ArraySet {
  constructor(array) {
    this[_Symbol$toStringTag] = 'Set';
    this._array = array || [];
    this._size = this._array.length;
  }

  add(value) {
    const {
      _array
    } = this;
    const id = (0, _objectUniqueId.getObjectUniqueId)(value); // if (Object.prototype.hasOwnProperty.call(_array, id)) {

    if (typeof _array[id] !== 'undefined') {
      return this;
    }

    this._array[id] = value;
    this._size++;
    return this;
  }

  delete(value) {
    const {
      _array
    } = this;
    const id = (0, _objectUniqueId.getObjectUniqueId)(value); // if (Object.prototype.hasOwnProperty.call(_array, id)) {

    if (typeof _array[id] === 'undefined') {
      return false;
    } // tslint:disable-next-line:no-array-delete


    delete _array[id];
    this._size--;
    return true;
  }

  clear() {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        // tslint:disable-next-line:no-array-delete
        delete _array[id];
      }
    }

    this._size = 0;
    return this;
  }

  get size() {
    return this._size;
  }

  *[_Symbol$iterator]() {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        yield _array[id];
      }
    }
  }

  *entries() {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        const value = _array[id];
        yield [value, value];
      }
    }
  }

  forEach(callbackfn, thisArg) {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        const value = _array[id];
        callbackfn.call(thisArg, value, value, this);
      }
    }
  }

  has(value) {
    return Object.prototype.hasOwnProperty.call(this._array, (0, _objectUniqueId.getObjectUniqueId)(value));
  }

  keys() {
    return this[Symbol.iterator]();
  }

  values() {
    return this[Symbol.iterator]();
  }

}

exports.ArraySet = ArraySet;