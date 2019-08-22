import _regeneratorRuntime from "@babel/runtime/regenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";

var _Symbol$toStringTag, _Symbol$iterator;

import { mergeMaps } from '../extensions/merge/merge-maps';
import { createMergeSetWrapper } from '../extensions/merge/merge-sets';
import { registerMergeable } from '../extensions/merge/mergers';
import { registerSerializable } from '../extensions/serialization/serializers';
import { isIterable } from '../helpers/helpers';
import { SetChangedObject } from './base/SetChangedObject';
import { SetChangedType } from './contracts/ISetChanged';
import { fillSet } from './helpers/set';
_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;
export var ObservableSet =
/*#__PURE__*/
function (_SetChangedObject) {
  _inherits(ObservableSet, _SetChangedObject);

  function ObservableSet(set) {
    var _this;

    _classCallCheck(this, ObservableSet);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ObservableSet).call(this));
    _this[_Symbol$toStringTag] = 'Set';
    _this._set = set || new Set();
    return _this;
  }

  _createClass(ObservableSet, [{
    key: "add",
    value: function add(value) {
      var _set = this._set;
      var oldSize = _set.size;

      this._set.add(value);

      var size = _set.size;

      if (size > oldSize) {
        var _setChangedIfCanEmit = this._setChangedIfCanEmit;

        if (_setChangedIfCanEmit) {
          _setChangedIfCanEmit.emit({
            type: SetChangedType.Added,
            newItems: [value]
          });
        }

        var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

        if (propertyChangedIfCanEmit) {
          propertyChangedIfCanEmit.onPropertyChanged({
            name: 'size',
            oldValue: oldSize,
            newValue: size
          });
        }
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(value) {
      var _set = this._set;
      var oldSize = _set.size;

      this._set["delete"](value);

      var size = _set.size;

      if (size < oldSize) {
        var _setChangedIfCanEmit = this._setChangedIfCanEmit;

        if (_setChangedIfCanEmit) {
          _setChangedIfCanEmit.emit({
            type: SetChangedType.Removed,
            oldItems: [value]
          });
        }

        var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

        if (propertyChangedIfCanEmit) {
          propertyChangedIfCanEmit.onPropertyChanged({
            name: 'size',
            oldValue: oldSize,
            newValue: size
          });
        }

        return true;
      }

      return false;
    }
  }, {
    key: "clear",
    value: function clear() {
      var size = this.size;

      if (size === 0) {
        return;
      }

      var _setChangedIfCanEmit = this._setChangedIfCanEmit;

      if (_setChangedIfCanEmit) {
        var oldItems = Array.from(this);

        this._set.clear();

        _setChangedIfCanEmit.emit({
          type: SetChangedType.Removed,
          oldItems: oldItems
        });
      } else {
        this._set.clear();
      }

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: size,
          newValue: 0
        });
      }
    } // region Unchanged Set methods

  }, {
    key: _Symbol$iterator,
    value: function value() {
      return this._set[Symbol.iterator]();
    }
  }, {
    key: "entries",
    value: function entries() {
      return this._set.entries();
    }
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _this2 = this;

      this._set.forEach(function (k, v, s) {
        return callbackfn.call(thisArg, k, v, _this2);
      });
    }
  }, {
    key: "has",
    value: function has(value) {
      return this._set.has(value);
    }
  }, {
    key: "keys",
    value: function keys() {
      return this._set.keys();
    }
  }, {
    key: "values",
    value: function values() {
      return this._set.values();
    } // endregion
    // region IMergeable

  }, {
    key: "_canMerge",
    value: function _canMerge(source) {
      var _set = this._set;

      if (_set.canMerge) {
        return _set.canMerge(source);
      }

      if (source.constructor === ObservableSet && this._set === source._set) {
        return null;
      }

      return source.constructor === Object || source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || isIterable(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      var _this3 = this;

      return mergeMaps(function (target, source) {
        return createMergeSetWrapper(target, source, function (arrayOrIterable) {
          return fillSet(new _this3._set.constructor(), arrayOrIterable);
        });
      }, merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
    } // endregion
    // region ISerializable

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        set: _serialize(this._set)
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize(_deSerialize, serializedValue) {} // endregion

  }, {
    key: "size",
    get: function get() {
      return this._set.size;
    }
  }]);

  return ObservableSet;
}(SetChangedObject);
ObservableSet.uuid = '91539dfb-55f4-4bfb-9dbf-bff7f6ab800d';
registerMergeable(ObservableSet);
registerSerializable(ObservableSet, {
  serializer: {
    deSerialize: function deSerialize(_deSerialize2, serializedValue, valueFactory) {
      return (
        /*#__PURE__*/
        _regeneratorRuntime.mark(function _callee() {
          var innerSet, value;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return _deSerialize2(serializedValue.set);

                case 2:
                  innerSet = _context.sent;
                  value = valueFactory(innerSet);
                  value.deSerialize(_deSerialize2, serializedValue);
                  return _context.abrupt("return", value);

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        })()
      );
    }
  }
});