import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _regeneratorRuntime from "@babel/runtime/regenerator";

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(toIterable);

import { CollectionChangedType } from '../../../../../../main/common/lists/contracts/ICollectionChanged';
import { compareDefault, SortedList } from '../../../../../../main/common/lists/SortedList';
import { TestVariants } from './TestVariants';
export function generateArray(size) {
  var arr = [];

  for (var i = 0; i < size; i++) {
    arr.push(i);
  }

  return arr;
}
export function toIterable(array) {
  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item;

  return _regeneratorRuntime.wrap(function toIterable$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 3;
          _iterator = array[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 12;
            break;
          }

          item = _step.value;
          _context.next = 9;
          return item;

        case 9:
          _iteratorNormalCompletion = true;
          _context.next = 5;
          break;

        case 12:
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](3);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 18:
          _context.prev = 18;
          _context.prev = 19;

          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }

        case 21:
          _context.prev = 21;

          if (!_didIteratorError) {
            _context.next = 24;
            break;
          }

          throw _iteratorError;

        case 24:
          return _context.finish(21);

        case 25:
          return _context.finish(18);

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, null, [[3, 14, 18, 26], [19,, 21, 25]]);
}
export function applyCollectionChangedToArray(event, array, compare) {
  switch (event.type) {
    case CollectionChangedType.Added:
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

    case CollectionChangedType.Removed:
      for (var _i3 = 0; _i3 < event.oldItems.length; _i3++) {
        assert.strictEqual(array[event.index + _i3], event.oldItems[_i3]);
      }

      for (var _i4 = event.shiftIndex; _i4 < array.length; _i4++) {
        array[event.index + _i4 - event.shiftIndex] = array[_i4];
      }

      array.length -= event.oldItems.length;
      break;

    case CollectionChangedType.Set:
      assert.strictEqual(array[event.index], event.oldItems[0]);
      array[event.index] = event.newItems[0];

      if (event.moveIndex !== event.index) {
        array.splice.apply(array, [event.moveIndex, 0].concat(_toConsumableArray(array.splice(event.index, 1))));
      }

      break;

    case CollectionChangedType.Moved:
      array.splice.apply(array, [event.moveIndex, 0].concat(_toConsumableArray(array.splice(event.index, event.moveSize))));
      break;

    case CollectionChangedType.Resorted:
      array.sort(compare);
      break;
  }
}

function assertList(list, expectedArray) {
  assert.deepStrictEqual(list.toArray(), expectedArray);
  assert.strictEqual(list.size, expectedArray.length);
  assert.ok(list.allocatedSize >= expectedArray.length);

  for (var i = 0; i < expectedArray.length; i++) {
    assert.strictEqual(list.get(i), expectedArray[i]);
    assert.strictEqual(expectedArray[list.indexOf(expectedArray[i])], expectedArray[i]);
    assert.strictEqual(list.contains(expectedArray[i]), true);
    assert.strictEqual(list.contains(Math.random()), false);
  }

  assert.deepStrictEqual(Array.from(list), expectedArray);
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
      useCollectionChanged: [false, true]
    };
    return _this;
  }

  _createClass(TestList, [{
    key: "testVariant",
    value: function testVariant(options) {
      var error;

      for (var debugIteration = 0; debugIteration < 3; debugIteration++) {
        var unsubscribeCollectionChanged = void 0;
        var unsubscribePropertyChanged = void 0;

        try {
          var _ret = function () {
            var array = options.array.slice(); // assert.deepStrictEqual(array, array.slice().sort(compareDefault))

            var compare = options.compare || (options.withCompare ? compareDefault : undefined);
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
            var arrayReplicate = options.autoSort ? array.slice(0, list.size).sort(compare || compareDefault) : array.slice(0, list.size); // assert.strictEqual(
            // 	list.countSorted,
            // 	options.autoSort ? list.size : options.countSorted || 0,
            // )

            var collectionChangedEvents = [];

            if (options.useCollectionChanged) {
              unsubscribeCollectionChanged = list.collectionChanged.subscribe(function (event) {
                collectionChangedEvents.push(event);
                applyCollectionChangedToArray(event, arrayReplicate, compare || compareDefault);

                if (event.type !== CollectionChangedType.Resorted) {
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

            if (options.useCollectionChanged) {
              if (unsubscribeCollectionChanged) {
                unsubscribeCollectionChanged();
              }

              assert.deepStrictEqual(collectionChangedEvents, options.expected.collectionChanged || []);
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
          if (unsubscribeCollectionChanged) {
            unsubscribeCollectionChanged();
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
      if ((!testCases.array || testCases.array.length <= 1) && !testCases.expected.error && (!testCases.expected.array || testCases.expected.array.length <= 1)) {
        testCases.autoSort = [false, true];
      }

      if (!testCases.countSorted && testCases.array && testCases.array.length >= 1 && (!testCases.compare || testCases.compare.length <= 0)) {
        var compare = testCases.compare && testCases.compare.length && testCases.compare[0] || compareDefault;
        var minCountSorted;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = testCases.array[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _array = _step2.value;
            var countSorted = 0;

            for (var _i7 = 0; _i7 < _array.length; _i7++) {
              if (_i7 > 0 && compare(_array[_i7 - 1], _array[_i7]) > 0) {
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

        testCases.countSorted = [undefined, 0];

        for (var i = 1; i <= minCountSorted; i++) {
          testCases.countSorted.push(i);
        }
      }

      TestList._instance.test(testCases);
    }
  }]);

  return TestList;
}(TestVariants);
TestList.totalListTests = 0;
TestList._instance = new TestList();