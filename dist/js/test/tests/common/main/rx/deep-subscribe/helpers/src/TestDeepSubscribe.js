"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.createObject = createObject;
exports.TestDeepSubscribeVariants = exports.TestDeepSubscribe = void 0;

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _helpers = require("../../../../../../../../main/common/time/helpers");

var _valueProperty = require("../../../../../../../../main/common/helpers/value-property");

var _ObservableMap = require("../../../../../../../../main/common/lists/ObservableMap");

var _ObservableSet = require("../../../../../../../../main/common/lists/ObservableSet");

var _SortedList = require("../../../../../../../../main/common/lists/SortedList");

var _common = require("../../../../../../../../main/common/rx/deep-subscribe/contracts/common");

var _deepSubscribe = require("../../../../../../../../main/common/rx/deep-subscribe/deep-subscribe");

var _ObservableClass2 = require("../../../../../../../../main/common/rx/object/ObservableClass");

var _ObservableObjectBuilder = require("../../../../../../../../main/common/rx/object/ObservableObjectBuilder");

var _Assert = require("../../../../../../../../main/common/test/Assert");

var _DeepCloneEqual = require("../../../../../../../../main/common/test/DeepCloneEqual");

var _RuleBuildersBuilder = require("./RuleBuildersBuilder");

/* tslint:disable:no-empty no-construct use-primitive-type no-duplicate-string */
var assert = new _Assert.Assert(new _DeepCloneEqual.DeepCloneEqual({
  commonOptions: {},
  equalOptions: {
    equalInnerReferences: true,
    equalMapSetOrder: true
  }
}));

function createObject() {
  var _Object$assign2, _context;

  var object = {};
  var list = new _SortedList.SortedList(); // @ts-ignore

  (0, _defineProperty.default)(list, 'listChanged', {
    configurable: true,
    writable: true,
    value: null
  });
  var set = new _set.default();
  var map2 = new _map2.default();

  var ObservableClasss =
  /*#__PURE__*/
  function (_ObservableClass) {
    (0, _inherits2.default)(ObservableClasss, _ObservableClass);

    function ObservableClasss() {
      (0, _classCallCheck2.default)(this, ObservableClasss);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf3.default)(ObservableClasss).apply(this, arguments));
    }

    return ObservableClasss;
  }(_ObservableClass2.ObservableClass);

  var observableObjectPrototype = new ObservableClasss();
  var observableObject = new _ObservableClass2.ObservableClass();
  var observableList = new _SortedList.SortedList();
  var observableSet = new _ObservableSet.ObservableSet();
  var observableMap = new _ObservableMap.ObservableMap();
  var property = new _ObservableClass2.ObservableClass();
  (0, _assign.default)(object, (_Object$assign2 = {}, _Object$assign2[_valueProperty.VALUE_PROPERTY_DEFAULT] = 'nothing', _Object$assign2.observableObjectPrototype = observableObjectPrototype, _Object$assign2.observableObject = observableObject, _Object$assign2.observableList = observableList, _Object$assign2.observableSet = observableSet, _Object$assign2.observableMap = observableMap, _Object$assign2.object = object, _Object$assign2.property = property, _Object$assign2.list = list, _Object$assign2.set = set, _Object$assign2.map2 = map2, _Object$assign2.valueUndefined = void 0, _Object$assign2.value = 'value', _Object$assign2.valueArray = ['value1', 'value2'], _Object$assign2.valueObject = new String('value'), _Object$assign2.promiseSync = {
    then: function then(resolve) {
      return resolve(observableObject);
    }
  }, _Object$assign2.promiseAsync = {
    then: function then(resolve) {
      return (0, _setTimeout2.default)(function () {
        return resolve(observableObject);
      }, 0);
    }
  }, _Object$assign2));
  var observableObjectBuilderPrototype = new _ObservableObjectBuilder.ObservableObjectBuilder(ObservableClasss.prototype);
  var observableObjectBuilder = new _ObservableObjectBuilder.ObservableObjectBuilder(observableObject);
  var propertyBuilder = new _ObservableObjectBuilder.ObservableObjectBuilder(property);
  (0, _forEach.default)(_context = (0, _keys.default)(object)).call(_context, function (key) {
    // if (key !== 'value' && key !== 'valueObject') {
    list.add(object[key]);
    set.add(object[key]);
    map2.set(key, object[key]);
    observableList.add(object[key]);
    observableSet.add(object[key]);
    observableMap.set(key, object[key]); // }

    if (key !== _valueProperty.VALUE_PROPERTY_DEFAULT) {
      if (key !== 'valueObjectWritable') {
        observableObjectBuilderPrototype.readable(key, null, object[key]);
      }

      observableObjectBuilder.writable(key, null, object[key]);
      propertyBuilder.writable('value_' + key, null, object[key]);
    }
  });
  observableObjectBuilderPrototype.writable('valueObjectWritable');
  propertyBuilder.writable(_valueProperty.VALUE_PROPERTY_DEFAULT, null, observableObject);
  return object;
}

