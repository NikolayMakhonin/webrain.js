"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateArray = generateArray;
exports.toIterable = toIterable;
exports.applyCollectionChangedToArray = applyCollectionChangedToArray;
exports.TestList = void 0;

var _ICollectionChanged = require("../../../../../../main/common/lists/contracts/ICollectionChanged");

var _SortedList = require("../../../../../../main/common/lists/SortedList");

var _TestVariants = require("./TestVariants");

function generateArray(size) {
  const arr = [];

  for (let i = 0; i < size; i++) {
    arr.push(i);
  }

  return arr;
}

function* toIterable(array) {
  for (const item of array) {
    yield item;
  }
}

function applyCollectionChangedToArray(event, array, compare) {
  switch (event.type) {
    case _ICollectionChanged.CollectionChangedType.Added:
      {
        const len = array.length;
        const shift = event.shiftIndex - event.index;

        for (let i = len - shift; i < len; i++) {
          array[i + shift] = array[i];
        }

        for (let i = len - 1; i >= event.shiftIndex; i--) {
          array[i] = array[i - shift];
        }
      }

      for (let i = 0; i < event.newItems.length; i++) {
        array[event.index + i] = event.newItems[i];
      }

      break;

    case _ICollectionChanged.CollectionChangedType.Removed:
      for (let i = 0; i < event.oldItems.length; i++) {
        assert.strictEqual(array[event.index + i], event.oldItems[i]);
      }

      for (let i = event.shiftIndex; i < array.length; i++) {
        array[event.index + i - event.shiftIndex] = array[i];
      }

      array.length -= event.oldItems.length;
      break;

    case _ICollectionChanged.CollectionChangedType.Set:
      assert.strictEqual(array[event.index], event.oldItems[0]);
      array[event.index] = event.newItems[0];

      if (event.moveIndex !== event.index) {
        array.splice(event.moveIndex, 0, ...array.splice(event.index, 1));
      }

      break;

    case _ICollectionChanged.CollectionChangedType.Moved:
      array.splice(event.moveIndex, 0, ...array.splice(event.index, event.moveSize));
      break;

    case _ICollectionChanged.CollectionChangedType.Resorted:
      array.sort(compare);
      break;
  }
}

function assertList(list, expectedArray) {
  assert.deepStrictEqual(list.toArray(), expectedArray);
  assert.strictEqual(list.size, expectedArray.length);
  assert.ok(list.allocatedSize >= expectedArray.length);

  for (let i = 0; i < expectedArray.length; i++) {
    assert.strictEqual(list.get(i), expectedArray[i]);
    assert.strictEqual(expectedArray[list.indexOf(expectedArray[i])], expectedArray[i]);
    assert.strictEqual(list.contains(expectedArray[i]), true);
    assert.strictEqual(list.contains(Math.random()), false);
  }

  assert.deepStrictEqual(Array.from(list), expectedArray);
}

const staticArray = [];
const staticList = new _SortedList.SortedList({
  array: staticArray
});

class TestList extends _TestVariants.TestVariants {
  constructor() {
    super();
    this.baseOptionsVariants = {
      notAddIfExists: [false, true],
      withCompare: [false, true],
      reuseListInstance: [false, true],
      useCollectionChanged: [false, true]
    };
  }

  testVariant(options) {
    let error;

    for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
      let unsubscribeCollectionChanged;
      let unsubscribePropertyChanged;

      try {
        let array = options.array.slice(); // assert.deepStrictEqual(array, array.slice().sort(compareDefault))

        const compare = options.compare || (options.withCompare ? _SortedList.compareDefault : undefined);
        let list;

        if (options.reuseListInstance) {
          staticList.clear();
          staticList.compare = compare;
          staticList.notAddIfExists = false;

          if (options.countSorted != null) {
            staticList.autoSort = true;

            for (let i = 0; i < options.countSorted; i++) {
              staticList.add(array[i]);
            }

            staticList.autoSort = false;

            for (let i = options.countSorted; i < array.length; i++) {
              staticList.add(array[i]);
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
            array,
            compare,
            autoSort: options.autoSort,
            notAddIfExists: options.notAddIfExists,
            countSorted: options.countSorted
          });
        }

        assert.strictEqual(list.countSorted, options.countSorted || 0);
        const arrayReplicate = options.autoSort ? array.slice(0, list.size).sort(compare || _SortedList.compareDefault) : array.slice(0, list.size); // assert.strictEqual(
        // 	list.countSorted,
        // 	options.autoSort ? list.size : options.countSorted || 0,
        // )

        const collectionChangedEvents = [];

        if (options.useCollectionChanged) {
          unsubscribeCollectionChanged = list.collectionChanged.subscribe(event => {
            collectionChangedEvents.push(event);
            applyCollectionChangedToArray(event, arrayReplicate, compare || _SortedList.compareDefault);

            if (event.type !== _ICollectionChanged.CollectionChangedType.Resorted) {
              assert.deepStrictEqual(arrayReplicate, array.slice(0, list.size));
            }
          });
        }

        const propertyChangedEvents = [];
        unsubscribePropertyChanged = list.propertyChanged.subscribe(event => {
          propertyChangedEvents.push(event);
        });
        assert.strictEqual(list.minAllocatedSize, undefined); // if (!options.reuseListInstance) {
        // 	assertList(list, array)
        // }

        if (options.expected.error) {
          assert.throws(() => options.action(list, array), options.expected.error);
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

          for (let i = list.size; i < array.length; i++) {
            assert.strictEqual(array[i], options.expected.defaultValue);
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

        let expectedPropertyChanged = options.expected.propertyChanged;

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

        break;
      } catch (ex) {
        if (!debugIteration) {
          console.log(`Error in: ${options.description}\n${JSON.stringify(options, null, 4)}\n${options.action.toString()}\n${ex.stack}`);
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

  static test(testCases) {
    if ((!testCases.array || testCases.array.length <= 1) && !testCases.expected.error && (!testCases.expected.array || testCases.expected.array.length <= 1)) {
      testCases.autoSort = [false, true];
    }

    if (!testCases.countSorted && testCases.array && testCases.array.length >= 1 && (!testCases.compare || testCases.compare.length <= 0)) {
      const compare = testCases.compare && testCases.compare.length && testCases.compare[0] || _SortedList.compareDefault;
      let minCountSorted;

      for (const array of testCases.array) {
        let countSorted = 0;

        for (let i = 0; i < array.length; i++) {
          if (i > 0 && compare(array[i - 1], array[i]) > 0) {
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

      for (let i = 1; i <= minCountSorted; i++) {
        testCases.countSorted.push(i);
      }
    }

    TestList._instance.test(testCases);
  }

}

exports.TestList = TestList;
TestList.totalListTests = 0;
TestList._instance = new TestList();