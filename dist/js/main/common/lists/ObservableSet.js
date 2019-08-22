"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservableSet = void 0;

var _mergeMaps = require("../extensions/merge/merge-maps");

var _mergeSets = require("../extensions/merge/merge-sets");

var _mergers = require("../extensions/merge/mergers");

var _serializers = require("../extensions/serialization/serializers");

var _helpers = require("../helpers/helpers");

var _SetChangedObject = require("./base/SetChangedObject");

var _ISetChanged = require("./contracts/ISetChanged");

var _set2 = require("./helpers/set");

let _Symbol$toStringTag, _Symbol$iterator;

_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;

class ObservableSet extends _SetChangedObject.SetChangedObject {
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
          type: _ISetChanged.SetChangedType.Added,
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
          type: _ISetChanged.SetChangedType.Removed,
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
        type: _ISetChanged.SetChangedType.Removed,
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
    this._set.forEach((k, v, s) => callbackfn.call(thisArg, k, v, this));
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

    return source.constructor === Object || source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || (0, _helpers.isIterable)(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return (0, _mergeMaps.mergeMaps)((target, source) => (0, _mergeSets.createMergeSetWrapper)(target, source, arrayOrIterable => (0, _set2.fillSet)(new this._set.constructor(), arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable


  serialize(serialize) {
    return {
      set: serialize(this._set)
    };
  }

  deSerialize(deSerialize, serializedValue) {} // endregion


}

exports.ObservableSet = ObservableSet;
ObservableSet.uuid = '91539dfb-55f4-4bfb-9dbf-bff7f6ab800d';
(0, _mergers.registerMergeable)(ObservableSet);
(0, _serializers.registerSerializable)(ObservableSet, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerSet = yield deSerialize(serializedValue.set);
      const value = valueFactory(innerSet);
      value.deSerialize(deSerialize, serializedValue);
      return value;
    }

  }
});