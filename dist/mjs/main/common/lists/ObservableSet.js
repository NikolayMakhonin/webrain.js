import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { SetChangedObject } from './base/SetChangedObject';
import { SetChangedType } from './contracts/ISetChanged';
export var ObservableSet =
/*#__PURE__*/
function (_SetChangedObject) {
  _inherits(ObservableSet, _SetChangedObject);

  function ObservableSet() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        set = _ref.set;

    _classCallCheck(this, ObservableSet);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ObservableSet).call(this));
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

        this.onPropertyChanged({
          name: 'size',
          oldValue: oldSize,
          newValue: size
        });
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(value) {
      var _set = this._set;
      var oldSize = _set.size;

      this._set.delete(value);

      var size = _set.size;

      if (size < oldSize) {
        var _setChangedIfCanEmit = this._setChangedIfCanEmit;

        if (_setChangedIfCanEmit) {
          _setChangedIfCanEmit.emit({
            type: SetChangedType.Removed,
            oldItems: [value]
          });
        }

        this.onPropertyChanged({
          name: 'size',
          oldValue: oldSize,
          newValue: size
        });
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

      this.onPropertyChanged({
        name: 'size',
        oldValue: size,
        newValue: 0
      });
    } // region Unchanged Set methods

  }, {
    key: Symbol.iterator,
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

  }, {
    key: Symbol.toStringTag,
    get: function get() {
      return this._set[Symbol.toStringTag];
    }
  }, {
    key: "size",
    get: function get() {
      return this._set.size;
    }
  }]);

  return ObservableSet;
}(SetChangedObject);