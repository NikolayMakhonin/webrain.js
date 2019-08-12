import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { createMergeMapWrapper, mergeMaps } from '../extensions/merge/merge-maps';
import { registerMergeable } from '../extensions/merge/mergers';
import { registerSerializable } from '../extensions/serialization/serializers';
import { isIterable } from '../helpers/helpers';
import { MapChangedObject } from './base/MapChangedObject';
import { MapChangedType } from './contracts/IMapChanged';
import { fillMap } from './helpers/set';
var _Symbol$toStringTag = Symbol.toStringTag;
var _Symbol$iterator = Symbol.iterator;
export var ObservableMap =
/*#__PURE__*/
function (_MapChangedObject) {
  _inherits(ObservableMap, _MapChangedObject);

  function ObservableMap(map) {
    var _this;

    _classCallCheck(this, ObservableMap);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ObservableMap).call(this));
    _this[_Symbol$toStringTag] = 'Map';
    _this._map = map || new Map();
    return _this;
  }

  _createClass(ObservableMap, [{
    key: "set",
    value: function set(key, value) {
      var _map = this._map;
      var oldSize = _map.size;

      var oldValue = _map.get(key);

      _map.set(key, value);

      var size = _map.size;

      if (size > oldSize) {
        var _mapChangedIfCanEmit = this._mapChangedIfCanEmit;

        if (_mapChangedIfCanEmit) {
          _mapChangedIfCanEmit.emit({
            type: MapChangedType.Added,
            key: key,
            newValue: value
          });
        }

        this.onPropertyChanged({
          name: 'size',
          oldValue: oldSize,
          newValue: size
        });
      } else {
        var _mapChangedIfCanEmit2 = this._mapChangedIfCanEmit;

        if (_mapChangedIfCanEmit2) {
          _mapChangedIfCanEmit2.emit({
            type: MapChangedType.Set,
            key: key,
            oldValue: oldValue,
            newValue: value
          });
        }
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var _map = this._map;
      var oldSize = _map.size;

      var oldValue = _map.get(key);

      this._map.delete(key);

      var size = _map.size;

      if (size < oldSize) {
        var _mapChangedIfCanEmit = this._mapChangedIfCanEmit;

        if (_mapChangedIfCanEmit) {
          _mapChangedIfCanEmit.emit({
            type: MapChangedType.Removed,
            key: key,
            oldValue: oldValue
          });
        }

        this.onPropertyChanged({
          name: 'size',
          oldValue: oldSize,
          newValue: size
        });
        return true;
      }

      return false;
    }
  }, {
    key: "clear",
    value: function clear() {
      var size = this.size;

      if (size === 0) {
        return;
      }

      var _mapChangedIfCanEmit = this._mapChangedIfCanEmit;

      if (_mapChangedIfCanEmit) {
        var oldItems = Array.from(this.entries());

        this._map.clear();

        for (var i = 0, len = oldItems.length; i < len; i++) {
          var oldItem = oldItems[i];

          _mapChangedIfCanEmit.emit({
            type: MapChangedType.Removed,
            key: oldItem[0],
            oldValue: oldItem[1]
          });
        }
      } else {
        this._map.clear();
      }

      this.onPropertyChanged({
        name: 'size',
        oldValue: size,
        newValue: 0
      });
    } // region Unchanged Map methods

  }, {
    key: _Symbol$iterator,
    value: function value() {
      return this._map[Symbol.iterator]();
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._map.get(key);
    }
  }, {
    key: "entries",
    value: function entries() {
      return this._map.entries();
    }
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _this2 = this;

      this._map.forEach(function (k, v, s) {
        return callbackfn.call(thisArg, k, v, _this2);
      });
    }
  }, {
    key: "has",
    value: function has(key) {
      return this._map.has(key);
    }
  }, {
    key: "keys",
    value: function keys() {
      return this._map.keys();
    }
  }, {
    key: "values",
    value: function values() {
      return this._map.values();
    } // endregion
    // region IMergeable

  }, {
    key: "_canMerge",
    value: function _canMerge(source) {
      var _map = this._map;

      if (_map.canMerge) {
        return _map.canMerge(source);
      }

      if (source.constructor === ObservableMap && this._map === source._map) {
        return null;
      }

      return source.constructor === Object || source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || isIterable(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      var _this3 = this;

      return mergeMaps(function (target, source) {
        return createMergeMapWrapper(target, source, function (arrayOrIterable) {
          return fillMap(new _this3._map.constructor(), arrayOrIterable);
        });
      }, merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
    } // endregion
    // region ISerializable

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        map: _serialize(this._map)
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize(_deSerialize, serializedValue) {} // endregion

  }, {
    key: "size",
    get: function get() {
      return this._map.size;
    }
  }]);

  return ObservableMap;
}(MapChangedObject);
ObservableMap.uuid = 'e162178d-5123-4bea-ab6e-b96d5b8f130b';
registerMergeable(ObservableMap);
registerSerializable(ObservableMap, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function deSerialize(_deSerialize2, serializedValue, valueFactory) {
      var innerMap, value;
      return _regeneratorRuntime.wrap(function deSerialize$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _deSerialize2(serializedValue.map);

            case 2:
              innerMap = _context.sent;
              value = valueFactory(innerMap);
              value.deSerialize(_deSerialize2, serializedValue);
              return _context.abrupt("return", value);

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, deSerialize);
    })
  }
});