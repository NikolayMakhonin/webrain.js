"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.CalcProperty = exports.CalcPropertyState = exports.CalcPropertyValue = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _async = require("../../../async/async");

var _ThenableSync = require("../../../async/ThenableSync");

var _valueProperty = require("../../../helpers/value-property");

var _webrainOptions = require("../../../helpers/webrainOptions");

var _DeferredCalc = require("../../deferred-calc/DeferredCalc");

var _ObservableClass3 = require("../ObservableClass");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _CalcObjectDebugger = require("./CalcObjectDebugger");

var CalcPropertyValue = function CalcPropertyValue(property) {
  (0, _classCallCheck2.default)(this, CalcPropertyValue);

  this.get = function () {
    return property;
  };
};

exports.CalcPropertyValue = CalcPropertyValue;

var CalcPropertyState =
/*#__PURE__*/
function (_ObservableClass) {
  (0, _inherits2.default)(CalcPropertyState, _ObservableClass);

  function CalcPropertyState(calcOptions, initValue) {
    var _this;

    (0, _classCallCheck2.default)(this, CalcPropertyState);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CalcPropertyState).call(this));
    _this.calcOptions = calcOptions;
    _this.value = initValue;
    return _this;
  }

  return CalcPropertyState;
}(_ObservableClass3.ObservableClass);

exports.CalcPropertyState = CalcPropertyState;
new _ObservableObjectBuilder.ObservableObjectBuilder(CalcPropertyState.prototype).writable('input').writable('value');

var CalcProperty =
/*#__PURE__*/
function (_ObservableClass2) {
  (0, _inherits2.default)(CalcProperty, _ObservableClass2);

  function CalcProperty(_ref) {
    var _this2;

    var calcFunc = _ref.calcFunc,
        name = _ref.name,
        calcOptions = _ref.calcOptions,
        initValue = _ref.initValue;
    (0, _classCallCheck2.default)(this, CalcProperty);
    _this2 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CalcProperty).call(this));

    if (typeof calcFunc !== 'function') {
      throw new Error("calcFunc must be a function: " + calcFunc);
    }

    if (typeof initValue !== 'function') {
      _this2._initValue = initValue;
    }

    if (!calcOptions) {
      calcOptions = {};
    }

    _this2._calcFunc = calcFunc;
    _this2.state = new CalcPropertyState(calcOptions, initValue);

    if (typeof name !== 'undefined') {
      _this2.state.name = name;
    }

    _this2._deferredCalc = new _DeferredCalc.DeferredCalc(function () {
      _this2.onInvalidated();
    }, function (done) {
      var prevValue = _this2.state.value;
      var deferredValue = (0, _ThenableSync.resolveAsyncFunc)(function () {
        if (typeof _this2.state.input === 'undefined') {
          return false;
        }

        return _this2._calcFunc(_this2.state);
      }, function (isChangedForce) {
        _this2._hasValue = true;
        var val = _this2.state.value;

        if (_webrainOptions.webrainOptions.equalsFunc.call(_this2.state, prevValue, _this2.state.value)) {
          _this2.state.value = val = prevValue;
        }

        _CalcObjectDebugger.CalcObjectDebugger.Instance.onCalculated((0, _assertThisInitialized2.default)(_this2), prevValue, val);

        done(isChangedForce, prevValue, val);
        return val;
      }, function (err) {
        _this2._error = err;
        console.error(err);

        _CalcObjectDebugger.CalcObjectDebugger.Instance.onError((0, _assertThisInitialized2.default)(_this2), _this2.state.value, prevValue, err);

        var val = _this2.state.value;

        if (_webrainOptions.webrainOptions.equalsFunc.call(_this2.state, prevValue, _this2.state.value)) {
          _this2.state.value = val = prevValue;
        }

        done(prevValue !== val, prevValue, val);
        return val; // ThenableSync.createRejected(err)
      }, true);

      if ((0, _async.isAsync)(deferredValue)) {
        _this2.setDeferredValue(deferredValue);
      }
    }, function (isChangedForce, oldValue, newValue) {
      if (isChangedForce || oldValue !== newValue) {
        if (!isChangedForce && (0, _async.isAsync)(_this2._deferredValue)) {
          _this2._deferredValue = newValue;
        } else {
          _this2.setDeferredValue(newValue, isChangedForce);
        }

        _this2.onValueChanged(oldValue, newValue, isChangedForce);
      }
    }, calcOptions);
    return _this2;
  }

  (0, _createClass2.default)(CalcProperty, [{
    key: "setDeferredValue",
    value: function setDeferredValue(newValue, force) {
      var oldValue = this._deferredValue;

      if (!force && (_webrainOptions.webrainOptions.equalsFunc ? _webrainOptions.webrainOptions.equalsFunc.call(this, oldValue, newValue) : oldValue === newValue)) {
        return;
      }

      this._deferredValue = newValue;
      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: _valueProperty.VALUE_PROPERTY_DEFAULT,
          oldValue: oldValue,
          newValue: newValue
        }, {
          name: 'wait',
          oldValue: oldValue,
          newValue: newValue
        });
      }
    }
  }, {
    key: "onValueChanged",
    value: function onValueChanged(oldValue, newValue, force) {
      if (!force && (_webrainOptions.webrainOptions.equalsFunc ? _webrainOptions.webrainOptions.equalsFunc.call(this, oldValue, newValue) : oldValue === newValue)) {
        return;
      }

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'last',
          oldValue: oldValue,
          newValue: newValue
        });
      }
    }
  }, {
    key: "invalidate",
    value: function invalidate() {
      if (!this._error) {
        this._deferredCalc.invalidate();
      }
    }
  }, {
    key: "onInvalidated",
    value: function onInvalidated() {
      _CalcObjectDebugger.CalcObjectDebugger.Instance.onInvalidated(this, this.state.value);

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        this._deferredCalc.calc();
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      if (_webrainOptions.webrainOptions.equalsFunc ? !_webrainOptions.webrainOptions.equalsFunc.call(this, this.state.value, this._initValue) : this.state.value !== this._initValue) {
        var _oldValue = this.state.value;
        var _newValue = this._initValue;
        this.state.value = _newValue;
        this.onValueChanged(_oldValue, _newValue);
        this.setDeferredValue(_newValue);
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

      return this.state.value;
    }
  }, {
    key: "lastOrWait",
    get: function get() {
      this._deferredCalc.calc();

      return this._hasValue ? this.state.value : this._deferredValue;
    }
  }]);
  return CalcProperty;
}(_ObservableClass3.ObservableClass); // Test:
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']


exports.CalcProperty = CalcProperty;