"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.generateArray = generateArray;
exports.shuffle = shuffle;
exports.indexOfNaN = indexOfNaN;
exports.convertToObject = convertToObject;
exports.allValues = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _Assert = require("../../../../../../../main/common/test/Assert");

function generateArray(size) {
  var arr = [];

  for (var i = 0; i < size; i++) {
    arr.push(i);
  }

  return arr;
}

function shuffle(array) {
  var _context;

  return (0, _sort.default)(_context = (0, _slice.default)(array).call(array)).call(_context, function () {
    return Math.random() > 0.5 ? 1 : -1;
  });
}

var allValues = [[], {}, '', 'NaN', 'null', 'undefined', '0', '1', 'true', 'false', 0, 1, true, false, null, undefined, -Infinity, Infinity, NaN];
exports.allValues = allValues;

function indexOfNaN(array) {
  for (var i = 0, len = array.length; i < len; i++) {
    var item = array[i];

    if (item !== item) {
      return i;
    }
  }
}

var valueToObjectMap = new _map.default();

function convertToObject(value) {
  if (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'value')) {
    _Assert.assert.fail('typeof value === ' + typeof value);
  }

  var obj = valueToObjectMap.get(value);

  if (!obj) {
    valueToObjectMap.set(value, obj = {
      value: value
    });
  }

  return obj;
}