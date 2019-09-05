"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/toConsumableArray"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _IMapChanged = require("../../../../../main/common/lists/contracts/IMapChanged");

var _ObservableMap = require("../../../../../main/common/lists/ObservableMap");

var _TestVariants = require("../src/helpers/TestVariants");

var _common = require("./src/helpers/common");

var _TestMap = require("./src/helpers/TestMap");

describe('common > main > lists > ObservableMap', function () {
  this.timeout(20000);
  var testMap = _TestMap.TestMap.test;
  after(function () {
    console.log('Total Map tests >= ' + _TestMap.TestMap.totalMapTests);
  });
  it('constructor', function () {
    var map;
    map = new _ObservableMap.ObservableMap();

    _TestMap.assert.strictEqual(map.size, 0);
  });
  it('set', function () {
    var _context2;

    function setArray(list, array) {
      var result = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator2.default)(array), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;
          result = list.set.apply(list, (0, _toConsumableArray2.default)(item)) || result;
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

    function set(key, value) {
      var _context;

      return {
        actions: [function (list) {
          return list.set(key, value);
        }],
        description: (0, _concat.default)(_context = "set(".concat((0, _stringify.default)(key), ", ")).call(_context, (0, _stringify.default)(value), ")\n")
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
    var entries = (0, _map.default)(_common.allValues).call(_common.allValues, function (o, i) {
      return [o, _common.allValues[_common.allValues.length - 1 - i]];
    });
    var entriesShuffle = (0, _common.shuffle)(entries);
    testMap({
      array: [[]],
      innerMap: ['Map', 'Map<Object>', 'ObjectHashMap', 'ArrayMap'],
      expected: {
        array: entries,
        returnValue: _TestVariants.THIS,
        propertyChanged: (0, _map.default)(entriesShuffle).call(entriesShuffle, function (o, i) {
          return {
            name: 'size',
            oldValue: i,
            newValue: i + 1
          };
        }),
        mapChanged: (0, _concat.default)(_context2 = (0, _map.default)(entriesShuffle).call(entriesShuffle, function (o, i) {
          return {
            type: _IMapChanged.MapChangedType.Added,
            key: o[0],
            newValue: o[1]
          };
        })).call(_context2, (0, _map.default)(entriesShuffle).call(entriesShuffle, function (o, i) {
          return {
            type: _IMapChanged.MapChangedType.Set,
            key: o[0],
            oldValue: o[1],
            newValue: o[1]
          };
        }))
      },
      actions: [function (list) {
        return setArray(list, (0, _concat.default)(entriesShuffle).call(entriesShuffle, entriesShuffle));
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
        for (var _iterator2 = (0, _getIterator2.default)(array), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;
          result = list.delete(key) || result;
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

    function remove(key) {
      return {
        actions: [function (list) {
          return list.delete(key);
        }],
        description: "delete(".concat((0, _stringify.default)(key), ")\n")
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
    var keys = (0, _common.shuffle)(_common.allValues);
    var entries = (0, _map.default)(keys).call(keys, function (o, i) {
      return [o, keys[keys.length - 1 - i]];
    });
    var additional = [[[], {}], [{}, []]];
    testMap({
      array: [(0, _concat.default)(entries).call(entries, additional)],
      innerMap: ['Map', 'Map<Object>', 'ObjectHashMap', 'ArrayMap'],
      expected: {
        array: additional,
        returnValue: true,
        propertyChanged: (0, _map.default)(keys).call(keys, function (o, i) {
          return {
            name: 'size',
            oldValue: keys.length - i + 2,
            newValue: keys.length - i + 1
          };
        }),
        mapChanged: (0, _map.default)(entries).call(entries, function (o, i) {
          return {
            type: _IMapChanged.MapChangedType.Removed,
            key: o[0],
            oldValue: o[1]
          };
        })
      },
      actions: [function (list) {
        return removeArray(list, (0, _concat.default)(keys).call(keys, keys));
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