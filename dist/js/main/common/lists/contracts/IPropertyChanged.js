"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PropertyChangedEvent = void 0;

class PropertyChangedEvent {
  constructor(name, oldValue, getNewValue) {
    this.name = name;
    this.oldValue = oldValue;
    this._getNewValue = getNewValue;
  }

  get newValue() {
    return this._getNewValue();
  }

}

exports.PropertyChangedEvent = PropertyChangedEvent;