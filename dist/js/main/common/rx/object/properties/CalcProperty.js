"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalcProperty = void 0;

var _ThenableSync = require("../../../async/ThenableSync");

var _helpers = require("../../../helpers/helpers");

var _DeferredCalc = require("../../deferred-calc/DeferredCalc");

var _IPropertyChanged = require("../IPropertyChanged");

var _ObservableObject = require("../ObservableObject");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _property = require("./property");

class CalcProperty extends _ObservableObject.ObservableObject {
  constructor(calcFunc, calcOptions, valueOptions, initValue) {
    super();

    if (typeof calcFunc !== 'function') {
      throw new Error(`calcFunc must be a function: ${calcFunc}`);
    }

    if (typeof initValue !== 'function') {
      this._initValue = initValue;
    }

    this._calcFunc = calcFunc;
    this._valueProperty = new _property.Property(valueOptions, initValue);
    this._deferredCalc = new _DeferredCalc.DeferredCalc(() => {
      this.onValueChanged();
    }, done => {
      const prevValue = this._valueProperty.value;
      this._deferredValue = (0, _ThenableSync.resolveAsyncFunc)(() => this._calcFunc(this.input, this._valueProperty), () => {
        this._hasValue = true;
        const val = this._valueProperty.value;
        done(prevValue !== val);
        return val;
      }, err => {
        done(prevValue !== this._valueProperty.value);
        return err;
      }, true);
    }, isChanged => {
      if (isChanged) {
        this.onValueChanged();
      }
    }, calcOptions);
  }

  invalidate() {
    this._deferredCalc.invalidate();
  }

  onValueChanged() {
    const {
      propertyChangedIfCanEmit
    } = this;

    if (propertyChangedIfCanEmit) {
      const oldValue = this._valueProperty.value;
      propertyChangedIfCanEmit.onPropertyChanged(new _IPropertyChanged.PropertyChangedEvent(_helpers.VALUE_PROPERTY_DEFAULT, oldValue, () => this[_helpers.VALUE_PROPERTY_DEFAULT]), new _IPropertyChanged.PropertyChangedEvent('last', oldValue, () => this.last), new _IPropertyChanged.PropertyChangedEvent('wait', oldValue, () => this.wait), new _IPropertyChanged.PropertyChangedEvent('lastOrWait', oldValue, () => this.lastOrWait));
    }
  }

  get [_helpers.VALUE_PROPERTY_DEFAULT]() {
    return this.wait;
  }

  get last() {
    this._deferredCalc.calc();

    return this._valueProperty.value;
  }

  get wait() {
    this._deferredCalc.calc();

    return this._deferredValue;
  }

  get lastOrWait() {
    this._deferredCalc.calc();

    return this._hasValue ? this._valueProperty.value : this._deferredValue;
  }

  clear() {
    if (this._valueProperty.value !== this._initValue) {
      this._valueProperty.value = this._initValue;
      this.onValueChanged();
    }
  }

}

exports.CalcProperty = CalcProperty;
new _ObservableObjectBuilder.ObservableObjectBuilder(CalcProperty.prototype).writable('input'); // Test:
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']