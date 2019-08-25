"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalcProperty = void 0;

var _ThenableSync = require("../../../async/ThenableSync");

var _IPropertyChanged = require("../../../lists/contracts/IPropertyChanged");

var _constants = require("../../deep-subscribe/contracts/constants");

var _DeferredCalc = require("../../deferred-calc/DeferredCalc");

var _ObservableObject = require("../ObservableObject");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _property = require("./property");

// export interface ICalcProperty<TInput, TValue, TMergeSource> {
// 	['@last']: TValue
// 	['@wait']: TValue
// 	['@lastOrWait']: TValue
// }
class CalcProperty extends _ObservableObject.ObservableObject {
  constructor(calcFunc, calcOptions, valueOptions, initValue) {
    super();

    if (typeof calcFunc !== 'function') {
      throw new Error(`calcFunc must be a function: ${calcFunc}`);
    }

    this._calcFunc = calcFunc;
    this._valueProperty = new _property.Property(valueOptions, initValue);
    this._deferredCalc = new _DeferredCalc.DeferredCalc(() => {
      this.onValueChanged();
    }, done => {
      this._deferredValue = (0, _ThenableSync.resolveAsyncFunc)(() => this._calcFunc(this.input, this._valueProperty), () => {
        this._hasValue = true;
        const val = this._valueProperty.value;
        done();
        return val;
      }, done, true);
    }, () => {
      this.onValueChanged();
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
      propertyChangedIfCanEmit.onPropertyChanged(new _IPropertyChanged.PropertyChangedEvent('last', oldValue, () => this.last), new _IPropertyChanged.PropertyChangedEvent('wait', oldValue, () => this.wait), new _IPropertyChanged.PropertyChangedEvent('lastOrWait', oldValue, () => this.lastOrWait));
    }
  }

  get [_constants.VALUE_PROPERTY_DEFAULT]() {
    return this.lastOrWait;
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

}

exports.CalcProperty = CalcProperty;
new _ObservableObjectBuilder.ObservableObjectBuilder(CalcProperty.prototype).writable('input'); // Test:
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']