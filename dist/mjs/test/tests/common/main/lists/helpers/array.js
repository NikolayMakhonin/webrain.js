import { binarySearch, move } from '../../../../../../main/common/lists/helpers/array';
describe('common > main > lists > helpers > array', function () {
  it('binarySearch full', function () {
    this.timeout(20000);

    var indexToItem = function indexToItem(index) {
      return "item".concat((index + 2).toString().padStart(3, '0'));
    };

    var arr = new Array(51).fill(0).map(function (o, i) {
      return indexToItem(i) + (i % 2 ? '_' : '');
    });

    for (var index = -2; index < arr.length + 2; index++) {
      var item = indexToItem(index);

      for (var bound = -1; bound < 1; bound++) {
        for (var start = -1; start <= Math.min(arr.length - 1, Math.max(0, index)); start++) {
          for (var end = arr.length; end >= Math.min(arr.length, index + 1); end--) {
            var result = binarySearch(arr, item, start < 0 ? null : start, end >= arr.length ? null : end, // eslint-disable-next-line no-nested-ternary
            index % 3 ? function (o1, o2) {
              return o1 > o2 ? 1 : o1 < o2 ? -1 : 0;
            } : null, bound);
            var log = JSON.stringify({
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
    assert.strictEqual(binarySearch([], 0), ~0);
    assert.strictEqual(binarySearch([1], 0), ~0);
    assert.strictEqual(binarySearch([-1], 0), ~1);
    assert.strictEqual(binarySearch([0], 0), 0);
    assert.strictEqual(binarySearch([0, 1, 1, 1, 2], 1, null, null, null, -1), 1);
    assert.strictEqual(binarySearch([0, 1, 1, 1, 2], 1, null, null, null, 1), 3);
    assert.strictEqual(binarySearch([0, 0, 1, 1, 1, 2], 1, null, null, null, -1), 2);
    assert.strictEqual(binarySearch([0, 0, 1, 1, 1, 2], 1, null, null, null, 1), 4);
    assert.strictEqual(binarySearch([0, 0, 1, 1, 1], 1, null, null, null, -1), 2);
    assert.strictEqual(binarySearch([0, 0, 1, 1, 1], 1, null, null, null, 1), 4);
    assert.strictEqual(binarySearch([1, 1, 1], 1, null, null, null, -1), 0);
    assert.strictEqual(binarySearch([1, 1, 1], 1, null, null, null, 1), 2);
    assert.strictEqual(binarySearch([0], 0, 0, 0), ~0);
    assert.strictEqual(binarySearch([0], 0, 0, 1), 0);
  });
  it('move', function () {
    function testMove(array, start, end, newIndex, expectedArray) {
      array = array.slice();
      move(array, start, end, newIndex);
      assert.deepStrictEqual(array, expectedArray);
    }

    testMove([0, 1], 1, 2, 0, [1, 0]);
    testMove([0, 1, 2], 1, 2, 0, [1, 0, 2]);
    testMove([0, 1, 2], 2, 3, 0, [2, 0, 1]);
    testMove([0, 1, 2, 3, 4, 5, 6, 7, 8], 1, 5, 3, [0, 5, 6, 1, 2, 3, 4, 7, 8]);
    testMove([0, 5, 6, 1, 2, 3, 4, 7, 8], 3, 7, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });
});