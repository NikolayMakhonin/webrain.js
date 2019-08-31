import _typeof from "@babel/runtime/helpers/typeof";
import { isThenable } from '../../../async/async';
import { resolveAsync, ThenableSync } from '../../../async/ThenableSync';
import { VALUE_PROPERTY_DEFAULT } from '../../../helpers/helpers';

function resolveValueProperty(value, getValue) {
  if (_typeof(value) === 'object' && VALUE_PROPERTY_DEFAULT in value) {
    if (getValue) {
      var newValue = getValue(value);

      if (typeof newValue !== 'undefined') {
        return newValue;
      }
    }

    return value[VALUE_PROPERTY_DEFAULT];
  }

  return value;
}

export function resolvePath(value) {
  var get = function get(getValue, isValueProperty) {
    var customResolveValue = getValue && isValueProperty ? function (val) {
      return resolveValueProperty(val, getValue);
    } : resolveValueProperty;
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