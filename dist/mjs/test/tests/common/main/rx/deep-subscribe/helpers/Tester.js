/* tslint:disable:no-empty no-construct use-primitive-type */
import { delay } from '../../../../../../../main/common/helpers/helpers';
import { VALUE_PROPERTY_DEFAULT } from '../../../../../../../main/common/helpers/value-property';
import { ObservableMap } from '../../../../../../../main/common/lists/ObservableMap';
import { ObservableSet } from '../../../../../../../main/common/lists/ObservableSet';
import { SortedList } from '../../../../../../../main/common/lists/SortedList';
import { deepSubscribe } from '../../../../../../../main/common/rx/deep-subscribe/deep-subscribe';
import { ObservableObject } from '../../../../../../../main/common/rx/object/ObservableObject';
import { ObservableObjectBuilder } from '../../../../../../../main/common/rx/object/ObservableObjectBuilder';
import { Assert } from '../../../../../../../main/common/test/Assert';
import { DeepCloneEqual } from '../../../../../../../main/common/test/DeepCloneEqual';
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

  class ObservableClass extends ObservableObject {}

  const observableObjectPrototype = new ObservableClass();
  const observableObject = new ObservableObject();
  const observableList = new SortedList();
  const observableSet = new ObservableSet();
  const observableMap = new ObservableMap();
  const property = new ObservableObject();
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
    value: 'value',
    valueObject: new String('value'),
    promiseSync: {
      then: resolve => resolve(observableObject)
    },
    promiseAsync: {
      then: resolve => setTimeout(() => resolve(observableObject), 0)
    }
  });
  const observableObjectBuilderPrototype = new ObservableObjectBuilder(ObservableClass.prototype);
  const observableObjectBuilder = new ObservableObjectBuilder(observableObject);
  const propertyBuilder = new ObservableObjectBuilder(property);
  Object.keys(object).forEach(key => {
    if (key !== 'value' && key !== 'valueObject') {
      list.add(object[key]);
      set.add(object[key]);
      map2.set(key, object[key]);
      observableList.add(object[key]);
      observableSet.add(object[key]);
      observableMap.set(key, object[key]);
    }

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

export class Tester {
  constructor({
    object,
    immediate,
    ignoreSubscribeCount,
    performanceTest,
    doNotSubscribeNonObjectValues,
    useIncorrectUnsubscribe
  }, ...ruleBuilders) {
    this._object = object;
    this._immediate = immediate;
    this._ignoreSubscribeCount = ignoreSubscribeCount;
    this._performanceTest = performanceTest;
    this._doNotSubscribeNonObjectValues = doNotSubscribeNonObjectValues;
    this._ruleBuilders = ruleBuilders;
    this._useIncorrectUnsubscribe = useIncorrectUnsubscribe;
    this._unsubscribe = ruleBuilders.map(o => null);

    if (!performanceTest) {
      this._subscribed = ruleBuilders.map(o => []);
      this._unsubscribed = ruleBuilders.map(o => []);
    }
  }

  checkSubscribes(subscribes, expectedSubscribes) {
    if (typeof expectedSubscribes === 'function') {
      expectedSubscribes = expectedSubscribes(this._object);
    }

    if (!this._ignoreSubscribeCount) {
      assert.circularDeepStrictEqual(subscribes, expectedSubscribes);
      return;
    }

    if (!expectedSubscribes.length) {
      assert.strictEqual(subscribes.length, 0);
      return;
    }

    for (let i = 0; i < subscribes.length; i++) {
      assert.equal(subscribes[i], expectedSubscribes[0]);
    }
  }

  subscribePrivate(ruleBuilder, i) {
    this._unsubscribe[i] = deepSubscribe(this._object, value => {
      if (this._doNotSubscribeNonObjectValues && !(value instanceof Object)) {
        return;
      }

      if (this._performanceTest) {
        return () => {};
      }

      this._subscribed[i].push(value);

      if (this._useIncorrectUnsubscribe) {
        return 'Test Incorrect Unsubscribe';
      }

      return () => {
        this._unsubscribed[i].push(value);
      };
    }, this._immediate, Math.random() > 0.5 ? o => ruleBuilder(o).clone() : ruleBuilder);
  } // region Sync


  subscribe(expectedSubscribed, expectedUnsubscribed, errorType, errorRegExp) {
    if (this._performanceTest) {
      for (let i = 0; i < this._ruleBuilders.length; i++) {
        const ruleBuilder = this._ruleBuilders[i];
        this.subscribePrivate(ruleBuilder, i);
      }

      return this;
    }

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      const ruleBuilder = this._ruleBuilders[i];
      assert.ok(this._unsubscribe[i] == null);
      assert.deepStrictEqual(this._subscribed[i], []);
      assert.deepStrictEqual(this._unsubscribed[i], []);

      if (errorType) {
        assert.throws(() => this.subscribePrivate(ruleBuilder, i), errorType, errorRegExp);
      } else {
        this.subscribePrivate(ruleBuilder, i);
        expectedUnsubscribed = [];
      }

      this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed);

      if (!expectedSubscribed) {
        assert.strictEqual(this._unsubscribe[i], null);
        assert.deepStrictEqual(this._subscribed[i], []);
      } else {
        this.checkSubscribes(this._subscribed[i], expectedSubscribed);
        this._subscribed[i] = [];
      }
    }

    return this;
  }

  change(changeFunc, expectedUnsubscribed, expectedSubscribed, errorType, errorRegExp) {
    if (this._performanceTest) {
      changeFunc(this._object);
      return this;
    }

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      assert.deepStrictEqual(this._subscribed[i], []);
      assert.deepStrictEqual(this._unsubscribed[i], []);
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
      this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed);
      this.checkSubscribes(this._subscribed[i], expectedSubscribed);
      this._unsubscribed[i] = [];
      this._subscribed[i] = [];
    }

    return this;
  }

  unsubscribe(expectedUnsubscribed, errorType, errorRegExp) {
    if (this._performanceTest) {
      for (let i = 0; i < this._ruleBuilders.length; i++) {
        this._unsubscribe[i]();
      }

      return this;
    }

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      assert.ok(this._unsubscribe[i]);
      assert.deepStrictEqual(this._subscribed[i], []);
      assert.deepStrictEqual(this._unsubscribed[i], []);

      if (errorType) {
        assert.throws(() => this._unsubscribe[i](), errorType, errorRegExp);
        assert.deepStrictEqual(this._subscribed[i], []);
        assert.deepStrictEqual(this._unsubscribed[i], []);
      } else {
        this._unsubscribe[i]();

        this._unsubscribe[i]();

        this._unsubscribe[i]();

        this._unsubscribe[i] = null;
        this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed);
        assert.deepStrictEqual(this._subscribed[i], []);
        this._unsubscribed[i] = [];
      }
    }

    return this;
  } // endregion
  // region Async


  async subscribeAsync(expectedSubscribed, expectedUnsubscribed, errorType, errorRegExp) {
    if (this._performanceTest) {
      for (let i = 0; i < this._ruleBuilders.length; i++) {
        const ruleBuilder = this._ruleBuilders[i];
        this.subscribePrivate(ruleBuilder, i);
      }

      return this;
    }

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      const ruleBuilder = this._ruleBuilders[i];
      assert.ok(this._unsubscribe[i] == null);
      assert.deepStrictEqual(this._subscribed[i], []);
      assert.deepStrictEqual(this._unsubscribed[i], []);

      if (errorType) {
        assert.throws(() => this.subscribePrivate(ruleBuilder, i), errorType, errorRegExp);
      } else {
        this.subscribePrivate(ruleBuilder, i);
        expectedUnsubscribed = [];
      }

      await delay(10);
      this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed);

      if (!expectedSubscribed) {
        assert.strictEqual(this._unsubscribe[i], null);
        assert.deepStrictEqual(this._subscribed[i], []);
      } else {
        this.checkSubscribes(this._subscribed[i], expectedSubscribed);
        this._subscribed[i] = [];
      }
    }

    return this;
  }

  async changeAsync(changeFunc, expectedUnsubscribed, expectedSubscribed, errorType, errorRegExp) {
    if (this._performanceTest) {
      changeFunc(this._object);
      return this;
    }

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      assert.deepStrictEqual(this._subscribed[i], []);
      assert.deepStrictEqual(this._unsubscribed[i], []);
    }

    if (typeof expectedUnsubscribed === 'function') {
      expectedUnsubscribed = expectedUnsubscribed(this._object);
    }

    if (errorType) {
      assert.throws(() => changeFunc(this._object), errorType, errorRegExp);
    } else {
      changeFunc(this._object);
    }

    await delay(10);

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed);
      this.checkSubscribes(this._subscribed[i], expectedSubscribed);
      this._unsubscribed[i] = [];
      this._subscribed[i] = [];
    }

    return this;
  }

  async unsubscribeAsync(expectedUnsubscribed, errorType, errorRegExp) {
    if (this._performanceTest) {
      for (let i = 0; i < this._ruleBuilders.length; i++) {
        this._unsubscribe[i]();
      }

      return this;
    }

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      assert.ok(this._unsubscribe[i]);
      assert.deepStrictEqual(this._subscribed[i], []);
      assert.deepStrictEqual(this._unsubscribed[i], []);

      if (errorType) {
        assert.throws(() => this._unsubscribe[i](), errorType, errorRegExp);
        assert.deepStrictEqual(this._subscribed[i], []);
        assert.deepStrictEqual(this._unsubscribed[i], []);
      } else {
        this._unsubscribe[i]();

        this._unsubscribe[i]();

        this._unsubscribe[i]();

        this._unsubscribe[i] = null;
        await delay(10);
        this.checkSubscribes(this._unsubscribed[i], expectedUnsubscribed);
        assert.deepStrictEqual(this._subscribed[i], []);
        this._unsubscribed[i] = [];
      }
    }

    return this;
  } // endregion


}

function repeat(value, count) {
  const array = [];

  for (let i = 0; i < count; i++) {
    array.push(value);
  }

  return array;
}