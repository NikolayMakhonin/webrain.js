"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeferredCalcProperty = void 0;

var _ObservableObject = require("../ObservableObject");

class DeferredCalcProperty extends _ObservableObject.ObservableObject {
  constructor(calcFunc) {
    super();

    if (typeof calcFunc !== 'function') {
      throw new Error(`calcFunc must be a function: ${calcFunc}`);
    }

    this._calcFunc = calcFunc;
  }

  get deferredValue() {
    return this._property.value;
  }

  get value() {
    if (this.isCalculated) {
      return this._value;
    }

    const value = this._calcFunc();

    this._value = value;
    this.isCalculated = true;
    return value;
  }

  invalidate() {
    if (this.isCalculated) {
      const {
        _propertyChangedIfCanEmit
      } = this;

      if (!_propertyChangedIfCanEmit) {
        this.isCalculated = false;
        return;
      }

      const event = {
        name: 'value',
        oldValue: this.value
      };
      this.isCalculated = false;
      Object.defineProperty(event, 'newValue', {
        configurable: true,
        enumerable: true,
        get: () => this.value
      });

      _propertyChangedIfCanEmit.emit(event);
    }
  }

}

exports.DeferredCalcProperty = DeferredCalcProperty;