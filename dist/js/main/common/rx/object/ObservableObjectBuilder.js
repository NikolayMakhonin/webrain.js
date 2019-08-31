"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObservableObjectBuilder = void 0;

var _helpers = require("../../helpers/helpers");

require("../extensions/autoConnect");

var _IPropertyChanged = require("./IPropertyChanged");

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
    } // optimization


    const getValue = (0, _helpers.createFunction)('o', `return o.__fields["${name}"]`);
    const setValue = (0, _helpers.createFunction)('o', 'v', `o.__fields["${name}"] = v`);
    const set = setOptions ? _ObservableObject._setExt.bind(null, name, getValue, setValue, setOptions) : _ObservableObject._set.bind(null, name, getValue, setValue);
    Object.defineProperty(object, name, {
      configurable: true,
      enumerable: !hidden,

      get() {
        return getValue(this);
      },

      set(newValue) {
        set(this, newValue);
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
    } // optimization


    const getValue = (0, _helpers.createFunction)('o', `return o.__fields["${name}"]`);

    const createInstanceProperty = instance => {
      Object.defineProperty(instance, name, {
        configurable: true,
        enumerable: !hidden,

        get() {
          return getValue(this);
        }

      });
    };

    if (factory) {
      // optimization
      const setValue = (0, _helpers.createFunction)('o', 'v', `o.__fields["${name}"] = v`);
      const set = setOptions ? _ObservableObject._setExt.bind(null, name, getValue, setValue, setOptions) : _ObservableObject._set.bind(null, name, getValue, setValue);
      Object.defineProperty(object, name, {
        configurable: true,
        enumerable: !hidden,

        get() {
          const factoryValue = factory.call(this, initValue);
          createInstanceProperty(this);

          if (typeof factoryValue !== 'undefined') {
            const oldValue = getValue(this);

            if (factoryValue !== oldValue) {
              set(this, factoryValue);
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