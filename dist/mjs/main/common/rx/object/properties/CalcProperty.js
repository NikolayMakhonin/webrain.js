import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { resolveAsyncFunc } from '../../../async/ThenableSync';
import { VALUE_PROPERTY_DEFAULT } from '../../../helpers/helpers';
import { DeferredCalc } from '../../deferred-calc/DeferredCalc';
import { PropertyChangedEvent } from '../IPropertyChanged';
import { ObservableObject } from '../ObservableObject';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { Property } from './property';
export var CalcProperty =
/*#__PURE__*/
function (_ObservableObject) {
  _inherits(CalcProperty, _ObservableObject);

  function CalcProperty(calcFunc, calcOptions, valueOptions, initValue) {
    var _this;

    _classCallCheck(this, CalcProperty);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CalcProperty).call(this));

    if (typeof calcFunc !== 'function') {
      throw new Error("calcFunc must be a function: ".concat(calcFunc));
    }

    if (typeof initValue !== 'function') {
      _this._initValue = initValue;
    }

    _this._calcFunc = calcFunc;
    _this._valueProperty = new Property(valueOptions, initValue);
    _this._deferredCalc = new DeferredCalc(function () {
      _this.onValueChanged();
    }, function (done) {
      var prevValue = _this._valueProperty.value;
      _this._deferredValue = resolveAsyncFunc(function () {
        return _this._calcFunc(_this.input, _this._valueProperty);
      }, function () {
        _this._hasValue = true;
        var val = _this._valueProperty.value;
        done(prevValue !== val);
        return val;
      }, function (err) {
        done(prevValue !== _this._valueProperty.value);
        return err;
      }, true);
    }, function (isChanged) {
      if (isChanged) {
        _this.onValueChanged();
      }
    }, calcOptions);
    return _this;
  }

  _createClass(CalcProperty, [{
    key: "invalidate",
    value: function invalidate() {
      this._deferredCalc.invalidate();
    }
  }, {
    key: "onValueChanged",
    value: function onValueChanged() {
      var _this2 = this;

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        var oldValue = this._valueProperty.value;
        propertyChangedIfCanEmit.onPropertyChanged(new PropertyChangedEvent(VALUE_PROPERTY_DEFAULT, oldValue, function () {
          return _this2[VALUE_PROPERTY_DEFAULT];
        }), new PropertyChangedEvent('last', oldValue, function () {
          return _this2.last;
        }), new PropertyChangedEvent('wait', oldValue, function () {
          return _this2.wait;
        }), new PropertyChangedEvent('lastOrWait', oldValue, function () {
          return _this2.lastOrWait;
        }));
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      if (this._valueProperty.value !== this._initValue) {
        this._valueProperty.value = this._initValue;
        this.onValueChanged();
      }
    }
  }, {
    key: VALUE_PROPERTY_DEFAULT,
    get: function get() {
      return this.wait;
    }
  }, {
    key: "last",
    get: function get() {
      this._deferredCalc.calc();

      return this._valueProperty.value;
    }
  }, {
    key: "wait",
    get: function get() {
      this._deferredCalc.calc();

      return this._deferredValue;
    }
  }, {
    key: "lastOrWait",
    get: function get() {
      this._deferredCalc.calc();

      return this._hasValue ? this._valueProperty.value : this._deferredValue;
    }
  }]);

  return CalcProperty;
}(ObservableObject);
new ObservableObjectBuilder(CalcProperty.prototype).writable('input'); // Test:
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']