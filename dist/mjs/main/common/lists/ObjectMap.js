let _Symbol$toStringTag, _Symbol$iterator;

import { createMergeMapWrapper, mergeMaps } from '../extensions/merge/merge-maps';
import { registerMergeable } from '../extensions/merge/mergers';
import { registerSerializable } from '../extensions/serialization/serializers';
import { isIterable } from '../helpers/helpers';
import { fillMap } from './helpers/set';
_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;
export class ObjectMap {
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

    return source.constructor === Object || source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || isIterable(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return mergeMaps((target, source) => createMergeMapWrapper(target, source, arrayOrIterable => fillMap(new ObjectMap(), arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable


  serialize(serialize) {
    return {
      object: serialize(this._object, {
        objectKeepUndefined: true
      })
    };
  }

  deSerialize() {} // endregion


}
ObjectMap.uuid = '62388f07b21a47788b3858f225cdbd42';
registerMergeable(ObjectMap);
registerSerializable(ObjectMap, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerMap = yield deSerialize(serializedValue.object);
      const value = valueFactory(innerMap); // value.deSerialize(deSerialize, serializedValue)

      return value;
    }

  }
});