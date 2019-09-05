let _Symbol$toStringTag, _Symbol$iterator;

import { mergeMaps } from '../extensions/merge/merge-maps';
import { createMergeSetWrapper } from '../extensions/merge/merge-sets';
import { registerMergeable } from '../extensions/merge/mergers';
import { registerSerializable } from '../extensions/serialization/serializers';
import { isIterable } from '../helpers/helpers';
import { fillObjectKeys } from './helpers/set';
_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;
export class ObjectSet {
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
    return new ObjectSet(fillObjectKeys({}, arrayOrIterable));
  } // region IMergeable


  _canMerge(source) {
    if (source.constructor === ObjectSet && this._object === source._object) {
      return null;
    }

    return source.constructor === Object || source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || isIterable(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return mergeMaps((target, source) => createMergeSetWrapper(target, source, arrayOrIterable => ObjectSet.from(arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
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
ObjectSet.uuid = '6988ebc9cd064a9b97a98415b8cf1dc4';
registerMergeable(ObjectSet);
registerSerializable(ObjectSet, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerSet = yield deSerialize(serializedValue.object);
      const value = valueFactory(innerSet); // value.deSerialize(deSerialize, serializedValue)

      return value;
    }

  }
});