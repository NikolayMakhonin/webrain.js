"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.DependSet = void 0;

var _iterator = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));

var _set2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _mergeMaps = require("../../../extensions/merge/merge-maps");

var _mergeSets = require("../../../extensions/merge/merge-sets");

var _mergers = require("../../../extensions/merge/mergers");

var _serializers = require("../../../extensions/serialization/serializers");

var _helpers = require("../../../helpers/helpers");

var _set3 = require("../../../lists/helpers/set");

var _CallState = require("../core/CallState");

var _facade = require("../core/facade");

var _Symbol$toStringTag, _Symbol$iterator;

_Symbol$toStringTag = _toStringTag.default;
_Symbol$iterator = _iterator.default;

var DependSet = /*#__PURE__*/function () {
  function DependSet(set) {
    (0, _classCallCheck2.default)(this, DependSet);
    this[_Symbol$toStringTag] = 'Set';
    this._set = set || new _set2.default();
  }

  (0, _createClass2.default)(DependSet, [{
    key: "dependAll",
    // region depend methods
    value: function dependAll() {
      return _CallState.ALWAYS_CHANGE_VALUE;
    } // noinspection JSUnusedLocalSymbols

  }, {
    key: "dependValue",
    value: function dependValue(value) {
      this.dependAll();
      return _CallState.ALWAYS_CHANGE_VALUE;
    }
  }, {
    key: "dependAnyValue",
    value: function dependAnyValue() {
      this.dependAll();
      return _CallState.ALWAYS_CHANGE_VALUE;
    } // endregion
    // region read methods

  }, {
    key: "has",
    value: function has(value) {
      this.dependValue(value);
      return this._set.has(value);
    }
  }, {
    key: "entries",
    value: function entries() {
      var _context;

      this.dependAnyValue();
      return (0, _entries.default)(_context = this._set).call(_context);
    }
  }, {
    key: "keys",
    value: function keys() {
      var _context2;

      this.dependAnyValue();
      return (0, _keys.default)(_context2 = this._set).call(_context2);
    }
  }, {
    key: "values",
    value: function values() {
      var _context3;

      this.dependAnyValue();
      return (0, _values.default)(_context3 = this._set).call(_context3);
    }
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _context4,
          _this = this;

      this.dependAnyValue();
      (0, _forEach.default)(_context4 = this._set).call(_context4, function (k, v) {
        return callbackfn.call(thisArg, k, v, _this);
      });
    }
  }, {
    key: _Symbol$iterator,
    value: function value() {
      this.dependAnyValue();
      return (0, _getIterator2.default)(this._set);
    } // endregion
    // region change methods

  }, {
    key: "add",
    value: function add(value) {
      var _set = this._set;
      var oldSize = _set.size;

      _set.add(value);

      if (_set.size !== oldSize) {
        (0, _CallState.invalidateCallState)((0, _facade.getCallState)(this.dependAnyValue).call(this));
        (0, _CallState.invalidateCallState)((0, _facade.getCallState)(this.dependValue).call(this, value));
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(value) {
      var _set = this._set;
      var oldSize = _set.size;

      this._set.delete(value);

      if (_set.size !== oldSize) {
        (0, _CallState.invalidateCallState)((0, _facade.getCallState)(this.dependAnyValue).call(this));
        (0, _CallState.invalidateCallState)((0, _facade.getCallState)(this.dependValue).call(this, value));
        return true;
      }

      return false;
    }
  }, {
    key: "clear",
    value: function clear() {
      var size = this._set.size;

      if (size === 0) {
        return;
      }

      this._set.clear();

      (0, _CallState.invalidateCallState)((0, _facade.getCallState)(this.dependAll).call(this));
    } // endregion
    // region IMergeable

  }, {
    key: "_canMerge",
    value: function _canMerge(source) {
      var _set = this._set;

      if (_set.canMerge) {
        return _set.canMerge(source);
      }

      if (source.constructor === DependSet && this._set === source._set) {
        return null;
      }

      return source.constructor === Object || source[_toStringTag.default] === 'Set' || (0, _isArray.default)(source) || (0, _helpers.isIterable)(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      var _this2 = this;

      this.dependAnyValue();
      return (0, _mergeMaps.mergeMaps)(function (target, source) {
        return (0, _mergeSets.createMergeSetWrapper)(target, source, function (arrayOrIterable) {
          return (0, _set3.fillSet)(new _this2._set.constructor(), arrayOrIterable);
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
        set: _serialize(this._set)
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize() {} // empty
    // endregion

  }, {
    key: "size",
    get: function get() {
      this.dependAnyValue();
      return this._set.size;
    }
  }]);
  return DependSet;
}();

exports.DependSet = DependSet;
DependSet.uuid = '0b5ba0da253c43a98944e34a82b61c06';
DependSet.prototype.dependAll = (0, _facade.depend)(DependSet.prototype.dependAll, null, null, true);
DependSet.prototype.dependAnyValue = (0, _facade.depend)(DependSet.prototype.dependAnyValue, null, null, true);
DependSet.prototype.dependValue = (0, _facade.depend)(DependSet.prototype.dependValue, null, null, true);
(0, _mergers.registerMergeable)(DependSet);
(0, _serializers.registerSerializable)(DependSet, {
  serializer: {
    deSerialize: /*#__PURE__*/_regenerator.default.mark(function deSerialize(_deSerialize, serializedValue, valueFactory) {
      var innerSet, value;
      return _regenerator.default.wrap(function deSerialize$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _deSerialize(serializedValue.set);

            case 2:
              innerSet = _context5.sent;
              value = valueFactory(innerSet); // value.deSerialize(deSerialize, serializedValue)

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