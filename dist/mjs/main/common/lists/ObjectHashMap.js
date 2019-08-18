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
export var ObjectHashMap =
/*#__PURE__*/
function () {
  function ObjectHashMap(object) {
    _classCallCheck(this, ObjectHashMap);

    this[_Symbol$toStringTag] = 'Map';
    this._object = object || {};
  }

  _createClass(ObjectHashMap, [{
    key: "set",
    value: function set(key, value) {
      var id = getObjectUniqueId(key);
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
      var id = getObjectUniqueId(key);

      if (!Object.prototype.hasOwnProperty.call(_object, id)) {
        return false;
      }

      delete _object[id];
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
      var _object, _id2;

      return _regeneratorRuntime.wrap(function entries$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _object = this._object;
              _context.t0 = _regeneratorRuntime.keys(_object);

            case 2:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 9;
                break;
              }

              _id2 = _context.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_object, _id2)) {
                _context.next = 7;
                break;
              }

              _context.next = 7;
              return _object[_id2];

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
      var id = getObjectUniqueId(key);
      var entry = this._object[id];
      return entry && entry[1];
    }
  }, {
    key: "has",
    value: function has(key) {
      var id = getObjectUniqueId(key);
      return Object.prototype.hasOwnProperty.call(this._object, id);
    }
  }, {
    key: "keys",
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function keys() {
      var _object, _id4, entry;

      return _regeneratorRuntime.wrap(function keys$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _object = this._object;
              _context2.t0 = _regeneratorRuntime.keys(_object);

            case 2:
              if ((_context2.t1 = _context2.t0()).done) {
                _context2.next = 10;
                break;
              }

              _id4 = _context2.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_object, _id4)) {
                _context2.next = 8;
                break;
              }

              entry = _object[_id4];
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
      var _object, _id5, entry;

      return _regeneratorRuntime.wrap(function values$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _object = this._object;
              _context3.t0 = _regeneratorRuntime.keys(_object);

            case 2:
              if ((_context3.t1 = _context3.t0()).done) {
                _context3.next = 10;
                break;
              }

              _id5 = _context3.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_object, _id5)) {
                _context3.next = 8;
                break;
              }

              entry = _object[_id5];
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
      if (source.constructor === ObjectHashMap && this._object === source._object) {
        return null;
      }

      return source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || isIterable(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps(function (target, source) {
        return createMergeMapWrapper(target, source, function (arrayOrIterable) {
          return fillMap(new ObjectHashMap(), arrayOrIterable);
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
    value: function deSerialize(_deSerialize, serializedValue) {} // endregion

  }, {
    key: "size",
    get: function get() {
      return Object.keys(this._object).length;
    }
  }]);

  return ObjectHashMap;
}();
ObjectHashMap.uuid = '7a5731ae-37ad-4c5b-aee0-25a8f1cd2228';
registerMergeable(ObjectHashMap);
registerSerializable(ObjectHashMap, {
  serializer: {
    deSerialize: function deSerialize(_deSerialize2, serializedValue, valueFactory) {
      return (
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee() {
          var innerMap, value;
          return _regeneratorRuntime.wrap(function _callee$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.next = 2;
                  return _deSerialize2(serializedValue.object);

                case 2:
                  innerMap = _context4.sent;
                  value = valueFactory(innerMap);
                  value.deSerialize(_deSerialize2, serializedValue);
                  return _context4.abrupt("return", value);

                case 6:
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