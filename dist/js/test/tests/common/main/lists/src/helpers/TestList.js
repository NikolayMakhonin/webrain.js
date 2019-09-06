"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.applyListChangedToArray = applyListChangedToArray;
exports.TestList = exports.assert = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _serializers = require("../../../../../../../main/common/extensions/serialization/serializers");

var _IListChanged = require("../../../../../../../main/common/lists/contracts/IListChanged");

var _compare = require("../../../../../../../main/common/lists/helpers/compare");

var _SortedList = require("../../../../../../../main/common/lists/SortedList");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _DeepCloneEqual = require("../../../../../../../main/common/test/DeepCloneEqual");

var _TestVariants2 = require("../../../src/helpers/TestVariants");

var assert = new _Assert.Assert(new _DeepCloneEqual.DeepCloneEqual({
  commonOptions: {},
  equalOptions: {
    // noCrossReferences: true,
    equalInnerReferences: true,
    equalTypes: true,
    equalMapSetOrder: true,
    strictEqualFunctions: true
  }
}));
exports.assert = assert;

function applyListChangedToArray(event, array, compare) {
  var _spliceInstanceProper2, _context2;

  switch (event.type) {
    case _IListChanged.ListChangedType.Added:
      {
        var len = array.length;
        var shift = event.shiftIndex - event.index;

        for (var i = len - shift; i < len; i++) {
          array[i + shift] = array[i];
        }

        for (var _i = len - 1; _i >= event.shiftIndex; _i--) {
          array[_i] = array[_i - shift];
        }
      }

      for (var _i2 = 0; _i2 < event.newItems.length; _i2++) {
        array[event.index + _i2] = event.newItems[_i2];
      }

      break;

    case _IListChanged.ListChangedType.Removed:
      for (var _i3 = 0; _i3 < event.oldItems.length; _i3++) {
        assert.strictEqual(array[event.index + _i3], event.oldItems[_i3]);
      }

      for (var _i4 = event.shiftIndex; _i4 < array.length; _i4++) {
        array[event.index + _i4 - event.shiftIndex] = array[_i4];
      }

      array.length -= event.oldItems.length;
      break;

    case _IListChanged.ListChangedType.Set:
      assert.strictEqual(array[event.index], event.oldItems[0]);
      array[event.index] = event.newItems[0];

      if (event.moveIndex !== event.index) {
        var _spliceInstanceProper, _context;

        (_spliceInstanceProper = (0, _splice.default)(array)).call.apply(_spliceInstanceProper, (0, _concat.default)(_context = [array, event.moveIndex, 0]).call(_context, (0, _splice.default)(array).call(array, event.index, 1)));
      }

      break;

    case _IListChanged.ListChangedType.Moved:
      (_spliceInstanceProper2 = (0, _splice.default)(array)).call.apply(_spliceInstanceProper2, (0, _concat.default)(_context2 = [array, event.moveIndex, 0]).call(_context2, (0, _splice.default)(array).call(array, event.index, event.moveSize)));

      break;

    case _IListChanged.ListChangedType.Resorted:
      (0, _sort.default)(array).call(array, compare);
      break;
  }
}

function equalsWithNaN(o1, o2) {
  return o1 === o2 || o1 !== o1 && o2 !== o2;
}

function testSerialization(list) {
  var serialized = _serializers.ObjectSerializer.default.serialize(list);

  var result = _serializers.ObjectSerializer.default.deSerialize(serialized);

  assert.notStrictEqual(result, list);
  assert.strictEqual(!!result.autoSort, !!list.autoSort);
  assert.strictEqual(result.countSorted, list.countSorted);
  assert.strictEqual(result.minAllocatedSize, list.minAllocatedSize);
  assert.strictEqual(!!result.notAddIfExists, !!list.notAddIfExists);
  assert.strictEqual(result.size, list.size);
  assert.deepStrictEqual(result.toArray(), list.toArray());
}

