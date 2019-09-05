"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.fillCollection = fillCollection;
exports.fillSet = fillSet;
exports.fillMap = fillMap;
exports.fillObject = fillObject;
exports.fillObjectKeys = fillObjectKeys;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

function fillCollection(collection, arrayOrIterable, add) {
  if ((0, _isArray.default)(arrayOrIterable)) {
    for (var i = 0, len = arrayOrIterable.length; i < len; i++) {
      add(collection, arrayOrIterable[i]);
    }
  } else {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator2.default)(arrayOrIterable), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _item = _step.value;
        add(collection, _item);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
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