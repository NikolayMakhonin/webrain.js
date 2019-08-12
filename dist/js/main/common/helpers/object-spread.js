"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectSpreadIgnoreNull = objectSpreadIgnoreNull;

function objectSpreadIgnoreNull(target, ...sources) {
  for (let i = 0, len = sources.length; i < len; i++) {
    const source = sources[i];

    if (source != null) {
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          const value = source[key];

          if (value != null) {
            target[key] = value;
          }
        }
      }
    }
  }

  return target;
}