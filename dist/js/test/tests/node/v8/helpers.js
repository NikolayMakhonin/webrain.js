"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _Assert = require("../../../../main/common/test/Assert");

var _Mocha = require("../../../../main/common/test/Mocha");

var _helpers = require("./src/helpers/common/helpers");

var _helpers2 = require("./src/helpers/helpers");

/* tslint:disable:no-identical-functions no-shadowed-variable no-var-requires */
// @ts-ignore
(0, _Mocha.describe)('node > v8 > helpers', function () {
  (0, _Mocha.it)('base', function () {
    function test(o) {
      return o * o;
    }

    (0, _helpers2.assertIsNotOptimized)({
      test: test
    });
    test(1);
    (0, _helpers2.assertIsNotOptimized)({
      test: test
    });
    test(2);
    (0, _helpers2.assertIsNotOptimized)({
      test: test
    });

    _helpers.v8.OptimizeFunctionOnNextCall(test);

    test(3);
    (0, _helpers2.assertIsOptimized)({
      test: test
    });
  });
  (0, _Mocha.it)('optimization asserts', function () {
    var obj = {
      x: 0,
      y: 0
    };

    function test(o) {
      return (0, _now.default)() * (o.x + o.y);
    }

    (0, _helpers2.assertIsNotOptimized)({
      test: test
    });

    _Assert.assert.throws(function () {
      return (0, _helpers2.assertIsOptimized)({
        test: test
      });
    }, _Assert.AssertionError);

    var arr = [];

    for (var i = 0; i < 6146; i++) {
      obj.x = i;
      obj.y = i * i;
      arr[i % 100] = test(obj);
    } // console.log(getFuncOptimizationStatusString({test}))
    // console.log(getObjectOptimizationInfo(obj))
    // console.log(getObjectOptimizationInfo(arr))


    _Assert.assert.throws(function () {
      return (0, _helpers2.assertIsNotOptimized)({
        test: test
      });
    }, _Assert.AssertionError);

    (0, _helpers2.assertIsOptimized)({
      test: test,
      obj: obj,
      arr: arr
    });

    for (var _i = 0; _i < 1000; _i++) {
      obj[_i * _i] = 'qwe';
      arr[_i * _i] = 'ert';
    } // console.log(getObjectOptimizationInfo(obj))
    // console.log(getObjectOptimizationInfo(arr))


    _Assert.assert.throws(function () {
      return (0, _helpers2.assertIsOptimized)({
        obj: obj
      });
    }, _Assert.AssertionError);

    _Assert.assert.throws(function () {
      return (0, _helpers2.assertIsOptimized)({
        arr: arr
      });
    }, _Assert.AssertionError);

    (0, _helpers2.assertIsOptimized)({
      test: test
    });
    test({});

    _Assert.assert.throws(function () {
      return (0, _helpers2.assertIsOptimized)({
        test: test
      });
    }, _Assert.AssertionError);
  });
});