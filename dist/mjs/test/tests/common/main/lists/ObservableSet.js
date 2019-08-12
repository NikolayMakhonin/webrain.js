import { SetChangedType } from '../../../../../main/common/lists/contracts/ISetChanged';
import { ObservableSet } from '../../../../../main/common/lists/ObservableSet';
import { THIS } from '../src/helpers/TestVariants';
import { allValues, shuffle } from './src/helpers/common';
import { assert, TestSet } from './src/helpers/TestSet';
describe('common > main > lists > ObservableSet', function () {
  this.timeout(20000);
  var testSet = TestSet.test;
  after(function () {
    console.log('Total Set tests >= ' + TestSet.totalSetTests);
  });
  it('constructor', function () {
    var set;
    set = new ObservableSet();
    assert.strictEqual(set.size, 0);
  });
  it('add', function () {
    function addArray(list, array) {
      var result = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;
          result = list.add(item) || result;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return result;
    }

    function add(item) {
      return {
        actions: [function (list) {
          return list.add(item);
        }],
        description: "add(".concat(JSON.stringify(item), ")\n")
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
    var allValuesShuffle = shuffle(allValues);
    testSet({
      array: [[]],
      innerSet: ['Set', 'Set<Object>', 'ArraySet'],
      expected: {
        array: allValues,
        returnValue: THIS,
        propertyChanged: allValuesShuffle.map(function (o, i) {
          return {
            name: 'size',
            oldValue: i,
            newValue: i + 1
          };
        }),
        setChanged: allValuesShuffle.map(function (o, i) {
          return {
            type: SetChangedType.Added,
            newItems: [o]
          };
        })
      },
      actions: [function (list) {
        return addArray(list, allValuesShuffle.concat(allValuesShuffle));
      }]
    });
  });
  it('delete', function () {
    function removeArray(list, array) {
      var result = false;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = array[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var item = _step2.value;
          result = list.delete(item) || result;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return result;
    }

    function remove(item) {
      return {
        actions: [function (list) {
          return list.delete(item);
        }],
        description: "delete(".concat(JSON.stringify(item), ")\n")
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
    var allValuesShuffle = shuffle(allValues);
    var additional = [[[], {}], [{}, []]];
    testSet({
      array: [allValuesShuffle.concat(additional)],
      innerSet: ['Set', 'Set<Object>', 'ArraySet'],
      expected: {
        array: additional,
        returnValue: true,
        propertyChanged: allValuesShuffle.map(function (o, i) {
          return {
            name: 'size',
            oldValue: allValuesShuffle.length - i + 2,
            newValue: allValuesShuffle.length - i + 1
          };
        }),
        setChanged: allValuesShuffle.map(function (o, i) {
          return {
            type: SetChangedType.Removed,
            oldItems: [o]
          };
        })
      },
      actions: [function (list) {
        return removeArray(list, allValuesShuffle.concat(allValuesShuffle));
      }]
    });
  });
  it('clear', function () {
    function clear() {
      return {
        actions: [function (list) {
          return list.clear();
        }],
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