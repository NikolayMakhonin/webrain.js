"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _IListChanged = require("../../../../../main/common/lists/contracts/IListChanged");

var _compare = require("../../../../../main/common/lists/helpers/compare");

var _SortedList = require("../../../../../main/common/lists/SortedList");

var _Assert = require("../../../../../main/common/test/Assert");

var _helpers = require("../src/helpers/helpers");

var _common = require("./src/helpers/common");

var _TestList = require("./src/helpers/TestList");

describe('common > main > lists > SortedList', function () {
  this.timeout(20000);
  var testList = _TestList.TestList.test;
  after(function () {
    console.log('Total Sorted tests >= ' + _TestList.TestList.totalListTests);
  });
  it('constructor', function () {
    var list;
    list = new _SortedList.SortedList();

    _TestList.assert.strictEqual(list.size, 0);

    _TestList.assert.strictEqual(list.minAllocatedSize, undefined);

    _TestList.assert.strictEqual(list.allocatedSize, 0);

    _TestList.assert.strictEqual(list.compare, undefined);

    _TestList.assert.strictEqual(list.autoSort, undefined);

    _TestList.assert.strictEqual(list.notAddIfExists, undefined);

    _TestList.assert.deepStrictEqual(list.toArray(), []);

    list = new _SortedList.SortedList({
      minAllocatedSize: 3
    });

    _TestList.assert.strictEqual(list.size, 0);

    _TestList.assert.strictEqual(list.minAllocatedSize, 3);

    _TestList.assert.strictEqual(list.allocatedSize, 0);

    _TestList.assert.strictEqual(list.compare, undefined);

    _TestList.assert.strictEqual(list.autoSort, undefined);

    _TestList.assert.strictEqual(list.notAddIfExists, undefined);

    _TestList.assert.deepStrictEqual(list.toArray(), []);

    var array = [0, 1, 2];
    list = new _SortedList.SortedList({
      array: array
    });

    _TestList.assert.strictEqual(list.size, 3);

    _TestList.assert.strictEqual(list.minAllocatedSize, undefined);

    _TestList.assert.strictEqual(list.allocatedSize, 3);

    _TestList.assert.strictEqual(list.compare, undefined);

    _TestList.assert.strictEqual(list.autoSort, undefined);

    _TestList.assert.strictEqual(list.notAddIfExists, undefined);

    var toArray = list.toArray();

    _TestList.assert.deepStrictEqual(toArray, [0, 1, 2]);

    _TestList.assert.notStrictEqual(toArray, array);

    list = new _SortedList.SortedList({
      compare: _compare.compareFast
    });

    _TestList.assert.strictEqual(list.size, 0);

    _TestList.assert.strictEqual(list.minAllocatedSize, undefined);

    _TestList.assert.strictEqual(list.allocatedSize, 0);

    _TestList.assert.strictEqual(list.compare, _compare.compareFast);

    _TestList.assert.strictEqual(list.autoSort, undefined);

    _TestList.assert.strictEqual(list.notAddIfExists, undefined);

    _TestList.assert.deepStrictEqual(list.toArray(), []);

    list = new _SortedList.SortedList({
      array: array = [2, 1, 1, 1, 1, 3],
      notAddIfExists: true
    });

    _TestList.assert.strictEqual(list.size, 6);

    _TestList.assert.strictEqual(list.minAllocatedSize, undefined);

    _TestList.assert.strictEqual(list.allocatedSize, 6);

    _TestList.assert.strictEqual(list.compare, undefined);

    _TestList.assert.strictEqual(list.autoSort, undefined);

    _TestList.assert.strictEqual(list.notAddIfExists, true);

    toArray = list.toArray();

    _TestList.assert.deepStrictEqual(toArray, [2, 1, 1, 1, 1, 3]); // list.removeDuplicates()
    // assert.strictEqual(list.size, 3)
    // assert.deepStrictEqual(toArray, [2, 1, 3])


    _TestList.assert.notStrictEqual(toArray, array);

    list.autoSort = false;

    _TestList.assert.deepStrictEqual(list.toArray(), [2, 1, 1, 1, 1, 3]);

    _TestList.assert.strictEqual(list.autoSort, false);

    list = new _SortedList.SortedList({
      array: array = [2, 1, 3],
      autoSort: true
    });

    _TestList.assert.strictEqual(list.size, 3);

    _TestList.assert.strictEqual(list.minAllocatedSize, undefined);

    _TestList.assert.strictEqual(list.allocatedSize, 3);

    _TestList.assert.strictEqual(list.compare, undefined);

    _TestList.assert.strictEqual(list.autoSort, true);

    _TestList.assert.strictEqual(list.notAddIfExists, undefined);

    toArray = list.toArray();

    _TestList.assert.deepStrictEqual(toArray, [1, 2, 3]);

    _TestList.assert.notStrictEqual(toArray, array);

    list = new _SortedList.SortedList({
      array: array = [2, 3, 1],
      countSorted: 2
    });

    _TestList.assert.strictEqual(list.size, 3);

    _TestList.assert.strictEqual(list.minAllocatedSize, undefined);

    _TestList.assert.strictEqual(list.allocatedSize, 3);

    _TestList.assert.strictEqual(list.compare, undefined);

    _TestList.assert.strictEqual(list.autoSort, undefined);

    _TestList.assert.strictEqual(list.countSorted, 2);

    _TestList.assert.strictEqual(list.notAddIfExists, undefined);

    toArray = list.toArray();

    _TestList.assert.deepStrictEqual(toArray, [2, 3, 1]);

    _TestList.assert.notStrictEqual(toArray, array);

    list.autoSort = true;

    _TestList.assert.strictEqual(list.countSorted, 2);

    list.get(0);

    _TestList.assert.strictEqual(list.countSorted, 3);

    _TestList.assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
  });
  it('size', function () {
    var array = (0, _common.generateArray)(31);
    var list = new _SortedList.SortedList({
      array: array,
      minAllocatedSize: 30
    });

    _TestList.assert.strictEqual(list.size, 31);

    _TestList.assert.strictEqual(list.allocatedSize, 31);

    list.removeRange(-1);

    _TestList.assert.strictEqual(list.size, 30);

    _TestList.assert.strictEqual(list.allocatedSize, 31);

    list.removeRange(-1);

    _TestList.assert.strictEqual(list.size, 29);

    _TestList.assert.strictEqual(list.allocatedSize, 31);

    list.addArray([1, 2, 3, 4]);

    _TestList.assert.strictEqual(list.size, 33);

    _TestList.assert.strictEqual(list.allocatedSize, 33);

    list.removeRange(-2);

    _TestList.assert.strictEqual(list.size, 31);

    _TestList.assert.strictEqual(list.allocatedSize, 33);

    list.removeRange(-2);

    _TestList.assert.strictEqual(list.size, 29);

    _TestList.assert.strictEqual(list.allocatedSize, 33);

    list.removeRange(-12);

    _TestList.assert.strictEqual(list.size, 17);

    _TestList.assert.strictEqual(list.allocatedSize, 33);

    list.removeRange(-1);

    _TestList.assert.strictEqual(list.size, 16);

    _TestList.assert.strictEqual(list.allocatedSize, 32);

    list.removeRange(-7);

    _TestList.assert.strictEqual(list.size, 9);

    _TestList.assert.strictEqual(list.allocatedSize, 32);

    list.removeRange(-1);

    _TestList.assert.strictEqual(list.size, 8);

    _TestList.assert.strictEqual(list.allocatedSize, 32);

    list.clear();

    _TestList.assert.strictEqual(list.size, 0);

    _TestList.assert.strictEqual(list.allocatedSize, 32);

    list.minAllocatedSize = 17;

    _TestList.assert.strictEqual(list.allocatedSize, 32);

    list.minAllocatedSize = 16;

    _TestList.assert.strictEqual(list.allocatedSize, 16);

    list.minAllocatedSize = 15;

    _TestList.assert.strictEqual(list.allocatedSize, 16);

    list.minAllocatedSize = 0;

    _TestList.assert.strictEqual(list.allocatedSize, 4);
  });
  it('get', function () {
    testList({
      array: [[]],
      expected: {
        error: Error,
        returnValue: null,
        defaultValue: null
      },
      actions: [function (list) {
        return list.get(0);
      }, function (list) {
        return list.get(1);
      }, function (list) {
        return list.get(-1);
      }]
    });
    testList({
      array: [['0']],
      expected: {
        error: Error,
        returnValue: null,
        defaultValue: null
      },
      actions: [function (list) {
        return list.get(1);
      }, function (list) {
        return list.get(2);
      }, function (list) {
        return list.get(-2);
      }, function (list) {
        return list.get(-3);
      }]
    });
    testList({
      array: [['4', '2', '3']],
      autoSort: [true],
      expected: {
        array: ['2', '3', '4'],
        returnValue: '3',
        defaultValue: null,
        countSorted: 3
      },
      actions: [function (list) {
        return list.get(1);
      }, function (list) {
        return list.get(-2);
      }]
    });
  });
  it('set', function () {
    function set(index, item) {
      var _context;

      return {
        actions: [function (list) {
          return list.set(index, item);
        }],
        description: (0, _concat.default)(_context = "set(".concat(index, ", ")).call(_context, (0, _stringify.default)(item), ")\n")
      };
    }

    testList({
      array: [[]],
      expected: {
        array: ['0'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 0,
          newItems: ['0'],
          shiftIndex: 0
        }]
      },
      actions: [set(0, '0'), set(-1, '0')]
    });
    testList({
      array: [[]],
      expected: {
        array: ['0'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 0,
          newItems: ['0'],
          shiftIndex: 0
        }]
      },
      actions: [set(0, '0'), set(-1, '0')]
    });
    testList({
      array: [[]],
      expected: {
        error: Error,
        returnValue: null,
        defaultValue: null
      },
      actions: [set(1, '0'), set(-2, '0')]
    });
    testList({
      array: [['0']],
      expected: {
        array: ['1'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Set,
          index: 0,
          oldItems: ['0'],
          newItems: ['1'],
          moveIndex: 0
        }]
      },
      actions: [set(0, '1'), set(-2, '1')]
    });
    testList({
      array: [['0']],
      expected: {
        error: Error,
        returnValue: null,
        defaultValue: null
      },
      actions: [set(-3, '0'), set(2, '0')]
    });
    testList({
      array: [['0']],
      expected: {
        array: ['0', '1'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 1,
          newItems: ['1'],
          shiftIndex: 1
        }]
      },
      actions: [set(1, '1'), set(-1, '1')]
    });
    testList({
      array: [['0', '1']],
      expected: {
        array: ['2', '1'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Set,
          index: 0,
          oldItems: ['0'],
          newItems: ['2'],
          moveIndex: 0
        }]
      },
      actions: [set(0, '2'), set(-3, '2')]
    });
    testList({
      // '0', '3', '4', '5', '7'
      array: [['5', '3', '7', '4', '0']],
      autoSort: [true],
      expected: {
        array: ['0', '1', '3', '5', '7'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Set,
          index: 2,
          oldItems: ['4'],
          newItems: ['1'],
          moveIndex: 1
        }]
      },
      actions: [set(2, '1'), set(-4, '1')]
    });
    testList({
      // '0', '3', '4', '5', '7'
      array: [['5', '3', '7', '4', '0']],
      notAddIfExists: [true],
      autoSort: [true],
      expected: {
        array: ['0', '3', '5', '7'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 2,
          oldItems: ['4'],
          shiftIndex: 3
        }]
      },
      actions: [set(2, '0'), set(-4, '0')]
    });
    testList({
      array: [['5', '3', '7', '4', '0']],
      notAddIfExists: [true],
      autoSort: [false],
      expected: {
        array: ['5', '3', '4', '0'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 2,
          oldItems: ['7'],
          shiftIndex: 3
        }]
      },
      actions: [set(2, '0'), set(-4, '0')]
    });
    testList({
      // '0', '3', '5', '5', '7'
      array: [['5', '3', '5', '7', '0']],
      notAddIfExists: [false],
      autoSort: [true],
      expected: {
        array: ['0', '3', '5', '5', '7'],
        returnValue: false,
        defaultValue: null
      },
      actions: [set(2, '5'), set(-4, '5')]
    });
  });
  it('add', function () {
    function add(item) {
      return {
        actions: [function (list) {
          return list.add(item);
        }, function (list) {
          return list.set(list.size, item);
        }, function (list) {
          return list.insert(list.size, item);
        }, function (list) {
          return list.addArray([item]);
        }, function (list) {
          return list.addIterable((0, _helpers.createIterable)([item]), 1);
        }, function (list) {
          return list.insertArray(list.size, [item]);
        }, function (list) {
          return list.insertIterable(list.size, (0, _helpers.createIterable)([item]), 1);
        }],
        description: "add(".concat((0, _stringify.default)(item), ")\n")
      };
    }

    testList({
      array: [[]],
      expected: {
        array: ['0'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 0,
          newItems: ['0'],
          shiftIndex: 0
        }]
      },
      actions: [add('0')]
    });
    testList({
      array: [['0']],
      expected: {
        array: ['0', '1'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 1,
          newItems: ['1'],
          shiftIndex: 1
        }]
      },
      actions: [add('1')]
    });
    testList({
      array: [['0', '2', '3']],
      autoSort: [true],
      expected: {
        array: ['0', '1', '2', '3'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 1,
          newItems: ['1'],
          shiftIndex: 2
        }]
      },
      actions: [add('1')]
    });
    testList({
      array: [['0', '2', '3']],
      notAddIfExists: [true],
      expected: {
        array: ['0', '2', '3'],
        returnValue: false,
        defaultValue: null
      },
      actions: [add('0'), add('2'), add('3')]
    });
  });
  it('addArray', function () {
    function addArray(sourceItems, sourceStart, sourceEnd) {
      var _context2, _context3;

      var start = sourceStart == null ? 0 : sourceStart;
      var end = sourceEnd == null ? sourceItems.length : sourceEnd;

      if (start < 0) {
        start += sourceItems.length;
      }

      if (end < 0) {
        end += sourceItems.length + 1;
      }

      return {
        actions: [function (list) {
          return list.addArray(sourceItems, sourceStart, sourceEnd);
        }, function (list) {
          return list.insertArray(list.size, sourceItems, sourceStart, sourceEnd);
        }, [function (list) {
          return list.addIterable((0, _slice.default)(sourceItems).call(sourceItems, start, end), end - start);
        }, function (list) {
          return list.addIterable((0, _helpers.createIterable)((0, _slice.default)(sourceItems).call(sourceItems, start, end)), end - start);
        }, function (list) {
          return list.insertIterable(list.size, (0, _slice.default)(sourceItems).call(sourceItems, start, end), end - start);
        }, function (list) {
          return list.insertIterable(list.size, (0, _helpers.createIterable)((0, _slice.default)(sourceItems).call(sourceItems, start, end)), end - start);
        }]],
        description: (0, _concat.default)(_context2 = (0, _concat.default)(_context3 = "arrArray(".concat((0, _stringify.default)(sourceItems), ", ")).call(_context3, sourceStart, ", ")).call(_context2, sourceEnd, ")\n")
      };
    }

    testList({
      array: [[]],
      expected: {
        array: [],
        returnValue: false,
        defaultValue: null
      },
      actions: [addArray([]), addArray(['0'], 1), addArray(['0'], 2), addArray(['0'], null, 0), addArray(['0'], null, -2), addArray(['0'], null, -3)]
    });
    testList({
      array: [[]],
      expected: {
        array: ['0'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 0,
          newItems: ['0'],
          shiftIndex: 0
        }]
      },
      actions: [addArray(['0']), addArray(['0'], 0), addArray(['0'], -1), addArray(['0'], null, 1), addArray(['0'], null, -1)]
    });
    testList({
      array: [[]],
      notAddIfExists: [false],
      expected: {
        error: Error,
        returnValue: null,
        defaultValue: null
      },
      actions: [addArray(['0'], -2), addArray(['0'], null, 2)]
    });
    testList({
      array: [['0']],
      notAddIfExists: [false],
      expected: {
        array: ['0', '1', '2', '3'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 1,
          newItems: ['1', '2', '3'],
          shiftIndex: 1
        }]
      },
      actions: [addArray(['1', '2', '3']), addArray(['1', '2', '3'], 0, 3), addArray(['1', '2', '3'], -3, -1)]
    });
    testList({
      array: [['0']],
      notAddIfExists: [false],
      expected: {
        array: ['0', '1', '2'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 1,
          newItems: ['1', '2'],
          shiftIndex: 1
        }]
      },
      actions: [addArray(['1', '2', '3'], null, 2), addArray(['1', '2', '3'], null, -2), addArray(['1', '2', '3'], 0, 2), addArray(['1', '2', '3'], 0, -2), addArray(['1', '2', '3'], -3, 2), addArray(['1', '2', '3'], -3, -2)]
    });
    testList({
      array: [['0']],
      notAddIfExists: [false],
      expected: {
        array: ['0', '2', '3'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 1,
          newItems: ['2', '3'],
          shiftIndex: 1
        }]
      },
      actions: [addArray(['1', '2', '3'], 1, null), addArray(['1', '2', '3'], -2, null), addArray(['1', '2', '3'], 1, -1), addArray(['1', '2', '3'], -2, -1), addArray(['1', '2', '3'], 1, 3), addArray(['1', '2', '3'], -2, 3)]
    });
  });
  it('insert', function () {
    function insert(index, item) {
      var _context4;

      return {
        actions: [function (list) {
          return list.insert(index, item);
        }, function (list) {
          return list.insertArray(index, [item]);
        }, function (list) {
          return list.insertIterable(index, (0, _helpers.createIterable)([item]), 1);
        }],
        description: (0, _concat.default)(_context4 = "insert(".concat(index, ", ")).call(_context4, (0, _stringify.default)(item), ")\n")
      };
    }

    testList({
      array: [[]],
      expected: {
        array: ['0'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 0,
          newItems: ['0'],
          shiftIndex: 0
        }]
      },
      actions: [insert(0, '0'), insert(-1, '0')]
    });
    testList({
      array: [[]],
      expected: {
        error: Error,
        returnValue: null,
        defaultValue: null
      },
      actions: [insert(1, '0'), insert(-2, '0')]
    });
    testList({
      array: [['0']],
      expected: {
        array: ['0', '1'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 1,
          newItems: ['1'],
          shiftIndex: 1
        }]
      },
      actions: [insert(1, '1'), insert(-1, '1')]
    });
    testList({
      array: [['0']],
      expected: {
        error: Error,
        returnValue: null,
        defaultValue: null
      },
      actions: [insert(2, '1'), insert(-3, '1')]
    });
    testList({
      array: [['0', '1', '2', '3', '4']],
      countSorted: [1, 2, 3, 4],
      expected: {
        array: ['0', '5', '1', '2', '3', '4'],
        countSorted: 1,
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 1,
          newItems: ['5'],
          shiftIndex: 2
        }]
      },
      actions: [insert(1, '5'), insert(-5, '5')]
    });
  });
  it('insertArray', function () {
    var _context8;

    function insertArray(index, sourceItems, sourceStart, sourceEnd) {
      var _context5, _context6, _context7;

      var start = sourceStart == null ? 0 : sourceStart;
      var end = sourceEnd == null ? sourceItems.length : sourceEnd;

      if (start < 0) {
        start += sourceItems.length;
      }

      if (end < 0) {
        end += sourceItems.length + 1;
      }

      return {
        actions: [function (list) {
          return list.insertArray(index, sourceItems, sourceStart, sourceEnd);
        }, [function (list) {
          return list.insertIterable(index, (0, _slice.default)(sourceItems).call(sourceItems, start, end), end - start);
        }, function (list) {
          return list.insertIterable(index, (0, _helpers.createIterable)((0, _slice.default)(sourceItems).call(sourceItems, start, end)), end - start);
        }]],
        description: (0, _concat.default)(_context5 = (0, _concat.default)(_context6 = (0, _concat.default)(_context7 = "insertArray(".concat(index, ", ")).call(_context7, (0, _stringify.default)(sourceItems), ", ")).call(_context6, sourceStart, ", ")).call(_context5, sourceEnd, ")\n")
      };
    }

    testList({
      array: [['0']],
      notAddIfExists: [false],
      expected: {
        array: ['1', '2', '0'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 0,
          newItems: ['1', '2'],
          shiftIndex: 2
        }]
      },
      actions: [insertArray(0, ['1', '2']), insertArray(0, ['1', '2'], 0, 2), insertArray(0, ['1', '2'], -2, -1), insertArray(0, ['1', '2', '3'], null, 2), insertArray(0, ['1', '2', '3'], null, -2), insertArray(0, ['1', '2', '3'], 0, 2), insertArray(0, ['1', '2', '3'], 0, -2), insertArray(0, ['1', '2', '3'], -3, 2), insertArray(0, ['1', '2', '3'], -3, -2)]
    });
    testList({
      array: [['0', '1', '2', '3', '4']],
      notAddIfExists: [false],
      expected: {
        array: ['0', '1', '4', '5', '2', '3', '4'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 2,
          newItems: ['4', '5'],
          shiftIndex: 4
        }]
      },
      actions: [insertArray(2, ['4', '5']), insertArray(2, ['4', '5'], 0, 2), insertArray(2, ['4', '5'], -2, -1), insertArray(2, ['4', '5', '6'], null, 2), insertArray(2, ['4', '5', '6'], null, -2), insertArray(2, ['4', '5', '6'], 0, 2), insertArray(2, ['4', '5', '6'], 0, -2), insertArray(2, ['4', '5', '6'], -3, 2), insertArray(2, ['4', '5', '6'], -3, -2)]
    });
    testList({
      // '0', '1', '3', '4', '5'
      array: [['0', '1', '3', '5', '4']],
      autoSort: [true],
      notAddIfExists: [true],
      expected: {
        array: ['0', '1', '2', '3', '4', '5'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 2,
          newItems: ['2'],
          shiftIndex: 3
        }]
      },
      actions: [insertArray(0, ['4', '2']), insertArray(1, ['4', '2']), insertArray(2, ['4', '2']), insertArray(3, ['4', '2']), insertArray(4, ['4', '2']), insertArray(5, ['4', '2'])]
    });
    testList({
      array: [['0', '1', '3', '5', '4']],
      autoSort: [false],
      notAddIfExists: [true],
      expected: {
        array: ['0', '2', '1', '3', '5', '4'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 1,
          newItems: ['2'],
          shiftIndex: 2
        }]
      },
      actions: [insertArray(1, ['4', '2'])]
    });
    testList({
      // '0', '1', '3', '4', '5'
      array: [['0', '1', '3', '5', '4']],
      autoSort: [true],
      notAddIfExists: [false],
      expected: {
        array: ['0', '1', '2', '3', '4', '4', '5'],
        returnValue: true,
        defaultValue: null,
        propertyChanged: [{
          name: 'size',
          oldValue: 5,
          newValue: 6
        }, {
          name: 'size',
          oldValue: 6,
          newValue: 7
        }],
        listChanged: [{
          type: _IListChanged.ListChangedType.Added,
          index: 3,
          newItems: ['4'],
          shiftIndex: 4
        }, {
          type: _IListChanged.ListChangedType.Added,
          index: 2,
          newItems: ['2'],
          shiftIndex: 3
        }]
      },
      actions: [insertArray(0, ['4', '2']), insertArray(1, ['4', '2']), insertArray(2, ['4', '2']), insertArray(3, ['4', '2']), insertArray(4, ['4', '2']), insertArray(5, ['4', '2'])]
    });
    var allValuesShuffle = (0, _common.shuffle)(_common.allValues);
    var allValuesSort = (0, _sort.default)(_context8 = (0, _slice.default)(allValuesShuffle).call(allValuesShuffle)).call(_context8);
    testList({
      array: [[]],
      autoSort: [true],
      notAddIfExists: [true],
      useListChanged: [false],
      expected: {
        array: (0, _sort.default)(_common.allValues).call(_common.allValues, _compare.compareFast),
        returnValue: true,
        defaultValue: null,
        propertyChanged: (0, _map.default)(allValuesShuffle).call(allValuesShuffle, function (o, i) {
          return {
            name: 'size',
            oldValue: i,
            newValue: i + 1
          };
        })
      },
      actions: [insertArray(0, (0, _concat.default)(allValuesShuffle).call(allValuesShuffle, allValuesShuffle))]
    });
    testList({
      array: [[]],
      autoSort: [false],
      notAddIfExists: [true],
      expected: {
        array: allValuesShuffle,
        returnValue: true,
        defaultValue: null,
        propertyChanged: (0, _map.default)(allValuesShuffle).call(allValuesShuffle, function (o, i) {
          return {
            name: 'size',
            oldValue: i,
            newValue: i + 1
          };
        }),
        listChanged: (0, _map.default)(allValuesShuffle).call(allValuesShuffle, function (o, i) {
          return {
            type: _IListChanged.ListChangedType.Added,
            index: i,
            newItems: [o],
            shiftIndex: i
          };
        })
      },
      actions: [insertArray(0, allValuesShuffle)]
    });
  });
  it('remove', function () {
    function remove(item) {
      return {
        actions: [function (list) {
          return list.remove(item);
        }],
        description: "remove(".concat((0, _stringify.default)(item), ")\n")
      };
    }

    testList({
      array: [[]],
      expected: {
        array: [],
        returnValue: false,
        defaultValue: null
      },
      actions: [remove('0')]
    });
    testList({
      array: [['0']],
      expected: {
        array: [],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 0,
          oldItems: ['0'],
          shiftIndex: 0
        }]
      },
      actions: [remove('0')]
    });
    testList({
      array: [['0', '1', '2']],
      expected: {
        array: ['1', '2'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 0,
          oldItems: ['0'],
          shiftIndex: 1
        }]
      },
      actions: [remove('0')]
    });
    testList({
      array: [['0', '1', '2']],
      expected: {
        array: ['0', '2'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 1,
          oldItems: ['1'],
          shiftIndex: 2
        }]
      },
      actions: [remove('1')]
    });
    testList({
      array: [['0', '1', '2']],
      expected: {
        array: ['0', '1', '2'],
        returnValue: false,
        defaultValue: null
      },
      actions: [remove('3')]
    });
    testList({
      array: [[0, 1, 2]],
      expected: {
        array: [0, 2],
        returnValue: true,
        defaultValue: 0,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 1,
          oldItems: [1],
          shiftIndex: 2
        }]
      },
      actions: [remove(1)]
    });
    testList({
      array: [[true, true]],
      notAddIfExists: [false],
      expected: {
        array: [true],
        returnValue: true,
        defaultValue: false,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 1,
          oldItems: [true],
          shiftIndex: 1
        }]
      },
      actions: [remove(true)]
    });
    testList({
      array: [['0', 2, true]],
      expected: {
        array: ['0', 2],
        returnValue: true,
        defaultValue: 0,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 2,
          oldItems: [true],
          shiftIndex: 2
        }]
      },
      actions: [remove(true)]
    });
  });
  it('removeAt', function () {
    function removeAt(index, withoutShift) {
      return {
        actions: [function (list) {
          return list.removeAt(index, withoutShift);
        }],
        description: "removeAt(".concat(index, ")\n")
      };
    }

    testList({
      array: [[]],
      expected: {
        error: Error,
        returnValue: null,
        defaultValue: null
      },
      actions: [removeAt(0), removeAt(-1)]
    });
    testList({
      array: [['0']],
      expected: {
        error: Error,
        returnValue: null,
        defaultValue: null
      },
      actions: [removeAt(1), removeAt(-2)]
    });
    testList({
      array: [['0']],
      expected: {
        array: [],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 0,
          oldItems: ['0'],
          shiftIndex: 0
        }]
      },
      actions: [removeAt(0), removeAt(-1)]
    });
    testList({
      array: [[0, 1, 2, 3]],
      expected: {
        array: [0, 2, 3],
        returnValue: true,
        defaultValue: 0,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 1,
          oldItems: [1],
          shiftIndex: 2
        }]
      },
      actions: [removeAt(1), removeAt(-3)]
    });
    testList({
      array: [['0', '1', '2', '3']],
      expected: {
        array: ['0', '3', '2'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 1,
          oldItems: ['1'],
          shiftIndex: 3
        }]
      },
      actions: [removeAt(1, true), removeAt(-3, true)]
    });
  });
  it('removeRange', function () {
    function removeRange(start, end, withoutShift) {
      var _context9, _context10;

      return {
        actions: [function (list) {
          return list.removeRange(start, end, withoutShift);
        }],
        description: (0, _concat.default)(_context9 = (0, _concat.default)(_context10 = "removeRange(".concat(start, ", ")).call(_context10, end, ", ")).call(_context9, withoutShift, ")\n")
      };
    }

    testList({
      array: [[]],
      expected: {
        array: [],
        returnValue: false,
        defaultValue: null
      },
      actions: [removeRange(0), removeRange(0, 0)]
    });
    testList({
      array: [[]],
      expected: {
        error: Error,
        returnValue: null,
        defaultValue: null
      },
      actions: [removeRange(-1), removeRange(0, 1)]
    });
    testList({
      array: [['0']],
      expected: {
        array: [],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 0,
          oldItems: ['0'],
          shiftIndex: 0
        }]
      },
      actions: [removeRange(0), removeRange(-1), removeRange(0, 1), removeRange(-1, 1), removeRange(0, -1), removeRange(-1, -1)]
    });
    testList({
      array: [['0']],
      expected: {
        array: ['0'],
        returnValue: false,
        defaultValue: null
      },
      actions: [removeRange(1), removeRange(0, 0), removeRange(1, 0), removeRange(0, -2), removeRange(-1, -2)]
    });
    testList({
      array: [[-5, -4, -3, -2, -1, true]],
      expected: {
        array: [-5, -1, true],
        returnValue: true,
        defaultValue: false,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 1,
          oldItems: [-4, -3, -2],
          shiftIndex: 4
        }]
      },
      actions: [removeRange(1, 4), removeRange(-5, -3)]
    });
    testList({
      array: [[-5, -4, -3, -2, -1, null]],
      expected: {
        array: [-5, -1, null],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 1,
          oldItems: [-4, -3, -2],
          shiftIndex: 4
        }]
      },
      actions: [removeRange(1, 4), removeRange(-5, -3)]
    });
    testList({
      array: [[-5, -4, -3, -2, -1, undefined]],
      compare: [function (o1, o2) {
        return (0, _compare.compareFast)(o1 || 0, o2 || 0);
      }],
      expected: {
        array: [-5, -1, undefined],
        returnValue: true,
        defaultValue: undefined,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 1,
          oldItems: [-4, -3, -2],
          shiftIndex: 4
        }]
      },
      actions: [removeRange(1, 4), removeRange(-5, -3)]
    });
    testList({
      array: [['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']],
      expected: {
        array: ['0', '1', '7', '8', '9', '5', '6'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 2,
          oldItems: ['2', '3', '4'],
          shiftIndex: 7
        }]
      },
      actions: [removeRange(2, 5, true)]
    });
    testList({
      array: [['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']],
      expected: {
        array: ['0', '1', '5', '6', '7', '8', '9'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 2,
          oldItems: ['2', '3', '4'],
          shiftIndex: 5
        }]
      },
      actions: [removeRange(2, 5, false)]
    });
  });
  it('removeArray', function () {
    var _context13;

    function removeArray(sourceItems, sourceStart, sourceEnd) {
      var _context11, _context12;

      var start = sourceStart == null ? 0 : sourceStart;
      var end = sourceEnd == null ? sourceItems.length : sourceEnd;

      if (start < 0) {
        start += sourceItems.length;
      }

      if (end < 0) {
        end += sourceItems.length + 1;
      }

      return {
        actions: [function (list) {
          return list.removeArray(sourceItems, sourceStart, sourceEnd);
        }, [function (list) {
          return list.removeIterable((0, _slice.default)(sourceItems).call(sourceItems, start, end), end - start);
        }, function (list) {
          return list.removeIterable((0, _helpers.createIterable)((0, _slice.default)(sourceItems).call(sourceItems, start, end)), end - start);
        }]],
        description: (0, _concat.default)(_context11 = (0, _concat.default)(_context12 = "removeArray(".concat((0, _stringify.default)(sourceItems), ", ")).call(_context12, sourceStart, ", ")).call(_context11, sourceEnd, ")\n")
      };
    }

    testList({
      array: [[]],
      expected: {
        array: [],
        returnValue: false,
        defaultValue: null
      },
      actions: [removeArray([]), removeArray(['0']), removeArray([], 0, -1), removeArray(['0'], -1, -2)]
    });
    testList({
      array: [['0', '1', '2', '3', '4']],
      expected: {
        array: ['0', '2', '4'],
        returnValue: true,
        defaultValue: null,
        propertyChanged: [{
          name: 'size',
          oldValue: 5,
          newValue: 4
        }, {
          name: 'size',
          oldValue: 4,
          newValue: 3
        }],
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 3,
          oldItems: ['3'],
          shiftIndex: 4
        }, {
          type: _IListChanged.ListChangedType.Removed,
          index: 1,
          oldItems: ['1'],
          shiftIndex: 2
        }]
      },
      actions: [removeArray(['0', '3', '1', '4'], 1, 3)]
    });
    var allValuesShuffle = (0, _common.shuffle)((0, _concat.default)(_common.allValues).call(_common.allValues, _common.allValues));
    var allValuesSort = (0, _sort.default)(_context13 = (0, _slice.default)(allValuesShuffle).call(allValuesShuffle)).call(_context13);
    testList({
      array: [allValuesShuffle],
      autoSort: [false, true],
      notAddIfExists: [false, true],
      useListChanged: [false],
      expected: {
        array: [],
        returnValue: true,
        defaultValue: (0, _SortedList.getDefaultValue)(allValuesShuffle[allValuesShuffle.length - 1]),
        propertyChanged: (0, _map.default)(allValuesShuffle).call(allValuesShuffle, function (o, i) {
          return {
            name: 'size',
            oldValue: allValuesShuffle.length - i,
            newValue: allValuesShuffle.length - i - 1
          };
        })
      },
      actions: [removeArray(allValuesShuffle)]
    });
  });
  it('clear', function () {
    function clear() {
      return {
        actions: [function (list) {
          return list.clear();
        }, function (list) {
          return list.removeRange(0, list.size);
        }],
        description: 'clear()\n'
      };
    }

    testList({
      array: [[]],
      expected: {
        array: [],
        returnValue: false,
        defaultValue: null
      },
      actions: [clear()]
    });
    testList({
      array: [['0']],
      expected: {
        array: [],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 0,
          oldItems: ['0'],
          shiftIndex: 0
        }]
      },
      actions: [clear()]
    });
    testList({
      array: [[0, 1, 2]],
      expected: {
        array: [],
        returnValue: true,
        defaultValue: 0,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 0,
          oldItems: [0, 1, 2],
          shiftIndex: 0
        }]
      },
      actions: [clear()]
    });
    testList({
      array: [[-3, -2, -1, true]],
      expected: {
        array: [],
        returnValue: true,
        defaultValue: 0,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 0,
          oldItems: [-3, -2, -1, true],
          shiftIndex: 0
        }]
      },
      actions: [clear()]
    });
    testList({
      array: [[1, '2', '3', '4']],
      expected: {
        array: [],
        returnValue: true,
        defaultValue: 0,
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 0,
          oldItems: [1, '2', '3', '4'],
          shiftIndex: 0
        }]
      },
      actions: [clear()]
    });
  });
  it('toArray', function () {
    function toArray(start, end) {
      var _context14;

      return {
        actions: [function (list) {
          return list.toArray(start, end);
        }, function (list) {
          var result = [];
          list.copyTo(result, null, start, end);
          return result;
        }],
        description: (0, _concat.default)(_context14 = "toArray(".concat(start, ", ")).call(_context14, end, ")\n")
      };
    }

    testList({
      array: [[]],
      expected: {
        array: [],
        returnValue: [],
        defaultValue: null
      },
      actions: [toArray()]
    });
    testList({
      array: [['0']],
      expected: {
        array: ['0'],
        returnValue: ['0'],
        defaultValue: null
      },
      actions: [toArray()]
    });
    testList({
      array: [['0', '1']],
      expected: {
        array: ['0', '1'],
        returnValue: ['0'],
        defaultValue: null
      },
      actions: [toArray(0, 1), toArray(null, 1), toArray(-2, 1), toArray(-2, -2)]
    });
    testList({
      array: [['0', '1']],
      expected: {
        array: ['0', '1'],
        returnValue: ['1'],
        defaultValue: null
      },
      actions: [toArray(1, 2), toArray(-1, 2), toArray(1, -1), toArray(-1, -1)]
    });
    testList({
      array: [['0', '1', '2', '3']],
      expected: {
        array: ['0', '1', '2', '3'],
        returnValue: ['1', '2'],
        defaultValue: null
      },
      actions: [toArray(1, 3), toArray(-3, 3), toArray(1, -2), toArray(-3, -2)]
    });
  });
  it('copyTo', function () {
    function copyTo(result, destArray, destIndex, start, end) {
      var _context15, _context16, _context17;

      return {
        actions: [function (list) {
          _TestList.assert.strictEqual(list.copyTo(destArray, destIndex, start, end), result);

          return destArray;
        }],
        description: (0, _concat.default)(_context15 = (0, _concat.default)(_context16 = (0, _concat.default)(_context17 = "copyTo(".concat((0, _stringify.default)(destArray), ", ")).call(_context17, destIndex, ", ")).call(_context16, start, ", ")).call(_context15, end, ")\n")
      };
    }

    testList({
      array: [[]],
      expected: {
        array: [],
        returnValue: [],
        defaultValue: null
      },
      actions: [copyTo(false, [])]
    });
    testList({
      array: [[]],
      expected: {
        error: [Error, _Assert.AssertionError],
        returnValue: null,
        defaultValue: null
      },
      actions: [copyTo(false, [], null, -1), copyTo(false, [], null, null, 1)]
    });
    testList({
      array: [['0']],
      expected: {
        error: Error,
        returnValue: null,
        defaultValue: null
      },
      actions: [copyTo(false, [], null, -2), copyTo(false, [], null, null, 2)]
    });
    testList({
      array: [['0', '1', '2']],
      expected: {
        error: [Error, _Assert.AssertionError],
        returnValue: ['0', '1'],
        defaultValue: null
      },
      actions: [copyTo(false, [], null, null, 2), copyTo(false, [], null, 0, 2), copyTo(false, [], null, -3, 2), copyTo(false, [], null, -3, -2)]
    });
    testList({
      array: [['0', '1', '2']],
      expected: {
        error: [Error, _Assert.AssertionError],
        returnValue: ['1', '2'],
        defaultValue: null
      },
      actions: [copyTo(false, [], null, 1, null), copyTo(false, [], null, 1, 2), copyTo(false, [], null, -2, null), copyTo(false, [], null, -2, -1)]
    });
    testList({
      array: [['0', '1', '2']],
      expected: {
        error: [Error, _Assert.AssertionError],
        returnValue: ['0', '1', '2', '1', '2'],
        defaultValue: null
      },
      actions: [copyTo(false, ['0', '1', '2', '3'], 3, 1, null)]
    });
  });
  it('indexOf', function () {
    testList({
      array: [['b', 'd', 'f', 'h', 'j', 'l']],
      compare: [function (o1, o2) {
        return (0, _compare.compareFast)(o1 + '', o2 + '');
      }],
      expected: {
        array: ['b', 'd', 'f', 'h', 'j', 'l'],
        returnValue: ~6,
        defaultValue: null
      },
      actions: [function (list) {
        return (0, _indexOf.default)(list).call(list, 'a');
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, 'a', 0);
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, 'a', 0, 1);
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, 'a', 0, 1, -1);
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, 'a', 0, 1, 1);
      }]
    });
    testList({
      array: [[]],
      expected: {
        error: Error,
        returnValue: null,
        defaultValue: null
      },
      actions: [function (list) {
        return (0, _indexOf.default)(list).call(list, 'a', -1);
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, 'a', null, 1);
      }]
    });
    testList({
      array: [[false]],
      autoSort: [true],
      expected: {
        array: [false],
        returnValue: -2,
        defaultValue: false
      },
      actions: [function (list) {
        return (0, _indexOf.default)(list).call(list, 'true');
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, []);
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, {});
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, function () {
          return 0;
        });
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, NaN);
      }]
    });
    testList({
      array: [['b', 'd', 'd', 'd', 'd', 'd', 'j', 'l']],
      compare: [function (o1, o2) {
        return (0, _compare.compareFast)(o1 + '', o2 + '');
      }],
      notAddIfExists: [false],
      expected: {
        array: ['b', 'd', 'd', 'd', 'd', 'd', 'j', 'l'],
        returnValue: 1,
        defaultValue: null
      },
      actions: [function (list) {
        return (0, _indexOf.default)(list).call(list, 'd');
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, 'd', 1);
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, 'd', 1, 2);
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, 'd', 1, 8, -1);
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, 'd', null, 2, 1);
      }]
    });
    testList({
      array: [['b', 'd', 'd', 'd', 'd', 'd', 'j', 'l']],
      compare: [function (o1, o2) {
        return (0, _compare.compareFast)(o1 + '', o2 + '');
      }],
      notAddIfExists: [false],
      expected: {
        array: ['b', 'd', 'd', 'd', 'd', 'd', 'j', 'l'],
        returnValue: 5,
        defaultValue: null
      },
      actions: [function (list) {
        return (0, _indexOf.default)(list).call(list, 'd', 5);
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, 'd', 5, 6);
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, 'd', 5, 8, 1);
      }, function (list) {
        return (0, _indexOf.default)(list).call(list, 'd', null, null, 1);
      }]
    });
  });
  it('move', function () {
    function move(oldIndex, newIndex) {
      var _context18;

      return {
        actions: [function (list) {
          return list.move(oldIndex, newIndex);
        }, function (list) {
          return list.moveRange(oldIndex, oldIndex + 1, newIndex);
        }],
        description: (0, _concat.default)(_context18 = "move(".concat(oldIndex, ", ")).call(_context18, newIndex, ")\n")
      };
    }

    testList({
      array: [[]],
      expected: {
        array: [],
        returnValue: false,
        defaultValue: null
      },
      actions: [move(-1, -1), move(-2, -2), move(2, 2), move(10, 10)]
    });
    testList({
      array: [[]],
      expected: {
        error: Error,
        returnValue: false,
        defaultValue: null
      },
      actions: [move(-1, 1), move(-2, 1), move(0, 2), move(0, -3)]
    });
    testList({
      array: [['0']],
      expected: {
        array: ['0'],
        returnValue: false,
        defaultValue: null
      },
      actions: [move(0, 0), move(-1, -1)]
    });
    testList({
      array: [['0', '1', '2', '3', '4']],
      expected: {
        array: ['0', '3', '1', '2', '4'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Moved,
          index: 3,
          moveIndex: 1,
          moveSize: 1
        }]
      },
      actions: [move(3, 1), move(-2, -4)]
    });
    testList({
      array: [['0', '1', '2', '3', '4']],
      expected: {
        array: ['0', '2', '3', '1', '4'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Moved,
          index: 1,
          moveIndex: 3,
          moveSize: 1
        }]
      },
      actions: [move(1, 3), move(-4, -2)]
    });
  });
  it('moveRange', function () {
    function moveRange(start, end, moveIndex) {
      var _context19, _context20;

      return {
        actions: [function (list) {
          return list.moveRange(start, end, moveIndex);
        }],
        description: (0, _concat.default)(_context19 = (0, _concat.default)(_context20 = "move(".concat(start, ", ")).call(_context20, end, ", ")).call(_context19, moveIndex, ")\n")
      };
    }

    testList({
      array: [[]],
      expected: {
        array: [],
        returnValue: false,
        defaultValue: null
      },
      actions: [moveRange(0, 0, 0), moveRange(10, -10, 10)]
    });
    testList({
      array: [[0, 1, 2, 3, 4, 5, 6, 7, 8]],
      expected: {
        array: [0, 5, 6, 1, 2, 3, 4, 7, 8],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Moved,
          index: 1,
          moveIndex: 3,
          moveSize: 4
        }]
      },
      actions: [moveRange(1, 5, 3)]
    });
    testList({
      array: [[0, 1, 2, 3, 4, 5, 6, 7, 8]],
      expected: {
        array: [0, 3, 4, 5, 6, 1, 2, 7, 8],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Moved,
          index: 3,
          moveIndex: 1,
          moveSize: 4
        }]
      },
      actions: [moveRange(3, 7, 1)]
    });
    testList({
      array: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
      expected: {
        array: [0, 8, 9, 1, 2, 3, 4, 5, 6, 7],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Moved,
          index: 1,
          moveIndex: 3,
          moveSize: 7
        }]
      },
      actions: [moveRange(1, 8, 3)]
    });
    testList({
      array: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
      expected: {
        array: [0, 3, 4, 5, 6, 7, 8, 9, 1, 2],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Moved,
          index: 3,
          moveIndex: 1,
          moveSize: 7
        }]
      },
      actions: [moveRange(3, 10, 1)]
    });
    testList({
      array: [[0, 1, 2, 3]],
      expected: {
        array: [0, 3, 1, 2],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Moved,
          index: 1,
          moveIndex: 2,
          moveSize: 2
        }]
      },
      actions: [moveRange(1, 3, 2), moveRange(1, 3, 3), moveRange(1, 3, -2), moveRange(1, 3, -1)]
    });
    testList({
      array: [[0, 1, 2, 3]],
      expected: {
        array: [0, 1, 2, 3],
        returnValue: false,
        defaultValue: null
      },
      actions: [moveRange(1, 3, 1), moveRange(1, 3, -3), moveRange(0, 4, 2), moveRange(0, 4, 3), moveRange(0, 4, -1)]
    });
  });
  it('sort', function () {
    function sort() {
      return {
        actions: [function (list) {
          return (0, _sort.default)(list).call(list);
        }, function (list) {
          return list.reSort();
        }],
        description: 'sort()\n'
      };
    }

    testList({
      array: [['2', '1', '3']],
      expected: {
        array: ['1', '2', '3'],
        returnValue: true,
        defaultValue: null,
        countSorted: 3,
        listChanged: [{
          type: _IListChanged.ListChangedType.Resorted
        }]
      },
      actions: [sort()]
    });
    testList({
      array: [['2', '1', '3']],
      expected: {
        array: ['1', '2', '3'],
        returnValue: true,
        defaultValue: null,
        countSorted: 3,
        propertyChanged: [{
          name: 'autoSort',
          oldValue: false,
          newValue: true
        }, {
          name: 'autoSort',
          oldValue: true,
          newValue: false
        }],
        listChanged: [{
          type: _IListChanged.ListChangedType.Resorted
        }]
      },
      actions: [function (list) {
        var countSorted = list.countSorted;
        list.autoSort = true;
        list.autoSort = false;
        return list.countSorted !== countSorted;
      }]
    });
  });
  it('reSort', function () {
    function reSort() {
      return {
        actions: [function (list) {
          return list.reSort();
        }],
        description: 'reSort()\n'
      };
    }

    testList({
      array: [['1', '2', '3']],
      countSorted: [undefined, 0],
      autoSort: [true],
      expected: {
        array: ['1', '2', '3'],
        returnValue: false,
        defaultValue: null
      },
      actions: [reSort()]
    });
    testList({
      array: [['1', '2', '3']],
      countSorted: [1, 2, 3],
      autoSort: [true],
      expected: {
        array: ['1', '2', '3'],
        returnValue: true,
        defaultValue: null,
        listChanged: [{
          type: _IListChanged.ListChangedType.Resorted
        }]
      },
      actions: [reSort()]
    });
    testList({
      array: [['1']],
      autoSort: [true],
      expected: {
        array: ['1'],
        returnValue: false,
        defaultValue: null
      },
      actions: [reSort()]
    });
  });
  it('removeDuplicates', function () {
    function removeDuplicates(withoutShift) {
      return {
        actions: [function (list) {
          return list.removeDuplicates(withoutShift);
        }],
        description: "removeDuplicates(".concat(withoutShift, ")\n")
      };
    }

    testList({
      array: [['2', '1', '2', '3', '4', '2']],
      expected: {
        array: ['2', '1', '3', '4'],
        returnValue: 2,
        defaultValue: null,
        propertyChanged: [{
          name: 'size',
          oldValue: 6,
          newValue: 5
        }, {
          name: 'size',
          oldValue: 5,
          newValue: 4
        }],
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 5,
          oldItems: ['2'],
          shiftIndex: 5
        }, {
          type: _IListChanged.ListChangedType.Removed,
          index: 2,
          oldItems: ['2'],
          shiftIndex: 3
        }]
      },
      actions: [removeDuplicates(), removeDuplicates(false)]
    });
    testList({
      array: [['2', '1', '2', '3', '4', '2']],
      expected: {
        array: ['2', '1', '4', '3'],
        returnValue: 2,
        defaultValue: null,
        propertyChanged: [{
          name: 'size',
          oldValue: 6,
          newValue: 5
        }, {
          name: 'size',
          oldValue: 5,
          newValue: 4
        }],
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 5,
          oldItems: ['2'],
          shiftIndex: 5
        }, {
          type: _IListChanged.ListChangedType.Removed,
          index: 2,
          oldItems: ['2'],
          shiftIndex: 4
        }]
      },
      actions: [removeDuplicates(true)]
    });
    testList({
      // '1', '2', '2', '2', '3', '4'
      array: [['2', '1', '2', '3', '4', '2']],
      autoSort: [true],
      expected: {
        array: ['1', '2', '3', '4'],
        returnValue: 2,
        defaultValue: null,
        propertyChanged: [{
          name: 'size',
          oldValue: 6,
          newValue: 5
        }, {
          name: 'size',
          oldValue: 5,
          newValue: 4
        }],
        listChanged: [{
          type: _IListChanged.ListChangedType.Removed,
          index: 3,
          oldItems: ['2'],
          shiftIndex: 4
        }, {
          type: _IListChanged.ListChangedType.Removed,
          index: 2,
          oldItems: ['2'],
          shiftIndex: 3
        }]
      },
      actions: [removeDuplicates(true)]
    });
  });
});