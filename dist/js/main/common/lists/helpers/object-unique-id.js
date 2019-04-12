"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getObjectUniqueId = getObjectUniqueId;
let nextObjectId = 0;
const UNIQUE_ID_PROPERTY_NAME = 'uniqueId-22xvm5z032r';
Object.defineProperty(Object.prototype, UNIQUE_ID_PROPERTY_NAME, {
  enumerable: false,
  configurable: false,

  get() {
    const uniqueId = nextObjectId++;
    Object.defineProperty(this, UNIQUE_ID_PROPERTY_NAME, {
      enumerable: false,
      configurable: false,

      get() {
        return uniqueId;
      }

    });
    return uniqueId;
  }

}); // tslint:disable-next-line:ban-types

function getObjectUniqueId(object) {
  return object[UNIQUE_ID_PROPERTY_NAME];
}