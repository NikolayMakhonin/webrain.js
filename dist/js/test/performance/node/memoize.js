"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _fastMemoize = _interopRequireDefault(require("fast-memoize"));

var _rdtsc = require("rdtsc");

var _depend = require("../../../main/common/rx/depend/core/depend");

var _Mocha = require("../../../main/common/test/Mocha");

var _calcMemAllocate = require("../../../main/common/test/calc-mem-allocate");

var _calc = require("../../../main/common/test/calc");

/* tslint:disable:no-empty no-identical-functions max-line-length no-construct use-primitive-type */
// @ts-ignore
// @ts-ignore
(0, _Mocha.describe)('memoize', function () {
  this.timeout(300000);

  var fn = function fn(one, two, three) {
    for (var i = 0; i < 1000; i++) {
      (0, _now.default)();
    }

    return true;
  };

  var fastMemoize = (0, _fastMemoize.default)(fn);
  var dependMemoize = (0, _depend.depend)(fn);
  (0, _Mocha.it)('primitives', function () {
    var result = (0, _rdtsc.calcPerformance)(10000, function () {// no operations
    }, function () {
      fastMemoize('foo', 3, 'bar');
    }, function () {
      dependMemoize('foo', 3, 'bar');
    });
    console.log(result);
  });
  (0, _Mocha.it)('objects', function () {
    var obj = {
      property1: {
        property2: {
          property2: {
            value: [1, 2, 3]
          }
        }
      },
      property2: {
        value: [1, 2, 3]
      }
    };
    var result = (0, _rdtsc.calcPerformance)(10000, function () {// no operations
    }, function () {
      fastMemoize(obj);
    }, function () {
      dependMemoize(obj);
    });
    console.log(result);
  });
  (0, _Mocha.it)('stress', function () {
    var result = (0, _rdtsc.calcPerformance)(10000, function () {// no operations
    }, function () {
      fastMemoize(Math.random());
    }, function () {
      dependMemoize(Math.random());
    });
    console.log(result);
  });
  (0, _Mocha.it)('memory', function () {
    console.log((0, _calcMemAllocate.calcMemAllocate)(_calc.CalcType.Min, 100000, function () {
      fastMemoize(Math.random());
    }).toString());
    console.log((0, _calcMemAllocate.calcMemAllocate)(_calc.CalcType.Min, 100000, function () {
      dependMemoize(Math.random());
    }).toString());
  });
});