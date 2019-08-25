import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

/* tslint:disable:no-empty */
import { delay } from '../../../../../../../main/common/helpers/helpers';
import { ObservableMap } from '../../../../../../../main/common/lists/ObservableMap';
import { ObservableSet } from '../../../../../../../main/common/lists/ObservableSet';
import { SortedList } from '../../../../../../../main/common/lists/SortedList';
import { VALUE_PROPERTY_DEFAULT } from '../../../../../../../main/common/rx/deep-subscribe/contracts/constants';
import { deepSubscribe } from '../../../../../../../main/common/rx/deep-subscribe/deep-subscribe';
import { ObservableObject } from '../../../../../../../main/common/rx/object/ObservableObject';
import { ObservableObjectBuilder } from '../../../../../../../main/common/rx/object/ObservableObjectBuilder';
import { Assert } from '../../../../../../../main/common/test/Assert';
import { DeepCloneEqual } from '../../../../../../../main/common/test/DeepCloneEqual';
var assert = new Assert(new DeepCloneEqual({
  commonOptions: {},
  equalOptions: {
    equalInnerReferences: true,
    equalMapSetOrder: true
  }
}));
export function createObject() {
  var _Object$assign;

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
  var property = new ObservableObject();
  Object.assign(object, (_Object$assign = {}, _defineProperty(_Object$assign, VALUE_PROPERTY_DEFAULT, 'nothing'), _defineProperty(_Object$assign, "observableObject", observableObject), _defineProperty(_Object$assign, "observableList", observableList), _defineProperty(_Object$assign, "observableSet", observableSet), _defineProperty(_Object$assign, "observableMap", observableMap), _defineProperty(_Object$assign, "object", object), _defineProperty(_Object$assign, "property", property), _defineProperty(_Object$assign, "list", list), _defineProperty(_Object$assign, "set", set), _defineProperty(_Object$assign, "map", map), _defineProperty(_Object$assign, "value", null), _defineProperty(_Object$assign, "promiseSync", {
    then: function then(resolve) {
      return resolve(observableObject);
    }
  }), _defineProperty(_Object$assign, "promiseAsync", {
    then: function then(resolve) {
      return setTimeout(function () {
        return resolve(observableObject);
      }, 0);
    }
  }), _Object$assign));
  var observableObjectBuilder = new ObservableObjectBuilder(observableObject);
  var propertyBuilder = new ObservableObjectBuilder(property);
  Object.keys(object).forEach(function (key) {
    if (key !== 'value') {
      list.add(object[key]);
      set.add(object[key]);
      map.set(key, object[key]);
      observableList.add(object[key]);
      observableSet.add(object[key]);
      observableMap.set(key, object[key]);
    }

    if (key !== VALUE_PROPERTY_DEFAULT) {
      observableObjectBuilder.writable(key, null, object[key]);
      propertyBuilder.writable('value_' + key, null, object[key]);
    }
  });
  propertyBuilder.writable(VALUE_PROPERTY_DEFAULT, null, observableObject);
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
        doNotSubscribeNonObjectValues = _ref.doNotSubscribeNonObjectValues,
        useIncorrectUnsubscribe = _ref.useIncorrectUnsubscribe;

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
    this._useIncorrectUnsubscribe = useIncorrectUnsubscribe;
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
        assert.circularDeepStrictEqual(subscribes, expectedSubscribes);
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
    key: "subscribePrivate",
    value: function subscribePrivate(ruleBuilder, i) {
      var _this = this;

      this._unsubscribe[i] = deepSubscribe(this._object, function (value) {
        if (_this._doNotSubscribeNonObjectValues && !(value instanceof Object)) {
          return;
        }

        if (_this._performanceTest) {
          return function () {};
        }

        _this._subscribed[i].push(value);

        if (_this._useIncorrectUnsubscribe) {
          return 'Test Incorrect Unsubscribe';
        }

        return function () {
          _this._unsubscribed[i].push(value);
        };
      }, this._immediate, Math.random() > 0.5 ? function (o) {
        return ruleBuilder(o).clone();
      } : ruleBuilder);
    } // region Sync

  }, {
    key: "subscribe",
    value: function subscribe(expectedSubscribed, expectedUnsubscribed, errorType, errorRegExp) {
      var _this2 = this;

      if (this._performanceTest) {
        for (var i = 0; i < this._ruleBuilders.length; i++) {
          var _ruleBuilder = this._ruleBuilders[i];
          this.subscribePrivate(_ruleBuilder, i);
        }

        return this;
      }

      var _loop = function _loop(_i) {
        var ruleBuilder = _this2._ruleBuilders[_i];
        assert.ok(_this2._unsubscribe[_i] == null);
        assert.deepStrictEqual(_this2._subscribed[_i], []);
        assert.deepStrictEqual(_this2._unsubscribed[_i], []);

        if (errorType) {
          assert["throws"](function () {
            return _this2.subscribePrivate(ruleBuilder, _i);
          }, errorType, errorRegExp);
        } else {
          _this2.subscribePrivate(ruleBuilder, _i);

          expectedUnsubscribed = [];
        }

        _this2.checkSubscribes(_this2._unsubscribed[_i], expectedUnsubscribed);

        if (!expectedSubscribed) {
          assert.strictEqual(_this2._unsubscribe[_i], null);
          assert.deepStrictEqual(_this2._subscribed[_i], []);
        } else {
          _this2.checkSubscribes(_this2._subscribed[_i], expectedSubscribed);

          _this2._subscribed[_i] = [];
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
      var _this3 = this;

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
        assert["throws"](function () {
          return changeFunc(_this3._object);
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
      var _this4 = this;

      if (this._performanceTest) {
        for (var i = 0; i < this._ruleBuilders.length; i++) {
          this._unsubscribe[i]();
        }

        return this;
      }

      var _loop2 = function _loop2(_i3) {
        assert.ok(_this4._unsubscribe[_i3]);
        assert.deepStrictEqual(_this4._subscribed[_i3], []);
        assert.deepStrictEqual(_this4._unsubscribed[_i3], []);

        if (errorType) {
          assert["throws"](function () {
            return _this4._unsubscribe[_i3]();
          }, errorType, errorRegExp);
          assert.deepStrictEqual(_this4._subscribed[_i3], []);
          assert.deepStrictEqual(_this4._unsubscribed[_i3], []);
        } else {
          _this4._unsubscribe[_i3]();

          _this4._unsubscribe[_i3]();

          _this4._unsubscribe[_i3]();

          _this4._unsubscribe[_i3] = null;

          _this4.checkSubscribes(_this4._unsubscribed[_i3], expectedUnsubscribed);

          assert.deepStrictEqual(_this4._subscribed[_i3], []);
          _this4._unsubscribed[_i3] = [];
        }
      };

      for (var _i3 = 0; _i3 < this._ruleBuilders.length; _i3++) {
        _loop2(_i3);
      }

      return this;
    } // endregion
    // region Async

  }, {
    key: "subscribeAsync",
    value: function () {
      var _subscribeAsync = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(expectedSubscribed, expectedUnsubscribed, errorType, errorRegExp) {
        var _this5 = this;

        var i, _ruleBuilder2, _loop3, _i4;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!this._performanceTest) {
                  _context2.next = 3;
                  break;
                }

                for (i = 0; i < this._ruleBuilders.length; i++) {
                  _ruleBuilder2 = this._ruleBuilders[i];
                  this.subscribePrivate(_ruleBuilder2, i);
                }

                return _context2.abrupt("return", this);

              case 3:
                _loop3 =
                /*#__PURE__*/
                _regeneratorRuntime.mark(function _callee(_i4) {
                  var ruleBuilder;
                  return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          ruleBuilder = _this5._ruleBuilders[_i4];
                          assert.ok(_this5._unsubscribe[_i4] == null);
                          assert.deepStrictEqual(_this5._subscribed[_i4], []);
                          assert.deepStrictEqual(_this5._unsubscribed[_i4], []);

                          if (errorType) {
                            assert["throws"](function () {
                              return _this5.subscribePrivate(ruleBuilder, _i4);
                            }, errorType, errorRegExp);
                          } else {
                            _this5.subscribePrivate(ruleBuilder, _i4);

                            expectedUnsubscribed = [];
                          }

                          _context.next = 7;
                          return delay(10);

                        case 7:
                          _this5.checkSubscribes(_this5._unsubscribed[_i4], expectedUnsubscribed);

                          if (!expectedSubscribed) {
                            assert.strictEqual(_this5._unsubscribe[_i4], null);
                            assert.deepStrictEqual(_this5._subscribed[_i4], []);
                          } else {
                            _this5.checkSubscribes(_this5._subscribed[_i4], expectedSubscribed);

                            _this5._subscribed[_i4] = [];
                          }

                        case 9:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                });
                _i4 = 0;

              case 5:
                if (!(_i4 < this._ruleBuilders.length)) {
                  _context2.next = 10;
                  break;
                }

                return _context2.delegateYield(_loop3(_i4), "t0", 7);

              case 7:
                _i4++;
                _context2.next = 5;
                break;

              case 10:
                return _context2.abrupt("return", this);

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function subscribeAsync(_x, _x2, _x3, _x4) {
        return _subscribeAsync.apply(this, arguments);
      }

      return subscribeAsync;
    }()
  }, {
    key: "changeAsync",
    value: function () {
      var _changeAsync = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3(changeFunc, expectedUnsubscribed, expectedSubscribed, errorType, errorRegExp) {
        var _this6 = this;

        var i, _i5;

        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this._performanceTest) {
                  _context3.next = 3;
                  break;
                }

                changeFunc(this._object);
                return _context3.abrupt("return", this);

              case 3:
                for (i = 0; i < this._ruleBuilders.length; i++) {
                  assert.deepStrictEqual(this._subscribed[i], []);
                  assert.deepStrictEqual(this._unsubscribed[i], []);
                }

                if (typeof expectedUnsubscribed === 'function') {
                  expectedUnsubscribed = expectedUnsubscribed(this._object);
                }

                if (errorType) {
                  assert["throws"](function () {
                    return changeFunc(_this6._object);
                  }, errorType, errorRegExp);
                } else {
                  changeFunc(this._object);
                }

                _context3.next = 8;
                return delay(10);

              case 8:
                for (_i5 = 0; _i5 < this._ruleBuilders.length; _i5++) {
                  this.checkSubscribes(this._unsubscribed[_i5], expectedUnsubscribed);
                  this.checkSubscribes(this._subscribed[_i5], expectedSubscribed);
                  this._unsubscribed[_i5] = [];
                  this._subscribed[_i5] = [];
                }

                return _context3.abrupt("return", this);

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function changeAsync(_x5, _x6, _x7, _x8, _x9) {
        return _changeAsync.apply(this, arguments);
      }

      return changeAsync;
    }()
  }, {
    key: "unsubscribeAsync",
    value: function () {
      var _unsubscribeAsync = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee5(expectedUnsubscribed, errorType, errorRegExp) {
        var _this7 = this;

        var i, _loop4, _i6;

        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!this._performanceTest) {
                  _context5.next = 3;
                  break;
                }

                for (i = 0; i < this._ruleBuilders.length; i++) {
                  this._unsubscribe[i]();
                }

                return _context5.abrupt("return", this);

              case 3:
                _loop4 =
                /*#__PURE__*/
                _regeneratorRuntime.mark(function _callee4(_i6) {
                  return _regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                      switch (_context4.prev = _context4.next) {
                        case 0:
                          assert.ok(_this7._unsubscribe[_i6]);
                          assert.deepStrictEqual(_this7._subscribed[_i6], []);
                          assert.deepStrictEqual(_this7._unsubscribed[_i6], []);

                          if (!errorType) {
                            _context4.next = 9;
                            break;
                          }

                          assert["throws"](function () {
                            return _this7._unsubscribe[_i6]();
                          }, errorType, errorRegExp);
                          assert.deepStrictEqual(_this7._subscribed[_i6], []);
                          assert.deepStrictEqual(_this7._unsubscribed[_i6], []);
                          _context4.next = 18;
                          break;

                        case 9:
                          _this7._unsubscribe[_i6]();

                          _this7._unsubscribe[_i6]();

                          _this7._unsubscribe[_i6]();

                          _this7._unsubscribe[_i6] = null;
                          _context4.next = 15;
                          return delay(10);

                        case 15:
                          _this7.checkSubscribes(_this7._unsubscribed[_i6], expectedUnsubscribed);

                          assert.deepStrictEqual(_this7._subscribed[_i6], []);
                          _this7._unsubscribed[_i6] = [];

                        case 18:
                        case "end":
                          return _context4.stop();
                      }
                    }
                  }, _callee4);
                });
                _i6 = 0;

              case 5:
                if (!(_i6 < this._ruleBuilders.length)) {
                  _context5.next = 10;
                  break;
                }

                return _context5.delegateYield(_loop4(_i6), "t0", 7);

              case 7:
                _i6++;
                _context5.next = 5;
                break;

              case 10:
                return _context5.abrupt("return", this);

              case 11:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function unsubscribeAsync(_x10, _x11, _x12) {
        return _unsubscribeAsync.apply(this, arguments);
      }

      return unsubscribeAsync;
    }() // endregion

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