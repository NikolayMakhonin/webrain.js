"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArraySet = void 0;

var _mergeMaps = require("../extensions/merge/merge-maps");

var _mergeSets = require("../extensions/merge/merge-sets");

var _mergers = require("../extensions/merge/mergers");

var _serializers = require("../extensions/serialization/serializers");

var _helpers = require("../helpers/helpers");

var _objectUniqueId = require("./helpers/object-unique-id");

var _set = require("./helpers/set");

let _Symbol$toStringTag, _Symbol$iterator;

_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;

class ArraySet {
  constructor(array, size) {
    this[_Symbol$toStringTag] = 'Set';
    this._array = array || [];
    this._size = size || Object.keys(this._array).length;
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

  static from(arrayOrIterable) {
    return (0, _set.fillSet)(new ArraySet(), arrayOrIterable);
  } // region IMergeable


  _canMerge(source) {
    if (source.constructor === ArraySet && this._array === source._array) {
      return null;
    }

    return source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || (0, _helpers.isIterable)(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return (0, _mergeMaps.mergeMaps)((target, source) => (0, _mergeSets.createMergeSetWrapper)(target, source, arrayOrIterable => ArraySet.from(arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable


  serialize(serialize) {
    return {
      array: serialize(this._array, {
        arrayAsObject: true,
        objectKeepUndefined: true
      })
    };
  }

  deSerialize() {} // endregion


}

exports.ArraySet = ArraySet;
ArraySet.uuid = '0e8c7f09ea9e46318af8a635c214a01c';
(0, _mergers.registerMergeable)(ArraySet);
(0, _serializers.registerSerializable)(ArraySet, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerSet = yield deSerialize(serializedValue.array, null, {
        arrayAsObject: true
      });
      const value = valueFactory(innerSet); // value.deSerialize(deSerialize, serializedValue)

      return value;
    }

  }
});