/* tslint:disable:no-empty no-construct use-primitive-type no-duplicate-string */
import { delay } from '../../../../../../../../main/common/time/helpers';
import { VALUE_PROPERTY_DEFAULT } from '../../../../../../../../main/common/helpers/value-property';
import { ObservableMap } from '../../../../../../../../main/common/lists/ObservableMap';
import { ObservableSet } from '../../../../../../../../main/common/lists/ObservableSet';
import { SortedList } from '../../../../../../../../main/common/lists/SortedList';
import { ValueChangeType } from '../../../../../../../../main/common/rx/deep-subscribe/contracts/common';
import { deepSubscribe } from '../../../../../../../../main/common/rx/deep-subscribe/deep-subscribe';
import { ObservableClass } from '../../../../../../../../main/common/rx/object/ObservableClass';
import { ObservableObjectBuilder } from '../../../../../../../../main/common/rx/object/ObservableObjectBuilder';
import { Assert } from '../../../../../../../../main/common/test/Assert';
import { DeepCloneEqual } from '../../../../../../../../main/common/test/DeepCloneEqual';
import { ruleFactoriesVariants } from './RuleBuildersBuilder';
const assert = new Assert(new DeepCloneEqual({
  commonOptions: {},
  equalOptions: {
    equalInnerReferences: true,
    equalMapSetOrder: true
  }
}));
export function createObject() {
  const object = {};
  const list = new SortedList(); // @ts-ignore

  Object.defineProperty(list, 'listChanged', {
    configurable: true,
    writable: true,
    value: null
  });
  const set = new Set();
  const map2 = new Map();

  class ObservableClasss extends ObservableClass {}

  const observableObjectPrototype = new ObservableClasss();
  const observableObject = new ObservableClass();
  const observableList = new SortedList();
  const observableSet = new ObservableSet();
  const observableMap = new ObservableMap();
  const property = new ObservableClass();
  Object.assign(object, {
    [VALUE_PROPERTY_DEFAULT]: 'nothing',
    observableObjectPrototype,
    observableObject,
    observableList,
    observableSet,
    observableMap,
    object,
    property,
    list,
    set,
    map2,
    valueUndefined: void 0,
    value: 'value',
    valueArray: ['value1', 'value2'],
    valueObject: new String('value'),
    promiseSync: {
      then: resolve => resolve(observableObject)
    },
    promiseAsync: {
      then: resolve => setTimeout(() => resolve(observableObject), 0)
    }
  });
  const observableObjectBuilderPrototype = new ObservableObjectBuilder(ObservableClasss.prototype);
  const observableObjectBuilder = new ObservableObjectBuilder(observableObject);
  const propertyBuilder = new ObservableObjectBuilder(property);
  Object.keys(object).forEach(key => {
    // if (key !== 'value' && key !== 'valueObject') {
    list.add(object[key]);
    set.add(object[key]);
    map2.set(key, object[key]);
    observableList.add(object[key]);
    observableSet.add(object[key]);
    observableMap.set(key, object[key]); // }

    if (key !== VALUE_PROPERTY_DEFAULT) {
      if (key !== 'valueObjectWritable') {
        observableObjectBuilderPrototype.readable(key, null, object[key]);
      }

      observableObjectBuilder.writable(key, null, object[key]);
      propertyBuilder.writable('value_' + key, null, object[key]);
    }
  });
  observableObjectBuilderPrototype.writable('valueObjectWritable');
  propertyBuilder.writable(VALUE_PROPERTY_DEFAULT, null, observableObject);
  return object;
}

function checkArray(actual, expected) {
  const log = JSON.stringify({
    actual,
    expected
  }, null, 4);

  if (actual == null) {
    assert.strictEqual(expected, null, log);
    return;
  }

  assert.strictEqual(actual.length, expected.length, log);

  for (let i = 0, len = actual.length; i < len; i++) {
    assert.strictEqual(actual[i], expected[i], log);
  }
}

function firstOrEmpty(array) {
  if (array.length === 0) {
    return 0;
  }

  return [array[0]];
}

