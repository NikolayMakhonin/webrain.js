"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.resolveValueProperty = resolveValueProperty;
exports.resolvePath = resolvePath;

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _async = require("../../../../async/async");

var _ThenableSync = require("../../../../async/ThenableSync");

var _valueProperty = require("../../../../helpers/value-property");

function resolveValueProperty(value, getValue) {
  if (value != null && value instanceof Object && value.constructor !== Object && !(0, _isArray.default)(value)) {
    // tslint:disable-next-line:no-collapsible-if
    if (_valueProperty.VALUE_PROPERTY_DEFAULT in value) {
      if (getValue) {
        var newValue = getValue(value);

        if (typeof newValue !== 'undefined') {
          return newValue;
        }
      }

      return value[_valueProperty.VALUE_PROPERTY_DEFAULT];
    }
  }

  return value;
}

function resolvePath(value) {
  var get = function get(getValue, isValueProperty, newValue, next) {
    var _getValue = getValue && function (val) {
      return val != null && typeof val === 'object' || typeof val === 'string' ? getValue(val, newValue, next) : void 0;
    };

    var customResolveValue = _getValue && isValueProperty ? function (val) {
      return resolveValueProperty(val, _getValue);
    } : resolveValueProperty;
    value = (0, _ThenableSync.resolveAsync)(value, null, null, null, customResolveValue);

    if (!_getValue) {
      return value;
    }

    if (!isValueProperty) {
      if (value instanceof _ThenableSync.ThenableSync) {
        value = value.then(_getValue, null, false);
      } else if ((0, _async.isThenable)(value)) {
        value = value.then(_getValue);
      } else {
        value = (0, _ThenableSync.resolveAsync)(_getValue(value));
      }
    }

    return get;
  };

  return get;
} // Test
// const x: TGetPropertyValue<ICalcProperty<Date>>
// const r = x(o => o, true)()