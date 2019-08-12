var nextObjectId = 1;
var UNIQUE_ID_PROPERTY_NAME = 'uniqueId-22xvm5z032r';
export function hasObjectUniqueId(object) {
  return object != null && Object.prototype.hasOwnProperty.call(object, UNIQUE_ID_PROPERTY_NAME);
}
export function canHaveUniqueId(object) {
  return !Object.isFrozen(object) || hasObjectUniqueId(object);
}
export function getObjectUniqueId(object) {
  if (!canHaveUniqueId(object)) {
    return null;
  }

  if (!hasObjectUniqueId(object)) {
    var uniqueId = nextObjectId++;
    Object.defineProperty(object, UNIQUE_ID_PROPERTY_NAME, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: uniqueId
    });
    return uniqueId;
  }

  return object[UNIQUE_ID_PROPERTY_NAME];
} // tslint:disable-next-line:ban-types

export function freezeWithUniqueId(object) {
  getObjectUniqueId(object);
  return Object.freeze(object);
} // tslint:disable-next-line:ban-types

export function isFrozenWithoutUniqueId(object) {
  return !object || Object.isFrozen(object) && !hasObjectUniqueId(object);
}