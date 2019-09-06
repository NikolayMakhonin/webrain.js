let _Symbol$toStringTag, _Symbol$iterator;

/* tslint:disable:ban-types */
import { mergeMaps } from '../extensions/merge/merge-maps';
import { createMergeSetWrapper } from '../extensions/merge/merge-sets';
import { registerMergeable } from '../extensions/merge/mergers';
import { registerSerializable } from '../extensions/serialization/serializers';
import { isIterable } from '../helpers/helpers';
import { getObjectUniqueId } from '../helpers/object-unique-id';
import { fillSet } from './helpers/set';
_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;
export class ArraySet {
  constructor(array, size) {
    this[_Symbol$toStringTag] = 'Set';
    this._array = array || [];
    this._size = size || Object.keys(this._array).length;
  }

  add(value) {
    const {
      _array
    } = this;
    const id = getObjectUniqueId(value); // if (Object.prototype.hasOwnProperty.call(_array, id)) {

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
    const id = getObjectUniqueId(value); // if (Object.prototype.hasOwnProperty.call(_array, id)) {

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
    return Object.prototype.hasOwnProperty.call(this._array, getObjectUniqueId(value));
  }

  keys() {
    return this[Symbol.iterator]();
  }

  values() {
    return this[Symbol.iterator]();
  }

  static from(arrayOrIterable) {
    return fillSet(new ArraySet(), arrayOrIterable);
  } // region IMergeable


  _canMerge(source) {
    if (source.constructor === ArraySet && this._array === source._array) {
      return null;
    }

    return source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || isIterable(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return mergeMaps((target, source) => createMergeSetWrapper(target, source, arrayOrIterable => ArraySet.from(arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
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
ArraySet.uuid = '0e8c7f09ea9e46318af8a635c214a01c';
registerMergeable(ArraySet);
registerSerializable(ArraySet, {
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