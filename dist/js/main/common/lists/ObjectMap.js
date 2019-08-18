"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjectMap = void 0;

var _mergeMaps = require("../extensions/merge/merge-maps");

var _mergers = require("../extensions/merge/mergers");

var _serializers = require("../extensions/serialization/serializers");

var _helpers = require("../helpers/helpers");

var _set = require("./helpers/set");

let _Symbol$toStringTag, _Symbol$iterator;

_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;

class ObjectMap {
  constructor(object) {
    this[_Symbol$toStringTag] = 'Map';
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

  [_Symbol$iterator]() {
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
  } // region IMergeable


  _canMerge(source) {
    if (source.constructor === ObjectMap && this._object === source._object) {
      return null;
    }

    return source.constructor === Object || source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || (0, _helpers.isIterable)(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return (0, _mergeMaps.mergeMaps)((target, source) => (0, _mergeMaps.createMergeMapWrapper)(target, source, arrayOrIterable => (0, _set.fillMap)(new ObjectMap(), arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
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

exports.ObjectMap = ObjectMap;
ObjectMap.uuid = '62388f07-b21a-4778-8b38-58f225cdbd42';
(0, _mergers.registerMergeable)(ObjectMap);
(0, _serializers.registerSerializable)(ObjectMap, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerMap = yield deSerialize(serializedValue.object);
      const value = valueFactory(innerMap);
      value.deSerialize(deSerialize, serializedValue);
      return value;
    }

  }
});