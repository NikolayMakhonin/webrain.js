import { webrainOptions } from '../../helpers/webrainOptions';
import '../extensions/autoConnect';
import { PropertyChangedObject } from './PropertyChangedObject';
export class ObservableClass extends PropertyChangedObject {
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

}
/** @internal */

export function _setExt(name, getValue, setValue, options, object, newValue) {
  if (!options) {
    return _set(name, getValue, setValue, object, newValue);
  }

  const oldValue = getValue ? getValue.call(object) : object.__fields[name];
  const equalsFunc = options.equalsFunc || webrainOptions.equalsFunc;

  if (oldValue === newValue || equalsFunc && equalsFunc.call(object, oldValue, newValue)) {
    return false;
  }

  const fillFunc = options.fillFunc;

  if (fillFunc && oldValue != null && newValue != null && fillFunc.call(object, oldValue, newValue)) {
    return false;
  }

  const convertFunc = options.convertFunc;

  if (convertFunc) {
    newValue = convertFunc.call(object, newValue);
  } // if (oldValue === newValue) {
  // 	return false
  // }


  const beforeChange = options.beforeChange;

  if (beforeChange) {
    beforeChange.call(object, oldValue);
  }

  if (setValue) {
    setValue.call(object, newValue);
  } else {
    object.__fields[name] = newValue;
  }

  if (!options || !options.suppressPropertyChanged) {
    const {
      propertyChangedIfCanEmit
    } = object;

    if (propertyChangedIfCanEmit) {
      propertyChangedIfCanEmit.onPropertyChanged({
        name,
        oldValue,
        newValue
      });
    }
  }

  const afterChange = options.afterChange;

  if (afterChange) {
    afterChange.call(object, newValue);
  }

  return true;
}
/** @internal */

export function _set(name, getValue, setValue, object, newValue) {
  const oldValue = getValue.call(object);

  if (oldValue === newValue || webrainOptions.equalsFunc && webrainOptions.equalsFunc.call(object, oldValue, newValue)) {
    return false;
  }

  setValue.call(object, newValue);
  const {
    propertyChangedDisabled,
    propertyChanged
  } = object.__meta;

  if (!propertyChangedDisabled && propertyChanged) {
    propertyChanged.emit({
      name,
      oldValue,
      newValue
    });
  }

  return true;
}