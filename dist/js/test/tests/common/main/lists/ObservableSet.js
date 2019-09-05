"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _ISetChanged = require("../../../../../main/common/lists/contracts/ISetChanged");

var _ObservableSet = require("../../../../../main/common/lists/ObservableSet");

var _TestVariants = require("../src/helpers/TestVariants");

var _common = require("./src/helpers/common");

var _TestSet = require("./src/helpers/TestSet");

describe('common > main > lists > ObservableSet', function () {
  this.timeout(20000);
  var testSet = _TestSet.TestSet.test;
  after(function () {
    console.log('Total Set tests >= ' + _TestSet.TestSet.totalSetTests);
  });
  it('constructor', function () {
    var set;
    set = new _ObservableSet.ObservableSet();

    _TestSet.assert.strictEqual(set.size, 0);
  });
  it('add', function () {
    function addArray(list, array) {
      var result = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator2.default)(array), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
        description: "add(".concat((0, _stringify.default)(item), ")\n")
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
    var allValuesShuffle = (0, _common.shuffle)(_common.allValues);
    testSet({
      array: [[]],
      innerSet: ['Set', 'Set<Object>', 'ArraySet'],
      expected: {
        array: _common.allValues,
        returnValue: _TestVariants.THIS,
        propertyChanged: (0, _map.default)(allValuesShuffle).call(allValuesShuffle, function (o, i) {
          return {
            name: 'size',
            oldValue: i,
            newValue: i + 1
          };
        }),
        setChanged: (0, _map.default)(allValuesShuffle).call(allValuesShuffle, function (o, i) {
          return {
            type: _ISetChanged.SetChangedType.Added,
            newItems: [o]
          };
        })
      },
      actions: [function (list) {
        return addArray(list, (0, _concat.default)(allValuesShuffle).call(allValuesShuffle, allValuesShuffle));
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
        description: "delete(".concat((0, _stringify.default)(item), ")\n")
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
    var allValuesShuffle = (0, _common.shuffle)(_common.allValues);
    var additional = [[[], {}], [{}, []]];
    testSet({
      array: [(0, _concat.default)(allValuesShuffle).call(allValuesShuffle, additional)],
      innerSet: ['Set', 'Set<Object>', 'ArraySet'],
      expected: {
        array: additional,
        returnValue: true,
        propertyChanged: (0, _map.default)(allValuesShuffle).call(allValuesShuffle, function (o, i) {
          return {
            name: 'size',
            oldValue: allValuesShuffle.length - i + 2,
            newValue: allValuesShuffle.length - i + 1
          };
        }),
        setChanged: (0, _map.default)(allValuesShuffle).call(allValuesShuffle, function (o, i) {
          return {
            type: _ISetChanged.SetChangedType.Removed,
            oldItems: [o]
          };
        })
      },
      actions: [function (list) {
        return removeArray(list, (0, _concat.default)(allValuesShuffle).call(allValuesShuffle, allValuesShuffle));
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