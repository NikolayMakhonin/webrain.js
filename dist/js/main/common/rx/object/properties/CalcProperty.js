"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.CalcProperty = exports.CalcPropertyValue = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _ThenableSync = require("../../../async/ThenableSync");

var _valueProperty = require("../../../helpers/value-property");

var _DeferredCalc = require("../../deferred-calc/DeferredCalc");

var _ObservableObject2 = require("../ObservableObject");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _CalcObjectDebugger = require("./CalcObjectDebugger");

var _Property = require("./Property");

var CalcPropertyValue = function CalcPropertyValue(property) {
  (0, _classCallCheck2.default)(this, CalcPropertyValue);

  this.get = function () {
    return property;
  };
};

exports.CalcPropertyValue = CalcPropertyValue;

var CalcProperty =
/*#__PURE__*/
function (_ObservableObject) {
  (0, _inherits2.default)(CalcProperty, _ObservableObject);

  function CalcProperty(calcFunc, calcOptions, valueOptions, initValue) {
    var _this;

    (0, _classCallCheck2.default)(this, CalcProperty);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CalcProperty).call(this));

    if (typeof calcFunc !== 'function') {
      throw new Error("calcFunc must be a function: " + calcFunc);
    }

    if (typeof initValue !== 'function') {
      _this._initValue = initValue;
    }

    _this._calcFunc = calcFunc;
    _this._valueProperty = new _Property.Property(valueOptions, initValue);
    _this._deferredCalc = new _DeferredCalc.DeferredCalc(function () {
      _this.onInvalidated();
    }, function (done) {
      var prevValue = _this._valueProperty.value;
      _this._deferredValue = (0, _ThenableSync.resolveAsyncFunc)(function () {
        return _this._calcFunc(_this.input, _this._valueProperty);
      }, function () {
        _this._hasValue = true;
        var val = _this._valueProperty.value;

        _CalcObjectDebugger.CalcObjectDebugger.Instance.onCalculated((0, _assertThisInitialized2.default)(_this), val, prevValue);

        done(prevValue !== val);
        return val;
      }, function (err) {
        _CalcObjectDebugger.CalcObjectDebugger.Instance.onError((0, _assertThisInitialized2.default)(_this), _this._valueProperty.value, prevValue, err);

        done(prevValue !== _this._valueProperty.value);
        return err;
      }, true);
    }, function (isChanged) {
      if (isChanged) {
        _this.onCalculated();
      }
    }, calcOptions);
    return _this;
  }

  (0, _createClass2.default)(CalcProperty, [{
    key: "invalidate",
    value: function invalidate() {
      this._deferredCalc.invalidate();
    }
  }, {
    key: "onInvalidated",
    value: function onInvalidated() {
      _CalcObjectDebugger.CalcObjectDebugger.Instance.onInvalidated(this, this._valueProperty.value);

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        var oldValue = this._valueProperty.value;
        var newValue = this.last; // new CalcPropertyValue(this)

        propertyChangedIfCanEmit.onPropertyChanged({
          name: _valueProperty.VALUE_PROPERTY_DEFAULT,
          oldValue: oldValue,
          newValue: newValue
        }, {
          name: 'wait',
          oldValue: oldValue,
          newValue: newValue
        }, {
          name: 'last',
          oldValue: oldValue,
          newValue: newValue
        }, {
          name: 'lastOrWait',
          oldValue: oldValue,
          newValue: newValue
        });
      }
    }
  }, {
    key: "onCalculated",
    value: function onCalculated() {
      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        var oldValue = this._valueProperty.value;
        var newValue = this.last; // new CalcPropertyValue(this)

        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'last',
          oldValue: oldValue,
          newValue: newValue
        }, {
          name: 'lastOrWait',
          oldValue: oldValue,
          newValue: newValue
        });
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      if (this._valueProperty.value !== this._initValue) {
        this._valueProperty.value = this._initValue;
        this.invalidate();
      }
    }
  }, {
    key: _valueProperty.VALUE_PROPERTY_DEFAULT,
    get: function get() {
      return this.wait;
    }
  }, {
    key: "wait",
    get: function get() {
      this._deferredCalc.calc();

      return this._deferredValue;
    }
  }, {
    key: "last",
    get: function get() {
      this._deferredCalc.calc();

      return this._valueProperty.value;
    }
  }, {
    key: "lastOrWait",
    get: function get() {
      this._deferredCalc.calc();

      return this._hasValue ? this._valueProperty.value : this._deferredValue;
    }
  }]);
  return CalcProperty;
}(_ObservableObject2.ObservableObject);

exports.CalcProperty = CalcProperty;
new _ObservableObjectBuilder.ObservableObjectBuilder(CalcProperty.prototype).writable('input'); // Test:
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']