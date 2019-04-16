import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

/* tslint:disable:no-empty */
import { ObservableMap } from '../../../../../../../main/common/lists/ObservableMap';
import { ObservableSet } from '../../../../../../../main/common/lists/ObservableSet';
import { SortedList } from '../../../../../../../main/common/lists/SortedList';
import { deepSubscribe } from '../../../../../../../main/common/rx/deep-subscribe/deep-subscribe';
import { ObservableObject } from '../../../../../../../main/common/rx/object/ObservableObject';
import { ObservableObjectBuilder } from '../../../../../../../main/common/rx/object/ObservableObjectBuilder';
export function createObject() {
  var object = {};
  var list = new SortedList(); // @ts-ignore

  Object.defineProperty(list, 'listChanged', {
    configurable: true,
    writable: true,
    value: null
  });
  var set = new Set();
  var map = new Map();
  var observableObject = new ObservableObject();
  var observableList = new SortedList();
  var observableSet = new ObservableSet();
  var observableMap = new ObservableMap();
  Object.assign(object, {
    observableObject: observableObject,
    observableList: observableList,
    observableSet: observableSet,
    observableMap: observableMap,
    object: object,
    list: list,
    set: set,
    map: map,
    value: null
  });
  var observableObjectBuilder = new ObservableObjectBuilder(observableObject);
  Object.keys(object).forEach(function (key) {
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

function checkArray(actual, expected) {
  var log = JSON.stringify({
    actual: actual,
    expected: expected
  }, null, 4);

  if (actual == null) {
    assert.strictEqual(expected, null, log);
    return;
  }

  assert.strictEqual(actual.length, expected.length, log);

  for (var i = 0, len = actual.length; i < len; i++) {
    assert.strictEqual(actual[i], expected[i], log);
  }
}

function firstOrEmpty(array) {
  if (array.length === 0) {
    return 0;
  }

  return [array[0]];
}

export var Tester =
/*#__PURE__*/
function () {
  function Tester(_ref) {
    var object = _ref.object,
        immediate = _ref.immediate,
        ignoreSubscribeCount = _ref.ignoreSubscribeCount,
        performanceTest = _ref.performanceTest,
        doNotSubscribeNonObjectValues = _ref.doNotSubscribeNonObjectValues;

    _classCallCheck(this, Tester);

    this._object = object;
    this._immediate = immediate;
    this._ignoreSubscribeCount = ignoreSubscribeCount;
    this._performanceTest = performanceTest;
    this._doNotSubscribeNonObjectValues = doNotSubscribeNonObjectValues;

    for (var _len = arguments.length, ruleBuilders = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      ruleBuilders[_key - 1] = arguments[_key];
    }

    this._ruleBuilders = ruleBuilders;
    this._unsubscribe = ruleBuilders.map(function (o) {
      return null;
    });

    if (!performanceTest) {
      this._subscribed = ruleBuilders.map(function (o) {
        return [];
      });
      this._unsubscribed = ruleBuilders.map(function (o) {
        return [];
      });
    }
  }

  _createClass(Tester, [{
    key: "checkSubscribes",
    value: function checkSubscribes(subscribes, expectedSubscribes) {
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

      for (var i = 0; i < subscribes.length; i++) {
        assert.equal(subscribes[i], expectedSubscribes[0]);
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(expectedSubscribed, expectedUnsubscribed, errorType, errorRegExp) {
      var _this = this;

      var subscribe = function subscribe(ruleBuilder, i) {
        _this._unsubscribe[i] = deepSubscribe(_this._object, function (value) {
          if (_this._doNotSubscribeNonObjectValues && !(value instanceof Object)) {
            return;
          }

          if (_this._performanceTest) {
            return function () {};
          }

          _this._subscribed[i].push(value);

          return function () {
            _this._unsubscribed[i].push(value);
          };
        }, _this._immediate, ruleBuilder);
      };

      if (this._performanceTest) {
        for (var i = 0; i < this._ruleBuilders.length; i++) {
          var _ruleBuilder = this._ruleBuilders[i];
          subscribe(_ruleBuilder, i);
        }

        return this;
      }

      var _loop = function _loop(_i) {
        var ruleBuilder = _this._ruleBuilders[_i];
        assert.ok(_this._unsubscribe[_i] == null);
        assert.deepStrictEqual(_this._subscribed[_i], []);
        assert.deepStrictEqual(_this._unsubscribed[_i], []);

        if (errorType) {
          assert.throws(function () {
            return subscribe(ruleBuilder, _i);
          }, errorType, errorRegExp);
        } else {
          subscribe(ruleBuilder, _i);
          expectedUnsubscribed = [];
        }

        _this.checkSubscribes(_this._unsubscribed[_i], expectedUnsubscribed);

        if (!expectedSubscribed) {
          assert.strictEqual(_this._unsubscribe[_i], null);
          assert.deepStrictEqual(_this._subscribed[_i], []);
        } else {
          _this.checkSubscribes(_this._subscribed[_i], expectedSubscribed);

          _this._subscribed[_i] = [];
        }
      };

      for (var _i = 0; _i < this._ruleBuilders.length; _i++) {
        _loop(_i);
      }

      return this;
    }
  }, {
    key: "change",
    value: function change(changeFunc, expectedUnsubscribed, expectedSubscribed, errorType, errorRegExp) {
      var _this2 = this;

      if (this._performanceTest) {
        changeFunc(this._object);
        return this;
      }

      for (var i = 0; i < this._ruleBuilders.length; i++) {
        assert.deepStrictEqual(this._subscribed[i], []);
        assert.deepStrictEqual(this._unsubscribed[i], []);
      }

      if (typeof expectedUnsubscribed === 'function') {
        expectedUnsubscribed = expectedUnsubscribed(this._object);
      }

      if (errorType) {
        assert.throws(function () {
          return changeFunc(_this2._object);
        }, errorType, errorRegExp);
      } else {
        changeFunc(this._object);
      }

      for (var _i2 = 0; _i2 < this._ruleBuilders.length; _i2++) {
        this.checkSubscribes(this._unsubscribed[_i2], expectedUnsubscribed);
        this.checkSubscribes(this._subscribed[_i2], expectedSubscribed);
        this._unsubscribed[_i2] = [];
        this._subscribed[_i2] = [];
      }

      return this;
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(expectedUnsubscribed, errorType, errorRegExp) {
      var _this3 = this;

      if (this._performanceTest) {
        for (var i = 0; i < this._ruleBuilders.length; i++) {
          this._unsubscribe[i]();
        }

        return this;
      }

      var _loop2 = function _loop2(_i3) {
        assert.ok(_this3._unsubscribe[_i3]);
        assert.deepStrictEqual(_this3._subscribed[_i3], []);
        assert.deepStrictEqual(_this3._unsubscribed[_i3], []);

        if (errorType) {
          assert.throws(function () {
            return _this3._unsubscribe[_i3]();
          }, errorType, errorRegExp);
          assert.deepStrictEqual(_this3._subscribed[_i3], []);
          assert.deepStrictEqual(_this3._unsubscribed[_i3], []);
        } else {
          _this3._unsubscribe[_i3]();

          _this3._unsubscribe[_i3]();

          _this3._unsubscribe[_i3]();

          _this3._unsubscribe[_i3] = null;

          _this3.checkSubscribes(_this3._unsubscribed[_i3], expectedUnsubscribed);

          assert.deepStrictEqual(_this3._subscribed[_i3], []);
          _this3._unsubscribed[_i3] = [];
        }
      };

      for (var _i3 = 0; _i3 < this._ruleBuilders.length; _i3++) {
        _loop2(_i3);
      }

      return this;
    }
  }]);

  return Tester;
}();

function repeat(value, count) {
  var array = [];

  for (var i = 0; i < count; i++) {
    array.push(value);
  }

  return array;
}