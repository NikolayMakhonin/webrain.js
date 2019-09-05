let _Symbol$toStringTag, _Symbol$iterator;

import { ObjectSerializer, registerSerializable } from '../../../../../../../main/common/extensions/serialization/serializers';
import { ArraySet } from '../../../../../../../main/common/lists/ArraySet';
import { SetChangedType } from '../../../../../../../main/common/lists/contracts/ISetChanged';
import { compareFast } from '../../../../../../../main/common/lists/helpers/compare';
import { ObjectSet } from '../../../../../../../main/common/lists/ObjectSet';
import { ObservableSet } from '../../../../../../../main/common/lists/ObservableSet';
import { Assert } from '../../../../../../../main/common/test/Assert';
import { DeepCloneEqual } from '../../../../../../../main/common/test/DeepCloneEqual';
import { TestVariants, THIS } from '../../../src/helpers/TestVariants';
import { convertToObject, indexOfNaN } from './common';
export const assert = new Assert(new DeepCloneEqual({
  commonOptions: {},
  equalOptions: {
    // noCrossReferences: true,
    equalInnerReferences: true,
    equalTypes: true,
    equalMapSetOrder: true,
    strictEqualFunctions: true
  }
}));
export function applySetChangedToArray(event, array) {
  switch (event.type) {
    case SetChangedType.Added:
      for (const item of event.newItems) {
        array.push(item);
      }

      break;

    case SetChangedType.Removed:
      for (const item of event.oldItems) {
        const index = item === item ? array.indexOf(item) : indexOfNaN(array);
        array.splice(index, 1);
      }

      break;
  }
}

function testSerialization(set) {
  const serialized = ObjectSerializer.default.serialize(set);
  const result = ObjectSerializer.default.deSerialize(serialized);
  assert.notStrictEqual(result, set);
  assert.deepStrictEqual(result.entries(), set.entries());
}

function assertSet(set, expectedArray) {
  expectedArray = expectedArray.sort(compareFast);
  assert.deepStrictEqual(Array.from(set.keys()).sort(compareFast), expectedArray);
  assert.deepStrictEqual(Array.from(set.values()).sort(compareFast), expectedArray);
  assert.deepStrictEqual(Array.from(set.entries()).map(o => o[0]).sort(compareFast), expectedArray);
  assert.deepStrictEqual(Array.from(set.entries()).map(o => o[1]).sort(compareFast), expectedArray);
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
  assert.deepStrictEqual(forEachArray.map(o => o[0]).sort(compareFast), expectedArray);
  assert.deepStrictEqual(forEachArray.map(o => o[1]).sort(compareFast), expectedArray);
  assert.deepStrictEqual(Array.from(set).sort(compareFast), expectedArray);
  testSerialization(set);
}

const staticSetInner = new Set();
const staticSet = new ObservableSet(staticSetInner);
_Symbol$toStringTag = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;

class SetWrapper {
  constructor(set) {
    this[_Symbol$toStringTag] = 'Set';
    this._set = set;
  }

  get size() {
    return this._set.size;
  }

  *[_Symbol$iterator]() {
    for (const item of this._set) {
      yield item.value;
    }
  }

  add(value) {
    this._set.add(convertToObject(value));

    return this;
  }

  clear() {
    this._set.clear();
  }

  delete(value) {
    return this._set.delete(convertToObject(value));
  }

  *entries() {
    for (const entry of this._set.entries()) {
      yield [entry[0].value, entry[1].value];
    }
  }

  forEach(callbackfn, thisArg) {
    this._set.forEach(function (value, key) {
      callbackfn(value.value, key.value, this);
    }, thisArg);
  }

  has(value) {
    return this._set.has(convertToObject(value));
  }

  *keys() {
    for (const item of this._set.keys()) {
      yield item.value;
    }
  }

  *values() {
    for (const item of this._set.values()) {
      yield item.value;
    }
  } // region ISerializable


  serialize(serialize) {
    return {
      set: serialize(this._set)
    };
  } // tslint:disable-next-line:no-empty


  deSerialize(deSerialize, serializedValue) {} // endregion


}

SetWrapper.uuid = '5de4524d6cdb41e989689798ecedef5d';
registerSerializable(SetWrapper, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerSet = yield deSerialize(serializedValue.set);
      const value = valueFactory(innerSet);
      value.deSerialize(deSerialize, serializedValue);
      return value;
    }

  }
});
export class TestSet extends TestVariants {
  constructor() {
    super();
    this.baseOptionsVariants = {
      reuseSetInstance: [false, true],
      useSetChanged: [false, true],
      innerSet: ['Set', 'Set<Object>', 'ObjectSet', 'ArraySet'],
      convertToObject: [false, true]
    };
  }

  testVariant(options) {
    let error;

    for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
      let unsubscribeSetChanged;
      let unsubscribePropertyChanged;

      try {
        const array = options.array.slice();
        const expectedArray = options.expected.array.slice();
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
          switch (options.innerSet) {
            case 'ObjectSet':
              setInner = new ObjectSet({});
              break;

            case 'ArraySet':
              setInner = new SetWrapper(new ArraySet([]));
              break;

            case 'Set<Object>':
              setInner = new SetWrapper(new Set());
              break;

            case 'Set':
              setInner = new Set();
              break;

            default:
              assert.fail('Unknown options.innerSet: ' + options.innerSet);
              break;
          }

          for (const item of array) {
            setInner.add(item);
          }

          set = new ObservableSet(setInner);
        }

        const arrayReplicate = array.slice(0, set.size);
        const setChangedEvents = [];

        if (options.useSetChanged) {
          unsubscribeSetChanged = set.setChanged.subscribe(event => {
            setChangedEvents.push(event);
            applySetChangedToArray(event, arrayReplicate);
            assert.deepStrictEqual(arrayReplicate.slice().sort(compareFast), Array.from(setInner.values()).sort(compareFast));
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
          assertSet(set, array);
        } else {
          assert.deepStrictEqual(options.action(set), options.expected.returnValue === THIS ? set : options.expected.returnValue);
          assertSet(set, expectedArray);
        }

        assert.deepStrictEqual(Array.from(setInner.values()).sort(compareFast), Array.from(set.values()).sort(compareFast));

        if (options.useSetChanged) {
          if (unsubscribeSetChanged) {
            unsubscribeSetChanged();
          }

          assert.deepStrictEqual(setChangedEvents, options.expected.setChanged || []);
          assert.deepStrictEqual(arrayReplicate.slice().sort(compareFast), Array.from(set.values()).sort(compareFast));
        }

        if (unsubscribePropertyChanged) {
          unsubscribePropertyChanged();
        }

        let expectedPropertyChanged = options.expected.propertyChanged;

        if (!expectedPropertyChanged && !options.expected.error && array.length !== expectedArray.length) {
          expectedPropertyChanged = [{
            name: 'size',
            oldValue: array.length,
            newValue: expectedArray.length
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
TestSet.totalSetTests = 0;
TestSet._instance = new TestSet();