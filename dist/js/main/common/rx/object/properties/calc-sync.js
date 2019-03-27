"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalcSync = void 0;

var _ObservableObject = require("../ObservableObject");

class CalcSync extends _ObservableObject.ObservableObject {
  constructor(calcValue) {
    super();

    if (typeof calcValue !== 'function') {
      throw new Error(`calcValue must be a function: ${calcValue}`);
    }

    this._calcValue = calcValue;
  }

  get value() {
    if (this.isCalculated) {
      return this._value;
    }

    const value = this._calcValue();

    this._value = value;
    this.isCalculated = true;
    return value;
  }

  invalidate() {
    if (this.isCalculated) {
      this.isCalculated = false;
      this.onPropertyChanged('value');
    }
  }

}

exports.CalcSync = CalcSync;