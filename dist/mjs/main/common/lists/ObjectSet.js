import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { mergeMaps } from '../extensions/merge/merge-maps';
import { createMergeSetWrapper } from '../extensions/merge/merge-sets';
import { registerMergeable } from '../extensions/merge/mergers';
import { registerSerializable } from '../extensions/serialization/serializers';
import { isIterable } from '../helpers/helpers';
import { fillObjectKeys } from './helpers/set';
var _Symbol$toStringTag = Symbol.toStringTag;
var _Symbol$iterator = Symbol.iterator;
export var ObjectSet =
/*#__PURE__*/
function () {
  function ObjectSet(object) {
    _classCallCheck(this, ObjectSet);

    this[_Symbol$toStringTag] = 'Set';
    this._object = object || {};
  }

  _createClass(ObjectSet, [{
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
      return Object.keys(this._object)[Symbol.iterator]();
    }
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function entries() {
      var _object, _value2;

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
      return this[Symbol.iterator]();
    }
  }, {
    key: "values",
    value: function values() {
      return this[Symbol.iterator]();
    }
  }, {
    key: "_canMerge",
    // region IMergeable
    value: function _canMerge(source) {
      if (source.constructor === ObjectSet && this._object === source._object) {
        return null;
      }

      return source.constructor === Object || source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || isIterable(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps(function (target, source) {
        return createMergeSetWrapper(target, source, function (arrayOrIterable) {
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
    value: function deSerialize(_deSerialize, serializedValue) {} // endregion

  }, {
    key: "size",
    get: function get() {
      return Object.keys(this._object).length;
    }
  }], [{
    key: "from",
    value: function from(arrayOrIterable) {
      return new ObjectSet(fillObjectKeys({}, arrayOrIterable));
    }
  }]);

  return ObjectSet;
}();
ObjectSet.uuid = '6988ebc9-cd06-4a9b-97a9-8415b8cf1dc4';
registerMergeable(ObjectSet);
registerSerializable(ObjectSet, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function deSerialize(_deSerialize2, serializedValue, valueFactory) {
      var innerSet, value;
      return _regeneratorRuntime.wrap(function deSerialize$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _deSerialize2(serializedValue.object);

            case 2:
              innerSet = _context2.sent;
              value = valueFactory(innerSet);
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