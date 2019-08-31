"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasObjectUniqueId = hasObjectUniqueId;
exports.canHaveUniqueId = canHaveUniqueId;
exports.getObjectUniqueId = getObjectUniqueId;
exports.freezeWithUniqueId = freezeWithUniqueId;
exports.isFrozenWithoutUniqueId = isFrozenWithoutUniqueId;
let nextObjectId = 1;
const UNIQUE_ID_PROPERTY_NAME = 'uniqueId-22xvm5z032r';

function hasObjectUniqueId(object) {
  return object != null && Object.prototype.hasOwnProperty.call(object, UNIQUE_ID_PROPERTY_NAME);
}

function canHaveUniqueId(object) {
  return !Object.isFrozen(object) || hasObjectUniqueId(object);
}

function getObjectUniqueId(object) {
  // PROF: 129 - 0.3%
  if (object == null) {
    return null;
  }

  const id = object[UNIQUE_ID_PROPERTY_NAME];

  if (id != null) {
    return id;
  }

  if (Object.isFrozen(object)) {
    return null;
  }

  const uniqueId = nextObjectId++;
  Object.defineProperty(object, UNIQUE_ID_PROPERTY_NAME, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: uniqueId
  });
  return uniqueId;
} // tslint:disable-next-line:ban-types


function freezeWithUniqueId(object) {
  getObjectUniqueId(object);
  return Object.freeze(object);
} // tslint:disable-next-line:ban-types


function isFrozenWithoutUniqueId(object) {
  return !object || Object.isFrozen(object) && !hasObjectUniqueId(object);
}