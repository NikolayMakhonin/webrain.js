"use strict";

var _ObservableMap = require("../../../../../../main/common/lists/ObservableMap");

var _ObservableSet = require("../../../../../../main/common/lists/ObservableSet");

var _SortedList = require("../../../../../../main/common/lists/SortedList");

var _deepSubscribe = require("../../../../../../main/common/rx/deep-subscribe/deep-subscribe");

var _ObservableObject = require("../../../../../../main/common/rx/object/ObservableObject");

var _ObservableObjectBuilder = require("../../../../../../main/common/rx/object/ObservableObjectBuilder");

describe('common > main > rx > deep-subscribe > deep-subscribe', function () {
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
      map
    });
    const observableObjectBuilder = new _ObservableObjectBuilder.ObservableObjectBuilder(observableObject);
    Object.keys(object).forEach(key => {
      list.add(object[key]);
      set.add(object[key]);
      map.set(key, object[key]);
      observableObjectBuilder.writable(key, null, object[key]);
      observableList.add(object[key]);
      observableSet.add(object[key]);
      observableMap.set(key, object[key]);
    });
    return object;
  }

  class Tester {
    constructor(obj, immediate, ruleBuilder) {
      this._subscribed = [];
      this._unsubscribed = [];
      this._object = obj;
      this._immediate = immediate;
      this._ruleBuilder = ruleBuilder;
    }

    subscribe(expectedSubscribed) {
      assert.ok(this._unsubscribe == null);
      assert.deepStrictEqual(this._subscribed, []);
      assert.deepStrictEqual(this._unsubscribed, []);
      this._unsubscribe = (0, _deepSubscribe.deepSubscribe)(this._object, value => {
        this._subscribed.push(value);

        return () => {
          this._unsubscribed.push(value);
        };
      }, this._immediate, this._ruleBuilder);
      assert.deepStrictEqual(this._unsubscribed, []);

      if (!expectedSubscribed) {
        assert.strictEqual(this._unsubscribe, null);
        assert.deepStrictEqual(this._subscribed, []);
      } else {
        assert.deepStrictEqual(this._subscribed, expectedSubscribed);
        this._subscribed = [];
      }
    }

    change(expectedUnsubscribed, expectedSubscribed, changeFunc) {
      assert.deepStrictEqual(this._subscribed, []);
      assert.deepStrictEqual(this._unsubscribed, []);
      changeFunc(this._object);
      assert.deepStrictEqual(this._unsubscribed, expectedUnsubscribed);
      assert.deepStrictEqual(this._subscribed, expectedSubscribed);
    }

    unsubscribe(expectedUnsubscribed) {
      assert.ok(this._unsubscribe);
      assert.deepStrictEqual(this._subscribed, []);
      assert.deepStrictEqual(this._unsubscribed, []);

      this._unsubscribe();

      assert.deepStrictEqual(this._unsubscribed, expectedUnsubscribed);
      assert.deepStrictEqual(this._subscribed, []);
    }

  }

  it('object', function () {
    const tester = new Tester(createObject().object, false, b => b.path(o => o.object));
    tester.subscribe(null);
    tester.change([], [], object => {
      object.object = null;
    });
  });
});