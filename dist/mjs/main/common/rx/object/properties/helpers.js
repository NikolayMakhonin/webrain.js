import { isThenable } from '../../../async/async';
import { resolveAsync, ThenableSync } from '../../../async/ThenableSync';
import { VALUE_PROPERTY_DEFAULT } from '../../../helpers/value-property';
import { CalcPropertyValue } from './CalcProperty';

function resolveValueProperty(value, getValue) {
  if (value != null && typeof value === 'object') {
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
    const _getValue = getValue && (val => val != null && typeof val === 'object' || typeof val === 'string' ? getValue(val) : void 0);

    const customResolveValue = _getValue && isValueProperty ? val => resolveValueProperty(val, _getValue) : resolveValueProperty;
    value = resolveAsync(value, null, null, null, customResolveValue);

    if (!_getValue) {
      return value;
    }

    if (!isValueProperty) {
      if (value instanceof ThenableSync) {
        value = value.then(_getValue, null, false);
      } else if (isThenable(value)) {
        value = value.then(_getValue);
      } else {
        value = resolveAsync(_getValue(value));
      }
    }

    return get;
  };

  return get;
} // Test
// const x: TGetPropertyValue<ICalcProperty<Date>>
// const r = x(o => o, true)()