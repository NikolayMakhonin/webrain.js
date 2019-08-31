"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolvePath = resolvePath;

var _async = require("../../../async/async");

var _ThenableSync = require("../../../async/ThenableSync");

var _helpers = require("../../../helpers/helpers");

function resolveValueProperty(value, getValue) {
  if (typeof value === 'object' && _helpers.VALUE_PROPERTY_DEFAULT in value) {
    if (getValue) {
      const newValue = getValue(value);

      if (typeof newValue !== 'undefined') {
        return newValue;
      }
    }

    return value[_helpers.VALUE_PROPERTY_DEFAULT];
  }

  return value;
}

function resolvePath(value) {
  const get = (getValue, isValueProperty) => {
    const customResolveValue = getValue && isValueProperty ? val => resolveValueProperty(val, getValue) : resolveValueProperty;
    value = (0, _ThenableSync.resolveAsync)(value, null, null, null, customResolveValue);

    if (!getValue) {
      return value;
    }

    if (!isValueProperty) {
      if (value instanceof _ThenableSync.ThenableSync) {
        value = value.then(getValue, null, false);
      } else if ((0, _async.isThenable)(value)) {
        value = value.then(getValue);
      } else {
        value = (0, _ThenableSync.resolveAsync)(getValue(value));
      }
    }

    return get;
  };

  return get;
} // Test
// const x: TGetPropertyValue<ICalcProperty<Date>>
// const r = x(o => o, true)()