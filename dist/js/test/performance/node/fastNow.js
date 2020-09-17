"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _rdtsc = require("rdtsc");

var _Mocha = require("../../../main/common/test/Mocha");

var _helpers = require("../../../main/common/time/helpers");

// @ts-ignore
(0, _Mocha.describe)('fastNow perf', function () {
  (0, _Mocha.it)('base', function () {
    this.timeout(300000);
    var value = 0;
    var result = (0, _rdtsc.calcPerformance)(10000, function () {// empty
    }, function () {
      // 4
      value = (0, _helpers.fastNow)();
    }, function () {
      // 387 (x 96.75)
      value = (0, _now.default)();
    });
    /*
    96.75
    16.95
    26
    35.5
    20.8
    34.45
    35.18
    32
     */

    console.log(result);
  });
});