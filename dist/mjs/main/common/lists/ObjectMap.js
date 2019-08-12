import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { createMergeMapWrapper, mergeMaps } from '../extensions/merge/merge-maps';
import { registerMergeable } from '../extensions/merge/mergers';
import { registerSerializable } from '../extensions/serialization/serializers';
import { isIterable } from '../helpers/helpers';
import { fillMap } from './helpers/set';
var _Symbol$toStringTag = Symbol.toStringTag;
var _Symbol$iterator = Symbol.iterator;
export var ObjectMap =
/*#__PURE__*/
function () {
  function ObjectMap(object) {
    _classCallCheck(this, ObjectMap);

    this[_Symbol$toStringTag] = 'Map';
    this._object = object || {};
  }

  _createClass(ObjectMap, [{
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
      return this.entries();
    }
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function entries() {
      var _object, _key2;

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

              _key2 = _context.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_object, _key2)) {
                _context.next = 7;
                break;
              }

              _context.next = 7;
              return [_key2, _object[_key2]];

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
      return Object.keys(this._object)[Symbol.iterator]();
    }
  }, {
    key: "values",
    value: function values() {
      return Object.values(this._object)[Symbol.iterator]();
    } // region IMergeable

  }, {
    key: "_canMerge",
    value: function _canMerge(source) {
      if (source.constructor === ObjectMap && this._object === source._object) {
        return null;
      }

      return source.constructor === Object || source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || isIterable(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps(function (target, source) {
        return createMergeMapWrapper(target, source, function (arrayOrIterable) {
          return fillMap(new ObjectMap(), arrayOrIterable);
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

  return ObjectMap;
}();
ObjectMap.uuid = '62388f07-b21a-4778-8b38-58f225cdbd42';
registerMergeable(ObjectMap);
registerSerializable(ObjectMap, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function deSerialize(_deSerialize2, serializedValue, valueFactory) {
      var innerMap, value;
      return _regeneratorRuntime.wrap(function deSerialize$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _deSerialize2(serializedValue.object);

            case 2:
              innerMap = _context2.sent;
              value = valueFactory(innerMap);
              value.deSerialize(_deSerialize2, serializedValue);
              return _context2.abrupt("return", value);

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      }, deSerialize);
    })
  }
});