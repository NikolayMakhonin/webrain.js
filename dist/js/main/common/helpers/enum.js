"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.forEachEnum = forEachEnum;
exports.getEnumValues = getEnumValues;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

function forEachEnum(enumType, callback) {
  for (var _key in enumType) {
    if (Object.prototype.hasOwnProperty.call(enumType, _key) && isNaN(Number(_key))) {
      var _value = enumType[_key];

      if (callback(_value, _key)) {
        return;
      }
    }
  }
}

var enumValuesCache = new _map.default();

function getEnumValues(enumType) {
  var values = enumValuesCache.get(enumType);

  if (values == null) {
    values = [];
    forEachEnum(enumType, function (value) {
      values.push(value);
    });
  }

  return values;
}