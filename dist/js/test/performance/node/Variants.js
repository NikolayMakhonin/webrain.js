"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _rdtsc = require("rdtsc");

var _Calc = require("../../../main/common/test/Calc");

var _Variants = require("../../../main/common/test/Variants");

/* tslint:disable:no-empty no-identical-functions max-line-length no-construct use-primitive-type */
// @ts-ignore
describe('common > performance > Variants', function () {
  this.timeout(300000);
  var tree = [1, [2, 3], [4, 5, [6, 7]]];

  function iterateIterables(iterables) {
    for (var _iterator = iterables, _isArray = (0, _isArray3.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var iterable = _ref;

      for (var _iterator2 = iterable, _isArray2 = (0, _isArray3.default)(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator2.default)(_iterator2);;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var item = _ref2;
      }
    }
  }

  it('mem', function () {
    (0, _Calc.calcMemAllocate)(_Calc.CalcType.Min, 10000, function () {
      iterateIterables((0, _Variants.treeToSequenceVariants)(tree));
    });
  });
  it('perf', function () {
    var result = (0, _rdtsc.calcPerformance)(10000, function () {// no operations
    }, function () {
      return iterateIterables((0, _Variants.treeToSequenceVariants)(tree));
    });
    console.log(result);
  });
});