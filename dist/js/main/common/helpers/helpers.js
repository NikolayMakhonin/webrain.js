"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports.isIterable = isIterable;
exports.isIterator = isIterator;
exports.typeToDebugString = typeToDebugString;
exports.delay = delay;
exports.checkIsFuncOrNull = checkIsFuncOrNull;
exports.toSingleCall = toSingleCall;
exports.createFunction = createFunction;
exports.hideObjectProperty = hideObjectProperty;
exports.EMPTY = void 0;

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _getOwnPropertyDescriptor = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/get-own-property-descriptor"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

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

function delay(timeMilliseconds) {
  return new _promise.default(function (resolve) {
    return (0, _setTimeout2.default)(resolve, timeMilliseconds);
  });
}

function checkIsFuncOrNull(func) {
  // PROF: 66 - 0.1%
  if (func != null && typeof func !== 'function') {
    throw new Error("Value is not a function or null/undefined: ".concat(func));
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
        throw new Error("Multiple call for single call function: ".concat(func));
      }

      return;
    }

    isCalled = true;
    return func.apply(void 0, arguments);
  };
}

var createFunctionCache = {}; // tslint:disable-next-line:ban-types

function createFunction() {
  var _ref;

  var id = (_ref = arguments.length - 1, _ref < 0 || arguments.length <= _ref ? undefined : arguments[_ref]) + '';
  var func = createFunctionCache[id];

  if (!func) {
    createFunctionCache[id] = func = Function.apply(void 0, arguments);
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