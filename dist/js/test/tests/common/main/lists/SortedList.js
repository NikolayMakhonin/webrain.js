"use strict";

var _SortedList = require("../../../../../main/common/lists/SortedList");

describe('common > main > lists > SortedList', function () {
  it('constructor', function () {
    let list = new _SortedList.SortedList();
    assert.strictEqual(Object.keys(list).length, 1, JSON.stringify(list));
    list = new _SortedList.SortedList({
      autoSort: true
    });
    assert.strictEqual(Object.keys(list).length, 2, JSON.stringify(list));
    assert.strictEqual(list.autoSort, true);

    const compare = () => {};

    list = new _SortedList.SortedList({
      compare
    });
    assert.strictEqual(Object.keys(list).length, 2, JSON.stringify(list));
    assert.strictEqual(list.compare, compare);
  });
});