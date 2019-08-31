"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PropertyChangedEvent = void 0;

// Is slower than simple object
// export class PropertyChangedEvent<TValue> implements IPropertyChangedEvent {
// 	public name: string
// 	public oldValue: TValue
// 	public newValue: TValue
//
// 	constructor(name, oldValue: TValue, newValue: TValue) {
// 		this.name = name
// 		this.oldValue = oldValue
// 		this.newValue = newValue
// 	}
// }
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