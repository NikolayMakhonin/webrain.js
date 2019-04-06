"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNIQUE_ID_PROPERTY_NAME = void 0;
let nextObjectId = 0;
const UNIQUE_ID_PROPERTY_NAME = 'uniqueId-22xvm5z032r';
exports.UNIQUE_ID_PROPERTY_NAME = UNIQUE_ID_PROPERTY_NAME;
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

});