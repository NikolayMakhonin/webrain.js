"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ObjectHashMap = void 0;

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

var _objectUniqueId = require("../helpers/object-unique-id");

var _set = require("./helpers/set");

var _Symbol$toStringTag, _Symbol$iterator;

_Symbol$toStringTag = _toStringTag.default;
_Symbol$iterator = _iterator.default;

var ObjectHashMap =
/*#__PURE__*/
function () {
  function ObjectHashMap(object) {
    (0, _classCallCheck2.default)(this, ObjectHashMap);
    this[_Symbol$toStringTag] = 'Map';
    this._object = object || {};
  }

  (0, _createClass2.default)(ObjectHashMap, [{
    key: "set",
    value: function set(key, value) {
      var id = (0, _objectUniqueId.getObjectUniqueId)(key);
      this._object[id] = [key, value];
      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _object = this._object;

      for (var _id in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, _id)) {
          delete _object[_id];
        }
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var _object = this._object;
      var id = (0, _objectUniqueId.getObjectUniqueId)(key);

      if (!Object.prototype.hasOwnProperty.call(_object, id)) {
        return false;
      }

      delete _object[id];
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
      var _object, _id2;

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

              _id2 = _context2.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_object, _id2)) {
                _context2.next = 7;
                break;
              }

              _context2.next = 7;
              return _object[_id2];

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

      for (var _id3 in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, _id3)) {
          var entry = _object[_id3];
          callbackfn.call(thisArg, entry[1], entry[0], this);
        }
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      var id = (0, _objectUniqueId.getObjectUniqueId)(key);
      var entry = this._object[id];
      return entry && entry[1];
    }
  }, {
    key: "has",
    value: function has(key) {
      var id = (0, _objectUniqueId.getObjectUniqueId)(key);
      return Object.prototype.hasOwnProperty.call(this._object, id);
    }
  }, {
    key: "keys",
    value:
    /*#__PURE__*/
    _regenerator.default.mark(function keys() {
      var _object, _id4, entry;

      return _regenerator.default.wrap(function keys$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _object = this._object;
              _context3.t0 = (0, _keys2.default)(_regenerator.default).call(_regenerator.default, _object);

            case 2:
              if ((_context3.t1 = _context3.t0()).done) {
                _context3.next = 10;
                break;
              }

              _id4 = _context3.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_object, _id4)) {
                _context3.next = 8;
                break;
              }

              entry = _object[_id4];
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
      var _object, _id5, entry;

      return _regenerator.default.wrap(function values$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _object = this._object;
              _context4.t0 = (0, _keys2.default)(_regenerator.default).call(_regenerator.default, _object);

            case 2:
              if ((_context4.t1 = _context4.t0()).done) {
                _context4.next = 10;
                break;
              }

              _id5 = _context4.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_object, _id5)) {
                _context4.next = 8;
                break;
              }

              entry = _object[_id5];
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
      if (source.constructor === ObjectHashMap && this._object === source._object) {
        return null;
      }

      return source[_toStringTag.default] === 'Map' || (0, _isArray.default)(source) || (0, _helpers.isIterable)(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return (0, _mergeMaps.mergeMaps)(function (target, source) {
        return (0, _mergeMaps.createMergeMapWrapper)(target, source, function (arrayOrIterable) {
          return (0, _set.fillMap)(new ObjectHashMap(), arrayOrIterable);
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
      return (0, _keys.default)(this._object).length;
    }
  }]);
  return ObjectHashMap;
}();

exports.ObjectHashMap = ObjectHashMap;
ObjectHashMap.uuid = '7a5731ae37ad4c5baee025a8f1cd2228';
(0, _mergers.registerMergeable)(ObjectHashMap);
(0, _serializers.registerSerializable)(ObjectHashMap, {
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
              return _deSerialize(serializedValue.object);

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