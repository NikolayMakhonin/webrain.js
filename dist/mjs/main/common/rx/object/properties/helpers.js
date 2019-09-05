import { isThenable } from '../../../async/async';
import { resolveAsync, ThenableSync } from '../../../async/ThenableSync';
import { VALUE_PROPERTY_DEFAULT } from '../../../helpers/value-property';
import { CalcPropertyValue } from './CalcProperty';

function resolveValueProperty(value, getValue) {
  if (typeof value === 'object') {
    if (VALUE_PROPERTY_DEFAULT in value) {
      if (getValue) {
        const newValue = getValue(value);

        if (typeof newValue !== 'undefined') {
          return newValue;
        }
      }

      return value[VALUE_PROPERTY_DEFAULT];
    }

    if (value instanceof CalcPropertyValue) {
      return value.get();
    }
  }

  return value;
}

export function resolvePath(value) {
  const get = (getValue, isValueProperty) => {
    const customResolveValue = getValue && isValueProperty ? val => resolveValueProperty(val, getValue) : resolveValueProperty;
    value = resolveAsync(value, null, null, null, customResolveValue);

    if (!getValue) {
      return value;
    }

    if (!isValueProperty) {
      if (value instanceof ThenableSync) {
        value = value.then(getValue, null, false);
      } else if (isThenable(value)) {
        value = value.then(getValue);
      } else {
        value = resolveAsync(getValue(value));
      }
    }

    return get;
  };

  return get;
} // Test
// const x: TGetPropertyValue<ICalcProperty<Date>>
// const r = x(o => o, true)()