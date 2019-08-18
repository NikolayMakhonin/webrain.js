import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import { MapChangedType } from '../../../../../main/common/lists/contracts/IMapChanged';
import { ObservableMap } from '../../../../../main/common/lists/ObservableMap';
import { THIS } from '../src/helpers/TestVariants';
import { allValues, shuffle } from './src/helpers/common';
import { assert, TestMap } from './src/helpers/TestMap';
describe('common > main > lists > ObservableMap', function () {
  this.timeout(20000);
  var testMap = TestMap.test;
  after(function () {
    console.log('Total Map tests >= ' + TestMap.totalMapTests);
  });
  it('constructor', function () {
    var map;
    map = new ObservableMap();
    assert.strictEqual(map.size, 0);
  });
  it('set', function () {
    function setArray(list, array) {
      var result = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;
          result = list.set.apply(list, _toConsumableArray(item)) || result;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return result;
    }

    function set(key, value) {
      return {
        actions: [function (list) {
          return list.set(key, value);
        }],
        description: "set(".concat(JSON.stringify(key), ", ").concat(JSON.stringify(value), ")\n")
      };
    }

    testMap({
      array: [[]],
      expected: {
        array: [['0', '1']],
        returnValue: THIS,
        mapChanged: [{
          type: MapChangedType.Added,
          key: '0',
          newValue: '1'
        }]
      },
      actions: [set('0', '1')]
    });
    testMap({
      array: [[['0', '1']]],
      expected: {
        array: [['0', '2']],
        returnValue: THIS,
        mapChanged: [{
          type: MapChangedType.Set,
          key: '0',
          oldValue: '1',
          newValue: '2'
        }]
      },
      actions: [set('0', '2')]
    });
    testMap({
      array: [[['0', '1']]],
      expected: {
        array: [['0', '1'], ['2', '3']],
        returnValue: THIS,
        mapChanged: [{
          type: MapChangedType.Added,
          key: '2',
          newValue: '3'
        }]
      },
      actions: [set('2', '3')]
    });
    var entries = allValues.map(function (o, i) {
      return [o, allValues[allValues.length - 1 - i]];
    });
    var entriesShuffle = shuffle(entries);
    testMap({
      array: [[]],
      innerMap: ['Map', 'Map<Object>', 'ObjectHashMap', 'ArrayMap'],
      expected: {
        array: entries,
        returnValue: THIS,
        propertyChanged: entriesShuffle.map(function (o, i) {
          return {
            name: 'size',
            oldValue: i,
            newValue: i + 1
          };
        }),
        mapChanged: entriesShuffle.map(function (o, i) {
          return {
            type: MapChangedType.Added,
            key: o[0],
            newValue: o[1]
          };
        }).concat(entriesShuffle.map(function (o, i) {
          return {
            type: MapChangedType.Set,
            key: o[0],
            oldValue: o[1],
            newValue: o[1]
          };
        }))
      },
      actions: [function (list) {
        return setArray(list, entriesShuffle.concat(entriesShuffle));
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
          var key = _step2.value;
          result = list["delete"](key) || result;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return result;
    }

    function remove(key) {
      return {
        actions: [function (list) {
          return list["delete"](key);
        }],
        description: "delete(".concat(JSON.stringify(key), ")\n")
      };
    }

    testMap({
      array: [[]],
      expected: {
        array: [],
        returnValue: false
      },
      actions: [remove('0')]
    });
    testMap({
      array: [[['0', '1']]],
      expected: {
        array: [],
        returnValue: true,
        mapChanged: [{
          type: MapChangedType.Removed,
          key: '0',
          oldValue: '1'
        }]
      },
      actions: [remove('0')]
    });
    testMap({
      array: [[['2', '3'], ['1', '4']]],
      expected: {
        array: [['1', '4']],
        returnValue: true,
        mapChanged: [{
          type: MapChangedType.Removed,
          key: '2',
          oldValue: '3'
        }]
      },
      actions: [remove('2')]
    });
    var keys = shuffle(allValues);
    var entries = keys.map(function (o, i) {
      return [o, keys[keys.length - 1 - i]];
    });
    var additional = [[[], {}], [{}, []]];
    testMap({
      array: [entries.concat(additional)],
      innerMap: ['Map', 'Map<Object>', 'ObjectHashMap', 'ArrayMap'],
      expected: {
        array: additional,
        returnValue: true,
        propertyChanged: keys.map(function (o, i) {
          return {
            name: 'size',
            oldValue: keys.length - i + 2,
            newValue: keys.length - i + 1
          };
        }),
        mapChanged: entries.map(function (o, i) {
          return {
            type: MapChangedType.Removed,
            key: o[0],
            oldValue: o[1]
          };
        })
      },
      actions: [function (list) {
        return removeArray(list, keys.concat(keys));
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

    testMap({
      array: [[]],
      expected: {
        array: [],
        returnValue: undefined
      },
      actions: [clear()]
    });
    testMap({
      array: [[['0', '1']]],
      expected: {
        array: [],
        returnValue: undefined,
        mapChanged: [{
          type: MapChangedType.Removed,
          key: '0',
          oldValue: '1'
        }]
      },
      actions: [clear()]
    });
    testMap({
      array: [[['0', '1'], ['2', '3']]],
      expected: {
        array: [],
        returnValue: undefined,
        mapChanged: [{
          type: MapChangedType.Removed,
          key: '0',
          oldValue: '1'
        }, {
          type: MapChangedType.Removed,
          key: '2',
          oldValue: '3'
        }]
      },
      actions: [clear()]
    });
  });
});