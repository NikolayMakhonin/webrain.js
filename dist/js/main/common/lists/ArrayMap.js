"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.ArrayMap = void 0;

var _iterator = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _keys2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _entries = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/entries"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _mergeMaps = require("../extensions/merge/merge-maps");

var _mergers = require("../extensions/merge/mergers");

var _serializers = require("../extensions/serialization/serializers");

var _helpers = require("../helpers/helpers");

var _objectUniqueId = require("./helpers/object-unique-id");

var _set = require("./helpers/set");

var _Symbol$toStringTag, _Symbol$iterator;

_Symbol$toStringTag = _toStringTag.default;
_Symbol$iterator = _iterator.default;

var ArrayMap =
/*#__PURE__*/
function () {
  function ArrayMap(array) {
    (0, _classCallCheck2.default)(this, ArrayMap);
    this[_Symbol$toStringTag] = 'Map';
    this._array = array || [];
  }

  (0, _createClass2.default)(ArrayMap, [{
    key: "set",
    value: function set(key, value) {
      var id = (0, _objectUniqueId.getObjectUniqueId)(key);
      this._array[id] = [key, value];
      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _array = this._array;

      for (var id in _array) {
        if (Object.prototype.hasOwnProperty.call(_array, id)) {
          // tslint:disable-next-line:no-array-delete
          delete _array[id];
        }
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var _array = this._array;
      var id = (0, _objectUniqueId.getObjectUniqueId)(key);

      if (!Object.prototype.hasOwnProperty.call(_array, id)) {
        return false;
      } // tslint:disable-next-line:no-array-delete


      delete _array[id];
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
      var _array, id;

      return _regenerator.default.wrap(function entries$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _array = this._array;
              _context2.t0 = (0, _keys2.default)(_regenerator.default).call(_regenerator.default, _array);

            case 2:
              if ((_context2.t1 = _context2.t0()).done) {
                _context2.next = 9;
                break;
              }

              id = _context2.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_array, id)) {
                _context2.next = 7;
                break;
              }

              _context2.next = 7;
              return _array[id];

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
      var _array = this._array;

      for (var id in _array) {
        if (Object.prototype.hasOwnProperty.call(_array, id)) {
          var entry = _array[id];
          callbackfn.call(thisArg, entry[1], entry[0], this);
        }
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      var id = (0, _objectUniqueId.getObjectUniqueId)(key);

      if (!Object.prototype.hasOwnProperty.call(this._array, id)) {
        return void 0;
      }

      return this._array[id][1];
    }
  }, {
    key: "has",
    value: function has(key) {
      var id = (0, _objectUniqueId.getObjectUniqueId)(key);
      return Object.prototype.hasOwnProperty.call(this._array, id);
    }
  }, {
    key: "keys",
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function keys() {
      var _array, id, entry;

      return _regenerator.default.wrap(function keys$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _array = this._array;
              _context3.t0 = (0, _keys2.default)(_regenerator.default).call(_regenerator.default, _array);

            case 2:
              if ((_context3.t1 = _context3.t0()).done) {
                _context3.next = 10;
                break;
              }

              id = _context3.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_array, id)) {
                _context3.next = 8;
                break;
              }

              entry = _array[id];
              _context3.next = 8;
              return entry[0];

            case 8:
              _context3.next = 2;
              break;

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, keys, this);
    }) // tslint:disable-next-line:no-identical-functions

  }, {
    key: "values",
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function values() {
      var _array, id, entry;

      return _regenerator.default.wrap(function values$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _array = this._array;
              _context4.t0 = (0, _keys2.default)(_regenerator.default).call(_regenerator.default, _array);

            case 2:
              if ((_context4.t1 = _context4.t0()).done) {
                _context4.next = 10;
                break;
              }

              id = _context4.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_array, id)) {
                _context4.next = 8;
                break;
              }

              entry = _array[id];
              _context4.next = 8;
              return entry[1];

            case 8:
              _context4.next = 2;
              break;

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, values, this);
    }) // region IMergeable

  }, {
    key: "_canMerge",
    value: function _canMerge(source) {
      if (source.constructor === ArrayMap && this._array === source._array) {
        return null;
      }

      return source[_toStringTag.default] === 'Map' || (0, _isArray.default)(source) || (0, _helpers.isIterable)(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return (0, _mergeMaps.mergeMaps)(function (target, source) {
        return (0, _mergeMaps.createMergeMapWrapper)(target, source, function (arrayOrIterable) {
          return (0, _set.fillMap)(new ArrayMap(), arrayOrIterable);
        });
      }, merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
    } // endregion
    // region ISerializable

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        array: _serialize(this._array, {
          arrayAsObject: true,
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
      return (0, _keys.default)(this._array).length;
    }
  }]);
  return ArrayMap;
}();

exports.ArrayMap = ArrayMap;
ArrayMap.uuid = 'ef0ced8a58f74381b8503b09c0a42eed';
(0, _mergers.registerMergeable)(ArrayMap);
(0, _serializers.registerSerializable)(ArrayMap, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    _regenerator.default.mark(function deSerialize(_deSerialize, serializedValue, valueFactory) {
      var innerMap, value;
      return _regenerator.default.wrap(function deSerialize$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _deSerialize(serializedValue.array, null, {
                arrayAsObject: true
              });

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