"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalcProperty = void 0;

var _ThenableSync = require("../../../async/ThenableSync");

var _IPropertyChanged = require("../../../lists/contracts/IPropertyChanged");

var _DeferredCalc = require("../../deferred-calc/DeferredCalc");

var _ObservableObject = require("../ObservableObject");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _property = require("./property");

const valuePropertiesNames = ['current', 'wait', 'currentOrWait'];

class CalcProperty extends _ObservableObject.ObservableObject {
  constructor(calcFunc, calcOptions, valueOptions, value) {
    super();

    if (typeof calcFunc !== 'function') {
      throw new Error(`calcFunc must be a function: ${calcFunc}`);
    }

    this._calcFunc = calcFunc;
    this._value = new _property.Property(valueOptions, value);
    this._deferredCalc = new _DeferredCalc.DeferredCalc(() => {
      this.onValueChanged();
    }, done => {
      this._waiter = (0, _ThenableSync.resolveAsyncFunc)(() => this._calcFunc(this.input, this._value), () => {
        this._hasValue = true;
        const val = this._value.value;
        done();
        return val;
      }, done, true);
    }, () => {
      this.onValueChanged();
    }, calcOptions);
  }

  get current() {
    this._deferredCalc.calc();

    return this._value.value;
  }

  get wait() {
    this._deferredCalc.calc();

    return this._waiter;
  }

  get currentOrWait() {
    this._deferredCalc.calc();

    return this._hasValue ? this._value.value : this._waiter;
  }

  onValueChanged() {
    const {
      propertyChangedIfCanEmit
    } = this;

    if (propertyChangedIfCanEmit) {
      const oldValue = this._value.value;
      propertyChangedIfCanEmit.onPropertyChanged(new _IPropertyChanged.PropertyChangedEvent('current', oldValue, () => this.current), new _IPropertyChanged.PropertyChangedEvent('wait', oldValue, () => this.wait), new _IPropertyChanged.PropertyChangedEvent('currentOrWait', oldValue, () => this.currentOrWait));
    }
  }

  invalidate() {
    this._deferredCalc.invalidate();
  }

}

exports.CalcProperty = CalcProperty;
new _ObservableObjectBuilder.ObservableObjectBuilder(CalcProperty.prototype).writable('input');