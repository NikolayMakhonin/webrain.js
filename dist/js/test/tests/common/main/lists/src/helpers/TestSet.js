"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applySetChangedToArray = applySetChangedToArray;
exports.TestSet = exports.THIS = void 0;

var _ISetChanged = require("../../../../../../../main/common/lists/contracts/ISetChanged");

var _compare = require("../../../../../../../main/common/lists/helpers/compare");

var _ObjectSet = require("../../../../../../../main/common/lists/ObjectSet");

var _ObservableSet = require("../../../../../../../main/common/lists/ObservableSet");

var _common = require("./common");

var _TestVariants = require("./TestVariants");

const THIS = {};
exports.THIS = THIS;

function applySetChangedToArray(event, array) {
  switch (event.type) {
    case _ISetChanged.SetChangedType.Added:
      for (const item of event.newItems) {
        array.push(item);
      }

      break;

    case _ISetChanged.SetChangedType.Removed:
      for (const item of event.oldItems) {
        const index = item === item ? array.indexOf(item) : (0, _common.indexOfNaN)(array);
        array.splice(index, 1);
      }

      break;
  }
}

function assertSet(set, expectedArray) {
  expectedArray = expectedArray.slice().sort(_compare.compareFast);
  assert.deepStrictEqual(Array.from(set.keys()).sort(_compare.compareFast), expectedArray);
  assert.deepStrictEqual(Array.from(set.values()).sort(_compare.compareFast), expectedArray);
  assert.deepStrictEqual(Array.from(set.entries()).map(o => o[0]).sort(_compare.compareFast), expectedArray);
  assert.deepStrictEqual(Array.from(set.entries()).map(o => o[1]).sort(_compare.compareFast), expectedArray);
  assert.strictEqual(set.size, expectedArray.length);

  for (const item of expectedArray) {
    assert.strictEqual(set.has(item), true);
    assert.strictEqual(set.has(Math.random()), false);
  }

  const forEachArray = [];
  const thisArg = {};
  set.forEach(function (value, key, instance) {
    assert.strictEqual(this, thisArg);
    assert.strictEqual(instance, set);
    forEachArray.push([key, value]);
  }, thisArg);
  assert.deepStrictEqual(forEachArray.map(o => o[0]).sort(_compare.compareFast), expectedArray);
  assert.deepStrictEqual(forEachArray.map(o => o[1]).sort(_compare.compareFast), expectedArray);
  assert.deepStrictEqual(Array.from(set).sort(_compare.compareFast), expectedArray);
}

const staticSetInner = new Set();
const staticSet = new _ObservableSet.ObservableSet({
  set: staticSetInner
});

class TestSet extends _TestVariants.TestVariants {
  constructor() {
    super();
    this.baseOptionsVariants = {
      reuseSetInstance: [false, true],
      useSetChanged: [false, true],
      useObjectSet: [false, true]
    };
  }

  testVariant(options) {
    let error;

    for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
      let unsubscribeSetChanged;
      let unsubscribePropertyChanged;

      try {
        const array = options.array.slice();
        let set;
        let setInner;

        if (options.reuseSetInstance) {
          staticSet.clear();

          for (const item of array) {
            staticSet.add(item);
          }

          set = staticSet;
          setInner = staticSetInner;
        } else {
          setInner = options.useObjectSet ? new _ObjectSet.ObjectSet({}) : new Set();

          for (const item of array) {
            setInner.add(item);
          }

          set = new _ObservableSet.ObservableSet({
            set: setInner
          });
        }

        const arrayReplicate = array.slice(0, set.size);
        const setChangedEvents = [];

        if (options.useSetChanged) {
          unsubscribeSetChanged = set.setChanged.subscribe(event => {
            setChangedEvents.push(event);
            applySetChangedToArray(event, arrayReplicate);
            assert.deepStrictEqual(arrayReplicate.slice().sort(_compare.compareFast), Array.from(setInner.values()).sort(_compare.compareFast));
          });
        }

        const propertyChangedEvents = [];
        unsubscribePropertyChanged = set.propertyChanged.subscribe(event => {
          propertyChangedEvents.push(event);
        });

        if (!options.reuseSetInstance) {
          assertSet(set, Array.from(setInner.values()));
        }

        if (options.expected.error) {
          assert.throws(() => options.action(set), options.expected.error);
          assertSet(set, options.array);
        } else {
          assert.deepStrictEqual(options.action(set), options.expected.returnValue === THIS ? set : options.expected.returnValue);
          assertSet(set, options.expected.array);
        }

        assert.deepStrictEqual(Array.from(setInner.values()).sort(_compare.compareFast), Array.from(set.values()).sort(_compare.compareFast));

        if (options.useSetChanged) {
          if (unsubscribeSetChanged) {
            unsubscribeSetChanged();
          }

          assert.deepStrictEqual(setChangedEvents, options.expected.setChanged || []);
          assert.deepStrictEqual(arrayReplicate.slice().sort(_compare.compareFast), Array.from(set.values()).sort(_compare.compareFast));
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
        break;
      } catch (ex) {
        if (!debugIteration) {
          console.log(`Error in: ${options.description}\n${JSON.stringify(options, null, 4)}\n${options.action.toString()}\n${ex.stack}`);
          error = ex;
        }
      } finally {
        if (unsubscribeSetChanged) {
          unsubscribeSetChanged();
        }

        if (unsubscribePropertyChanged) {
          unsubscribePropertyChanged();
        }

        TestSet.totalSetTests++;
      }
    }

    if (error) {
      throw error;
    }
  }

  static test(testCases) {
    TestSet._instance.test(testCases);
  }

}

exports.TestSet = TestSet;
TestSet.totalSetTests = 0;
TestSet._instance = new TestSet();