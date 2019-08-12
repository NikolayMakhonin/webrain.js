"use strict";

var _IMapChanged = require("../../../../../main/common/lists/contracts/IMapChanged");

var _ObservableMap = require("../../../../../main/common/lists/ObservableMap");

var _TestVariants = require("../src/helpers/TestVariants");

var _common = require("./src/helpers/common");

var _TestMap = require("./src/helpers/TestMap");

describe('common > main > lists > ObservableMap', function () {
  this.timeout(20000);
  const testMap = _TestMap.TestMap.test;
  after(function () {
    console.log('Total Map tests >= ' + _TestMap.TestMap.totalMapTests);
  });
  it('constructor', function () {
    let map;
    map = new _ObservableMap.ObservableMap();

    _TestMap.assert.strictEqual(map.size, 0);
  });
  it('set', function () {
    function setArray(list, array) {
      let result = false;

      for (const item of array) {
        result = list.set(...item) || result;
      }

      return result;
    }

    function set(key, value) {
      return {
        actions: [list => list.set(key, value)],
        description: `set(${JSON.stringify(key)}, ${JSON.stringify(value)})\n`
      };
    }

    testMap({
      array: [[]],
      expected: {
        array: [['0', '1']],
        returnValue: _TestVariants.THIS,
        mapChanged: [{
          type: _IMapChanged.MapChangedType.Added,
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
        returnValue: _TestVariants.THIS,
        mapChanged: [{
          type: _IMapChanged.MapChangedType.Set,
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
        returnValue: _TestVariants.THIS,
        mapChanged: [{
          type: _IMapChanged.MapChangedType.Added,
          key: '2',
          newValue: '3'
        }]
      },
      actions: [set('2', '3')]
    });

    const entries = _common.allValues.map((o, i) => [o, _common.allValues[_common.allValues.length - 1 - i]]);

    const entriesShuffle = (0, _common.shuffle)(entries);
    testMap({
      array: [[]],
      innerMap: ['Map', 'Map<Object>', 'ObjectHashMap', 'ArrayMap'],
      expected: {
        array: entries,
        returnValue: _TestVariants.THIS,
        propertyChanged: entriesShuffle.map((o, i) => ({
          name: 'size',
          oldValue: i,
          newValue: i + 1
        })),
        mapChanged: entriesShuffle.map((o, i) => ({
          type: _IMapChanged.MapChangedType.Added,
          key: o[0],
          newValue: o[1]
        })).concat(entriesShuffle.map((o, i) => ({
          type: _IMapChanged.MapChangedType.Set,
          key: o[0],
          oldValue: o[1],
          newValue: o[1]
        })))
      },
      actions: [list => setArray(list, entriesShuffle.concat(entriesShuffle))]
    });
  });
  it('delete', function () {
    function removeArray(list, array) {
      let result = false;

      for (const key of array) {
        result = list.delete(key) || result;
      }

      return result;
    }

    function remove(key) {
      return {
        actions: [list => list.delete(key)],
        description: `delete(${JSON.stringify(key)})\n`
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
          type: _IMapChanged.MapChangedType.Removed,
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
          type: _IMapChanged.MapChangedType.Removed,
          key: '2',
          oldValue: '3'
        }]
      },
      actions: [remove('2')]
    });
    const keys = (0, _common.shuffle)(_common.allValues);
    const entries = keys.map((o, i) => [o, keys[keys.length - 1 - i]]);
    const additional = [[[], {}], [{}, []]];
    testMap({
      array: [entries.concat(additional)],
      innerMap: ['Map', 'Map<Object>', 'ObjectHashMap', 'ArrayMap'],
      expected: {
        array: additional,
        returnValue: true,
        propertyChanged: keys.map((o, i) => ({
          name: 'size',
          oldValue: keys.length - i + 2,
          newValue: keys.length - i + 1
        })),
        mapChanged: entries.map((o, i) => ({
          type: _IMapChanged.MapChangedType.Removed,
          key: o[0],
          oldValue: o[1]
        }))
      },
      actions: [list => removeArray(list, keys.concat(keys))]
    });
  });
  it('clear', function () {
    function clear() {
      return {
        actions: [list => list.clear()],
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
          type: _IMapChanged.MapChangedType.Removed,
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
          type: _IMapChanged.MapChangedType.Removed,
          key: '0',
          oldValue: '1'
        }, {
          type: _IMapChanged.MapChangedType.Removed,
          key: '2',
          oldValue: '3'
        }]
      },
      actions: [clear()]
    });
  });
});