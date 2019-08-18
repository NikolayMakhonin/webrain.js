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