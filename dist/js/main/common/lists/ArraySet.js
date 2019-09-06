"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ArraySet = void 0;

var _iterator = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _keys2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _mergeMaps = require("../extensions/merge/merge-maps");

var _mergeSets = require("../extensions/merge/merge-sets");

var _mergers = require("../extensions/merge/mergers");

var _serializers = require("../extensions/serialization/serializers");

var _helpers = require("../helpers/helpers");

var _objectUniqueId = require("../helpers/object-unique-id");

var _set = require("./helpers/set");

var _Symbol$toStringTag, _Symbol$iterator;

_Symbol$toStringTag = _toStringTag.default;
_Symbol$iterator = _iterator.default;

var ArraySet =
/*#__PURE__*/
function () {
  function ArraySet(array, size) {
    (0, _classCallCheck2.default)(this, ArraySet);
    this[_Symbol$toStringTag] = 'Set';
    this._array = array || [];
    this._size = size || (0, _keys2.default)(this._array).length;
  }

  (0, _createClass2.default)(ArraySet, [{
    key: "add",
    value: function add(value) {
      var _array = this._array;
      var id = (0, _objectUniqueId.getObjectUniqueId)(value); // if (Object.prototype.hasOwnProperty.call(_array, id)) {

      if (typeof _array[id] !== 'undefined') {
        return this;
      }

      this._array[id] = value;
      this._size++;
      return this;
    }
  }, {
    key: "delete",
    value: function _delete(value) {
      var _array = this._array;
      var id = (0, _objectUniqueId.getObjectUniqueId)(value); // if (Object.prototype.hasOwnProperty.call(_array, id)) {

      if (typeof _array[id] === 'undefined') {
        return false;
      } // tslint:disable-next-line:no-array-delete


      delete _array[id];
      this._size--;
      return true;
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

      this._size = 0;
      return this;
    }
  }, {
    key: _Symbol$iterator,
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function value() {
      var _array, id;

      return _regenerator.default.wrap(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _array = this._array;
              _context.t0 = (0, _keys.default)(_regenerator.default).call(_regenerator.default, _array);

            case 2:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 9;
                break;
              }

              id = _context.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_array, id)) {
                _context.next = 7;
                break;
              }

              _context.next = 7;
              return _array[id];

            case 7:
              _context.next = 2;
              break;

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, value, this);
    })
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function entries() {
      var _array, id, _value;

      return _regenerator.default.wrap(function entries$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _array = this._array;
              _context2.t0 = (0, _keys.default)(_regenerator.default).call(_regenerator.default, _array);

            case 2:
              if ((_context2.t1 = _context2.t0()).done) {
                _context2.next = 10;
                break;
              }

              id = _context2.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_array, id)) {
                _context2.next = 8;
                break;
              }

              _value = _array[id];
              _context2.next = 8;
              return [_value, _value];

            case 8:
              _context2.next = 2;
              break;

            case 10:
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
          var _value2 = _array[id];
          callbackfn.call(thisArg, _value2, _value2, this);
        }
      }
    }
  }, {
    key: "has",
    value: function has(value) {
      return Object.prototype.hasOwnProperty.call(this._array, (0, _objectUniqueId.getObjectUniqueId)(value));
    }
  }, {
    key: "keys",
    value: function keys() {
      return (0, _getIterator2.default)(this);
    }
  }, {
    key: "values",
    value: function values() {
      return (0, _getIterator2.default)(this);
    }
  }, {
    key: "_canMerge",
    // region IMergeable
    value: function _canMerge(source) {
      if (source.constructor === ArraySet && this._array === source._array) {
        return null;
      }

      return source[_toStringTag.default] === 'Set' || (0, _isArray.default)(source) || (0, _helpers.isIterable)(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return (0, _mergeMaps.mergeMaps)(function (target, source) {
        return (0, _mergeSets.createMergeSetWrapper)(target, source, function (arrayOrIterable) {
          return ArraySet.from(arrayOrIterable);
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
      return this._size;
    }
  }], [{
    key: "from",
    value: function from(arrayOrIterable) {
      return (0, _set.fillSet)(new ArraySet(), arrayOrIterable);
    }
  }]);
  return ArraySet;
}();

exports.ArraySet = ArraySet;
ArraySet.uuid = '0e8c7f09ea9e46318af8a635c214a01c';
(0, _mergers.registerMergeable)(ArraySet);
(0, _serializers.registerSerializable)(ArraySet, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    _regenerator.default.mark(function deSerialize(_deSerialize, serializedValue, valueFactory) {
      var innerSet, value;
      return _regenerator.default.wrap(function deSerialize$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _deSerialize(serializedValue.array, null, {
                arrayAsObject: true
              });

            case 2:
              innerSet = _context3.sent;
              value = valueFactory(innerSet); // value.deSerialize(deSerialize, serializedValue)

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