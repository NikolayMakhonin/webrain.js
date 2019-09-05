"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _fill = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/fill"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _padStart = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/pad-start"));

var _array = require("../../../../../../main/common/lists/helpers/array");

describe('common > main > lists > helpers > array', function () {
  it('binarySearch full', function () {
    var _context2, _context3;

    this.timeout(20000);

    var indexToItem = function indexToItem(index) {
      var _context;

      return "item".concat((0, _padStart.default)(_context = (index + 2).toString()).call(_context, 3, '0'));
    };

    var arr = (0, _map.default)(_context2 = (0, _fill.default)(_context3 = new Array(51)).call(_context3, 0)).call(_context2, function (o, i) {
      return indexToItem(i) + (i % 2 ? '_' : '');
    });

    for (var index = -2; index < arr.length + 2; index++) {
      var item = indexToItem(index);

      for (var bound = -1; bound < 1; bound++) {
        for (var start = -1; start <= Math.min(arr.length - 1, Math.max(0, index)); start++) {
          for (var end = arr.length; end >= Math.min(arr.length, index + 1); end--) {
            var result = (0, _array.binarySearch)(arr, item, start < 0 ? null : start, end >= arr.length ? null : end, // eslint-disable-next-line no-nested-ternary
            index % 3 ? function (o1, o2) {
              return o1 > o2 ? 1 : o1 < o2 ? -1 : 0;
            } : null, bound);
            var log = (0, _stringify.default)({
              index: index,
              start: start,
              end: end,
              bound: bound
            });

            if (index < 0) {
              assert.strictEqual(result, ~0, log);
            } else if (index >= arr.length) {
              assert.strictEqual(result, ~arr.length, log);
            } else if (index % 2) {
              assert.strictEqual(result, ~index, log);
            } else {
              assert.strictEqual(result, index, log);
            }
          }
        }
      }
    }
  });
  it('binarySearch specific', function () {
    assert.strictEqual((0, _array.binarySearch)([], 0), ~0);
    assert.strictEqual((0, _array.binarySearch)([1], 0), ~0);
    assert.strictEqual((0, _array.binarySearch)([-1], 0), ~1);
    assert.strictEqual((0, _array.binarySearch)([0], 0), 0);
    assert.strictEqual((0, _array.binarySearch)([0, 1, 1, 1, 2], 1, null, null, null, -1), 1);
    assert.strictEqual((0, _array.binarySearch)([0, 1, 1, 1, 2], 1, null, null, null, 1), 3);
    assert.strictEqual((0, _array.binarySearch)([0, 0, 1, 1, 1, 2], 1, null, null, null, -1), 2);
    assert.strictEqual((0, _array.binarySearch)([0, 0, 1, 1, 1, 2], 1, null, null, null, 1), 4);
    assert.strictEqual((0, _array.binarySearch)([0, 0, 1, 1, 1], 1, null, null, null, -1), 2);
    assert.strictEqual((0, _array.binarySearch)([0, 0, 1, 1, 1], 1, null, null, null, 1), 4);
    assert.strictEqual((0, _array.binarySearch)([1, 1, 1], 1, null, null, null, -1), 0);
    assert.strictEqual((0, _array.binarySearch)([1, 1, 1], 1, null, null, null, 1), 2);
    assert.strictEqual((0, _array.binarySearch)([0], 0, 0, 0), ~0);
    assert.strictEqual((0, _array.binarySearch)([0], 0, 0, 1), 0);
  });
  it('move', function () {
    function testMove(array, start, end, newIndex, expectedArray) {
      array = (0, _slice.default)(array).call(array);
      (0, _array.move)(array, start, end, newIndex);
      assert.deepStrictEqual(array, expectedArray);
    }

    testMove([0, 1], 1, 2, 0, [1, 0]);
    testMove([0, 1, 2], 1, 2, 0, [1, 0, 2]);
    testMove([0, 1, 2], 2, 3, 0, [2, 0, 1]);
    testMove([0, 1, 2, 3, 4, 5, 6, 7, 8], 1, 5, 3, [0, 5, 6, 1, 2, 3, 4, 7, 8]);
    testMove([0, 5, 6, 1, 2, 3, 4, 7, 8], 3, 7, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });
});