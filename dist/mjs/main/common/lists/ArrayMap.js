let _Symbol$toStringTag, _Symbol$iterator;

import { createMergeMapWrapper, mergeMaps } from '../extensions/merge/merge-maps';
import { registerMergeable } from '../extensions/merge/mergers';
import { registerSerializable } from '../extensions/serialization/serializers';
import { isIterable } from '../helpers/helpers';
import { getObjectUniqueId } from '../helpers/object-unique-id';
import { fillMap } from './helpers/set';
_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;
export class ArrayMap {
  constructor(array) {
    this[_Symbol$toStringTag] = 'Map';
    this._array = array || [];
  }

  set(key, value) {
    const id = getObjectUniqueId(key);
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
    const id = getObjectUniqueId(key);

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
    const id = getObjectUniqueId(key);

    if (!Object.prototype.hasOwnProperty.call(this._array, id)) {
      return void 0;
    }

    return this._array[id][1];
  }

  has(key) {
    const id = getObjectUniqueId(key);
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

    return source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || isIterable(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return mergeMaps((target, source) => createMergeMapWrapper(target, source, arrayOrIterable => fillMap(new ArrayMap(), arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
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
ArrayMap.uuid = 'ef0ced8a58f74381b8503b09c0a42eed';
registerMergeable(ArrayMap);
registerSerializable(ArrayMap, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      // @ts-ignore
      const innerMap = yield deSerialize(serializedValue.array, null, {
        arrayAsObject: true
      });
      const value = valueFactory(innerMap); // value.deSerialize(deSerialize, serializedValue)

      return value;
    }

  }
});