export class TestDeepSubscribe {
  constructor({
    object,
    immediate,
    ignoreSubscribeCount,
    performanceTest,
    doNotSubscribeNonObjectValues,
    useIncorrectUnsubscribe,
    shouldNeverSubscribe,
    asyncDelay = 30
  }, ...ruleBuilders) {
    this._object = object;
    this._immediate = immediate;
    this._ignoreSubscribeCount = ignoreSubscribeCount;
    this._performanceTest = performanceTest;
    this._doNotSubscribeNonObjectValues = doNotSubscribeNonObjectValues;
    this._ruleBuilders = ruleBuilders;
    this._useIncorrectUnsubscribe = useIncorrectUnsubscribe;
    this._shouldNeverSubscribe = shouldNeverSubscribe;
    this._unsubscribe = ruleBuilders.map(o => null);
    this._asyncDelay = asyncDelay;

    if (!performanceTest) {
      TestDeepSubscribe.totalTests += ruleBuilders.length;
      this._subscribed = ruleBuilders.map(o => []);
      this._unsubscribed = ruleBuilders.map(o => []);
      this._lastValue = ruleBuilders.map(o => []);
      this._subscribersCount = ruleBuilders.map(o => 0);
      this._expectedLastValue = ruleBuilders.map(o => []);
    }
  }

  getDefaultExpectedLastValue(expectedSubscribed, expectedUnsubscribed) {
    if (expectedUnsubscribed && expectedUnsubscribed.length) {
      if (expectedSubscribed && expectedSubscribed.length) {
        return typeof expectedSubscribed === 'function' ? o => {
          const values = expectedSubscribed(o);
          return values && values.length ? [void 0, values[values.length - 1]] : [void 0];
        } : [void 0, expectedSubscribed[expectedSubscribed.length - 1]];
      }

      return [void 0];
    }

    if (expectedSubscribed && expectedSubscribed.length) {
      return typeof expectedSubscribed === 'function' ? o => {
        const values = expectedSubscribed(o);
        return values && values.length ? [values[values.length - 1]] : [];
      } : [expectedSubscribed[expectedSubscribed.length - 1]];
    }

    return [];
  }

  checkLastValues(lastValue, expectedSubscribed, expectedUnsubscribed, expectedLastValue, message) {
    // if (!expectedLastValue) {
    // 	expectedLastValue = this.getDefaultExpectedLastValue(expectedSubscribed, expectedUnsubscribed)
    // }
    if (expectedLastValue && expectedLastValue.length > 1) {
      expectedLastValue = [expectedLastValue[expectedLastValue.length - 1]];
    }

    if (lastValue && lastValue.length > 1) {
      lastValue = [lastValue[lastValue.length - 1]];
    }

    this.checkSubscribes(lastValue, expectedLastValue, message);
  }

  checkSubscribes(subscribes, expectedSubscribes, message) {
    if (typeof expectedSubscribes === 'function') {
      expectedSubscribes = expectedSubscribes(this._object);
    }

    if (!this._ignoreSubscribeCount) {
      assert.circularDeepStrictEqual(subscribes, expectedSubscribes, message);
      return;
    }

    if (!expectedSubscribes.length) {
      assert.strictEqual(subscribes.length, 0, message);
      return;
    }

    for (let i = 0; i < subscribes.length; i++) {
      assert.strictEqual(subscribes[i], expectedSubscribes[0], message);
    }
  }

