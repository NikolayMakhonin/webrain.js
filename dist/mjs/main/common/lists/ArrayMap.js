import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

var _Symbol$toStringTag, _Symbol$iterator;

import { createMergeMapWrapper, mergeMaps } from '../extensions/merge/merge-maps';
import { registerMergeable } from '../extensions/merge/mergers';
import { registerSerializable } from '../extensions/serialization/serializers';
import { isIterable } from '../helpers/helpers';
import { getObjectUniqueId } from './helpers/object-unique-id';
import { fillMap } from './helpers/set';
_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;
export var ArrayMap =
/*#__PURE__*/
function () {
  function ArrayMap(array) {
    _classCallCheck(this, ArrayMap);

    this[_Symbol$toStringTag] = 'Map';
    this._array = array || [];
  }

  _createClass(ArrayMap, [{
    key: "set",
    value: function set(key, value) {
      var id = getObjectUniqueId(key);
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
      var id = getObjectUniqueId(key);

      if (!Object.prototype.hasOwnProperty.call(_array, id)) {
        return false;
      } // tslint:disable-next-line:no-array-delete


      delete _array[id];
      return true;
    }
  }, {
    key: _Symbol$iterator,
    value: function value() {
      return this.entries();
    }
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function entries() {
      var _array, id;

      return _regeneratorRuntime.wrap(function entries$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _array = this._array;
              _context.t0 = _regeneratorRuntime.keys(_array);

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
      var id = getObjectUniqueId(key);

      if (!Object.prototype.hasOwnProperty.call(this._array, id)) {
        return void 0;
      }

      return this._array[id][1];
    }
  }, {
    key: "has",
    value: function has(key) {
      var id = getObjectUniqueId(key);
      return Object.prototype.hasOwnProperty.call(this._array, id);
    }
  }, {
    key: "keys",
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function keys() {
      var _array, id, entry;

      return _regeneratorRuntime.wrap(function keys$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _array = this._array;
              _context2.t0 = _regeneratorRuntime.keys(_array);

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

              entry = _array[id];
              _context2.next = 8;
              return entry[0];

            case 8:
              _context2.next = 2;
              break;

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, keys, this);
    }) // tslint:disable-next-line:no-identical-functions

  }, {
    key: "values",
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function values() {
      var _array, id, entry;

      return _regeneratorRuntime.wrap(function values$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _array = this._array;
              _context3.t0 = _regeneratorRuntime.keys(_array);

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
              return entry[1];

            case 8:
              _context3.next = 2;
              break;

            case 10:
            case "end":
              return _context3.stop();
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

      return source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || isIterable(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps(function (target, source) {
        return createMergeMapWrapper(target, source, function (arrayOrIterable) {
          return fillMap(new ArrayMap(), arrayOrIterable);
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
      return Object.keys(this._array).length;
    }
  }]);

  return ArrayMap;
}();
ArrayMap.uuid = 'ef0ced8a58f74381b8503b09c0a42eed';
registerMergeable(ArrayMap);
registerSerializable(ArrayMap, {
  serializer: {
    deSerialize: function deSerialize(_deSerialize, serializedValue, valueFactory) {
      return (
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee() {
          var innerMap, value;
          return _regeneratorRuntime.wrap(function _callee$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return _deSerialize(serializedValue.array, null, {
                    arrayAsObject: true
                  });

                case 2:
                  innerMap = _context4.sent;
                  value = valueFactory(innerMap); // value.deSerialize(deSerialize, serializedValue)

                  return _context4.abrupt("return", value);

                case 5:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee);
        })()
      );
    }
  }
});