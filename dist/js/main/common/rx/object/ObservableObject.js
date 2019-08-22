"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservableObject = void 0;

require("../extensions/autoConnect");

var _PropertyChangedObject = require("./PropertyChangedObject");

class ObservableObject extends _PropertyChangedObject.PropertyChangedObject {
  /** @internal */
  constructor() {
    super();
    Object.defineProperty(this, '__fields', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {}
    });
  }
  /** @internal */


  _set(name, newValue, options) {
    const {
      __fields
    } = this;
    const oldValue = __fields[name];
    const equalsFunc = options && options.equalsFunc;

    if (equalsFunc ? equalsFunc.call(this, oldValue, newValue) : oldValue === newValue) {
      return false;
    }

    const fillFunc = options && options.fillFunc;

    if (fillFunc && oldValue != null && newValue != null && fillFunc.call(this, oldValue, newValue)) {
      return false;
    }

    const convertFunc = options && options.convertFunc;

    if (convertFunc) {
      newValue = convertFunc.call(this, newValue);
    }

    if (oldValue === newValue) {
      return false;
    }

    const beforeChange = options && options.beforeChange;

    if (beforeChange) {
      beforeChange.call(this, oldValue);
    }

    __fields[name] = newValue;
    const afterChange = options && options.afterChange;

    if (afterChange) {
      afterChange.call(this, newValue);
    }

    if (!options || !options.suppressPropertyChanged) {
      const {
        propertyChangedIfCanEmit
      } = this;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name,
          oldValue,
          newValue
        });
      }
    }

    return true;
  }

}

exports.ObservableObject = ObservableObject;