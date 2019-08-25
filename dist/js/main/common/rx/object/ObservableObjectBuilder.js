"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservableObjectBuilder = void 0;

var _IPropertyChanged = require("../../lists/contracts/IPropertyChanged");

require("../extensions/autoConnect");

var _ObservableObject = require("./ObservableObject");

class ObservableObjectBuilder {
  constructor(object) {
    this.object = object || new _ObservableObject.ObservableObject();
  }

  writable(name, options, initValue) {
    const {
      setOptions,
      hidden
    } = options || {};
    const {
      object
    } = this;
    const {
      __fields
    } = object;

    if (__fields) {
      __fields[name] = object[name];
    } else if (typeof initValue !== 'undefined') {
      throw new Error("You can't set initValue for prototype writable property");
    }

    Object.defineProperty(object, name, {
      configurable: true,
      enumerable: !hidden,

      get() {
        return this.__fields[name];
      },

      set(newValue) {
        this._set(name, newValue, setOptions);
      }

    });

    if (__fields && typeof initValue !== 'undefined') {
      const value = __fields[name];

      if (initValue !== value) {
        object[name] = initValue;
      }
    }

    return this;
  }

  readable(name, options, initValue) {
    const hidden = options && options.hidden;
    const setOptions = { ...(options && options.setOptions),
      suppressPropertyChanged: true
    };
    const {
      object
    } = this;
    const {
      __fields
    } = object;

    if (__fields) {
      __fields[name] = object[name];
    }

    let factory = options && options.factory;

    if (!factory && !__fields && typeof initValue !== 'undefined') {
      factory = o => o;
    }

    const createInstanceProperty = instance => {
      Object.defineProperty(instance, name, {
        configurable: true,
        enumerable: !hidden,

        get() {
          return this.__fields[name];
        }

      });
    };

    if (factory) {
      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: !hidden,

        get() {
          const factoryValue = factory.call(this, initValue);
          createInstanceProperty(this);
          const {
            __fields: fields
          } = this;

          if (fields && typeof factoryValue !== 'undefined') {
            const oldValue = fields[name];

            if (factoryValue !== oldValue) {
              this._set(name, factoryValue, setOptions);
            }
          }

          return factoryValue;
        }

      });

      if (__fields) {
        const oldValue = __fields[name];
        const {
          propertyChangedIfCanEmit
        } = object;

        if (propertyChangedIfCanEmit) {
          propertyChangedIfCanEmit.onPropertyChanged(new _IPropertyChanged.PropertyChangedEvent(name, oldValue, () => object[name]));
        }
      }
    } else {
      createInstanceProperty(object);

      if (__fields && typeof initValue !== 'undefined') {
        const oldValue = __fields[name];

        if (initValue !== oldValue) {
          __fields[name] = initValue;
          const {
            propertyChangedIfCanEmit
          } = object;

          if (propertyChangedIfCanEmit) {
            propertyChangedIfCanEmit.onPropertyChanged({
              name,
              oldValue,
              newValue: initValue
            });
          }
        }
      }
    }

    return this;
  }

  delete(name) {
    const {
      object
    } = this;
    const oldValue = object[name];

    object._setUnsubscriber(name, null);

    delete object[name];
    const {
      __fields
    } = object;

    if (__fields) {
      delete __fields[name];

      if (typeof oldValue !== 'undefined') {
        const {
          propertyChangedIfCanEmit
        } = object;

        if (propertyChangedIfCanEmit) {
          propertyChangedIfCanEmit.onPropertyChanged({
            name,
            oldValue
          });
        }
      }
    }

    return this;
  }

} // Test:
// export const obj = new ObservableObjectBuilder()
// 	.writable<number, 'prop1'>('prop1')
// 	.readable<string, 'prop2'>('prop2')
// 	.readable<string, 'prop3'>('prop3')
// 	.delete('prop3')
// 	.object
//
// export const x = obj.prop1 + obj.prop2 + obj.propertyChanged + obj.prop3
// const builder = new ObservableObjectBuilder(true as any)
//
// export function writable<T = any>(
// 	options?: IWritableFieldOptions,
// 	initValue?: T,
// ) {
// 	return (target: ObservableObject, propertyKey: string, descriptor: PropertyDescriptor) => {
// 		builder.object = target
// 		builder.writable(propertyKey, options, initValue)
// 	}
// }
//
// export function readable<T = any>(
// 	options?: IReadableFieldOptions<T>,
// 	initValue?: T,
// ) {
// 	return (target: ObservableObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.readable(propertyKey, options, initValue)
// 	}
// }
// class Class extends ObservableObject {
// 	@writable()
// 	public prop: number
//
// 	@readable()
// 	public prop2: number
// }


exports.ObservableObjectBuilder = ObservableObjectBuilder;