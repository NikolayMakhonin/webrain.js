"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getNextObjectId = getNextObjectId;
exports.hasObjectUniqueId = hasObjectUniqueId;
exports.canHaveUniqueId = canHaveUniqueId;
exports.getObjectUniqueId = getObjectUniqueId;
exports.freezeWithUniqueId = freezeWithUniqueId;
exports.isFrozenWithoutUniqueId = isFrozenWithoutUniqueId;

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _isFrozen = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/is-frozen"));

var nextObjectId = 1;

function getNextObjectId() {
  return nextObjectId++;
}

var UNIQUE_ID_PROPERTY_NAME = '458d576952bc489ab45e98ac7f296fd9';

function hasObjectUniqueId(object) {
  return object != null && Object.prototype.hasOwnProperty.call(object, UNIQUE_ID_PROPERTY_NAME);
}

function canHaveUniqueId(object) {
  return !(0, _isFrozen.default)(object) || hasObjectUniqueId(object);
}

function getObjectUniqueId(object) {
  // PROF: 129 - 0.3%
  if (object == null) {
    return null;
  }

  var id = object[UNIQUE_ID_PROPERTY_NAME];

  if (id != null) {
    return id;
  }

  if ((0, _isFrozen.default)(object)) {
    return null;
  }

  var uniqueId = getNextObjectId();
  (0, _defineProperty.default)(object, UNIQUE_ID_PROPERTY_NAME, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: uniqueId
  });
  return uniqueId;
} // tslint:disable-next-line:ban-types


function freezeWithUniqueId(object) {
  getObjectUniqueId(object);
  return (0, _freeze.default)(object);
} // tslint:disable-next-line:ban-types


function isFrozenWithoutUniqueId(object) {
  return !object || (0, _isFrozen.default)(object) && !hasObjectUniqueId(object);
}