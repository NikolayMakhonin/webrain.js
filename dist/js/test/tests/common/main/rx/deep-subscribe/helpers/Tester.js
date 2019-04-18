"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createObject = createObject;
exports.Tester = void 0;

var _ObservableMap = require("../../../../../../../main/common/lists/ObservableMap");

var _ObservableSet = require("../../../../../../../main/common/lists/ObservableSet");

var _SortedList = require("../../../../../../../main/common/lists/SortedList");

var _deepSubscribe = require("../../../../../../../main/common/rx/deep-subscribe/deep-subscribe");

var _ObservableObject = require("../../../../../../../main/common/rx/object/ObservableObject");

var _ObservableObjectBuilder = require("../../../../../../../main/common/rx/object/ObservableObjectBuilder");

/* tslint:disable:no-empty */
function createObject() {
  const object = {};
  const list = new _SortedList.SortedList(); // @ts-ignore

  Object.defineProperty(list, 'listChanged', {
    configurable: true,
    writable: true,
    value: null
  });
  const set = new Set();
  const map = new Map();
  const observableObject = new _ObservableObject.ObservableObject();
  const observableList = new _SortedList.SortedList();
  const observableSet = new _ObservableSet.ObservableSet();
  const observableMap = new _ObservableMap.ObservableMap();
  Object.assign(object, {
    observableObject,
    observableList,
    observableSet,
    observableMap,
    object,
    list,
    set,
    map,
    value: null
  });
  const observableObjectBuilder = new _ObservableObjectBuilder.ObservableObjectBuilder(observableObject);
  Object.keys(object).forEach(key => {
    if (key !== 'value') {
      list.add(object[key]);
      set.add(object[key]);
      map.set(key, object[key]);
      observableList.add(object[key]);
      observableSet.add(object[key]);
      observableMap.set(key, object[key]);
    }

    observableObjectBuilder.writable(key, null, object[key]);
  });
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

class Tester {
  constructor({
    object,
    immediate,
    ignoreSubscribeCount,
    performanceTest,
    doNotSubscribeNonObjectValues
  }, ...ruleBuilders) {
    this._object = object;
    this._immediate = immediate;
    this._ignoreSubscribeCount = ignoreSubscribeCount;
    this._performanceTest = performanceTest;
    this._doNotSubscribeNonObjectValues = doNotSubscribeNonObjectValues;
    this._ruleBuilders = ruleBuilders;
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
      assert.deepStrictEqual(subscribes, expectedSubscribes);
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

  subscribe(expectedSubscribed, expectedUnsubscribed, errorType, errorRegExp) {
    const subscribe = (ruleBuilder, i) => {
      this._unsubscribe[i] = (0, _deepSubscribe.deepSubscribe)(this._object, value => {
        if (this._doNotSubscribeNonObjectValues && !(value instanceof Object)) {
          return;
        }

        if (this._performanceTest) {
          return () => {};
        }

        this._subscribed[i].push(value);

        return () => {
          this._unsubscribed[i].push(value);
        };
      }, this._immediate, ruleBuilder);
    };

    if (this._performanceTest) {
      for (let i = 0; i < this._ruleBuilders.length; i++) {
        const ruleBuilder = this._ruleBuilders[i];
        subscribe(ruleBuilder, i);
      }

      return this;
    }

    for (let i = 0; i < this._ruleBuilders.length; i++) {
      const ruleBuilder = this._ruleBuilders[i];
      assert.ok(this._unsubscribe[i] == null);
      assert.deepStrictEqual(this._subscribed[i], []);
      assert.deepStrictEqual(this._unsubscribed[i], []);

      if (errorType) {
        assert.throws(() => subscribe(ruleBuilder, i), errorType, errorRegExp);
      } else {
        subscribe(ruleBuilder, i);
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
  }

}

exports.Tester = Tester;

function repeat(value, count) {
  const array = [];

  for (let i = 0; i < count; i++) {
    array.push(value);
  }

  return array;
}