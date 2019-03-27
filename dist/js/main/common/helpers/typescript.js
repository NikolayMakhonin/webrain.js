"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enumerable = enumerable;

/**
 * @enumerable decorator that sets the enumerable property of a class field to false.
 * @param value true|false
 */
function enumerable(value) {
  return (target, propertyKey) => {
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {
      writable: true
    };

    if (descriptor.enumerable !== value) {
      descriptor.enumerable = value;
      Object.defineProperty(target, propertyKey, descriptor);
    }
  };
}