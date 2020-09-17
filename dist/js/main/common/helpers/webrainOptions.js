"use strict";

exports.__esModule = true;
exports.webrainEquals = webrainEquals;
exports.webrainOptions = void 0;

var _helpers = require("./helpers");

var webrainOptions = {
  equalsFunc: function equalsFunc(oldValue, newValue) {
    if (oldValue instanceof Date) {
      return newValue instanceof Date && oldValue.getTime() === newValue.getTime();
    }

    return (0, _helpers.equalsObjects)(oldValue, newValue);
  },
  debugInfo: true,
  callState: {
    garbageCollect: {
      minLifeTime: 60000,
      bulkSize: 1000,
      interval: 1000,
      disabled: false
    },
    logCaughtErrors: false
  },
  timeouts: {
    dependWait: 60000
  }
};
exports.webrainOptions = webrainOptions;

function webrainEquals(o1, o2) {
  return (0, _helpers.equals)(o1, o2) || webrainOptions.equalsFunc != null && webrainOptions.equalsFunc.call(this, o1, o2);
}