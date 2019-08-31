export function isIterable(value) {
  return value != null && typeof value[Symbol.iterator] === 'function';
}
export function isIterator(value) {
  return value != null && typeof value[Symbol.iterator] === 'function' && typeof value.next === 'function';
}
export function typeToDebugString(type) {
  return type == null ? type + '' : type && type.name || type.toString();
} // tslint:disable-next-line:no-empty no-shadowed-variable

export var EMPTY = function EMPTY() {};
export function delay(timeMilliseconds) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, timeMilliseconds);
  });
}
export function checkIsFuncOrNull(func) {
  // PROF: 66 - 0.1%
  if (func != null && typeof func !== 'function') {
    throw new Error("Value is not a function or null/undefined: ".concat(func));
  }

  return func;
}
export function toSingleCall(func, throwOnMultipleCall) {
  if (func == null) {
    return func;
  }

  func = checkIsFuncOrNull(func);
  var isCalled = false;
  return function () {
    if (isCalled) {
      if (throwOnMultipleCall) {
        throw new Error("Multiple call for single call function: ".concat(func));
      }

      return;
    }

    isCalled = true;
    return func.apply(void 0, arguments);
  };
}
var createFunctionCache = {}; // tslint:disable-next-line:ban-types

export function createFunction() {
  var _ref;

  var id = (_ref = arguments.length - 1, _ref < 0 || arguments.length <= _ref ? undefined : arguments[_ref]) + '';
  var func = createFunctionCache[id];

  if (!func) {
    createFunctionCache[id] = func = Function.apply(void 0, arguments);
  }

  return func;
}
export function hideObjectProperty(object, propertyName) {
  var descriptor = Object.getOwnPropertyDescriptor(object, propertyName);

  if (descriptor) {
    descriptor.enumerable = false;
    return;
  }

  Object.defineProperty(object, propertyName, {
    configurable: true,
    enumerable: false,
    value: object[propertyName]
  });
}
export var VALUE_PROPERTY_DEFAULT = '';