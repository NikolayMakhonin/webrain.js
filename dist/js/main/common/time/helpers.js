"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.delay = delay;
exports.fastNow = fastNow;
exports.performanceNow = void 0;

var _setInterval2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-interval"));

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

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
} // region fast now


var _fastNow = (0, _now.default)();

var lastAccessTime = 0;

function fastNowUpdate() {
  _fastNow = (0, _now.default)();

  if (_fastNow - lastAccessTime > 5000) {
    clearInterval(fastNowTimer);
    fastNowTimer = null;
  }
}

var fastNowTimer = null;

function fastNowSchedule() {
  lastAccessTime = _fastNow;

  if (fastNowTimer === null) {
    fastNowTimer = (0, _setInterval2.default)(fastNowUpdate, 1000);
  }
}
/** Precision - 1 second */


function fastNow() {
  fastNowSchedule();
  return _fastNow;
} // endregion