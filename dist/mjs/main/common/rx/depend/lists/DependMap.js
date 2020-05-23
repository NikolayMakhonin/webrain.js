let _Symbol$toStringTag, _Symbol$iterator;

import { createMergeMapWrapper, mergeMaps } from '../../../extensions/merge/merge-maps';
import { registerMergeable } from '../../../extensions/merge/mergers';
import { registerSerializable } from '../../../extensions/serialization/serializers';
import { isIterable } from '../../../helpers/helpers';
import { webrainEquals } from '../../../helpers/webrainOptions';
import { fillMap } from '../../../lists/helpers/set';
import { ALWAYS_CHANGE_VALUE, invalidateCallState } from '../core/CallState';
import { depend, getCallState } from '../core/facade';
_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;
export class DependMap {
  constructor(map) {
    this[_Symbol$toStringTag] = 'Map';
    this._map = map || new Map();
  }

  // region depend methods
  dependAll() {
    return ALWAYS_CHANGE_VALUE;
  } // noinspection JSUnusedLocalSymbols


  dependKey(key) {
    this.dependAll();
    return ALWAYS_CHANGE_VALUE;
  }

  dependAnyKey() {
    this.dependAll();
    return ALWAYS_CHANGE_VALUE;
  }

  dependValue(key) {
    this.dependKey(key);
    return ALWAYS_CHANGE_VALUE;
  }

  dependAnyValue() {
    this.dependAnyKey();
    return ALWAYS_CHANGE_VALUE;
  } // endregion
  // region read methods


  get(key) {
    this.dependValue(key);
    return this._map.get(key);
  }

  has(key) {
    this.dependKey(key);
    return this._map.has(key);
  }

  get size() {
    this.dependAnyKey();
    return this._map.size;
  }

  entries() {
    this.dependAnyValue();
    return this._map.entries();
  }

  keys() {
    this.dependAnyKey();
    return this._map.keys();
  }

  values() {
    this.dependAnyValue();
    return this._map.values();
  }

  forEach(callbackfn, thisArg) {
    this.dependAnyValue();

    this._map.forEach((k, v) => callbackfn.call(thisArg, k, v, this));
  }

  [_Symbol$iterator]() {
    this.dependAnyValue();
    return this._map[Symbol.iterator]();
  } // endregion
  // region change methods


  set(key, value) {
    const {
      _map
    } = this;
    const oldSize = _map.size;

    const oldValue = _map.get(key);

    _map.set(key, value);

    if (_map.size !== oldSize) {
      invalidateCallState(getCallState(this.dependAnyKey).call(this));
      invalidateCallState(getCallState(this.dependKey).call(this, key));
    } else if (!webrainEquals(oldValue, value)) {
      invalidateCallState(getCallState(this.dependAnyValue).call(this));
      invalidateCallState(getCallState(this.dependValue).call(this, key));
    }

    return this;
  }

  delete(key) {
    const {
      _map
    } = this;
    const oldSize = _map.size;

    this._map.delete(key);

    if (_map.size !== oldSize) {
      invalidateCallState(getCallState(this.dependAnyKey).call(this));
      invalidateCallState(getCallState(this.dependKey).call(this, key));
      return true;
    }

    return false;
  }

  clear() {
    const {
      size
    } = this._map;

    if (size === 0) {
      return;
    }

    this._map.clear();

    invalidateCallState(getCallState(this.dependAll).call(this));
  } // endregion
  // region IMergeable


  _canMerge(source) {
    const {
      _map
    } = this;

    if (_map.canMerge) {
      return _map.canMerge(source);
    }

    if (source.constructor === DependMap && this._map === source._map) {
      return null;
    }

    return source.constructor === Object || source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || isIterable(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    this.dependAnyValue();
    return mergeMaps((target, source) => createMergeMapWrapper(target, source, arrayOrIterable => fillMap(new this._map.constructor(), arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable
  // noinspection SpellCheckingInspection


  serialize(serialize) {
    this.dependAnyValue();
    return {
      map: serialize(this._map)
    };
  }

  deSerialize() {} // empty
  // endregion


}
DependMap.uuid = 'd97c26caddd84a4d9748fd0f345f75fd';
DependMap.prototype.dependAll = depend(DependMap.prototype.dependAll, null, null, true);
DependMap.prototype.dependAnyKey = depend(DependMap.prototype.dependAnyKey, null, null, true);
DependMap.prototype.dependAnyValue = depend(DependMap.prototype.dependAnyValue, null, null, true);
DependMap.prototype.dependKey = depend(DependMap.prototype.dependKey, null, null, true);
DependMap.prototype.dependValue = depend(DependMap.prototype.dependValue, null, null, true);
registerMergeable(DependMap);
registerSerializable(DependMap, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerMap = yield deSerialize(serializedValue.map);
      const value = valueFactory(innerMap); // value.deSerialize(deSerialize, serializedValue)

      return value;
    }

  }
});