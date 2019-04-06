var nextObjectId = 0;
export var UNIQUE_ID_PROPERTY_NAME = 'uniqueId-22xvm5z032r';
Object.defineProperty(Object.prototype, UNIQUE_ID_PROPERTY_NAME, {
  enumerable: false,
  configurable: false,
  get: function get() {
    var uniqueId = nextObjectId++;
    Object.defineProperty(this, UNIQUE_ID_PROPERTY_NAME, {
      enumerable: false,
      configurable: false,
      get: function get() {
        return uniqueId;
      }
    });
    return uniqueId;
  }
});