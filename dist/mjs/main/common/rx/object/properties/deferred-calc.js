import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { ObservableObject } from '../ObservableObject';
export var DeferredCalcProperty =
/*#__PURE__*/
function (_ObservableObject) {
  _inherits(DeferredCalcProperty, _ObservableObject);

  function DeferredCalcProperty(calcFunc) {
    var _this;

    _classCallCheck(this, DeferredCalcProperty);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(DeferredCalcProperty).call(this));

    if (typeof calcFunc !== 'function') {
      throw new Error("calcFunc must be a function: ".concat(calcFunc));
    }

    _this._calcFunc = calcFunc;
    return _this;
  }

  _createClass(DeferredCalcProperty, [{
    key: "invalidate",
    value: function invalidate() {
      var _this2 = this;

      if (this.isCalculated) {
        var _propertyChangedIfCanEmit = this._propertyChangedIfCanEmit;

        if (!_propertyChangedIfCanEmit) {
          this.isCalculated = false;
          return;
        }

        var event = {
          name: 'value',
          oldValue: this.value
        };
        this.isCalculated = false;
        Object.defineProperty(event, 'newValue', {
          configurable: true,
          enumerable: true,
          get: function get() {
            return _this2.value;
          }
        });

        _propertyChangedIfCanEmit.emit(event);
      }
    }
  }, {
    key: "deferredValue",
    get: function get() {
      return this._property.value;
    }
  }, {
    key: "value",
    get: function get() {
      if (this.isCalculated) {
        return this._value;
      }

      var value = this._calcFunc();

      this._value = value;
      this.isCalculated = true;
      return value;
    }
  }]);

  return DeferredCalcProperty;
}(ObservableObject);