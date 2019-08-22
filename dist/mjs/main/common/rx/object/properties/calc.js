import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { resolveAsyncFunc } from '../../../async/ThenableSync';
import { PropertyChangedEvent } from '../../../lists/contracts/IPropertyChanged';
import { DeferredCalc } from '../../deferred-calc/DeferredCalc';
import { ObservableObject } from '../ObservableObject';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { Property } from './property';
var valuePropertiesNames = ['current', 'wait', 'currentOrWait'];
export var CalcProperty =
/*#__PURE__*/
function (_ObservableObject) {
  _inherits(CalcProperty, _ObservableObject);

  function CalcProperty(calcFunc, calcOptions, valueOptions, value) {
    var _this;

    _classCallCheck(this, CalcProperty);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CalcProperty).call(this));

    if (typeof calcFunc !== 'function') {
      throw new Error("calcFunc must be a function: ".concat(calcFunc));
    }

    _this._calcFunc = calcFunc;
    _this._value = new Property(valueOptions, value);
    _this._deferredCalc = new DeferredCalc(function () {
      _this.onValueChanged();
    }, function (done) {
      _this._waiter = resolveAsyncFunc(function () {
        return _this._calcFunc(_this.input, _this._value);
      }, function () {
        _this._hasValue = true;
        var val = _this._value.value;
        done();
        return val;
      }, done, true);
    }, function () {
      _this.onValueChanged();
    }, calcOptions);
    return _this;
  }

  _createClass(CalcProperty, [{
    key: "onValueChanged",
    value: function onValueChanged() {
      var _this2 = this;

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        var oldValue = this._value.value;
        propertyChangedIfCanEmit.onPropertyChanged(new PropertyChangedEvent('current', oldValue, function () {
          return _this2.current;
        }), new PropertyChangedEvent('wait', oldValue, function () {
          return _this2.wait;
        }), new PropertyChangedEvent('currentOrWait', oldValue, function () {
          return _this2.currentOrWait;
        }));
      }
    }
  }, {
    key: "invalidate",
    value: function invalidate() {
      this._deferredCalc.invalidate();
    }
  }, {
    key: "current",
    get: function get() {
      this._deferredCalc.calc();

      return this._value.value;
    }
  }, {
    key: "wait",
    get: function get() {
      this._deferredCalc.calc();

      return this._waiter;
    }
  }, {
    key: "currentOrWait",
    get: function get() {
      this._deferredCalc.calc();

      return this._hasValue ? this._value.value : this._waiter;
    }
  }]);

  return CalcProperty;
}(ObservableObject);
new ObservableObjectBuilder(CalcProperty.prototype).writable('input');