  subscribePrivate(ruleBuilder, i) {
    const subscribeValue = (newValue, parent, key, propertiesPath, rule) => {
      if (this._doNotSubscribeNonObjectValues && !(newValue instanceof Object)) {
        if (typeof this._expectedLastValue[i][this._expectedLastValue[i].length - 1] === 'undefined' || this._subscribersCount[i] === 0) {
          this._expectedLastValue[i].push(newValue);
        }

        this._subscribersCount[i]++;

        if (typeof newValue !== 'undefined') {
          this._subscribed[i].push(newValue);
        }

        return;
      }

      if (this._performanceTest) {
        return () => {};
      }

      if (typeof this._expectedLastValue[i][this._expectedLastValue[i].length - 1] === 'undefined' || this._subscribersCount[i] === 0) {
        this._expectedLastValue[i].push(newValue);
      }

      this._subscribersCount[i]++;

      if (typeof newValue !== 'undefined') {
        this._subscribed[i].push(newValue);
      }

      if (this._useIncorrectUnsubscribe) {
        return 'Test Incorrect Unsubscribe';
      }

      return typeof newValue !== 'undefined' ? () => {
        this._unsubscribed[i].push(newValue);
      } : null;
    };

    const unsubscribeValue = (oldValue, parent, key, propertiesPath, rule, isUnsubscribed) => {
      if (this._performanceTest) {
        return;
      }

      this._subscribersCount[i]--;

      if (this._subscribersCount[i] === 0) {
        this._expectedLastValue[i].push(void 0);
      }

      assert.ok(this._subscribersCount[i] >= 0); // if (this._subscribersCount[i] < 0) {
      // 	assert.strictEqual(typeof value, 'undefined')
      // 	this._subscribersCount[i] = 0
      // }

      if (typeof oldValue !== 'undefined' && !isUnsubscribed) {
        this._unsubscribed[i].push(oldValue);
      }
    };

    this._unsubscribe[i] = deepSubscribe({
      object: this._object,

      changeValue(key, oldValue, newValue, parent, changeType, keyType, propertiesPath, rule, isUnsubscribed) {
        if ((changeType & ValueChangeType.Unsubscribe) !== 0) {
          unsubscribeValue(oldValue, parent, key, propertiesPath, rule, isUnsubscribed);
        }

        if ((changeType & ValueChangeType.Subscribe) !== 0) {
          return subscribeValue(newValue, parent, key, propertiesPath, rule);
        }
      },

      lastValue: (value, parent, propertyName) => {
        if (this._performanceTest) {
          return () => {};
        }

        this._lastValue[i].push(value);
      },
      immediate: this._immediate,
      ruleBuilder: Math.random() > 0.5 ? o => ruleBuilder(o).clone() : ruleBuilder
    });
  } // region Sync


  subscribe(expectedSubscribed, expectedUnsubscribed, expectedLastValue, errorType, errorRegExp) {
    if (this._performanceTest) {
      for (let i = 0; i < this._ruleBuilders.length; i++) {
        const ruleBuilder = this._ruleBuilders[i];
        this.subscribePrivate(ruleBuilder, i);
      }

      return this;
    }

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      const ruleBuilder = this._ruleBuilders[i];
      assert.ok(this._unsubscribe[i] == null, 'unsubscribe()');
      assert.deepStrictEqual(this._subscribed[i], [], 'subscribed[]');
      assert.deepStrictEqual(this._unsubscribed[i], [], 'unsubscribed[]');
      assert.deepStrictEqual(this._lastValue[i], [], 'lastValue[]');

      if (errorType) {
        assert.throws(() => this.subscribePrivate(ruleBuilder, i), errorType, errorRegExp);
      } else {
        this.subscribePrivate(ruleBuilder, i);
        expectedUnsubscribed = [];
      }

      this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed, 'unsubscribe[]');

      if (!expectedSubscribed) {
        assert.strictEqual(this._unsubscribe[i], null, 'unsubscribe()');
        assert.deepStrictEqual(this._subscribed[i], [], 'subscribed[]');
      } else {
        this.checkSubscribes(this._subscribed[i], expectedSubscribed, 'subscribed[]');
        this._subscribed[i] = [];
      }

