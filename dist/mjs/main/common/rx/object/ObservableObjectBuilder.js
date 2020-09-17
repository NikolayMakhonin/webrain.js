import { createFunction, missingSetter } from '../../helpers/helpers';
import { webrainEquals } from '../../helpers/webrainOptions';
import { depend } from '../../rx/depend/core/depend';
import { PropertyChangedEvent } from './IPropertyChanged';
import { ObjectBuilder } from './ObjectBuilder';
import { _set, _setExt, ObservableClass } from './ObservableClass';
export class ObservableObjectBuilder extends ObjectBuilder {
  constructor(object) {
    super(object || new ObservableClass());
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


    const getValue = options && options.getValue || createFunction(() => function () {
      return this.__fields[name];
    }, `return this.__fields["${name}"]`);
    const setValue = options && options.setValue || createFunction(() => function (v) {
      this.__fields[name] = v;
    }, 'v', `this.__fields["${name}"] = v`);
    const set = setOptions ? function (newValue) {
      return _setExt.call(this, name, getValue, setValue, setOptions, newValue);
    } : function (newValue) {
      return _set.call(this, name, getValue, setValue, newValue);
    };
    Object.defineProperty(object, name, {
      configurable: true,
      enumerable: !hidden,
      get: depend(getValue, null, null, true),
      // get: getValue,
      set
    });

    if (__fields && typeof initValue !== 'undefined') {
      const value = __fields[name];

      if (!webrainEquals.call(object, value, initValue)) {
        object[name] = initValue;
      }
    }

    return this;
  }

  readable(name, options, initValue) {
    return this.updatable(name, options, initValue);
  }

  updatable(name, options, initValue) {
    const hidden = options && options.hidden;
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

    const update = options && options.update; // optimization

    const getValue = options && options.getValue || createFunction(() => function () {
      return this.__fields[name];
    }, `return this.__fields["${name}"]`);
    let setValue;

    if (update || factory) {
      setValue = options && options.setValue || createFunction(() => function (v) {
        this.__fields[name] = v;
      }, 'v', `this.__fields["${name}"] = v`);
    }

    let setOnUpdate;

    if (update) {
      // tslint:disable-next-line
      const setOptions = options && options.setOptions;
      setOnUpdate = setOptions ? function (newValue) {
        return _setExt.call(this, name, getValue, setValue, setOptions, newValue);
      } : function (newValue) {
        return _set.call(this, name, getValue, setValue, newValue);
      };
    }

    let setOnInit;

    if (factory) {
      const setOptions = { ...(options && options.setOptions),
        suppressPropertyChanged: true
      };
      setOnInit = setOptions ? function (newValue) {
        return _setExt.call(this, name, getValue, setValue, setOptions, newValue);
      } : function (newValue) {
        return _set.call(this, name, getValue, setValue, newValue);
      };
    }

    const createInstanceProperty = instance => {
      const attributes = {
        configurable: true,
        enumerable: !hidden,
        // get: depend(getValue, null, true),
        get: getValue,
        set: update ? function (value) {
          const newValue = update.call(this, value);

          if (typeof newValue !== 'undefined') {
            setOnUpdate.call(this, newValue);
          }
        } : missingSetter
      };
      Object.defineProperty(instance, name, attributes);
    };

    const initializeValue = options && options.init;

    if (factory) {
      const init = function () {
        const factoryValue = factory.call(this, initValue);
        createInstanceProperty(this);

        if (initializeValue) {
          initializeValue.call(this, factoryValue);
        }

        return factoryValue;
      };

      const initAttributes = {
        configurable: true,
        enumerable: !hidden,

        get() {
          const factoryValue = init.call(this);

          if (typeof factoryValue !== 'undefined') {
            const oldValue = getValue.call(this);

            if (!webrainEquals.call(this, oldValue, factoryValue)) {
              setOnInit.call(this, factoryValue);
            }
          }

          return factoryValue;
        },

        set: update ? function (value) {
          // tslint:disable:no-dead-store
          const factoryValue = init.call(this);
          const newValue = update.call(this, value);

          if (typeof newValue !== 'undefined') {
            const oldValue = getValue.call(this);

            if (!webrainEquals.call(this, oldValue, newValue)) {
              setOnInit.call(this, newValue);
            }
          }
        } : missingSetter
      };
      Object.defineProperty(object, name, initAttributes);

      if (__fields) {
        const oldValue = __fields[name];
        const {
          propertyChangedIfCanEmit
        } = object;

        if (propertyChangedIfCanEmit) {
          propertyChangedIfCanEmit.onPropertyChanged(new PropertyChangedEvent(name, oldValue, () => object[name]));
        }
      }
    } else {
      createInstanceProperty(object);

      if (__fields && typeof initValue !== 'undefined') {
        const oldValue = __fields[name];

        if (initializeValue) {
          initializeValue.call(this, initValue);
        }

        if (!webrainEquals.call(object, oldValue, initValue)) {
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
// 	return (target: ObservableClass, propertyKey: string, descriptor: PropertyDescriptor) => {
// 		builder.object = target
// 		builder.writable(propertyKey, options, initValue)
// 	}
// }
//
// export function readable<T = any>(
// 	options?: IReadableFieldOptions<T>,
// 	initValue?: T,
// ) {
// 	return (target: ObservableClass, propertyKey: string) => {
// 		builder.object = target
// 		builder.readable(propertyKey, options, initValue)
// 	}
// }
// class Class extends ObservableClass {
// 	@writable()
// 	public prop: number
//
// 	@readable()
// 	public prop2: number
// }