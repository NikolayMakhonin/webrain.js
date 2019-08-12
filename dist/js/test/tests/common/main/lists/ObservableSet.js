"use strict";

var _ISetChanged = require("../../../../../main/common/lists/contracts/ISetChanged");

var _ObservableSet = require("../../../../../main/common/lists/ObservableSet");

var _TestVariants = require("../src/helpers/TestVariants");

var _common = require("./src/helpers/common");

var _TestSet = require("./src/helpers/TestSet");

describe('common > main > lists > ObservableSet', function () {
  this.timeout(20000);
  const testSet = _TestSet.TestSet.test;
  after(function () {
    console.log('Total Set tests >= ' + _TestSet.TestSet.totalSetTests);
  });
  it('constructor', function () {
    let set;
    set = new _ObservableSet.ObservableSet();

    _TestSet.assert.strictEqual(set.size, 0);
  });
  it('add', function () {
    function addArray(list, array) {
      let result = false;

      for (const item of array) {
        result = list.add(item) || result;
      }

      return result;
    }

    function add(item) {
      return {
        actions: [list => list.add(item)],
        description: `add(${JSON.stringify(item)})\n`
      };
    }

    testSet({
      array: [[]],
      expected: {
        array: ['0'],
        returnValue: _TestVariants.THIS,
        setChanged: [{
          type: _ISetChanged.SetChangedType.Added,
          newItems: ['0']
        }]
      },
      actions: [add('0')]
    });
    testSet({
      array: [['0']],
      expected: {
        array: ['0'],
        returnValue: _TestVariants.THIS
      },
      actions: [add('0')]
    });
    testSet({
      array: [['0']],
      expected: {
        array: ['0', '1'],
        returnValue: _TestVariants.THIS,
        setChanged: [{
          type: _ISetChanged.SetChangedType.Added,
          newItems: ['1']
        }]
      },
      actions: [add('1')]
    });
    const allValuesShuffle = (0, _common.shuffle)(_common.allValues);
    testSet({
      array: [[]],
      innerSet: ['Set', 'Set<Object>', 'ArraySet'],
      expected: {
        array: _common.allValues,
        returnValue: _TestVariants.THIS,
        propertyChanged: allValuesShuffle.map((o, i) => ({
          name: 'size',
          oldValue: i,
          newValue: i + 1
        })),
        setChanged: allValuesShuffle.map((o, i) => ({
          type: _ISetChanged.SetChangedType.Added,
          newItems: [o]
        }))
      },
      actions: [list => addArray(list, allValuesShuffle.concat(allValuesShuffle))]
    });
  });
  it('delete', function () {
    function removeArray(list, array) {
      let result = false;

      for (const item of array) {
        result = list.delete(item) || result;
      }

      return result;
    }

    function remove(item) {
      return {
        actions: [list => list.delete(item)],
        description: `delete(${JSON.stringify(item)})\n`
      };
    }

    testSet({
      array: [[]],
      expected: {
        array: [],
        returnValue: false
      },
      actions: [remove('0')]
    });
    testSet({
      array: [['0']],
      expected: {
        array: [],
        returnValue: true,
        setChanged: [{
          type: _ISetChanged.SetChangedType.Removed,
          oldItems: ['0']
        }]
      },
      actions: [remove('0')]
    });
    testSet({
      array: [['2', '1']],
      expected: {
        array: ['1'],
        returnValue: true,
        setChanged: [{
          type: _ISetChanged.SetChangedType.Removed,
          oldItems: ['2']
        }]
      },
      actions: [remove('2')]
    });
    testSet({
      array: [['2', '1']],
      expected: {
        array: ['1'],
        returnValue: true,
        setChanged: [{
          type: _ISetChanged.SetChangedType.Removed,
          oldItems: ['2']
        }]
      },
      actions: [remove('2')]
    });
    const allValuesShuffle = (0, _common.shuffle)(_common.allValues);
    const additional = [[[], {}], [{}, []]];
    testSet({
      array: [allValuesShuffle.concat(additional)],
      innerSet: ['Set', 'Set<Object>', 'ArraySet'],
      expected: {
        array: additional,
        returnValue: true,
        propertyChanged: allValuesShuffle.map((o, i) => ({
          name: 'size',
          oldValue: allValuesShuffle.length - i + 2,
          newValue: allValuesShuffle.length - i + 1
        })),
        setChanged: allValuesShuffle.map((o, i) => ({
          type: _ISetChanged.SetChangedType.Removed,
          oldItems: [o]
        }))
      },
      actions: [list => removeArray(list, allValuesShuffle.concat(allValuesShuffle))]
    });
  });
  it('clear', function () {
    function clear() {
      return {
        actions: [list => list.clear()],
        description: 'clear()\n'
      };
    }

    testSet({
      array: [[]],
      expected: {
        array: [],
        returnValue: undefined
      },
      actions: [clear()]
    });
    testSet({
      array: [['0']],
      expected: {
        array: [],
        returnValue: undefined,
        setChanged: [{
          type: _ISetChanged.SetChangedType.Removed,
          oldItems: ['0']
        }]
      },
      actions: [clear()]
    });
    testSet({
      array: [['0', '1']],
      expected: {
        array: [],
        returnValue: undefined,
        setChanged: [{
          type: _ISetChanged.SetChangedType.Removed,
          oldItems: ['0', '1']
        }]
      },
      actions: [clear()]
    });
  });
});