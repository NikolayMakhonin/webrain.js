"use strict";

exports.__esModule = true;
exports.webrainOptions = void 0;

var _helpers = require("./helpers");

var webrainOptions = {
  equalsFunc: function equalsFunc(oldValue, newValue) {
    if (oldValue instanceof Date) {
      return newValue instanceof Date && oldValue.getTime() === newValue.getTime();
    }

    return (0, _helpers.equalsObjects)(oldValue, newValue);
  },
  debugInfo: true
};
exports.webrainOptions = webrainOptions;