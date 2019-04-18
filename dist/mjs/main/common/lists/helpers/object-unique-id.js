var nextObjectId = 0;
var UNIQUE_ID_PROPERTY_NAME = 'uniqueId-22xvm5z032r';
Object.defineProperty(Object.prototype, UNIQUE_ID_PROPERTY_NAME, {
  enumerable: false,
  configurable: false,
  get: function get() {
    var uniqueId = nextObjectId++;
    Object.defineProperty(this, UNIQUE_ID_PROPERTY_NAME, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: uniqueId
    });
    return uniqueId;
  }
}); // tslint:disable-next-line:ban-types

export function getObjectUniqueId(object) {
  return object[UNIQUE_ID_PROPERTY_NAME];
}