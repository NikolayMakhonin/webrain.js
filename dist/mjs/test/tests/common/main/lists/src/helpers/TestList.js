import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import { ObjectSerializer } from '../../../../../../../main/common/extensions/serialization/serializers';
import { ListChangedType } from '../../../../../../../main/common/lists/contracts/IListChanged';
import { compareFast } from '../../../../../../../main/common/lists/helpers/compare';
import { SortedList } from '../../../../../../../main/common/lists/SortedList';
import { Assert } from '../../../../../../../main/common/test/Assert';
import { DeepCloneEqual } from '../../../../../../../main/common/test/DeepCloneEqual';
import { TestVariants } from '../../../src/helpers/TestVariants';
export var assert = new Assert(new DeepCloneEqual({
  commonOptions: {},
  equalOptions: {
    // noCrossReferences: true,
    equalInnerReferences: true,
    equalTypes: true,
    equalMapSetOrder: true,
    strictEqualFunctions: true
  }
}));
export function applyListChangedToArray(event, array, compare) {
  switch (event.type) {
    case ListChangedType.Added:
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

    case ListChangedType.Removed:
      for (var _i3 = 0; _i3 < event.oldItems.length; _i3++) {
        assert.strictEqual(array[event.index + _i3], event.oldItems[_i3]);
      }

      for (var _i4 = event.shiftIndex; _i4 < array.length; _i4++) {
        array[event.index + _i4 - event.shiftIndex] = array[_i4];
      }

      array.length -= event.oldItems.length;
      break;

    case ListChangedType.Set:
      assert.strictEqual(array[event.index], event.oldItems[0]);
      array[event.index] = event.newItems[0];

      if (event.moveIndex !== event.index) {
        array.splice.apply(array, [event.moveIndex, 0].concat(_toConsumableArray(array.splice(event.index, 1))));
      }

      break;

    case ListChangedType.Moved:
      array.splice.apply(array, [event.moveIndex, 0].concat(_toConsumableArray(array.splice(event.index, event.moveSize))));
      break;

    case ListChangedType.Resorted:
      array.sort(compare);
      break;
  }
}

function equalsWithNaN(o1, o2) {
  return o1 === o2 || o1 !== o1 && o2 !== o2;
}

function testSerialization(list) {
  var serialized = ObjectSerializer.default.serialize(list);
  var result = ObjectSerializer.default.deSerialize(serialized);
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
    assert.ok(equalsWithNaN(expectedArray[list.indexOf(expectedArray[i])], expectedArray[i]));
    assert.strictEqual(list.contains(expectedArray[i]), true);
    assert.strictEqual(list.contains(Math.random()), false);
  }

  assert.deepStrictEqual(Array.from(list), expectedArray);
  testSerialization(list);
}

var staticArray = [];
var staticList = new SortedList({
  array: staticArray
});
export var TestList =
/*#__PURE__*/
function (_TestVariants) {
  _inherits(TestList, _TestVariants);

  function TestList() {
    var _this;

    _classCallCheck(this, TestList);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TestList).call(this));
    _this.baseOptionsVariants = {
      notAddIfExists: [false, true],
      withCompare: [false, true],
      reuseListInstance: [false, true],
      useListChanged: [false, true]
    };
    return _this;
  }

  _createClass(TestList, [{
    key: "testVariant",
    value: function testVariant(options) {
      var error;

      for (var debugIteration = 0; debugIteration < 3; debugIteration++) {
        var unsubscribeListChanged = void 0;
        var unsubscribePropertyChanged = void 0;

        try {
          var _ret = function () {
            var array = options.array.slice(); // assert.deepStrictEqual(array, array.slice().sort(compareFast))

            var compare = options.compare || (options.withCompare ? compareFast : undefined);
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
              list = new SortedList({
                array: array,
                compare: compare,
                autoSort: options.autoSort,
                notAddIfExists: options.notAddIfExists,
                countSorted: options.countSorted
              });
            }

            assert.strictEqual(list.countSorted, options.countSorted || 0);
            var arrayReplicate = options.autoSort ? array.slice(0, list.size).sort(compare || compareFast) : array.slice(0, list.size); // assert.strictEqual(
            // 	list.countSorted,
            // 	options.autoSort ? list.size : options.countSorted || 0,
            // )

            var listChangedEvents = [];

            if (options.useListChanged) {
              unsubscribeListChanged = list.listChanged.subscribe(function (event) {
                listChangedEvents.push(event);
                applyListChangedToArray(event, arrayReplicate, compare || compareFast);

                if (event.type !== ListChangedType.Resorted) {
                  assert.deepStrictEqual(arrayReplicate, array.slice(0, list.size));
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
              assert.deepStrictEqual(array.slice(0, list.size), list.toArray());

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
            console.log("Error in: ".concat(options.description, "\n").concat(JSON.stringify(options, null, 4), "\n").concat(options.action.toString(), "\n").concat(ex.stack));
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
        var compare = testCases.compare && testCases.compare.length && testCases.compare[0] || compareFast;
        var minCountSorted;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = testCases.array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _array2 = _step.value;
            var countSorted = 0;

            for (var _i8 = 0; _i8 < _array2.length; _i8++) {
              if (_i8 > 0 && compare(_array2[_i8 - 1], _array2[_i8]) > 0) {
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

        testCases.countSorted = [undefined, 0];

        for (var _i7 = 1; _i7 <= minCountSorted; _i7++) {
          testCases.countSorted.push(_i7);
        }
      }

      TestList._instance.test(testCases);
    }
  }]);

  return TestList;
}(TestVariants);
TestList.totalListTests = 0;
TestList._instance = new TestList();