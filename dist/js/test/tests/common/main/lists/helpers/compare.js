"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _compare = require("../../../../../../main/common/lists/helpers/compare");

var _Assert = require("../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../main/common/test/Mocha");

var _common = require("../src/helpers/common");

(0, _Mocha.describe)('common > main > lists > helpers > compare', function () {
  (0, _Mocha.it)('strict', function () {
    function testCompare(obj1, obj2) {
      _Assert.assert.strictEqual((0, _compare.compareStrict)(obj1, obj2), -1);

      _Assert.assert.strictEqual((0, _compare.compareStrict)(obj2, obj1), 1);

      _Assert.assert.strictEqual((0, _compare.compareStrict)(obj1, obj1), 0);

      _Assert.assert.strictEqual((0, _compare.compareStrict)(obj2, obj2), 0);
    }

    testCompare(-Infinity, -1);
    testCompare(-1, 0);
    testCompare(0, 1);
    testCompare(1, Infinity);
    testCompare(Infinity, NaN);
    testCompare(NaN, false);
    testCompare(false, '');
    testCompare('', {});
    testCompare([], {});
    testCompare({}, function () {});
    testCompare(function () {}, null);
    testCompare(null, undefined);
    testCompare(Infinity, NaN);
    testCompare(Number.NEGATIVE_INFINITY, Infinity);
    testCompare(-Infinity, Number.POSITIVE_INFINITY);
    testCompare(Number.NEGATIVE_INFINITY, 0);

    for (var i = 0; i < 100; i++) {
      testCompare([], []);
      testCompare({}, {});
      testCompare(function () {}, function () {});
      var array = (0, _common.shuffle)(_common.allValues);
      (0, _sort.default)(array).call(array, _compare.compareStrict);

      _Assert.assert.deepStrictEqual(array, [-Infinity, 0, 1, Infinity, NaN, false, true, '', '0', '1', 'NaN', 'false', 'null', 'true', 'undefined', [], {}, null, undefined]);
    }
  });
  (0, _Mocha.it)('fast', function () {
    var _context;

    function testCompare(obj1, obj2) {
      var result = (0, _compare.compareStrict)(obj1, obj2);

      _Assert.assert.ok(result === -1 || result === 1);

      _Assert.assert.strictEqual((0, _compare.compareStrict)(obj2, obj1), -result);

      _Assert.assert.strictEqual((0, _compare.compareStrict)(obj1, obj1), 0);

      _Assert.assert.strictEqual((0, _compare.compareStrict)(obj2, obj2), 0);
    }

    testCompare(-Infinity, -1);
    testCompare(-1, 0);
    testCompare(0, 1);
    testCompare(1, Infinity);
    testCompare(Infinity, NaN);
    testCompare(NaN, false);
    testCompare(false, '');
    testCompare('', {});
    testCompare([], {});
    testCompare({}, function () {});
    testCompare(function () {}, null);
    testCompare(null, undefined);
    testCompare(Infinity, NaN);
    testCompare(Number.NEGATIVE_INFINITY, Infinity);
    testCompare(-Infinity, Number.POSITIVE_INFINITY);
    testCompare(Number.NEGATIVE_INFINITY, 0);
    var arrayCheck = (0, _sort.default)(_context = (0, _slice.default)(_common.allValues).call(_common.allValues)).call(_context, _compare.compareFast);

    for (var i = 0; i < 100; i++) {
      testCompare([], []);
      testCompare({}, {});
      testCompare(function () {}, function () {});
      var array = (0, _common.shuffle)(_common.allValues);
      (0, _sort.default)(array).call(array, _compare.compareFast); // console.log(array)

      _Assert.assert.deepStrictEqual(array, arrayCheck);
    }
  });
});