let _Symbol$toStringTag, _Symbol$iterator;

import { createMergeMapWrapper, mergeMaps } from '../extensions/merge/merge-maps';
import { registerMergeable } from '../extensions/merge/mergers';
import { registerSerializable } from '../extensions/serialization/serializers';
import { isIterable } from '../helpers/helpers';
import { MapChangedObject } from './base/MapChangedObject';
import { MapChangedType } from './contracts/IMapChanged';
import { fillMap } from './helpers/set';
_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;
export class ObservableMap extends MapChangedObject {
  constructor(map) {
    super();
    this[_Symbol$toStringTag] = 'Map';
    this._map = map || new Map();
  }

  set(key, value) {
    const {
      _map
    } = this;
    const oldSize = _map.size;

    const oldValue = _map.get(key);

    _map.set(key, value);

    const size = _map.size;

    if (size > oldSize) {
      const {
        _mapChangedIfCanEmit
      } = this;

      if (_mapChangedIfCanEmit) {
        _mapChangedIfCanEmit.emit({
          type: MapChangedType.Added,
          key,
          newValue: value
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
    } else {
      const {
        _mapChangedIfCanEmit
      } = this;

      if (_mapChangedIfCanEmit) {
        _mapChangedIfCanEmit.emit({
          type: MapChangedType.Set,
          key,
          oldValue,
          newValue: value
        });
      }
    }

    return this;
  }

  delete(key) {
    const {
      _map
    } = this;
    const oldSize = _map.size;

    const oldValue = _map.get(key);

    this._map.delete(key);

    const size = _map.size;

    if (size < oldSize) {
      const {
        _mapChangedIfCanEmit
      } = this;

      if (_mapChangedIfCanEmit) {
        _mapChangedIfCanEmit.emit({
          type: MapChangedType.Removed,
          key,
          oldValue
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
      _mapChangedIfCanEmit
    } = this;

    if (_mapChangedIfCanEmit) {
      const oldItems = Array.from(this.entries());

      this._map.clear();

      for (let i = 0, len = oldItems.length; i < len; i++) {
        const oldItem = oldItems[i];

        _mapChangedIfCanEmit.emit({
          type: MapChangedType.Removed,
          key: oldItem[0],
          oldValue: oldItem[1]
        });
      }
    } else {
      this._map.clear();
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
  } // region Unchanged Map methods


  get size() {
    return this._map.size;
  }

  [_Symbol$iterator]() {
    return this._map[Symbol.iterator]();
  }

  get(key) {
    return this._map.get(key);
  }

  entries() {
    return this._map.entries();
  }

  forEach(callbackfn, thisArg) {
    this._map.forEach((k, v) => callbackfn.call(thisArg, k, v, this));
  }

  has(key) {
    return this._map.has(key);
  }

  keys() {
    return this._map.keys();
  }

  values() {
    return this._map.values();
  } // endregion
  // region IMergeable


  _canMerge(source) {
    const {
      _map
    } = this;

    if (_map.canMerge) {
      return _map.canMerge(source);
    }

    if (source.constructor === ObservableMap && this._map === source._map) {
      return null;
    }

    return source.constructor === Object || source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || isIterable(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return mergeMaps((target, source) => createMergeMapWrapper(target, source, arrayOrIterable => fillMap(new this._map.constructor(), arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable
  // noinspection SpellCheckingInspection


  serialize(serialize) {
    return {
      map: serialize(this._map)
    };
  }

  deSerialize() {} // endregion


}
ObservableMap.uuid = 'e162178d51234beaab6eb96d5b8f130b';
registerMergeable(ObservableMap);
registerSerializable(ObservableMap, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerMap = yield deSerialize(serializedValue.map);
      const value = valueFactory(innerMap); // value.deSerialize(deSerialize, serializedValue)

      return value;
    }

  }
});