function assertList(list, expectedArray) {
  assert.deepStrictEqual(list.toArray(), expectedArray);
  assert.strictEqual(list.size, expectedArray.length);
  assert.ok(list.allocatedSize >= expectedArray.length);

  for (var i = 0; i < expectedArray.length; i++) {
    assert.ok(equalsWithNaN(list.get(i), expectedArray[i]));
    assert.ok(equalsWithNaN(expectedArray[(0, _indexOf.default)(list).call(list, expectedArray[i])], expectedArray[i]));
    assert.strictEqual(list.contains(expectedArray[i]), true);
    assert.strictEqual(list.contains(Math.random()), false);
  }

  assert.deepStrictEqual((0, _from.default)(list), expectedArray);
  testSerialization(list);
}

var staticArray = [];
var staticList = new _SortedList.SortedList({
  array: staticArray
});

var TestList =
/*#__PURE__*/
function (_TestVariants) {
  (0, _inherits2.default)(TestList, _TestVariants);

  function TestList() {
    var _this;

    (0, _classCallCheck2.default)(this, TestList);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(TestList).call(this));
    _this.baseOptionsVariants = {
      notAddIfExists: [false, true],
      withCompare: [false, true],
      reuseListInstance: [false, true],
      useListChanged: [false, true]
    };
    return _this;
  }

  (0, _createClass2.default)(TestList, [{
    key: "testVariant",
    value: function testVariant(options) {
      var error;

      for (var debugIteration = 0; debugIteration < 3; debugIteration++) {
        var unsubscribeListChanged = void 0;
        var unsubscribePropertyChanged = void 0;

        try {
          var _ret = function () {
            var _context3, _context4;

            var array = (0, _slice.default)(_context3 = options.array).call(_context3); // assert.deepStrictEqual(array, array.slice().sort(compareFast))

            var compare = options.compare || (options.withCompare ? _compare.compareFast : undefined);
            var list = void 0;

            if (options.reuseListInstance) {
              staticList.clear();
              staticList.compare = compare;
              staticList.notAddIfExists = false;

              if (options.countSorted != null) {
                staticList.autoSort = true;

                for (var i = 0; i < options.countSorted; i++) {
                  staticList.add(array[i]);
                }

                staticList.autoSort = false;

                for (var _i5 = options.countSorted; _i5 < array.length; _i5++) {
                  staticList.add(array[_i5]);
                }
              } else {
                staticList.autoSort = false;
                staticList.addArray(array);
              }

              staticList.autoSort = options.autoSort;
              staticList.notAddIfExists = options.notAddIfExists;
              list = staticList;
              array = staticArray;
            } else {
              list = new _SortedList.SortedList({
                array: array,
                compare: compare,
                autoSort: options.autoSort,
                notAddIfExists: options.notAddIfExists,
                countSorted: options.countSorted
              });
            }

            assert.strictEqual(list.countSorted, options.countSorted || 0);
            var arrayReplicate = options.autoSort ? (0, _sort.default)(_context4 = (0, _slice.default)(array).call(array, 0, list.size)).call(_context4, compare || _compare.compareFast) : (0, _slice.default)(array).call(array, 0, list.size); // assert.strictEqual(
            // 	list.countSorted,
            // 	options.autoSort ? list.size : options.countSorted || 0,
            // )

            var listChangedEvents = [];

            if (options.useListChanged) {
              unsubscribeListChanged = list.listChanged.subscribe(function (event) {
                listChangedEvents.push(event);
                applyListChangedToArray(event, arrayReplicate, compare || _compare.compareFast);

                if (event.type !== _IListChanged.ListChangedType.Resorted) {
                  assert.deepStrictEqual(arrayReplicate, (0, _slice.default)(array).call(array, 0, list.size));
                }
              });
            }

            var propertyChangedEvents = [];
            unsubscribePropertyChanged = list.propertyChanged.subscribe(function (event) {
              propertyChangedEvents.push(event);
            });
            assert.strictEqual(list.minAllocatedSize, undefined); // if (!options.reuseListInstance) {
            // 	assertList(list, array)
            // }

            if (options.expected.error) {
              assert.throws(function () {
                return options.action(list, array);
              }, options.expected.error);
              assert.strictEqual(list.countSorted, options.expected.countSorted == null ? options.autoSort ? list.size : options.countSorted || 0 : options.expected.countSorted);
              assert.strictEqual(list.minAllocatedSize, undefined);
              assertList(list, options.array);
            } else {
              assert.deepStrictEqual(options.action(list, array), options.expected.returnValue);

              if (options.expected.countSorted != null) {
                assert.strictEqual(list.countSorted, options.expected.countSorted);
              }

              assert.strictEqual(list.minAllocatedSize, undefined);
              assertList(list, options.expected.array);
            }

            if (!options.reuseListInstance) {
              assert.deepStrictEqual((0, _slice.default)(array).call(array, 0, list.size), list.toArray());

              for (var _i6 = list.size; _i6 < array.length; _i6++) {
                assert.strictEqual(array[_i6], options.expected.defaultValue);
              }
            }

            if (options.useListChanged) {
              if (unsubscribeListChanged) {
                unsubscribeListChanged();
              }

              assert.deepStrictEqual(listChangedEvents, options.expected.listChanged || []);
              assert.deepStrictEqual(arrayReplicate, list.toArray());
            }

            if (unsubscribePropertyChanged) {
              unsubscribePropertyChanged();
            }

            var expectedPropertyChanged = options.expected.propertyChanged;

            if (!expectedPropertyChanged && !options.expected.error && options.array.length !== options.expected.array.length) {
              expectedPropertyChanged = [{
                name: 'size',
                oldValue: options.array.length,
                newValue: options.expected.array.length
              }];
            }

            assert.deepStrictEqual(propertyChangedEvents, expectedPropertyChanged || []);

            if (options.expected.countSorted != null) {
              assert.strictEqual(list.countSorted, options.expected.countSorted);
            } else if (options.autoSort) {
              assert.strictEqual(list.countSorted, list.size);
            }

            return "break";
          }();

          if (_ret === "break") break;
        } catch (ex) {
          if (!debugIteration) {
            console.log("Error in: " + options.description + "\n" + (0, _stringify.default)(options, null, 4) + "\n" + options.action.toString() + "\n" + ex.stack);
            error = ex;
          }
        } finally {
          if (unsubscribeListChanged) {
            unsubscribeListChanged();
          }

          if (unsubscribePropertyChanged) {
            unsubscribePropertyChanged();
          }

          TestList.totalListTests++;
        }
      }

      if (error) {
        throw error;
      }
    }
  }], [{
    key: "test",
    value: function test(testCases) {
      var maxArrayLength = 0;

      if (testCases.array) {
        for (var i = 0; i < testCases.array.length; i++) {
          var _array = testCases.array[i];

          if (_array.length > maxArrayLength) {
            maxArrayLength = _array.length;
          }
        }
      }

      if (maxArrayLength <= 1 && !testCases.expected.error && (!testCases.expected.array || testCases.expected.array.length <= 1)) {
        testCases.autoSort = [false, true];
      }

      if (!testCases.countSorted && maxArrayLength <= 1 && (!testCases.compare || testCases.compare.length <= 0)) {
        var compare = testCases.compare && testCases.compare.length && testCases.compare[0] || _compare.compareFast;
        var minCountSorted;

        for (var _iterator = testCases.array, _isArray = (0, _isArray2.default)(_iterator), _i7 = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
          var _ref;

          if (_isArray) {
            if (_i7 >= _iterator.length) break;
            _ref = _iterator[_i7++];
          } else {
            _i7 = _iterator.next();
            if (_i7.done) break;
            _ref = _i7.value;
          }

          var _array2 = _ref;
          var countSorted = 0;

          for (var _i9 = 0; _i9 < _array2.length; _i9++) {
            if (_i9 > 0 && compare(_array2[_i9 - 1], _array2[_i9]) > 0) {
              break;
            }

            countSorted++;
          }

          if (minCountSorted == null || countSorted < minCountSorted) {
            minCountSorted = countSorted;
          }

          if (minCountSorted === 0) {
            break;
          }
        }

        testCases.countSorted = [undefined, 0];

        for (var _i8 = 1; _i8 <= minCountSorted; _i8++) {
          testCases.countSorted.push(_i8);
        }
      }

      TestList._instance.test(testCases);
    }
  }]);
  return TestList;
}(_TestVariants2.TestVariants);

exports.TestList = TestList;
TestList.totalListTests = 0;
TestList._instance = new TestList();