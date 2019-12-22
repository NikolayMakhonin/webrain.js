let _Symbol$toStringTag, _Symbol$iterator;

import { createMergeMapWrapper, mergeMaps } from '../extensions/merge/merge-maps';
import { registerMergeable } from '../extensions/merge/mergers';
import { registerSerializable } from '../extensions/serialization/serializers';
import { isIterable } from '../helpers/helpers';
import { getObjectUniqueId } from '../helpers/object-unique-id';
import { fillMap } from './helpers/set';
_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;
export class ObjectHashMap {
  constructor(object) {
    this[_Symbol$toStringTag] = 'Map';
    this._object = object || {};
  }

  set(key, value) {
    const id = getObjectUniqueId(key);
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
    const id = getObjectUniqueId(key);

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
    const id = getObjectUniqueId(key);
    const entry = this._object[id];
    return entry && entry[1];
  }

  has(key) {
    const id = getObjectUniqueId(key);
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

    return source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || isIterable(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return mergeMaps((target, source) => createMergeMapWrapper(target, source, arrayOrIterable => fillMap(new ObjectHashMap(), arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable
  // noinspection SpellCheckingInspection


  serialize(serialize) {
    return {
      object: serialize(this._object, {
        objectKeepUndefined: true
      })
    };
  }

  deSerialize() {} // endregion


}
ObjectHashMap.uuid = '7a5731ae37ad4c5baee025a8f1cd2228';
registerMergeable(ObjectHashMap);
registerSerializable(ObjectHashMap, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerMap = yield deSerialize(serializedValue.object);
      const value = valueFactory(innerMap); // value.deSerialize(deSerialize, serializedValue)

      return value;
    }

  }
});