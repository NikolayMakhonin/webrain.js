"use strict";

exports.__esModule = true;
exports.setObjectValue = setObjectValue;

var _common = require("../contracts/common");

function setObjectValue(object, key, keyType, value) {
  switch (keyType) {
    case _common.ValueKeyType.Property:
    case _common.ValueKeyType.ValueProperty:
      object[key] = value;
      break;

    case _common.ValueKeyType.MapKey:
      object.set(key, value);
      break;

    case _common.ValueKeyType.CollectionAny:
      throw new Error('Unsupported set value for ValueKeyType.CollectionAny');

    default:
      throw new Error('Unknown ValueKeyType: ' + keyType);
  }
}