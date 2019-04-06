import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { MapChangedObject } from './base/MapChangedObject';
import { MapChangedType } from './contracts/IMapChanged';
export var ObservableMap =
/*#__PURE__*/
function (_MapChangedObject) {
  _inherits(ObservableMap, _MapChangedObject);

  function ObservableMap() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        map = _ref.map;

    _classCallCheck(this, ObservableMap);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ObservableMap).call(this));
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
          this.onMapChanged({
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
    key: Symbol.iterator,
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

  }, {
    key: Symbol.toStringTag,
    get: function get() {
      return this._map[Symbol.toStringTag];
    }
  }, {
    key: "size",
    get: function get() {
      return this._map.size;
    }
  }]);

  return ObservableMap;
}(MapChangedObject);