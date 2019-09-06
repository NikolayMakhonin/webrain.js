"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ObservableMap = void 0;

var _iterator = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _map3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _mergeMaps = require("../extensions/merge/merge-maps");

var _mergers = require("../extensions/merge/mergers");

var _serializers = require("../extensions/serialization/serializers");

var _helpers = require("../helpers/helpers");

var _MapChangedObject2 = require("./base/MapChangedObject");

var _IMapChanged = require("./contracts/IMapChanged");

var _set = require("./helpers/set");

var _Symbol$toStringTag, _Symbol$iterator;

_Symbol$toStringTag = _toStringTag.default;
_Symbol$iterator = _iterator.default;

var ObservableMap =
/*#__PURE__*/
function (_MapChangedObject) {
  (0, _inheritsLoose2.default)(ObservableMap, _MapChangedObject);

  function ObservableMap(map) {
    var _this;

    _this = _MapChangedObject.call(this) || this;
    _this[_Symbol$toStringTag] = 'Map';
    _this._map = map || new _map3.default();
    return _this;
  }

  var _proto = ObservableMap.prototype;

  _proto.set = function set(key, value) {
    var _map = this._map;
    var oldSize = _map.size;

    var oldValue = _map.get(key);

    _map.set(key, value);

    var size = _map.size;

    if (size > oldSize) {
      var _mapChangedIfCanEmit = this._mapChangedIfCanEmit;

      if (_mapChangedIfCanEmit) {
        _mapChangedIfCanEmit.emit({
          type: _IMapChanged.MapChangedType.Added,
          key: key,
          newValue: value
        });
      }

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: oldSize,
          newValue: size
        });
      }
    } else {
      var _mapChangedIfCanEmit2 = this._mapChangedIfCanEmit;

      if (_mapChangedIfCanEmit2) {
        _mapChangedIfCanEmit2.emit({
          type: _IMapChanged.MapChangedType.Set,
          key: key,
          oldValue: oldValue,
          newValue: value
        });
      }
    }

    return this;
  };

  _proto.delete = function _delete(key) {
    var _map = this._map;
    var oldSize = _map.size;

    var oldValue = _map.get(key);

    this._map.delete(key);

    var size = _map.size;

    if (size < oldSize) {
      var _mapChangedIfCanEmit = this._mapChangedIfCanEmit;

      if (_mapChangedIfCanEmit) {
        _mapChangedIfCanEmit.emit({
          type: _IMapChanged.MapChangedType.Removed,
          key: key,
          oldValue: oldValue
        });
      }

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

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
  };

  _proto.clear = function clear() {
    var size = this.size;

    if (size === 0) {
      return;
    }

    var _mapChangedIfCanEmit = this._mapChangedIfCanEmit;

    if (_mapChangedIfCanEmit) {
      var _context;

      var oldItems = (0, _from.default)((0, _entries.default)(_context = this).call(_context));

      this._map.clear();

      for (var i = 0, len = oldItems.length; i < len; i++) {
        var oldItem = oldItems[i];

        _mapChangedIfCanEmit.emit({
          type: _IMapChanged.MapChangedType.Removed,
          key: oldItem[0],
          oldValue: oldItem[1]
        });
      }
    } else {
      this._map.clear();
    }

    var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

    if (propertyChangedIfCanEmit) {
      propertyChangedIfCanEmit.onPropertyChanged({
        name: 'size',
        oldValue: size,
        newValue: 0
      });
    }
  } // region Unchanged Map methods
  ;

  _proto[_Symbol$iterator] = function () {
    return (0, _getIterator2.default)(this._map);
  };

  _proto.get = function get(key) {
    return this._map.get(key);
  };

  _proto.entries = function entries() {
    var _context2;

    return (0, _entries.default)(_context2 = this._map).call(_context2);
  };

  _proto.forEach = function forEach(callbackfn, thisArg) {
    var _context3,
        _this2 = this;

    (0, _forEach.default)(_context3 = this._map).call(_context3, function (k, v) {
      return callbackfn.call(thisArg, k, v, _this2);
    });
  };

  _proto.has = function has(key) {
    return this._map.has(key);
  };

  _proto.keys = function keys() {
    var _context4;

    return (0, _keys.default)(_context4 = this._map).call(_context4);
  };

  _proto.values = function values() {
    var _context5;

    return (0, _values.default)(_context5 = this._map).call(_context5);
  } // endregion
  // region IMergeable
  ;

  _proto._canMerge = function _canMerge(source) {
    var _map = this._map;

    if (_map.canMerge) {
      return _map.canMerge(source);
    }

    if (source.constructor === ObservableMap && this._map === source._map) {
      return null;
    }

    return source.constructor === Object || source[_toStringTag.default] === 'Map' || (0, _isArray.default)(source) || (0, _helpers.isIterable)(source);
  };

  _proto._merge = function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    var _this3 = this;

    return (0, _mergeMaps.mergeMaps)(function (target, source) {
      return (0, _mergeMaps.createMergeMapWrapper)(target, source, function (arrayOrIterable) {
        return (0, _set.fillMap)(new _this3._map.constructor(), arrayOrIterable);
      });
    }, merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable
  ;

  _proto.serialize = function serialize(_serialize) {
    return {
      map: _serialize(this._map)
    };
  };

  _proto.deSerialize = function deSerialize() {} // endregion
  ;

  (0, _createClass2.default)(ObservableMap, [{
    key: "size",
    get: function get() {
      return this._map.size;
    }
  }]);
  return ObservableMap;
}(_MapChangedObject2.MapChangedObject);

exports.ObservableMap = ObservableMap;
ObservableMap.uuid = 'e162178d51234beaab6eb96d5b8f130b';
(0, _mergers.registerMergeable)(ObservableMap);
(0, _serializers.registerSerializable)(ObservableMap, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    _regenerator.default.mark(function deSerialize(_deSerialize, serializedValue, valueFactory) {
      var innerMap, value;
      return _regenerator.default.wrap(function deSerialize$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _deSerialize((0, _map2.default)(serializedValue));

            case 2:
              innerMap = _context6.sent;
              value = valueFactory(innerMap); // value.deSerialize(deSerialize, serializedValue)

              return _context6.abrupt("return", value);

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      }, deSerialize);
    })
  }
});