import { SetChangedType } from '../../../../../main/common/lists/contracts/ISetChanged';
import { ObservableSet } from '../../../../../main/common/lists/ObservableSet';
import { describe, it } from '../../../../../main/common/test/Mocha';
import { THIS } from '../src/helpers/TestVariants';
import { allValues, shuffle } from './src/helpers/common';
import { assert, TestSet } from './src/helpers/TestSet';
describe('common > main > lists > ObservableSet', function () {
  this.timeout(20000);
  const testSet = TestSet.test;
  after(function () {
    console.log('Total Set tests >= ' + TestSet.totalSetTests);
  });
  it('constructor', function () {
    let set;
    set = new ObservableSet();
    assert.strictEqual(set.size, 0);
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
        returnValue: THIS,
        setChanged: [{
          type: SetChangedType.Added,
          newItems: ['0']
        }]
      },
      actions: [add('0')]
    });
    testSet({
      array: [['0']],
      expected: {
        array: ['0'],
        returnValue: THIS
      },
      actions: [add('0')]
    });
    testSet({
      array: [['0']],
      expected: {
        array: ['0', '1'],
        returnValue: THIS,
        setChanged: [{
          type: SetChangedType.Added,
          newItems: ['1']
        }]
      },
      actions: [add('1')]
    });
    const allValuesShuffle = shuffle(allValues);
    testSet({
      array: [[]],
      innerSet: ['Set', 'Set<Object>', 'ArraySet'],
      expected: {
        array: allValues,
        returnValue: THIS,
        propertyChanged: allValuesShuffle.map((o, i) => ({
          name: 'size',
          oldValue: i,
          newValue: i + 1
        })),
        setChanged: allValuesShuffle.map((o, i) => ({
          type: SetChangedType.Added,
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
          type: SetChangedType.Removed,
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
          type: SetChangedType.Removed,
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
          type: SetChangedType.Removed,
          oldItems: ['2']
        }]
      },
      actions: [remove('2')]
    });
    const allValuesShuffle = shuffle(allValues);
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
          type: SetChangedType.Removed,
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
          type: SetChangedType.Removed,
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
          type: SetChangedType.Removed,
          oldItems: ['0', '1']
        }]
      },
      actions: [clear()]
    });
  });
});