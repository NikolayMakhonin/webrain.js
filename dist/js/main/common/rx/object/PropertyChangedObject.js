"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PropertyChangedObject = exports.PropertyChangedSubject = void 0;

var _hasSubscribers = require("../subjects/hasSubscribers");

// function expandAndDistinct(inputItems: any, output: string[] = [], map: any = {}): string[] {
// 	if (inputItems == null) {
// 		return output
// 	}
//
// 	if (Array.isArray(inputItems)) {
// 		for (const item of inputItems) {
// 			expandAndDistinct(item, output, map)
// 		}
// 		return output
// 	}
//
// 	if (!map[inputItems]) {
// 		map[inputItems] = true
// 		output[output.length] = inputItems
// 	}
//
// 	return output
// }
class PropertyChangedSubject extends _hasSubscribers.HasSubscribersSubject {
  constructor(object) {
    super();
    this._object = object;
  }

  onPropertyChanged(...eventsOrPropertyNames) {
    for (let i = 0, len = eventsOrPropertyNames.length; i < len; i++) {
      let event = eventsOrPropertyNames[i];

      if (event == null) {
        event = {};
      }

      if (typeof event !== 'object') {
        const value = this._object[event];
        event = {
          name: event,
          oldValue: value,
          newValue: value
        };
      }

      this.emit(event);
    }

    return this;
  }

}

exports.PropertyChangedSubject = PropertyChangedSubject;

class PropertyChangedObject {
  /** @internal */
  constructor() {
    Object.defineProperty(this, '__meta', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {}
    });
  }
  /** @internal */


  _setUnsubscriber(propertyName, unsubscribe) {
    const {
      __meta
    } = this;
    let {
      unsubscribers
    } = __meta;

    if (unsubscribers) {
      const oldUnsubscribe = unsubscribers[propertyName];

      if (oldUnsubscribe) {
        oldUnsubscribe();
      }
    }

    if (unsubscribe) {
      if (!unsubscribers) {
        __meta.unsubscribers = unsubscribers = {};
      }

      unsubscribers[propertyName] = unsubscribe;
    }
  } // region propertyChanged


  get propertyChanged() {
    let {
      propertyChanged
    } = this.__meta;

    if (!propertyChanged) {
      this.__meta.propertyChanged = propertyChanged = new PropertyChangedSubject(this);
    }

    return propertyChanged;
  }

  get propertyChangedIfCanEmit() {
    const {
      propertyChangedDisabled,
      propertyChanged
    } = this.__meta;
    return !propertyChangedDisabled && propertyChanged && propertyChanged.hasSubscribers ? propertyChanged : null;
  } // endregion


}

exports.PropertyChangedObject = PropertyChangedObject;