      this.checkLastValues(this._lastValue[i], expectedSubscribed, expectedUnsubscribed, expectedLastValue || this._expectedLastValue[i], 'lastValue[]');
      this._lastValue[i] = [];
      this._expectedLastValue[i] = [];
    }

    return this;
  }

  change(changeFunc, expectedUnsubscribed, expectedSubscribed, expectedLastValue, errorType, errorRegExp) {
    if (this._performanceTest) {
      changeFunc(this._object);
      return this;
    }

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      assert.deepStrictEqual(this._subscribed[i], [], 'subscribed[]');
      assert.deepStrictEqual(this._unsubscribed[i], [], 'unsubscribed[]');
      assert.deepStrictEqual(this._lastValue[i], [], 'lastValue[]');
    }

    if (typeof expectedUnsubscribed === 'function') {
      expectedUnsubscribed = expectedUnsubscribed(this._object);
    }

    if (errorType) {
      assert.throws(() => changeFunc(this._object), errorType, errorRegExp);
    } else {
      changeFunc(this._object);
    }

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed, 'unsubscribed[]');
      this.checkSubscribes(this._subscribed[i], expectedSubscribed, 'subscribed[]');
      this.checkLastValues(this._lastValue[i], expectedSubscribed, expectedUnsubscribed, expectedLastValue || this._expectedLastValue[i], 'lastValue[]');
      this._unsubscribed[i] = [];
      this._subscribed[i] = [];
      this._lastValue[i] = [];
      this._expectedLastValue[i] = [];
    }

    return this;
  }

  unsubscribe(expectedUnsubscribed, expectedLastValue, errorType, errorRegExp) {
    if (this._performanceTest) {
      for (let i = 0; i < this._ruleBuilders.length; i++) {
        this._unsubscribe[i]();
      }

      return this;
    }

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      if (this._shouldNeverSubscribe) {
        assert.ok(this._unsubscribe[i] == null, 'unsubscribe()');
      } else {
        assert.ok(this._unsubscribe[i], 'unsubscribe()');
      }

      assert.deepStrictEqual(this._subscribed[i], [], 'subscribed[]');
      assert.deepStrictEqual(this._unsubscribed[i], [], 'unsubscribed[]');
      assert.deepStrictEqual(this._lastValue[i], [], 'lastValue[]');

      if (errorType) {
        assert.throws(() => this._unsubscribe[i](), errorType, errorRegExp);
        assert.deepStrictEqual(this._subscribed[i], [], 'subscribed[]');
        assert.deepStrictEqual(this._unsubscribed[i], [], 'unsubscribed[]');
        assert.deepStrictEqual(this._lastValue[i], [], 'lastValue[]');
      } else {
        if (!this._shouldNeverSubscribe) {
          this._unsubscribe[i]();

          this._unsubscribe[i]();

          this._unsubscribe[i]();

          this._unsubscribe[i] = null;
        }

        this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed, 'unsubscribed[]');
        assert.strictEqual(this._subscribersCount[i], 0, 'subscribersCount');
        assert.deepStrictEqual(this._subscribed[i], [], 'subscribed[]');
        this.checkLastValues(this._lastValue[i], null, expectedUnsubscribed, expectedLastValue || this._expectedLastValue[i], 'lastValue[]');
        this._unsubscribed[i] = [];
        this._lastValue[i] = [];
        this._expectedLastValue[i] = [];
      }
    }

    return this;
  } // endregion
  // region Async


  async subscribeAsync(expectedSubscribed, expectedUnsubscribed, expectedLastValue, errorType, errorRegExp) {
    if (this._performanceTest) {
      for (let i = 0; i < this._ruleBuilders.length; i++) {
        const ruleBuilder = this._ruleBuilders[i];
        this.subscribePrivate(ruleBuilder, i);
      }

      return this;
    }

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      const ruleBuilder = this._ruleBuilders[i];
      assert.ok(this._unsubscribe[i] == null, 'unsubscribe()');
      assert.deepStrictEqual(this._subscribed[i], [], 'subscribed[]');
      assert.deepStrictEqual(this._unsubscribed[i], [], 'unsubscribed[]');
      assert.deepStrictEqual(this._lastValue[i], [], 'lastValue[]');

      if (errorType) {
        assert.throws(() => this.subscribePrivate(ruleBuilder, i), errorType, errorRegExp);
      } else {
        this.subscribePrivate(ruleBuilder, i);
        expectedUnsubscribed = [];
      }

      await delay(this._asyncDelay);
      this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed, 'unsubscribed[]');

      if (!expectedSubscribed) {
        assert.strictEqual(this._unsubscribe[i], null, 'unsubscribe()');
        assert.deepStrictEqual(this._subscribed[i], [], 'subscribed[]');
      } else {
        this.checkSubscribes(this._subscribed[i], expectedSubscribed, 'subscribed[]');
        this._subscribed[i] = [];
      }

      this.checkLastValues(this._lastValue[i], expectedSubscribed, expectedUnsubscribed, expectedLastValue || this._expectedLastValue[i], 'lastValue[]');
      this._lastValue[i] = [];
      this._expectedLastValue[i] = [];
    }

    return this;
  }

  async changeAsync(changeFunc, expectedUnsubscribed, expectedSubscribed, expectedLastValue, errorType, errorRegExp) {
    if (this._performanceTest) {
      changeFunc(this._object);
      return this;
    }

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      assert.deepStrictEqual(this._subscribed[i], [], 'subscribed[]');
      assert.deepStrictEqual(this._unsubscribed[i], [], 'unsubscribed[]');
      assert.deepStrictEqual(this._lastValue[i], [], 'lastValue[]');
    }

    if (typeof expectedUnsubscribed === 'function') {
      expectedUnsubscribed = expectedUnsubscribed(this._object);
    }

    if (errorType) {
      assert.throws(() => changeFunc(this._object), errorType, errorRegExp);
    } else {
      changeFunc(this._object);
    }

    await delay(this._asyncDelay);

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed, 'unsubscribed[]');
      this.checkSubscribes(this._subscribed[i], expectedSubscribed, 'subscribed[]');
      this.checkLastValues(this._lastValue[i], expectedSubscribed, expectedUnsubscribed, expectedLastValue || this._expectedLastValue[i], 'lastValue[]');
      this._unsubscribed[i] = [];
      this._subscribed[i] = [];
      this._lastValue[i] = [];
      this._expectedLastValue[i] = [];
    }

    return this;
  }

  async unsubscribeAsync(expectedUnsubscribed, expectedLastValue, errorType, errorRegExp) {
    if (this._performanceTest) {
      for (let i = 0; i < this._ruleBuilders.length; i++) {
        this._unsubscribe[i]();
      }

      return this;
    }

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      if (this._shouldNeverSubscribe) {
        assert.ok(this._unsubscribe[i] == null, 'unsubscribe()');
      } else {
        assert.ok(this._unsubscribe[i], 'unsubscribe()');
      }

      assert.deepStrictEqual(this._subscribed[i], [], 'subscribed[]');
      assert.deepStrictEqual(this._unsubscribed[i], [], 'unsubscribed[]');
      assert.deepStrictEqual(this._lastValue[i], [], 'lastValue[]');

      if (errorType) {
        assert.throws(() => this._unsubscribe[i](), errorType, errorRegExp);
        assert.strictEqual(this._subscribersCount[i], 0, 'subscribersCount');
        assert.deepStrictEqual(this._subscribed[i], [], 'subscribed[]');
        assert.deepStrictEqual(this._unsubscribed[i], [], 'unsubscribed[]');
        assert.deepStrictEqual(this._lastValue[i], [], 'lastValue[]');
      } else {
        if (!this._shouldNeverSubscribe) {
          this._unsubscribe[i]();

          this._unsubscribe[i]();

          this._unsubscribe[i]();

          this._unsubscribe[i] = null;
        }

        await delay(this._asyncDelay);
        this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed, 'unsubscribed[]');
        assert.deepStrictEqual(this._subscribed[i], [], 'subscribed[]');
        this.checkLastValues(this._lastValue[i], null, expectedUnsubscribed, expectedLastValue || this._expectedLastValue[i], 'lastValue[]');
        this._unsubscribed[i] = [];
        this._lastValue[i] = [];
        this._expectedLastValue[i] = [];
      }
    }

    return this;
  } // endregion


}
TestDeepSubscribe.totalTests = 0;
export class TestDeepSubscribeVariants extends TestDeepSubscribe {
  constructor(options, ...variants) {
    super(options, ...ruleFactoriesVariants(...variants));
  }

}

function repeat(value, count) {
  const array = [];

  for (let i = 0; i < count; i++) {
    array.push(value);
  }

  return array;
}