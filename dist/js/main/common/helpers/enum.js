"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.forEachEnum = forEachEnum;
exports.forEachEnumFlags = forEachEnumFlags;
exports.getEnumValues = getEnumValues;
exports.getEnumFlags = getEnumFlags;

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

function forEachEnumFlags(enumType, callback) {
  var flag = 1;

  while (true) {
    var _name = enumType[flag];

    if (_name == null) {
      break;
    }

    if (callback(flag, _name)) {
      return;
    }

    flag <<= 1;
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

var enumFlagsCache = new _map.default();

function getEnumFlags(enumType) {
  var values = enumFlagsCache.get(enumType);

  if (values == null) {
    values = [];
    forEachEnumFlags(enumType, function (value) {
      values.push(value);
    });
  }

  return values;
}