let _Symbol$toStringTag, _Symbol$iterator;

import { mergeMaps } from '../../../extensions/merge/merge-maps';
import { createMergeSetWrapper } from '../../../extensions/merge/merge-sets';
import { registerMergeable } from '../../../extensions/merge/mergers';
import { registerSerializable } from '../../../extensions/serialization/serializers';
import { isIterable } from '../../../helpers/helpers';
import { fillSet } from '../../../lists/helpers/set';
import { ALWAYS_CHANGE_VALUE, invalidateCallState } from '../core/CallState';
import { depend, getCallState } from '../core/facade';
_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;
export class DependSet {
  constructor(set) {
    this[_Symbol$toStringTag] = 'Set';
    this._set = set || new Set();
  }

  // region depend methods
  dependAll() {
    return ALWAYS_CHANGE_VALUE;
  } // noinspection JSUnusedLocalSymbols


  dependValue(value) {
    this.dependAll();
    return ALWAYS_CHANGE_VALUE;
  }

  dependAnyValue() {
    this.dependAll();
    return ALWAYS_CHANGE_VALUE;
  } // endregion
  // region read methods


  has(value) {
    this.dependValue(value);
    return this._set.has(value);
  }

  get size() {
    this.dependAnyValue();
    return this._set.size;
  }

  entries() {
    this.dependAnyValue();
    return this._set.entries();
  }

  keys() {
    this.dependAnyValue();
    return this._set.keys();
  }

  values() {
    this.dependAnyValue();
    return this._set.values();
  }

  forEach(callbackfn, thisArg) {
    this.dependAnyValue();

    this._set.forEach((k, v) => callbackfn.call(thisArg, k, v, this));
  }

  [_Symbol$iterator]() {
    this.dependAnyValue();
    return this._set[Symbol.iterator]();
  } // endregion
  // region change methods


  add(value) {
    const {
      _set
    } = this;
    const oldSize = _set.size;

    _set.add(value);

    if (_set.size !== oldSize) {
      invalidateCallState(getCallState(this.dependAnyValue).call(this));
      invalidateCallState(getCallState(this.dependValue).call(this, value));
    }

    return this;
  }

  delete(value) {
    const {
      _set
    } = this;
    const oldSize = _set.size;

    this._set.delete(value);

    if (_set.size !== oldSize) {
      invalidateCallState(getCallState(this.dependAnyValue).call(this));
      invalidateCallState(getCallState(this.dependValue).call(this, value));
      return true;
    }

    return false;
  }

  clear() {
    const {
      size
    } = this._set;

    if (size === 0) {
      return;
    }

    this._set.clear();

    invalidateCallState(getCallState(this.dependAll).call(this));
  } // endregion
  // region IMergeable


  _canMerge(source) {
    const {
      _set
    } = this;

    if (_set.canMerge) {
      return _set.canMerge(source);
    }

    if (source.constructor === DependSet && this._set === source._set) {
      return null;
    }

    return source.constructor === Object || source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || isIterable(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    this.dependAnyValue();
    return mergeMaps((target, source) => createMergeSetWrapper(target, source, arrayOrIterable => fillSet(new this._set.constructor(), arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable
  // noinspection SpellCheckingInspection


  serialize(serialize) {
    this.dependAnyValue();
    return {
      set: serialize(this._set)
    };
  }

  deSerialize() {} // empty
  // endregion


}
DependSet.uuid = '0b5ba0da253c43a98944e34a82b61c06';
DependSet.prototype.dependAll = depend(DependSet.prototype.dependAll, null, null, true);
DependSet.prototype.dependAnyValue = depend(DependSet.prototype.dependAnyValue, null, null, true);
DependSet.prototype.dependValue = depend(DependSet.prototype.dependValue, null, null, true);
registerMergeable(DependSet);
registerSerializable(DependSet, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerSet = yield deSerialize(serializedValue.set);
      const value = valueFactory(innerSet); // value.deSerialize(deSerialize, serializedValue)

      return value;
    }

  }
});