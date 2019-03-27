"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Property = exports.SetMode = void 0;

var _ObservableObject = require("../ObservableObject");

const SetMode = {
  Default: 0,
  Fill: 1,
  Clone: 2
};
exports.SetMode = SetMode;

class Property extends _ObservableObject.ObservableObject {
  constructor(valueFactory) {
    super();
    this._valueField = {};
    this._valueFactory = valueFactory;
  }

  get value() {
    return this._valueField.value;
  }

  set value(value) {
    this.set(value);
  }

  set(source, options) {
    const {
      fill,
      clone,
      fillFunc,
      valueFactory
    } = options;
    return this._set('value', this._valueField, source, {
      fillFunc: fill ? fillFunc : null,

      convert(sourceValue) {
        if (clone && sourceValue != null) {
          return cloneValue(sourceValue);
        }

        return sourceValue;
      }

    });

    function cloneValue(sourceValue) {
      if (fillFunc == null) {
        throw new Error('Cannot clone value, because fillFunc == null');
      }

      let value;

      if (valueFactory != null) {
        value = valueFactory(sourceValue);

        if (value != null) {
          return value;
        }
      }

      const {
        _valueFactory
      } = this;

      if (!_valueFactory) {
        throw new Error('Cannot clone value, because this._valueFactory == null');
      }

      value = _valueFactory();

      if (!fillFunc(value, sourceValue)) {
        throw new Error('Cannot clone value, because fillFunc return false');
      }

      return value;
    }
  }

}

exports.Property = Property;