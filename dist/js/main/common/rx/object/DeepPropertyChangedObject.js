"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeepPropertyChangedObject = void 0;

var _hasSubscribers = require("../subjects/hasSubscribers");

var _PropertyChangedObject = require("./PropertyChangedObject");

class DeepPropertyChangedObject extends _PropertyChangedObject.PropertyChangedObject {
  /** @internal */
  // region propertyChanged
  get deepPropertyChanged() {
    let {
      deepPropertyChanged
    } = this.__meta;

    if (!deepPropertyChanged) {
      this.__meta.deepPropertyChanged = deepPropertyChanged = new _hasSubscribers.HasSubscribersSubject();
    }

    return deepPropertyChanged;
  }

  onPropertyChanged(eventsOrPropertyNames) {
    const {
      propertyChanged,
      deepPropertyChanged
    } = this.__meta;

    if (!propertyChanged && !deepPropertyChanged) {
      return this;
    }

    this._emitPropertyChanged(eventsOrPropertyNames, event => {
      if (propertyChanged) {
        propertyChanged.emit(event);
      }

      if (deepPropertyChanged) {
        deepPropertyChanged.emit(event);
      }
    });

    return this;
  }

  onDeepPropertyChanged(eventsOrPropertyNames) {
    const {
      deepPropertyChanged
    } = this.__meta;

    if (!deepPropertyChanged) {
      return this;
    }

    this._emitPropertyChanged(eventsOrPropertyNames, event => {
      deepPropertyChanged.emit(event);
    });

    return this;
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
  }
  /** @internal */


  _propagatePropertyChanged(propertyName, value) {
    this._setUnsubscriber(propertyName, null);

    if (!value) {
      return null;
    }

    const deepPropertyChanged = value.deepPropertyChanged || value.propertyChanged;

    if (!deepPropertyChanged) {
      return null;
    }

    const subscriber = event => {
      this.deepPropertyChanged.emit({
        name: propertyName,
        next: event
      });
    };

    {
      const unsubscribe = this.deepPropertyChanged.hasSubscribersObservable.autoConnect(null, () => deepPropertyChanged.subscribe(subscriber));

      this._setUnsubscriber(propertyName, unsubscribe);

      return unsubscribe;
    }
  } // endregion


}

exports.DeepPropertyChangedObject = DeepPropertyChangedObject;