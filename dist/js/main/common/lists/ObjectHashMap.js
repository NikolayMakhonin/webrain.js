"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjectHashMap = void 0;

var _mergeMaps = require("../extensions/merge/merge-maps");

var _mergers = require("../extensions/merge/mergers");

var _serializers = require("../extensions/serialization/serializers");

var _helpers = require("../helpers/helpers");

var _objectUniqueId = require("./helpers/object-unique-id");

var _set = require("./helpers/set");

var _Symbol$toStringTag = Symbol.toStringTag;
var _Symbol$iterator = Symbol.iterator;

class ObjectHashMap {
  constructor(object) {
    this[_Symbol$toStringTag] = 'Map';
    this._object = object || {};
  }

  set(key, value) {
    const id = (0, _objectUniqueId.getObjectUniqueId)(key);
    this._object[id] = [key, value];
    return this;
  }

  clear() {
    const {
      _object
    } = this;

    for (const id in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, id)) {
        delete _object[id];
      }
    }

    return this;
  }

  delete(key) {
    const {
      _object
    } = this;
    const id = (0, _objectUniqueId.getObjectUniqueId)(key);

    if (!Object.prototype.hasOwnProperty.call(_object, id)) {
      return false;
    }

    delete _object[id];
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

    for (const id in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, id)) {
        yield _object[id];
      }
    }
  }

  forEach(callbackfn, thisArg) {
    const {
      _object
    } = this;

    for (const id in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, id)) {
        const entry = _object[id];
        callbackfn.call(thisArg, entry[1], entry[0], this);
      }
    }
  }

  get(key) {
    const id = (0, _objectUniqueId.getObjectUniqueId)(key);
    const entry = this._object[id];
    return entry && entry[1];
  }

  has(key) {
    const id = (0, _objectUniqueId.getObjectUniqueId)(key);
    return Object.prototype.hasOwnProperty.call(this._object, id);
  }

  *keys() {
    const {
      _object
    } = this;

    for (const id in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, id)) {
        const entry = _object[id];
        yield entry[0];
      }
    }
  } // tslint:disable-next-line:no-identical-functions


  *values() {
    const {
      _object
    } = this;

    for (const id in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, id)) {
        const entry = _object[id];
        yield entry[1];
      }
    }
  } // region IMergeable


  _canMerge(source) {
    if (source.constructor === ObjectHashMap && this._object === source._object) {
      return null;
    }

    return source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || (0, _helpers.isIterable)(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return (0, _mergeMaps.mergeMaps)((target, source) => (0, _mergeMaps.createMergeMapWrapper)(target, source, arrayOrIterable => (0, _set.fillMap)(new ObjectHashMap(), arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
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

exports.ObjectHashMap = ObjectHashMap;
ObjectHashMap.uuid = '7a5731ae-37ad-4c5b-aee0-25a8f1cd2228';
(0, _mergers.registerMergeable)(ObjectHashMap);
(0, _serializers.registerSerializable)(ObjectHashMap, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerMap = yield deSerialize(serializedValue.object);
      const value = valueFactory(innerMap);
      value.deSerialize(deSerialize, serializedValue);
      return value;
    }

  }
});