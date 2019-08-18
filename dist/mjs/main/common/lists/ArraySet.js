import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

var _Symbol$toStringTag, _Symbol$iterator;

/* tslint:disable:ban-types */
import { mergeMaps } from '../extensions/merge/merge-maps';
import { createMergeSetWrapper } from '../extensions/merge/merge-sets';
import { registerMergeable } from '../extensions/merge/mergers';
import { registerSerializable } from '../extensions/serialization/serializers';
import { isIterable } from '../helpers/helpers';
import { getObjectUniqueId } from './helpers/object-unique-id';
import { fillSet } from './helpers/set';
_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;
export var ArraySet =
/*#__PURE__*/
function () {
  function ArraySet(array, size) {
    _classCallCheck(this, ArraySet);

    this[_Symbol$toStringTag] = 'Set';
    this._array = array || [];
    this._size = size || Object.keys(this._array).length;
  }

  _createClass(ArraySet, [{
    key: "add",
    value: function add(value) {
      var _array = this._array;
      var id = getObjectUniqueId(value); // if (Object.prototype.hasOwnProperty.call(_array, id)) {

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
      var id = getObjectUniqueId(value); // if (Object.prototype.hasOwnProperty.call(_array, id)) {

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
    _regeneratorRuntime.mark(function value() {
      var _array, id;

      return _regeneratorRuntime.wrap(function value$(_context) {
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
      }, value, this);
    })
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    _regeneratorRuntime.mark(function entries() {
      var _array, id, _value;

      return _regeneratorRuntime.wrap(function entries$(_context2) {
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
      return Object.prototype.hasOwnProperty.call(this._array, getObjectUniqueId(value));
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
      if (source.constructor === ArraySet && this._array === source._array) {
        return null;
      }

      return source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || isIterable(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps(function (target, source) {
        return createMergeSetWrapper(target, source, function (arrayOrIterable) {
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
    value: function deSerialize(_deSerialize, serializedValue) {} // endregion

  }, {
    key: "size",
    get: function get() {
      return this._size;
    }
  }], [{
    key: "from",
    value: function from(arrayOrIterable) {
      return fillSet(new ArraySet(), arrayOrIterable);
    }
  }]);

  return ArraySet;
}();
ArraySet.uuid = '0e8c7f09-ea9e-4631-8af8-a635c214a01c';
registerMergeable(ArraySet);
registerSerializable(ArraySet, {
  serializer: {
    deSerialize: function deSerialize(_deSerialize2, serializedValue, valueFactory) {
      return (
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee() {
          var innerSet, value;
          return _regeneratorRuntime.wrap(function _callee$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return _deSerialize2(serializedValue.array, null, {
                    arrayAsObject: true
                  });

                case 2:
                  innerSet = _context3.sent;
                  value = valueFactory(innerSet);
                  value.deSerialize(_deSerialize2, serializedValue);
                  return _context3.abrupt("return", value);

                case 6:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee);
        })()
      );
    }
  }
});