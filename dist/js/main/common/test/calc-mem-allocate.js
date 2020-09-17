"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.calcMemAllocate = calcMemAllocate;

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _rdtsc = require("rdtsc");

var _calc = require("./calc");

// @ts-ignore
function _calcMemAllocate(calcType, countTests, testFunc) {
  var _context;

  for (var _len = arguments.length, testFuncArgs = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
    testFuncArgs[_key - 3] = arguments[_key];
  }

  return _calc.calc.apply(void 0, (0, _concat.default)(_context = [calcType, countTests, function () {
    var heapUsed = process.memoryUsage().heapUsed;
    testFunc.apply(void 0, arguments);
    heapUsed = process.memoryUsage().heapUsed - heapUsed;
    return heapUsed < 0 ? null : [heapUsed];
  }]).call(_context, testFuncArgs));
}

function calcMemAllocate(calcType, countTests, testFunc) {
  for (var _len2 = arguments.length, testFuncArgs = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    testFuncArgs[_key2 - 3] = arguments[_key2];
  }

  return (0, _rdtsc.runInRealtimePriority)(function () {
    var _context2, _context3;

    // tslint:disable-next-line:no-empty
    var zero = _calcMemAllocate.apply(void 0, (0, _concat.default)(_context2 = [calcType, countTests, function () {}]).call(_context2, testFuncArgs));

    var value = _calcMemAllocate.apply(void 0, (0, _concat.default)(_context3 = [calcType, countTests, testFunc]).call(_context3, testFuncArgs));

    return value.subtract(zero);
  });
}