"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.fillCollection = fillCollection;
exports.fillSet = fillSet;
exports.fillMap = fillMap;
exports.fillObject = fillObject;
exports.fillObjectKeys = fillObjectKeys;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

function fillCollection(collection, arrayOrIterable, add) {
  if ((0, _isArray2.default)(arrayOrIterable)) {
    for (var i = 0, len = arrayOrIterable.length; i < len; i++) {
      add(collection, arrayOrIterable[i]);
    }
  } else {
    for (var _iterator = arrayOrIterable, _isArray = (0, _isArray2.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _item = _ref;
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