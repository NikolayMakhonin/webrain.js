"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ObjectMap = void 0;

var _iterator = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _keys2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _mergeMaps = require("../extensions/merge/merge-maps");

var _mergers = require("../extensions/merge/mergers");

var _serializers = require("../extensions/serialization/serializers");

var _helpers = require("../helpers/helpers");

var _set = require("./helpers/set");

var _Symbol$toStringTag, _Symbol$iterator;

_Symbol$toStringTag = _toStringTag.default;
_Symbol$iterator = _iterator.default;

var ObjectMap =
/*#__PURE__*/
function () {
  function ObjectMap(object) {
    (0, _classCallCheck2.default)(this, ObjectMap);
    this[_Symbol$toStringTag] = 'Map';
    this._object = object || {};
  }

  (0, _createClass2.default)(ObjectMap, [{
    key: "set",
    value: function set(key, value) {
      this._object[key] = value;
      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _object = this._object;

      for (var _key in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, _key)) {
          delete _object[_key];
        }
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var _object = this._object;

      if (!Object.prototype.hasOwnProperty.call(_object, key)) {
        return false;
      }

      delete _object[key];
      return true;
    }
  }, {
    key: _Symbol$iterator,
    value: function value() {
      var _context;

      return (0, _entries.default)(_context = this).call(_context);
    }
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function entries() {
      var _object, _key2;

      return _regenerator.default.wrap(function entries$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _object = this._object;
              _context2.t0 = (0, _keys2.default)(_regenerator.default).call(_regenerator.default, _object);

            case 2:
              if ((_context2.t1 = _context2.t0()).done) {
                _context2.next = 9;
                break;
              }

              _key2 = _context2.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_object, _key2)) {
                _context2.next = 7;
                break;
              }

              _context2.next = 7;
              return [_key2, _object[_key2]];

            case 7:
              _context2.next = 2;
              break;

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, entries, this);
    })
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _object = this._object;

      for (var _key3 in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, _key3)) {
          callbackfn.call(thisArg, _object[_key3], _key3, this);
        }
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._object[key];
    }
  }, {
    key: "has",
    value: function has(key) {
      return Object.prototype.hasOwnProperty.call(this._object, key);
    }
  }, {
    key: "keys",
    value: function keys() {
      return (0, _getIterator2.default)((0, _keys.default)(this._object));
    }
  }, {
    key: "values",
    value: function values() {
      return (0, _getIterator2.default)((0, _values.default)(this._object));
    } // region IMergeable

  }, {
    key: "_canMerge",
    value: function _canMerge(source) {
      if (source.constructor === ObjectMap && this._object === source._object) {
        return null;
      }

      return source.constructor === Object || source[_toStringTag.default] === 'Map' || (0, _isArray.default)(source) || (0, _helpers.isIterable)(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return (0, _mergeMaps.mergeMaps)(function (target, source) {
        return (0, _mergeMaps.createMergeMapWrapper)(target, source, function (arrayOrIterable) {
          return (0, _set.fillMap)(new ObjectMap(), arrayOrIterable);
        });
      }, merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
    } // endregion
    // region ISerializable
    // noinspection SpellCheckingInspection

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        object: _serialize(this._object, {
          objectKeepUndefined: true
        })
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize() {} // endregion

  }, {
    key: "size",
    get: function get() {
      return (0, _keys.default)(this._object).length;
    }
  }]);
  return ObjectMap;
}();

exports.ObjectMap = ObjectMap;
ObjectMap.uuid = '62388f07b21a47788b3858f225cdbd42';
(0, _mergers.registerMergeable)(ObjectMap);
(0, _serializers.registerSerializable)(ObjectMap, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    _regenerator.default.mark(function deSerialize(_deSerialize, serializedValue, valueFactory) {
      var innerMap, value;
      return _regenerator.default.wrap(function deSerialize$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _deSerialize(serializedValue.object);

            case 2:
              innerMap = _context3.sent;
              value = valueFactory(innerMap); // value.deSerialize(deSerialize, serializedValue)

              return _context3.abrupt("return", value);

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, deSerialize);
    })
  }
});