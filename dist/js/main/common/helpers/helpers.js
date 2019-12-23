"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.isIterable = isIterable;
exports.isIterator = isIterator;
exports.typeToDebugString = typeToDebugString;
exports.checkIsFuncOrNull = checkIsFuncOrNull;
exports.toSingleCall = toSingleCall;
exports.createFunction = createFunction;
exports.hideObjectProperty = hideObjectProperty;
exports.equalsObjects = equalsObjects;
exports.EMPTY = void 0;

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

function isIterable(value) {
  return value != null && typeof (0, _getIteratorMethod2.default)(value) === 'function';
}

function isIterator(value) {
  return value != null && typeof (0, _getIteratorMethod2.default)(value) === 'function' && typeof value.next === 'function';
}

function typeToDebugString(type) {
  return type == null ? type + '' : type && type.name || type.toString();
} // tslint:disable-next-line:no-empty no-shadowed-variable


var EMPTY = function EMPTY() {};

exports.EMPTY = EMPTY;

function checkIsFuncOrNull(func) {
  // PROF: 66 - 0.1%
  if (func != null && typeof func !== 'function') {
    throw new Error("Value is not a function or null/undefined: " + func);
  }

  return func;
}

function toSingleCall(func, throwOnMultipleCall) {
  if (func == null) {
    return func;
  }

  func = checkIsFuncOrNull(func);
  var isCalled = false;
  return function () {
    if (isCalled) {
      if (throwOnMultipleCall) {
        throw new Error("Multiple call for single call function: " + func);
      }

      return;
    }

    isCalled = true;
    return func.apply(void 0, arguments);
  };
}

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

function hideObjectProperty(object, propertyName) {
  var descriptor = (0, _getOwnPropertyDescriptor.default)(object, propertyName);

  if (descriptor) {
    descriptor.enumerable = false;
    return;
  }

  (0, _defineProperty.default)(object, propertyName, {
    configurable: true,
    enumerable: false,
    value: object[propertyName]
  });
}

function equalsObjects(o1, o2) {
  if (o1 === o2) {
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