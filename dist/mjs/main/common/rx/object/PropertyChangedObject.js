import { HasSubscribersSubject } from '../subjects/hasSubscribers';
export class PropertyChangedSubject extends HasSubscribersSubject {
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
export class PropertyChangedObject {
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
    const {
      unsubscribers
    } = __meta;

    if (unsubscribers) {
      const oldUnsubscribe = unsubscribers[propertyName];

      if (unsubscribe !== oldUnsubscribe) {
        if (oldUnsubscribe) {
          unsubscribers[propertyName] = unsubscribe;
          oldUnsubscribe();
        } else if (unsubscribe) {
          unsubscribers[propertyName] = unsubscribe;
        }
      }
    } else if (unsubscribe) {
      __meta.unsubscribers = {
        [propertyName]: unsubscribe
      };
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