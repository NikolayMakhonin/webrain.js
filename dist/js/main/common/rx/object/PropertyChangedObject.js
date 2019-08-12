"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PropertyChangedObject = void 0;

var _hasSubscribers = require("../subjects/hasSubscribers");

function expandAndDistinct(inputItems, output = [], map = {}) {
  if (inputItems == null) {
    return output;
  }

  if (Array.isArray(inputItems)) {
    for (const item of inputItems) {
      expandAndDistinct(item, output, map);
    }

    return output;
  }

  if (!map[inputItems]) {
    map[inputItems] = true;
    output[output.length] = inputItems;
  }

  return output;
}

class PropertyChangedObject {
  /** @internal */
  constructor() {
    Object.defineProperty(this, '__meta', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {}
    });
  } // region propertyChanged


  get propertyChanged() {
    let {
      propertyChanged
    } = this.__meta;

    if (!propertyChanged) {
      this.__meta.propertyChanged = propertyChanged = new _hasSubscribers.HasSubscribersSubject();
    }

    return propertyChanged;
  }

  get _propertyChangedIfCanEmit() {
    const {
      propertyChangedDisabled,
      propertyChanged
    } = this.__meta;
    return !propertyChangedDisabled && propertyChanged && propertyChanged.hasSubscribers ? propertyChanged : null;
  }

  _emitPropertyChanged(eventsOrPropertyNames, emitFunc) {
    if (eventsOrPropertyNames === null) {
      return;
    }

    const toEvent = event => {
      if (event == null) {
        return {};
      }

      if (typeof event !== 'object') {
        const value = this[event];
        event = {
          name: event,
          oldValue: value,
          newValue: value
        };
      }

      return event;
    };

    if (!Array.isArray(eventsOrPropertyNames)) {
      emitFunc(toEvent(eventsOrPropertyNames));
    } else {
      const items = expandAndDistinct(eventsOrPropertyNames);

      for (let i = 0, len = items.length; i < len; i++) {
        emitFunc(toEvent(items[i]));
      }
    }
  }

  onPropertyChanged(eventsOrPropertyNames) {
    const {
      __meta
    } = this;

    if (!__meta) {
      return this;
    }

    const {
      propertyChanged,
      propertyChangedDisabled
    } = this.__meta;

    if (!propertyChanged || propertyChangedDisabled) {
      return this;
    }

    this._emitPropertyChanged(eventsOrPropertyNames, event => {
      if (propertyChanged) {
        propertyChanged.emit(event);
      }
    });

    return this;
  } // endregion


}

exports.PropertyChangedObject = PropertyChangedObject;