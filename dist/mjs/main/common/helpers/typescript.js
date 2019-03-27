/**
 * @enumerable decorator that sets the enumerable property of a class field to false.
 * @param value true|false
 */
export function enumerable(value) {
  return function (target, propertyKey) {
    var descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {
      writable: true
    };

    if (descriptor.enumerable !== value) {
      descriptor.enumerable = value;
      Object.defineProperty(target, propertyKey, descriptor);
    }
  };
}