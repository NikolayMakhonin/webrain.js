"use strict";

exports.__esModule = true;
exports.resolvePath = resolvePath;

var _async = require("../../../async/async");

var _ThenableSync = require("../../../async/ThenableSync");

var _valueProperty = require("../../../helpers/value-property");

var _CalcProperty = require("./CalcProperty");

function resolveValueProperty(value, getValue) {
  if (typeof value === 'object') {
    if (_valueProperty.VALUE_PROPERTY_DEFAULT in value) {
      if (getValue) {
        var newValue = getValue(value);

        if (typeof newValue !== 'undefined') {
          return newValue;
        }
      }

      return value[_valueProperty.VALUE_PROPERTY_DEFAULT];
    }

    if (value instanceof _CalcProperty.CalcPropertyValue) {
      return value.get();
    }
  }

  return value;
}

function resolvePath(value) {
  var get = function get(getValue, isValueProperty) {
    var customResolveValue = getValue && isValueProperty ? function (val) {
      return resolveValueProperty(val, getValue);
    } : resolveValueProperty;
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