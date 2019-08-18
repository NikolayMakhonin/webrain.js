"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjectSet = void 0;

var _mergeMaps = require("../extensions/merge/merge-maps");

var _mergeSets = require("../extensions/merge/merge-sets");

var _mergers = require("../extensions/merge/mergers");

var _serializers = require("../extensions/serialization/serializers");

var _helpers = require("../helpers/helpers");

var _set = require("./helpers/set");

let _Symbol$toStringTag, _Symbol$iterator;

_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;

class ObjectSet {
  constructor(object) {
    this[_Symbol$toStringTag] = 'Set';
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

  [_Symbol$iterator]() {
    return Object.keys(this._object)[Symbol.iterator]();
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
    return this[Symbol.iterator]();
  }

  values() {
    return this[Symbol.iterator]();
  }

  static from(arrayOrIterable) {
    return new ObjectSet((0, _set.fillObjectKeys)({}, arrayOrIterable));
  } // region IMergeable


  _canMerge(source) {
    if (source.constructor === ObjectSet && this._object === source._object) {
      return null;
    }

    return source.constructor === Object || source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || (0, _helpers.isIterable)(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return (0, _mergeMaps.mergeMaps)((target, source) => (0, _mergeSets.createMergeSetWrapper)(target, source, arrayOrIterable => ObjectSet.from(arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable


  serialize(serialize) {
    return {
      object: serialize(this._object, {
        objectKeepUndefined: true
      })
    };
  }

  deSerialize(deSerialize, serializedValue) {} // endregion


}

exports.ObjectSet = ObjectSet;
ObjectSet.uuid = '6988ebc9-cd06-4a9b-97a9-8415b8cf1dc4';
(0, _mergers.registerMergeable)(ObjectSet);
(0, _serializers.registerSerializable)(ObjectSet, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerSet = yield deSerialize(serializedValue.object);
      const value = valueFactory(innerSet);
      value.deSerialize(deSerialize, serializedValue);
      return value;
    }

  }
});