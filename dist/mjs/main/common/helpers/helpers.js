export function equals(v1, v2) {
  return v1 === v2 // is NaN
  || v1 !== v1 && v2 !== v2;
}
export function isIterable(value) {
  return value != null && typeof value === 'object' && (Array.isArray(value) || !(value instanceof String) && typeof value[Symbol.iterator] === 'function');
}
export function isIterator(value) {
  return isIterable(value) && typeof value.next === 'function';
}
export function typeToDebugString(type) {
  return type == null ? type + '' : type && type.name || type.toString();
} // tslint:disable-next-line:no-empty no-shadowed-variable

export const EMPTY = function EMPTY() {};

const allowCreateFunction = (() => {
  try {
    const func = new Function('a', 'b', 'return a + b');
    return !!func;
  } catch (err) {
    return false;
  }
})();

const createFunctionCache = {}; // tslint:disable-next-line:ban-types

export function createFunction(alternativeFuncFactory, ...args) {
  const id = args[args.length - 1] + '';
  let func = createFunctionCache[id];

  if (!func) {
    createFunctionCache[id] = func = allowCreateFunction ? Function(...args) : alternativeFuncFactory();
  }

  return func;
}
export function equalsObjects(o1, o2) {
  if (equals(o1, o2)) {
    return true;
  }

  if (o1 && typeof o1 === 'object' && typeof o1.equals === 'function') {
    return o1.equals(o2);
  }

  if (o2 && typeof o2 === 'object' && typeof o2.equals === 'function') {
    return o2.equals(o1);
  }

  return false;
}
export function nextHash(hash, value) {
  return (4294967296 + hash) * 31 + value | 0;
}
export function missingGetter() {
  throw new TypeError('Missing Getter');
}
export function missingSetter() {
  throw new TypeError('Missing Setter');
}