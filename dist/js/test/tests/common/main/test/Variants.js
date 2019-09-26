"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _Assert = require("../../../../../main/common/test/Assert");

var _Variants = require("../../../../../main/common/test/Variants");

/* tslint:disable:no-construct use-primitive-type */
describe('common > test > Variants', function () {
  function iterablesToString(iterables) {
    var iterablesArray = (0, _from.default)(iterables);
    var str = (0, _map.default)(iterablesArray).call(iterablesArray, function (iterable) {
      return "[ " + (0, _from.default)(iterable).join(', ') + " ]";
    }).join(',\r\n');
    return str;
  }

  function testTree(tree, resultArrays) {
    var iterables = (0, _Variants.treeToSequenceVariants)(tree);
    var arrays = (0, _Variants.iterablesToArrays)(iterables);
    console.log(iterablesToString(arrays));

    _Assert.assert.deepStrictEqual(arrays, resultArrays);

    arrays = (0, _Variants.iterablesToArrays)(iterables);

    _Assert.assert.deepStrictEqual(arrays, resultArrays);
  }

  it('simple', function () {
    testTree([1], [[1]]);
    testTree([[1, 2]], [[1], [2]]);
    testTree([1, 2], [[1, 2]]);
    testTree([1, 2, 3], [[1, 2, 3]]);
    testTree([1, [2, 3]], [[1, 2], [1, 3]]);
    testTree([1, [2, 3], [4, 5]], [[1, 2, 4], [1, 2, 5], [1, 3, 4], [1, 3, 5]]);
  });
  it('base', function () {
    testTree([1, [2, 3], [4, 5, [6, [7, 8]]]], [[1, 2, 4], [1, 2, 5], [1, 2, 6, 7], [1, 2, 6, 8], [1, 3, 4], [1, 3, 5], [1, 3, 6, 7], [1, 3, 6, 8]]);
  });
});