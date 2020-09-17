"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.equals = equals;
exports.isIterable = isIterable;
exports.isIterator = isIterator;
exports.typeToDebugString = typeToDebugString;
exports.createFunction = createFunction;
exports.equalsObjects = equalsObjects;
exports.nextHash = nextHash;
exports.missingGetter = missingGetter;
exports.missingSetter = missingSetter;
exports.EMPTY = void 0;

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

function equals(v1, v2) {
  return v1 === v2 // is NaN
  || v1 !== v1 && v2 !== v2;
}

function isIterable(value) {
  return value != null && typeof value === 'object' && ((0, _isArray.default)(value) || !(value instanceof String) && typeof (0, _getIteratorMethod2.default)(value) === 'function');
}

function isIterator(value) {
  return isIterable(value) && typeof value.next === 'function';
}

function typeToDebugString(type) {
  return type == null ? type + '' : type && type.name || type.toString();
} // tslint:disable-next-line:no-empty no-shadowed-variable


var EMPTY = function EMPTY() {};

exports.EMPTY = EMPTY;

var allowCreateFunction = function () {
  try {
    var func = new Function('a', 'b', 'return a + b');
    return !!func;
  } catch (err) {
    return false;
  }
}();

var createFunctionCache = {}; // tslint:disable-next-line:ban-types

function createFunction(alternativeFuncFactory) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var id = args[args.length - 1] + '';
  var func = createFunctionCache[id];

  if (!func) {
    createFunctionCache[id] = func = allowCreateFunction ? Function.apply(void 0, args) : alternativeFuncFactory();
  }

  return func;
}

function equalsObjects(o1, o2) {
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

function nextHash(hash, value) {
  return (4294967296 + hash) * 31 + value | 0;
}

function missingGetter() {
  throw new TypeError('Missing Getter');
}

function missingSetter() {
  throw new TypeError('Missing Setter');
}