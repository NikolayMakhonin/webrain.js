export function isIterable(value) {
  return value && typeof value[Symbol.iterator] === 'function';
}
export function isIterator(value) {
  return value && typeof value[Symbol.iterator] === 'function' && typeof value.next === 'function';
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