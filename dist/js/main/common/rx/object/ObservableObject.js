"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservableObject = void 0;

require("../extensions/autoConnect");

var _DeepPropertyChangedObject = require("./DeepPropertyChangedObject");

class ObservableObject extends _DeepPropertyChangedObject.DeepPropertyChangedObject {
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
    const {
      equalsFunc
    } = options;

    if (equalsFunc ? equalsFunc.call(this, oldValue, newValue) : oldValue === newValue) {
      return false;
    }

    const {
      fillFunc
    } = options;

    if (fillFunc && oldValue != null && newValue != null && fillFunc.call(this, oldValue, newValue)) {
      return false;
    }

    const {
      convertFunc
    } = options;

    if (convertFunc) {
      newValue = convertFunc.call(this, newValue);
    }

    if (oldValue === newValue) {
      return false;
    }

    const {
      beforeChange
    } = options;

    if (beforeChange) {
      beforeChange.call(this, oldValue);
    }

    __fields[name] = newValue;

    this._propagatePropertyChanged(name, newValue);

    const {
      afterChange
    } = options;

    if (afterChange) {
      afterChange.call(this, newValue);
    }

    this.onPropertyChanged({
      name,
      oldValue,
      newValue
    });
    return true;
  }

}

exports.ObservableObject = ObservableObject;