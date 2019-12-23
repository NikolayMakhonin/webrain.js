"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.delay = delay;
exports.performanceNow = void 0;

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var performanceNow = typeof performance !== 'undefined' // eslint-disable-next-line no-undef
? function () {
  return performance.now();
} : function () {
  var time = process.hrtime();
  return time[0] * 1000 + time[1] * 0.000001;
};
exports.performanceNow = performanceNow;

function delay(timeMilliseconds) {
  return new _promise.default(function (resolve) {
    return (0, _setTimeout2.default)(resolve, timeMilliseconds);
  });
}