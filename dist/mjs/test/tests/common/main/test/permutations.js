import { assert } from '../../../../../main/common/test/Assert';
import { describe, it } from '../../../../../main/common/test/Mocha';
import { forEachPermutation } from '../../../../../main/common/test/permutations';
describe('common > test > permutations', function () {
  it('base', function () {
    // 1
    let index = 0;
    let check = [[1]];
    forEachPermutation([1], arr => {
      assert.deepStrictEqual(arr, check[index++]);
    });
    assert.strictEqual(index, check.length); // 2

    index = 0;
    check = [[1, 2], [2, 1]];
    forEachPermutation([1, 2], arr => {
      assert.deepStrictEqual(arr, check[index++]);
    });
    assert.strictEqual(index, check.length); // 3

    index = 0;
    check = [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]];
    forEachPermutation([1, 2, 3], arr => {
      assert.deepStrictEqual(arr, check[index++]);
    });
    assert.strictEqual(index, check.length); // 4

    index = 0;
    check = [[1, 2, 3, 4], [1, 2, 4, 3], [1, 3, 2, 4], [1, 3, 4, 2], [1, 4, 2, 3], [1, 4, 3, 2], [2, 1, 3, 4], [2, 1, 4, 3], [2, 3, 1, 4], [2, 3, 4, 1], [2, 4, 1, 3], [2, 4, 3, 1], [3, 1, 2, 4], [3, 1, 4, 2], [3, 2, 1, 4], [3, 2, 4, 1], [3, 4, 1, 2], [3, 4, 2, 1], [4, 1, 2, 3], [4, 1, 3, 2], [4, 2, 1, 3], [4, 2, 3, 1], [4, 3, 1, 2], [4, 3, 2, 1]];
    forEachPermutation([1, 2, 3, 4], arr => {
      assert.deepStrictEqual(arr, check[index++]);
    });
    assert.strictEqual(index, check.length);
  });
});