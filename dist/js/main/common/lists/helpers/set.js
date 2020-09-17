"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.fillCollection = fillCollection;
exports.fillSet = fillSet;
exports.fillMap = fillMap;
exports.fillObject = fillObject;
exports.fillObjectKeys = fillObjectKeys;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

function _createForOfIteratorHelperLoose(o) { var _context2; var i = 0; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = (0, _getIterator2.default)(o); return (0, _bind.default)(_context2 = i.next).call(_context2, i); }

function _unsupportedIterableToArray(o, minLen) { var _context; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context = Object.prototype.toString.call(o)).call(_context, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function fillCollection(collection, arrayOrIterable, add) {
  if ((0, _isArray.default)(arrayOrIterable)) {
    for (var i = 0, len = arrayOrIterable.length; i < len; i++) {
      add(collection, arrayOrIterable[i]);
    }
  } else {
    for (var _iterator = _createForOfIteratorHelperLoose(arrayOrIterable), _step; !(_step = _iterator()).done;) {
      var _item = _step.value;
      add(collection, _item);
    }
  }

  return collection;
}

function fillSet(set, arrayOrIterable) {
  return fillCollection(set, arrayOrIterable, function (c, o) {
    return c.add(o);
  });
}

function fillMap(map, arrayOrIterable) {
  return fillCollection(map, arrayOrIterable, function (c, o) {
    return c.set.apply(c, o);
  });
}

function fillObject(object, arrayOrIterable) {
  return fillCollection(object, arrayOrIterable, function (c, o) {
    return c[o[0]] = o[1];
  });
}

function fillObjectKeys(object, arrayOrIterable) {
  return fillCollection(object, arrayOrIterable, function (c, o) {
    return c[o] = true;
  });
}