function checkArray(actual, expected) {
  var log = (0, _stringify.default)({
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

var TestDeepSubscribe =
/*#__PURE__*/
function () {
  function TestDeepSubscribe(_ref) {
    var object = _ref.object,
        immediate = _ref.immediate,
        ignoreSubscribeCount = _ref.ignoreSubscribeCount,
        performanceTest = _ref.performanceTest,
        doNotSubscribeNonObjectValues = _ref.doNotSubscribeNonObjectValues,
        useIncorrectUnsubscribe = _ref.useIncorrectUnsubscribe,
        shouldNeverSubscribe = _ref.shouldNeverSubscribe,
        _ref$asyncDelay = _ref.asyncDelay,
        asyncDelay = _ref$asyncDelay === void 0 ? 30 : _ref$asyncDelay;
    (0, _classCallCheck2.default)(this, TestDeepSubscribe);
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
    this._shouldNeverSubscribe = shouldNeverSubscribe;
    this._unsubscribe = (0, _map.default)(ruleBuilders).call(ruleBuilders, function (o) {
      return null;
    });
    this._asyncDelay = asyncDelay;

    if (!performanceTest) {
      TestDeepSubscribe.totalTests += ruleBuilders.length;
      this._subscribed = (0, _map.default)(ruleBuilders).call(ruleBuilders, function (o) {
        return [];
      });
      this._unsubscribed = (0, _map.default)(ruleBuilders).call(ruleBuilders, function (o) {
        return [];
      });
      this._lastValue = (0, _map.default)(ruleBuilders).call(ruleBuilders, function (o) {
        return [];
      });
      this._subscribersCount = (0, _map.default)(ruleBuilders).call(ruleBuilders, function (o) {
        return 0;
      });
      this._expectedLastValue = (0, _map.default)(ruleBuilders).call(ruleBuilders, function (o) {
        return [];
      });
    }
  }

  (0, _createClass2.default)(TestDeepSubscribe, [{
    key: "getDefaultExpectedLastValue",
    value: function getDefaultExpectedLastValue(expectedSubscribed, expectedUnsubscribed) {
      if (expectedUnsubscribed && expectedUnsubscribed.length) {
        if (expectedSubscribed && expectedSubscribed.length) {
          return typeof expectedSubscribed === 'function' ? function (o) {
            var values = expectedSubscribed(o);
            return values && values.length ? [void 0, values[values.length - 1]] : [void 0];
          } : [void 0, expectedSubscribed[expectedSubscribed.length - 1]];
        }

        return [void 0];
      }

      if (expectedSubscribed && expectedSubscribed.length) {
        return typeof expectedSubscribed === 'function' ? function (o) {
          var values = expectedSubscribed(o);
          return values && values.length ? [values[values.length - 1]] : [];
        } : [expectedSubscribed[expectedSubscribed.length - 1]];
      }

      return [];
    }
  }, {
    key: "checkLastValues",
    value: function checkLastValues(lastValue, expectedSubscribed, expectedUnsubscribed, expectedLastValue, message) {
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
  }, {
    key: "checkSubscribes",
    value: function checkSubscribes(subscribes, expectedSubscribes, message) {
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

      for (var i = 0; i < subscribes.length; i++) {
        assert.strictEqual(subscribes[i], expectedSubscribes[0], message);
      }
    }
  }, {
    key: "subscribePrivate",
    value: function subscribePrivate(ruleBuilder, i) {
      var _this = this;

      var subscribeValue = function subscribeValue(newValue, parent, key, propertiesPath, rule) {
        if (_this._doNotSubscribeNonObjectValues && !(newValue instanceof Object)) {
          if (typeof _this._expectedLastValue[i][_this._expectedLastValue[i].length - 1] === 'undefined' || _this._subscribersCount[i] === 0) {
            _this._expectedLastValue[i].push(newValue);
          }

          _this._subscribersCount[i]++;

          if (typeof newValue !== 'undefined') {
            _this._subscribed[i].push(newValue);
          }

          return;
        }

        if (_this._performanceTest) {
          return function () {};
        }

        if (typeof _this._expectedLastValue[i][_this._expectedLastValue[i].length - 1] === 'undefined' || _this._subscribersCount[i] === 0) {
          _this._expectedLastValue[i].push(newValue);
        }

        _this._subscribersCount[i]++;

        if (typeof newValue !== 'undefined') {
          _this._subscribed[i].push(newValue);
        }

        if (_this._useIncorrectUnsubscribe) {
          return 'Test Incorrect Unsubscribe';
        }

        return typeof newValue !== 'undefined' ? function () {
          _this._unsubscribed[i].push(newValue);
        } : null;
      };

      var unsubscribeValue = function unsubscribeValue(oldValue, parent, key, propertiesPath, rule, isUnsubscribed) {
        if (_this._performanceTest) {
          return;
        }

        _this._subscribersCount[i]--;

        if (_this._subscribersCount[i] === 0) {
          _this._expectedLastValue[i].push(void 0);
        }

        assert.ok(_this._subscribersCount[i] >= 0); // if (this._subscribersCount[i] < 0) {
        // 	assert.strictEqual(typeof value, 'undefined')
        // 	this._subscribersCount[i] = 0
        // }

        if (typeof oldValue !== 'undefined' && !isUnsubscribed) {
          _this._unsubscribed[i].push(oldValue);
        }
      };

      this._unsubscribe[i] = (0, _deepSubscribe.deepSubscribe)({
        object: this._object,
        changeValue: function changeValue(key, oldValue, newValue, parent, changeType, keyType, propertiesPath, rule, isUnsubscribed) {
          if ((changeType & _common.ValueChangeType.Unsubscribe) !== 0) {
            unsubscribeValue(oldValue, parent, key, propertiesPath, rule, isUnsubscribed);
          }

          if ((changeType & _common.ValueChangeType.Subscribe) !== 0) {
            return subscribeValue(newValue, parent, key, propertiesPath, rule);
          }
        },
        lastValue: function lastValue(value, parent, propertyName) {
          if (_this._performanceTest) {
            return function () {};
          }

          _this._lastValue[i].push(value);
        },
        immediate: this._immediate,
        ruleBuilder: Math.random() > 0.5 ? function (o) {
          return ruleBuilder(o).clone();
        } : ruleBuilder
      });
    } // region Sync

  }, {
    key: "subscribe",
    value: function subscribe(expectedSubscribed, expectedUnsubscribed, expectedLastValue, errorType, errorRegExp) {
      var _this2 = this;

      if (this._performanceTest) {
        for (var i = 0; i < this._ruleBuilders.length; i++) {
          var ruleBuilder = this._ruleBuilders[i];
          this.subscribePrivate(ruleBuilder, i);
        }

        return this;
      }

      var _loop = function _loop(_i) {
        var ruleBuilder = _this2._ruleBuilders[_i];
        assert.ok(_this2._unsubscribe[_i] == null, 'unsubscribe()');
        assert.deepStrictEqual(_this2._subscribed[_i], [], 'subscribed[]');
        assert.deepStrictEqual(_this2._unsubscribed[_i], [], 'unsubscribed[]');
        assert.deepStrictEqual(_this2._lastValue[_i], [], 'lastValue[]');

        if (errorType) {
          assert.throws(function () {
            return _this2.subscribePrivate(ruleBuilder, _i);
          }, errorType, errorRegExp);
        } else {
          _this2.subscribePrivate(ruleBuilder, _i);

          expectedUnsubscribed = [];
        }

        _this2.checkSubscribes(_this2._unsubscribed[_i], expectedUnsubscribed, 'unsubscribe[]');

        if (!expectedSubscribed) {
          assert.strictEqual(_this2._unsubscribe[_i], null, 'unsubscribe()');
          assert.deepStrictEqual(_this2._subscribed[_i], [], 'subscribed[]');
        } else {
          _this2.checkSubscribes(_this2._subscribed[_i], expectedSubscribed, 'subscribed[]');

          _this2._subscribed[_i] = [];
        }

        _this2.checkLastValues(_this2._lastValue[_i], expectedSubscribed, expectedUnsubscribed, expectedLastValue || _this2._expectedLastValue[_i], 'lastValue[]');

        _this2._lastValue[_i] = [];
        _this2._expectedLastValue[_i] = [];
      };

      for (var _i = 0; _i < this._ruleBuilders.length; _i++) {
        _loop(_i);
      }

      return this;
    }
  }, {
    key: "change",
    value: function change(changeFunc, expectedUnsubscribed, expectedSubscribed, expectedLastValue, errorType, errorRegExp) {
      var _this3 = this;

      if (this._performanceTest) {
        changeFunc(this._object);
        return this;
      }

      for (var i = 0; i < this._ruleBuilders.length; i++) {
        assert.deepStrictEqual(this._subscribed[i], [], 'subscribed[]');
        assert.deepStrictEqual(this._unsubscribed[i], [], 'unsubscribed[]');
        assert.deepStrictEqual(this._lastValue[i], [], 'lastValue[]');
      }

      if (typeof expectedUnsubscribed === 'function') {
        expectedUnsubscribed = expectedUnsubscribed(this._object);
      }

      if (errorType) {
        assert.throws(function () {
          return changeFunc(_this3._object);
        }, errorType, errorRegExp);
      } else {
        changeFunc(this._object);
      }

      for (var _i2 = 0; _i2 < this._ruleBuilders.length; _i2++) {
        this.checkSubscribes(this._unsubscribed[_i2], expectedUnsubscribed, 'unsubscribed[]');
        this.checkSubscribes(this._subscribed[_i2], expectedSubscribed, 'subscribed[]');
        this.checkLastValues(this._lastValue[_i2], expectedSubscribed, expectedUnsubscribed, expectedLastValue || this._expectedLastValue[_i2], 'lastValue[]');
        this._unsubscribed[_i2] = [];
        this._subscribed[_i2] = [];
        this._lastValue[_i2] = [];
        this._expectedLastValue[_i2] = [];
      }

      return this;
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(expectedUnsubscribed, expectedLastValue, errorType, errorRegExp) {
      var _this4 = this;

      if (this._performanceTest) {
        for (var i = 0; i < this._ruleBuilders.length; i++) {
          this._unsubscribe[i]();
        }

        return this;
      }

      var _loop2 = function _loop2(_i3) {
        if (_this4._shouldNeverSubscribe) {
          assert.ok(_this4._unsubscribe[_i3] == null, 'unsubscribe()');
        } else {
          assert.ok(_this4._unsubscribe[_i3], 'unsubscribe()');
        }

        assert.deepStrictEqual(_this4._subscribed[_i3], [], 'subscribed[]');
        assert.deepStrictEqual(_this4._unsubscribed[_i3], [], 'unsubscribed[]');
        assert.deepStrictEqual(_this4._lastValue[_i3], [], 'lastValue[]');

        if (errorType) {
          assert.throws(function () {
            return _this4._unsubscribe[_i3]();
          }, errorType, errorRegExp);
          assert.deepStrictEqual(_this4._subscribed[_i3], [], 'subscribed[]');
          assert.deepStrictEqual(_this4._unsubscribed[_i3], [], 'unsubscribed[]');
          assert.deepStrictEqual(_this4._lastValue[_i3], [], 'lastValue[]');
        } else {
          if (!_this4._shouldNeverSubscribe) {
            _this4._unsubscribe[_i3]();

            _this4._unsubscribe[_i3]();

            _this4._unsubscribe[_i3]();

            _this4._unsubscribe[_i3] = null;
          }

          _this4.checkSubscribes(_this4._unsubscribed[_i3], expectedUnsubscribed, 'unsubscribed[]');

          assert.strictEqual(_this4._subscribersCount[_i3], 0, 'subscribersCount');
          assert.deepStrictEqual(_this4._subscribed[_i3], [], 'subscribed[]');

          _this4.checkLastValues(_this4._lastValue[_i3], null, expectedUnsubscribed, expectedLastValue || _this4._expectedLastValue[_i3], 'lastValue[]');

          _this4._unsubscribed[_i3] = [];
          _this4._lastValue[_i3] = [];
          _this4._expectedLastValue[_i3] = [];
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
      var _subscribeAsync = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(expectedSubscribed, expectedUnsubscribed, expectedLastValue, errorType, errorRegExp) {
        var _this5 = this;

        var i, ruleBuilder, _loop3, _i4;

        return _regenerator.default.wrap(function _callee$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this._performanceTest) {
                  _context3.next = 3;
                  break;
                }

                for (i = 0; i < this._ruleBuilders.length; i++) {
                  ruleBuilder = this._ruleBuilders[i];
                  this.subscribePrivate(ruleBuilder, i);
                }

                return _context3.abrupt("return", this);

              case 3:
                _loop3 =
                /*#__PURE__*/
                _regenerator.default.mark(function _loop3(_i4) {
                  var ruleBuilder;
                  return _regenerator.default.wrap(function _loop3$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          ruleBuilder = _this5._ruleBuilders[_i4];
                          assert.ok(_this5._unsubscribe[_i4] == null, 'unsubscribe()');
                          assert.deepStrictEqual(_this5._subscribed[_i4], [], 'subscribed[]');
                          assert.deepStrictEqual(_this5._unsubscribed[_i4], [], 'unsubscribed[]');
                          assert.deepStrictEqual(_this5._lastValue[_i4], [], 'lastValue[]');

                          if (errorType) {
                            assert.throws(function () {
                              return _this5.subscribePrivate(ruleBuilder, _i4);
                            }, errorType, errorRegExp);
                          } else {
                            _this5.subscribePrivate(ruleBuilder, _i4);

                            expectedUnsubscribed = [];
                          }

                          _context2.next = 8;
                          return (0, _helpers.delay)(_this5._asyncDelay);

                        case 8:
                          _this5.checkSubscribes(_this5._unsubscribed[_i4], expectedUnsubscribed, 'unsubscribed[]');

                          if (!expectedSubscribed) {
                            assert.strictEqual(_this5._unsubscribe[_i4], null, 'unsubscribe()');
                            assert.deepStrictEqual(_this5._subscribed[_i4], [], 'subscribed[]');
                          } else {
                            _this5.checkSubscribes(_this5._subscribed[_i4], expectedSubscribed, 'subscribed[]');

                            _this5._subscribed[_i4] = [];
                          }

                          _this5.checkLastValues(_this5._lastValue[_i4], expectedSubscribed, expectedUnsubscribed, expectedLastValue || _this5._expectedLastValue[_i4], 'lastValue[]');

                          _this5._lastValue[_i4] = [];
                          _this5._expectedLastValue[_i4] = [];

                        case 13:
                        case "end":
                          return _context2.stop();
                      }
                    }
                  }, _loop3);
                });
                _i4 = 0;

              case 5:
                if (!(_i4 < this._ruleBuilders.length)) {
                  _context3.next = 10;
                  break;
                }

                return _context3.delegateYield(_loop3(_i4), "t0", 7);

              case 7:
                _i4++;
                _context3.next = 5;
                break;

              case 10:
                return _context3.abrupt("return", this);

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee, this);
      }));

      function subscribeAsync(_x, _x2, _x3, _x4, _x5) {
        return _subscribeAsync.apply(this, arguments);
      }

      return subscribeAsync;
    }()
  }, {
    key: "changeAsync",
    value: function () {
      var _changeAsync = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(changeFunc, expectedUnsubscribed, expectedSubscribed, expectedLastValue, errorType, errorRegExp) {
        var _this6 = this;

        var i, _i5;

        return _regenerator.default.wrap(function _callee2$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!this._performanceTest) {
                  _context4.next = 3;
                  break;
                }

                changeFunc(this._object);
                return _context4.abrupt("return", this);

              case 3:
                for (i = 0; i < this._ruleBuilders.length; i++) {
                  assert.deepStrictEqual(this._subscribed[i], [], 'subscribed[]');
                  assert.deepStrictEqual(this._unsubscribed[i], [], 'unsubscribed[]');
                  assert.deepStrictEqual(this._lastValue[i], [], 'lastValue[]');
                }

                if (typeof expectedUnsubscribed === 'function') {
                  expectedUnsubscribed = expectedUnsubscribed(this._object);
                }

                if (errorType) {
                  assert.throws(function () {
                    return changeFunc(_this6._object);
                  }, errorType, errorRegExp);
                } else {
                  changeFunc(this._object);
                }

                _context4.next = 8;
                return (0, _helpers.delay)(this._asyncDelay);

              case 8:
                for (_i5 = 0; _i5 < this._ruleBuilders.length; _i5++) {
                  this.checkSubscribes(this._unsubscribed[_i5], expectedUnsubscribed, 'unsubscribed[]');
                  this.checkSubscribes(this._subscribed[_i5], expectedSubscribed, 'subscribed[]');
                  this.checkLastValues(this._lastValue[_i5], expectedSubscribed, expectedUnsubscribed, expectedLastValue || this._expectedLastValue[_i5], 'lastValue[]');
                  this._unsubscribed[_i5] = [];
                  this._subscribed[_i5] = [];
                  this._lastValue[_i5] = [];
                  this._expectedLastValue[_i5] = [];
                }

                return _context4.abrupt("return", this);

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee2, this);
      }));

      function changeAsync(_x6, _x7, _x8, _x9, _x10, _x11) {
        return _changeAsync.apply(this, arguments);
      }

      return changeAsync;
    }()
  }, {
    key: "unsubscribeAsync",
    value: function () {
      var _unsubscribeAsync = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(expectedUnsubscribed, expectedLastValue, errorType, errorRegExp) {
        var _this7 = this;

        var i, _loop4, _i6;

        return _regenerator.default.wrap(function _callee3$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!this._performanceTest) {
                  _context6.next = 3;
                  break;
                }

                for (i = 0; i < this._ruleBuilders.length; i++) {
                  this._unsubscribe[i]();
                }

                return _context6.abrupt("return", this);

              case 3:
                _loop4 =
                /*#__PURE__*/
                _regenerator.default.mark(function _loop4(_i6) {
                  return _regenerator.default.wrap(function _loop4$(_context5) {
                    while (1) {
                      switch (_context5.prev = _context5.next) {
                        case 0:
                          if (_this7._shouldNeverSubscribe) {
                            assert.ok(_this7._unsubscribe[_i6] == null, 'unsubscribe()');
                          } else {
                            assert.ok(_this7._unsubscribe[_i6], 'unsubscribe()');
                          }

                          assert.deepStrictEqual(_this7._subscribed[_i6], [], 'subscribed[]');
                          assert.deepStrictEqual(_this7._unsubscribed[_i6], [], 'unsubscribed[]');
                          assert.deepStrictEqual(_this7._lastValue[_i6], [], 'lastValue[]');

                          if (!errorType) {
                            _context5.next = 12;
                            break;
                          }

                          assert.throws(function () {
                            return _this7._unsubscribe[_i6]();
                          }, errorType, errorRegExp);
                          assert.strictEqual(_this7._subscribersCount[_i6], 0, 'subscribersCount');
                          assert.deepStrictEqual(_this7._subscribed[_i6], [], 'subscribed[]');
                          assert.deepStrictEqual(_this7._unsubscribed[_i6], [], 'unsubscribed[]');
                          assert.deepStrictEqual(_this7._lastValue[_i6], [], 'lastValue[]');
                          _context5.next = 21;
                          break;

                        case 12:
                          if (!_this7._shouldNeverSubscribe) {
                            _this7._unsubscribe[_i6]();

                            _this7._unsubscribe[_i6]();

                            _this7._unsubscribe[_i6]();

                            _this7._unsubscribe[_i6] = null;
                          }

                          _context5.next = 15;
                          return (0, _helpers.delay)(_this7._asyncDelay);

                        case 15:
                          _this7.checkSubscribes(_this7._unsubscribed[_i6], expectedUnsubscribed, 'unsubscribed[]');

                          assert.deepStrictEqual(_this7._subscribed[_i6], [], 'subscribed[]');

                          _this7.checkLastValues(_this7._lastValue[_i6], null, expectedUnsubscribed, expectedLastValue || _this7._expectedLastValue[_i6], 'lastValue[]');

                          _this7._unsubscribed[_i6] = [];
                          _this7._lastValue[_i6] = [];
                          _this7._expectedLastValue[_i6] = [];

                        case 21:
                        case "end":
                          return _context5.stop();
                      }
                    }
                  }, _loop4);
                });
                _i6 = 0;

              case 5:
                if (!(_i6 < this._ruleBuilders.length)) {
                  _context6.next = 10;
                  break;
                }

                return _context6.delegateYield(_loop4(_i6), "t0", 7);

              case 7:
                _i6++;
                _context6.next = 5;
                break;

              case 10:
                return _context6.abrupt("return", this);

              case 11:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee3, this);
      }));

      function unsubscribeAsync(_x12, _x13, _x14, _x15) {
        return _unsubscribeAsync.apply(this, arguments);
      }

      return unsubscribeAsync;
    }() // endregion

  }]);
  return TestDeepSubscribe;
}();

exports.TestDeepSubscribe = TestDeepSubscribe;
TestDeepSubscribe.totalTests = 0;

var TestDeepSubscribeVariants =
/*#__PURE__*/
function (_TestDeepSubscribe) {
  (0, _inherits2.default)(TestDeepSubscribeVariants, _TestDeepSubscribe);

  function TestDeepSubscribeVariants(options) {
    var _getPrototypeOf2, _context7;

    (0, _classCallCheck2.default)(this, TestDeepSubscribeVariants);

    for (var _len2 = arguments.length, variants = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      variants[_key2 - 1] = arguments[_key2];
    }

    return (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(TestDeepSubscribeVariants)).call.apply(_getPrototypeOf2, (0, _concat.default)(_context7 = [this, options]).call(_context7, _RuleBuildersBuilder.ruleFactoriesVariants.apply(void 0, variants))));
  }

  return TestDeepSubscribeVariants;
}(TestDeepSubscribe);

exports.TestDeepSubscribeVariants = TestDeepSubscribeVariants;

function repeat(value, count) {
  var array = [];

  for (var i = 0; i < count; i++) {
    array.push(value);
  }

  return array;
}