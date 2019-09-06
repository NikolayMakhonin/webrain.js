"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ObservableSet = void 0;

var _iterator = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _set2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _mergeMaps = require("../extensions/merge/merge-maps");

var _mergeSets = require("../extensions/merge/merge-sets");

var _mergers = require("../extensions/merge/mergers");

var _serializers = require("../extensions/serialization/serializers");

var _helpers = require("../helpers/helpers");

var _SetChangedObject2 = require("./base/SetChangedObject");

var _ISetChanged = require("./contracts/ISetChanged");

var _set3 = require("./helpers/set");

var _Symbol$toStringTag, _Symbol$iterator;

_Symbol$toStringTag = _toStringTag.default;
_Symbol$iterator = _iterator.default;

var ObservableSet =
/*#__PURE__*/
function (_SetChangedObject) {
  (0, _inheritsLoose2.default)(ObservableSet, _SetChangedObject);

  function ObservableSet(set) {
    var _this;

    _this = _SetChangedObject.call(this) || this;
    _this[_Symbol$toStringTag] = 'Set';
    _this._set = set || new _set2.default();
    return _this;
  }

  var _proto = ObservableSet.prototype;

  _proto.add = function add(value) {
    var _set = this._set;
    var oldSize = _set.size;

    this._set.add(value);

    var size = _set.size;

    if (size > oldSize) {
      var _setChangedIfCanEmit = this._setChangedIfCanEmit;

      if (_setChangedIfCanEmit) {
        _setChangedIfCanEmit.emit({
          type: _ISetChanged.SetChangedType.Added,
          newItems: [value]
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
    }

    return this;
  };

  _proto.delete = function _delete(value) {
    var _set = this._set;
    var oldSize = _set.size;

    this._set.delete(value);

    var size = _set.size;

    if (size < oldSize) {
      var _setChangedIfCanEmit = this._setChangedIfCanEmit;

      if (_setChangedIfCanEmit) {
        _setChangedIfCanEmit.emit({
          type: _ISetChanged.SetChangedType.Removed,
          oldItems: [value]
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

    var _setChangedIfCanEmit = this._setChangedIfCanEmit;

    if (_setChangedIfCanEmit) {
      var oldItems = (0, _from.default)(this);

      this._set.clear();

      _setChangedIfCanEmit.emit({
        type: _ISetChanged.SetChangedType.Removed,
        oldItems: oldItems
      });
    } else {
      this._set.clear();
    }

    var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

    if (propertyChangedIfCanEmit) {
      propertyChangedIfCanEmit.onPropertyChanged({
        name: 'size',
        oldValue: size,
        newValue: 0
      });
    }
  } // region Unchanged Set methods
  ;

  _proto[_Symbol$iterator] = function () {
    return (0, _getIterator2.default)(this._set);
  };

  _proto.entries = function entries() {
    var _context;

    return (0, _entries.default)(_context = this._set).call(_context);
  };

  _proto.forEach = function forEach(callbackfn, thisArg) {
    var _context2,
        _this2 = this;

    (0, _forEach.default)(_context2 = this._set).call(_context2, function (k, v) {
      return callbackfn.call(thisArg, k, v, _this2);
    });
  };

  _proto.has = function has(value) {
    return this._set.has(value);
  };

  _proto.keys = function keys() {
    var _context3;

    return (0, _keys.default)(_context3 = this._set).call(_context3);
  };

  _proto.values = function values() {
    var _context4;

    return (0, _values.default)(_context4 = this._set).call(_context4);
  } // endregion
  // region IMergeable
  ;

  _proto._canMerge = function _canMerge(source) {
    var _set = this._set;

    if (_set.canMerge) {
      return _set.canMerge(source);
    }

    if (source.constructor === ObservableSet && this._set === source._set) {
      return null;
    }

    return source.constructor === Object || source[_toStringTag.default] === 'Set' || (0, _isArray.default)(source) || (0, _helpers.isIterable)(source);
  };

  _proto._merge = function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    var _this3 = this;

    return (0, _mergeMaps.mergeMaps)(function (target, source) {
      return (0, _mergeSets.createMergeSetWrapper)(target, source, function (arrayOrIterable) {
        return (0, _set3.fillSet)(new _this3._set.constructor(), arrayOrIterable);
      });
    }, merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable
  ;

  _proto.serialize = function serialize(_serialize) {
    return {
      set: _serialize(this._set)
    };
  };

  _proto.deSerialize = function deSerialize() {} // endregion
  ;

  (0, _createClass2.default)(ObservableSet, [{
    key: "size",
    get: function get() {
      return this._set.size;
    }
  }]);
  return ObservableSet;
}(_SetChangedObject2.SetChangedObject);

exports.ObservableSet = ObservableSet;
ObservableSet.uuid = '91539dfb55f44bfb9dbfbff7f6ab800d';
(0, _mergers.registerMergeable)(ObservableSet);
(0, _serializers.registerSerializable)(ObservableSet, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    _regenerator.default.mark(function deSerialize(_deSerialize, serializedValue, valueFactory) {
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