let _Symbol$toStringTag, _Symbol$iterator;

import { mergeMaps } from '../extensions/merge/merge-maps';
import { createMergeSetWrapper } from '../extensions/merge/merge-sets';
import { registerMergeable } from '../extensions/merge/mergers';
import { registerSerializable } from '../extensions/serialization/serializers';
import { isIterable } from '../helpers/helpers';
import { SetChangedObject } from './base/SetChangedObject';
import { SetChangedType } from './contracts/ISetChanged';
import { fillSet } from './helpers/set';
_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;
export class ObservableSet extends SetChangedObject {
  constructor(set) {
    super();
    this[_Symbol$toStringTag] = 'Set';
    this._set = set || new Set();
  }

  add(value) {
    const {
      _set
    } = this;
    const oldSize = _set.size;

    this._set.add(value);

    const size = _set.size;

    if (size > oldSize) {
      const {
        _setChangedIfCanEmit
      } = this;

      if (_setChangedIfCanEmit) {
        _setChangedIfCanEmit.emit({
          type: SetChangedType.Added,
          newItems: [value]
        });
      }

      const {
        propertyChangedIfCanEmit
      } = this;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: oldSize,
          newValue: size
        });
      }
    }

    return this;
  }

  delete(value) {
    const {
      _set
    } = this;
    const oldSize = _set.size;

    this._set.delete(value);

    const size = _set.size;

    if (size < oldSize) {
      const {
        _setChangedIfCanEmit
      } = this;

      if (_setChangedIfCanEmit) {
        _setChangedIfCanEmit.emit({
          type: SetChangedType.Removed,
          oldItems: [value]
        });
      }

      const {
        propertyChangedIfCanEmit
      } = this;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: oldSize,
          newValue: size
        });
      }

      return true;
    }

    return false;
  }

  clear() {
    const {
      size
    } = this;

    if (size === 0) {
      return;
    }

    const {
      _setChangedIfCanEmit
    } = this;

    if (_setChangedIfCanEmit) {
      const oldItems = Array.from(this);

      this._set.clear();

      _setChangedIfCanEmit.emit({
        type: SetChangedType.Removed,
        oldItems
      });
    } else {
      this._set.clear();
    }

    const {
      propertyChangedIfCanEmit
    } = this;

    if (propertyChangedIfCanEmit) {
      propertyChangedIfCanEmit.onPropertyChanged({
        name: 'size',
        oldValue: size,
        newValue: 0
      });
    }
  } // region Unchanged Set methods


  get size() {
    return this._set.size;
  }

  [_Symbol$iterator]() {
    return this._set[Symbol.iterator]();
  }

  entries() {
    return this._set.entries();
  }

  forEach(callbackfn, thisArg) {
    this._set.forEach((k, v) => callbackfn.call(thisArg, k, v, this));
  }

  has(value) {
    return this._set.has(value);
  }

  keys() {
    return this._set.keys();
  }

  values() {
    return this._set.values();
  } // endregion
  // region IMergeable


  _canMerge(source) {
    const {
      _set
    } = this;

    if (_set.canMerge) {
      return _set.canMerge(source);
    }

    if (source.constructor === ObservableSet && this._set === source._set) {
      return null;
    }

    return source.constructor === Object || source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || isIterable(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return mergeMaps((target, source) => createMergeSetWrapper(target, source, arrayOrIterable => fillSet(new this._set.constructor(), arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable
  // noinspection SpellCheckingInspection


  serialize(serialize) {
    return {
      set: serialize(this._set)
    };
  }

  deSerialize() {} // endregion


}
ObservableSet.uuid = '91539dfb55f44bfb9dbfbff7f6ab800d';
registerMergeable(ObservableSet);
registerSerializable(ObservableSet, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerSet = yield deSerialize(serializedValue.set);
      const value = valueFactory(innerSet); // value.deSerialize(deSerialize, serializedValue)

      return value;
    }

  }
});