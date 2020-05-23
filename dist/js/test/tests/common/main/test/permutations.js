"use strict";

var _Assert = require("../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../main/common/test/Mocha");

var _permutations = require("../../../../../main/common/test/permutations");

(0, _Mocha.describe)('common > test > permutations', function () {
  (0, _Mocha.it)('base', function () {
    // 1
    var index = 0;
    var check = [[1]];
    (0, _permutations.forEachPermutation)([1], function (arr) {
      _Assert.assert.deepStrictEqual(arr, check[index++]);
    });

    _Assert.assert.strictEqual(index, check.length); // 2


    index = 0;
    check = [[1, 2], [2, 1]];
    (0, _permutations.forEachPermutation)([1, 2], function (arr) {
      _Assert.assert.deepStrictEqual(arr, check[index++]);
    });

    _Assert.assert.strictEqual(index, check.length); // 3


    index = 0;
    check = [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]];
    (0, _permutations.forEachPermutation)([1, 2, 3], function (arr) {
      _Assert.assert.deepStrictEqual(arr, check[index++]);
    });

    _Assert.assert.strictEqual(index, check.length); // 4


    index = 0;
    check = [[1, 2, 3, 4], [1, 2, 4, 3], [1, 3, 2, 4], [1, 3, 4, 2], [1, 4, 2, 3], [1, 4, 3, 2], [2, 1, 3, 4], [2, 1, 4, 3], [2, 3, 1, 4], [2, 3, 4, 1], [2, 4, 1, 3], [2, 4, 3, 1], [3, 1, 2, 4], [3, 1, 4, 2], [3, 2, 1, 4], [3, 2, 4, 1], [3, 4, 1, 2], [3, 4, 2, 1], [4, 1, 2, 3], [4, 1, 3, 2], [4, 2, 1, 3], [4, 2, 3, 1], [4, 3, 1, 2], [4, 3, 2, 1]];
    (0, _permutations.forEachPermutation)([1, 2, 3, 4], function (arr) {
      _Assert.assert.deepStrictEqual(arr, check[index++]);
    });

    _Assert.assert.strictEqual(index, check.length);
  });
});