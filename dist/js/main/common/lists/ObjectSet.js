"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.ObjectSet = void 0;

var _iterator = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _toStringTag = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol/to-string-tag"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _keys2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _mergeMaps = require("../extensions/merge/merge-maps");

var _mergeSets = require("../extensions/merge/merge-sets");

var _mergers = require("../extensions/merge/mergers");

var _serializers = require("../extensions/serialization/serializers");

var _helpers = require("../helpers/helpers");

var _set = require("./helpers/set");

var _Symbol$toStringTag, _Symbol$iterator;

_Symbol$toStringTag = _toStringTag.default;
_Symbol$iterator = _iterator.default;

var ObjectSet =
/*#__PURE__*/
function () {
  function ObjectSet(object) {
    (0, _classCallCheck2.default)(this, ObjectSet);
    this[_Symbol$toStringTag] = 'Set';
    this._object = object || {};
  }

  (0, _createClass2.default)(ObjectSet, [{
    key: "add",
    value: function add(value) {
      this._object[value] = true;
      return this;
    }
  }, {
    key: "delete",
    value: function _delete(value) {
      var _object = this._object;

      if (!Object.prototype.hasOwnProperty.call(_object, value)) {
        return false;
      }

      delete _object[value];
      return true;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _object = this._object;

      for (var _value in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, _value)) {
          delete _object[_value];
        }
      }

      return this;
    }
  }, {
    key: _Symbol$iterator,
    value: function value() {
      return (0, _getIterator2.default)((0, _keys2.default)(this._object));
    }
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function entries() {
      var _object, _value2;

      return _regenerator.default.wrap(function entries$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _object = this._object;
              _context.t0 = (0, _keys.default)(_regenerator.default).call(_regenerator.default, _object);

            case 2:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 9;
                break;
              }

              _value2 = _context.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_object, _value2)) {
                _context.next = 7;
                break;
              }

              _context.next = 7;
              return [_value2, _value2];

            case 7:
              _context.next = 2;
              break;

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, entries, this);
    })
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _object = this._object;

      for (var _value3 in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, _value3)) {
          callbackfn.call(thisArg, _value3, _value3, this);
        }
      }
    }
  }, {
    key: "has",
    value: function has(value) {
      return Object.prototype.hasOwnProperty.call(this._object, value);
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
      if (source.constructor === ObjectSet && this._object === source._object) {
        return null;
      }

      return source.constructor === Object || source[_toStringTag.default] === 'Set' || (0, _isArray.default)(source) || (0, _helpers.isIterable)(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return (0, _mergeMaps.mergeMaps)(function (target, source) {
        return (0, _mergeSets.createMergeSetWrapper)(target, source, function (arrayOrIterable) {
          return ObjectSet.from(arrayOrIterable);
        });
      }, merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
    } // endregion
    // region ISerializable

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
      return (0, _keys2.default)(this._object).length;
    }
  }], [{
    key: "from",
    value: function from(arrayOrIterable) {
      return new ObjectSet((0, _set.fillObjectKeys)({}, arrayOrIterable));
    }
  }]);
  return ObjectSet;
}();

exports.ObjectSet = ObjectSet;
ObjectSet.uuid = '6988ebc9cd064a9b97a98415b8cf1dc4';
(0, _mergers.registerMergeable)(ObjectSet);
(0, _serializers.registerSerializable)(ObjectSet, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    _regenerator.default.mark(function deSerialize(_deSerialize, serializedValue, valueFactory) {
      var innerSet, value;
      return _regenerator.default.wrap(function deSerialize$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _deSerialize(serializedValue.object);

            case 2:
              innerSet = _context2.sent;
              value = valueFactory(innerSet); // value.deSerialize(deSerialize, serializedValue)

              return _context2.abrupt("return", value);

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, deSerialize);
    })
  }
});