"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrayMap = void 0;

var _mergeMaps = require("../extensions/merge/merge-maps");

var _mergers = require("../extensions/merge/mergers");

var _serializers = require("../extensions/serialization/serializers");

var _helpers = require("../helpers/helpers");

var _objectUniqueId = require("./helpers/object-unique-id");

var _set = require("./helpers/set");

var _Symbol$toStringTag = Symbol.toStringTag;
var _Symbol$iterator = Symbol.iterator;

class ArrayMap {
  constructor(array) {
    this[_Symbol$toStringTag] = 'Map';
    this._array = array || [];
  }

  set(key, value) {
    const id = (0, _objectUniqueId.getObjectUniqueId)(key);
    this._array[id] = [key, value];
    return this;
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

    return this;
  }

  delete(key) {
    const {
      _array
    } = this;
    const id = (0, _objectUniqueId.getObjectUniqueId)(key);

    if (!Object.prototype.hasOwnProperty.call(_array, id)) {
      return false;
    } // tslint:disable-next-line:no-array-delete


    delete _array[id];
    return true;
  }

  get size() {
    return Object.keys(this._array).length;
  }

  [_Symbol$iterator]() {
    return this.entries();
  }

  *entries() {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        yield _array[id];
      }
    }
  }

  forEach(callbackfn, thisArg) {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        const entry = _array[id];
        callbackfn.call(thisArg, entry[1], entry[0], this);
      }
    }
  }

  get(key) {
    const id = (0, _objectUniqueId.getObjectUniqueId)(key);

    if (!Object.prototype.hasOwnProperty.call(this._array, id)) {
      return void 0;
    }

    return this._array[id][1];
  }

  has(key) {
    const id = (0, _objectUniqueId.getObjectUniqueId)(key);
    return Object.prototype.hasOwnProperty.call(this._array, id);
  }

  *keys() {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        const entry = _array[id];
        yield entry[0];
      }
    }
  } // tslint:disable-next-line:no-identical-functions


  *values() {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        const entry = _array[id];
        yield entry[1];
      }
    }
  } // region IMergeable


  _canMerge(source) {
    if (source.constructor === ArrayMap && this._array === source._array) {
      return null;
    }

    return source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || (0, _helpers.isIterable)(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return (0, _mergeMaps.mergeMaps)((target, source) => (0, _mergeMaps.createMergeMapWrapper)(target, source, arrayOrIterable => (0, _set.fillMap)(new ArrayMap(), arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
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

  deSerialize(deSerialize, serializedValue) {} // endregion


}

exports.ArrayMap = ArrayMap;
ArrayMap.uuid = 'ef0ced8a-58f7-4381-b850-3b09c0a42eed';
(0, _mergers.registerMergeable)(ArrayMap);
(0, _serializers.registerSerializable)(ArrayMap, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      // @ts-ignore
      const innerMap = yield deSerialize(serializedValue.array, null, {
        arrayAsObject: true
      });
      const value = valueFactory(innerMap);
      value.deSerialize(deSerialize, serializedValue);
      return value;
    }

  }
});