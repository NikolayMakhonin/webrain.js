"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.DependMap = void 0;

var _iterator = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));

var _map3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _mergeMaps = require("../../../extensions/merge/merge-maps");

var _mergers = require("../../../extensions/merge/mergers");

var _serializers = require("../../../extensions/serialization/serializers");

var _helpers = require("../../../helpers/helpers");

var _webrainOptions = require("../../../helpers/webrainOptions");

var _set = require("../../../lists/helpers/set");

var _CallState = require("../core/CallState");

var _facade = require("../core/facade");

var _Symbol$toStringTag, _Symbol$iterator;

_Symbol$toStringTag = _toStringTag.default;
_Symbol$iterator = _iterator.default;

var DependMap = /*#__PURE__*/function () {
  function DependMap(map) {
    (0, _classCallCheck2.default)(this, DependMap);
    this[_Symbol$toStringTag] = 'Map';
    this._map = map || new _map3.default();
  }

  (0, _createClass2.default)(DependMap, [{
    key: "dependAll",
    // region depend methods
    value: function dependAll() {
      return _CallState.ALWAYS_CHANGE_VALUE;
    } // noinspection JSUnusedLocalSymbols

  }, {
    key: "dependKey",
    value: function dependKey(key) {
      this.dependAll();
      return _CallState.ALWAYS_CHANGE_VALUE;
    }
  }, {
    key: "dependAnyKey",
    value: function dependAnyKey() {
      this.dependAll();
      return _CallState.ALWAYS_CHANGE_VALUE;
    }
  }, {
    key: "dependValue",
    value: function dependValue(key) {
      this.dependKey(key);
      return _CallState.ALWAYS_CHANGE_VALUE;
    }
  }, {
    key: "dependAnyValue",
    value: function dependAnyValue() {
      this.dependAnyKey();
      return _CallState.ALWAYS_CHANGE_VALUE;
    } // endregion
    // region read methods

  }, {
    key: "get",
    value: function get(key) {
      this.dependValue(key);
      return this._map.get(key);
    }
  }, {
    key: "has",
    value: function has(key) {
      this.dependKey(key);
      return this._map.has(key);
    }
  }, {
    key: "entries",
    value: function entries() {
      var _context;

      this.dependAnyValue();
      return (0, _entries.default)(_context = this._map).call(_context);
    }
  }, {
    key: "keys",
    value: function keys() {
      var _context2;

      this.dependAnyKey();
      return (0, _keys.default)(_context2 = this._map).call(_context2);
    }
  }, {
    key: "values",
    value: function values() {
      var _context3;

      this.dependAnyValue();
      return (0, _values.default)(_context3 = this._map).call(_context3);
    }
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _context4,
          _this = this;

      this.dependAnyValue();
      (0, _forEach.default)(_context4 = this._map).call(_context4, function (k, v) {
        return callbackfn.call(thisArg, k, v, _this);
      });
    }
  }, {
    key: _Symbol$iterator,
    value: function value() {
      this.dependAnyValue();
      return (0, _getIterator2.default)(this._map);
    } // endregion
    // region change methods

  }, {
    key: "set",
    value: function set(key, value) {
      var _map = this._map;
      var oldSize = _map.size;

      var oldValue = _map.get(key);

      _map.set(key, value);

      if (_map.size !== oldSize) {
        (0, _CallState.invalidateCallState)((0, _facade.getCallState)(this.dependAnyKey).call(this));
        (0, _CallState.invalidateCallState)((0, _facade.getCallState)(this.dependKey).call(this, key));
      } else if (!(0, _webrainOptions.webrainEquals)(oldValue, value)) {
        (0, _CallState.invalidateCallState)((0, _facade.getCallState)(this.dependAnyValue).call(this));
        (0, _CallState.invalidateCallState)((0, _facade.getCallState)(this.dependValue).call(this, key));
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var _map = this._map;
      var oldSize = _map.size;

      this._map.delete(key);

      if (_map.size !== oldSize) {
        (0, _CallState.invalidateCallState)((0, _facade.getCallState)(this.dependAnyKey).call(this));
        (0, _CallState.invalidateCallState)((0, _facade.getCallState)(this.dependKey).call(this, key));
        return true;
      }

      return false;
    }
  }, {
    key: "clear",
    value: function clear() {
      var size = this._map.size;

      if (size === 0) {
        return;
      }

      this._map.clear();

      (0, _CallState.invalidateCallState)((0, _facade.getCallState)(this.dependAll).call(this));
    } // endregion
    // region IMergeable

  }, {
    key: "_canMerge",
    value: function _canMerge(source) {
      var _map = this._map;

      if (_map.canMerge) {
        return _map.canMerge(source);
      }

      if (source.constructor === DependMap && this._map === source._map) {
        return null;
      }

      return source.constructor === Object || source[_toStringTag.default] === 'Map' || (0, _isArray.default)(source) || (0, _helpers.isIterable)(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      var _this2 = this;

      this.dependAnyValue();
      return (0, _mergeMaps.mergeMaps)(function (target, source) {
        return (0, _mergeMaps.createMergeMapWrapper)(target, source, function (arrayOrIterable) {
          return (0, _set.fillMap)(new _this2._map.constructor(), arrayOrIterable);
        });
      }, merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
    } // endregion
    // region ISerializable
    // noinspection SpellCheckingInspection

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      this.dependAnyValue();
      return {
        map: _serialize(this._map)
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize() {} // empty
    // endregion

  }, {
    key: "size",
    get: function get() {
      this.dependAnyKey();
      return this._map.size;
    }
  }]);
  return DependMap;
}();

exports.DependMap = DependMap;
DependMap.uuid = 'd97c26caddd84a4d9748fd0f345f75fd';
DependMap.prototype.dependAll = (0, _facade.depend)(DependMap.prototype.dependAll, null, null, true);
DependMap.prototype.dependAnyKey = (0, _facade.depend)(DependMap.prototype.dependAnyKey, null, null, true);
DependMap.prototype.dependAnyValue = (0, _facade.depend)(DependMap.prototype.dependAnyValue, null, null, true);
DependMap.prototype.dependKey = (0, _facade.depend)(DependMap.prototype.dependKey, null, null, true);
DependMap.prototype.dependValue = (0, _facade.depend)(DependMap.prototype.dependValue, null, null, true);
(0, _mergers.registerMergeable)(DependMap);
(0, _serializers.registerSerializable)(DependMap, {
  serializer: {
    deSerialize: /*#__PURE__*/_regenerator.default.mark(function deSerialize(_deSerialize, serializedValue, valueFactory) {
      var innerMap, value;
      return _regenerator.default.wrap(function deSerialize$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _deSerialize((0, _map2.default)(serializedValue));

            case 2:
              innerMap = _context5.sent;
              value = valueFactory(innerMap); // value.deSerialize(deSerialize, serializedValue)

              return _context5.abrupt("return", value);

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, deSerialize);
    })
  }
});