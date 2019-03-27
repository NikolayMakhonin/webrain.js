import { SortedList } from '../../../../../main/common/lists/SortedList';
describe('common > main > lists > SortedList', function () {
  it('constructor', function () {
    var list = new SortedList();
    assert.strictEqual(Object.keys(list).length, 1, JSON.stringify(list));
    list = new SortedList({
      autoSort: true
    });
    assert.strictEqual(Object.keys(list).length, 2, JSON.stringify(list));
    assert.strictEqual(list.autoSort, true);

    var compare = function compare() {};

    list = new SortedList({
      compare: compare
    });
    assert.strictEqual(Object.keys(list).length, 2, JSON.stringify(list));
    assert.strictEqual(list.compare, compare);
  });
});