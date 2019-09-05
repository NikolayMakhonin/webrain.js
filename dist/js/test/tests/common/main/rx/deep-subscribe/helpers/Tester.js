"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty2 = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty2(exports, "__esModule", {
  value: true
});

exports.createObject = createObject;
exports.Tester = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _defineProperty3 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _helpers = require("../../../../../../../main/common/helpers/helpers");

var _valueProperty = require("../../../../../../../main/common/helpers/value-property");

var _ObservableMap = require("../../../../../../../main/common/lists/ObservableMap");

var _ObservableSet = require("../../../../../../../main/common/lists/ObservableSet");

var _SortedList = require("../../../../../../../main/common/lists/SortedList");

var _deepSubscribe = require("../../../../../../../main/common/rx/deep-subscribe/deep-subscribe");

var _ObservableObject2 = require("../../../../../../../main/common/rx/object/ObservableObject");

var _ObservableObjectBuilder = require("../../../../../../../main/common/rx/object/ObservableObjectBuilder");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _DeepCloneEqual = require("../../../../../../../main/common/test/DeepCloneEqual");

/* tslint:disable:no-empty no-construct use-primitive-type */
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

  (0, _defineProperty3.default)(list, 'listChanged', {
    configurable: true,
    writable: true,
    value: null
  });
  var set = new _set.default();
  var map2 = new _map2.default();

  var ObservableClass =
  /*#__PURE__*/
  function (_ObservableObject) {
    (0, _inherits2.default)(ObservableClass, _ObservableObject);

    function ObservableClass() {
      (0, _classCallCheck2.default)(this, ObservableClass);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ObservableClass).apply(this, arguments));
    }

    return ObservableClass;
  }(_ObservableObject2.ObservableObject);

  var observableObjectPrototype = new ObservableClass();
  var observableObject = new _ObservableObject2.ObservableObject();
  var observableList = new _SortedList.SortedList();
  var observableSet = new _ObservableSet.ObservableSet();
  var observableMap = new _ObservableMap.ObservableMap();
  var property = new _ObservableObject2.ObservableObject();
  (0, _assign.default)(object, (_Object$assign2 = {}, (0, _defineProperty2.default)(_Object$assign2, _valueProperty.VALUE_PROPERTY_DEFAULT, 'nothing'), (0, _defineProperty2.default)(_Object$assign2, "observableObjectPrototype", observableObjectPrototype), (0, _defineProperty2.default)(_Object$assign2, "observableObject", observableObject), (0, _defineProperty2.default)(_Object$assign2, "observableList", observableList), (0, _defineProperty2.default)(_Object$assign2, "observableSet", observableSet), (0, _defineProperty2.default)(_Object$assign2, "observableMap", observableMap), (0, _defineProperty2.default)(_Object$assign2, "object", object), (0, _defineProperty2.default)(_Object$assign2, "property", property), (0, _defineProperty2.default)(_Object$assign2, "list", list), (0, _defineProperty2.default)(_Object$assign2, "set", set), (0, _defineProperty2.default)(_Object$assign2, "map2", map2), (0, _defineProperty2.default)(_Object$assign2, "value", 'value'), (0, _defineProperty2.default)(_Object$assign2, "valueObject", new String('value')), (0, _defineProperty2.default)(_Object$assign2, "promiseSync", {
    then: function then(resolve) {
      return resolve(observableObject);
    }
  }), (0, _defineProperty2.default)(_Object$assign2, "promiseAsync", {
    then: function then(resolve) {
      return (0, _setTimeout2.default)(function () {
        return resolve(observableObject);
      }, 0);
    }
  }), _Object$assign2));
  var observableObjectBuilderPrototype = new _ObservableObjectBuilder.ObservableObjectBuilder(ObservableClass.prototype);
  var observableObjectBuilder = new _ObservableObjectBuilder.ObservableObjectBuilder(observableObject);
  var propertyBuilder = new _ObservableObjectBuilder.ObservableObjectBuilder(property);
  (0, _forEach.default)(_context = (0, _keys.default)(object)).call(_context, function (key) {
    if (key !== 'value' && key !== 'valueObject') {
      list.add(object[key]);
      set.add(object[key]);
      map2.set(key, object[key]);
      observableList.add(object[key]);
      observableSet.add(object[key]);
      observableMap.set(key, object[key]);
    }

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

var Tester =
/*#__PURE__*/
function () {
  function Tester(_ref) {
    var object = _ref.object,
        immediate = _ref.immediate,
        ignoreSubscribeCount = _ref.ignoreSubscribeCount,
        performanceTest = _ref.performanceTest,
        doNotSubscribeNonObjectValues = _ref.doNotSubscribeNonObjectValues,
        useIncorrectUnsubscribe = _ref.useIncorrectUnsubscribe;
    (0, _classCallCheck2.default)(this, Tester);
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
    this._unsubscribe = (0, _map.default)(ruleBuilders).call(ruleBuilders, function (o) {
      return null;
    });

    if (!performanceTest) {
      this._subscribed = (0, _map.default)(ruleBuilders).call(ruleBuilders, function (o) {
        return [];
      });
      this._unsubscribed = (0, _map.default)(ruleBuilders).call(ruleBuilders, function (o) {
        return [];
      });
    }
  }

  (0, _createClass2.default)(Tester, [{
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

      this._unsubscribe[i] = (0, _deepSubscribe.deepSubscribe)(this._object, function (value) {
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
          assert.throws(function () {
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
        assert.throws(function () {
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
          assert.throws(function () {
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
      var _subscribeAsync = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(expectedSubscribed, expectedUnsubscribed, errorType, errorRegExp) {
        var _this5 = this;

        var i, _ruleBuilder2, _loop3, _i4;

        return _regenerator.default.wrap(function _callee$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this._performanceTest) {
                  _context3.next = 3;
                  break;
                }

                for (i = 0; i < this._ruleBuilders.length; i++) {
                  _ruleBuilder2 = this._ruleBuilders[i];
                  this.subscribePrivate(_ruleBuilder2, i);
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
                          assert.ok(_this5._unsubscribe[_i4] == null);
                          assert.deepStrictEqual(_this5._subscribed[_i4], []);
                          assert.deepStrictEqual(_this5._unsubscribed[_i4], []);

                          if (errorType) {
                            assert.throws(function () {
                              return _this5.subscribePrivate(ruleBuilder, _i4);
                            }, errorType, errorRegExp);
                          } else {
                            _this5.subscribePrivate(ruleBuilder, _i4);

                            expectedUnsubscribed = [];
                          }

                          _context2.next = 7;
                          return (0, _helpers.delay)(10);

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

      function subscribeAsync(_x, _x2, _x3, _x4) {
        return _subscribeAsync.apply(this, arguments);
      }

      return subscribeAsync;
    }()
  }, {
    key: "changeAsync",
    value: function () {
      var _changeAsync = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(changeFunc, expectedUnsubscribed, expectedSubscribed, errorType, errorRegExp) {
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
                  assert.deepStrictEqual(this._subscribed[i], []);
                  assert.deepStrictEqual(this._unsubscribed[i], []);
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
                return (0, _helpers.delay)(10);

              case 8:
                for (_i5 = 0; _i5 < this._ruleBuilders.length; _i5++) {
                  this.checkSubscribes(this._unsubscribed[_i5], expectedUnsubscribed);
                  this.checkSubscribes(this._subscribed[_i5], expectedSubscribed);
                  this._unsubscribed[_i5] = [];
                  this._subscribed[_i5] = [];
                }

                return _context4.abrupt("return", this);

              case 10:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee2, this);
      }));

      function changeAsync(_x5, _x6, _x7, _x8, _x9) {
        return _changeAsync.apply(this, arguments);
      }

      return changeAsync;
    }()
  }, {
    key: "unsubscribeAsync",
    value: function () {
      var _unsubscribeAsync = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(expectedUnsubscribed, errorType, errorRegExp) {
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
                          assert.ok(_this7._unsubscribe[_i6]);
                          assert.deepStrictEqual(_this7._subscribed[_i6], []);
                          assert.deepStrictEqual(_this7._unsubscribed[_i6], []);

                          if (!errorType) {
                            _context5.next = 9;
                            break;
                          }

                          assert.throws(function () {
                            return _this7._unsubscribe[_i6]();
                          }, errorType, errorRegExp);
                          assert.deepStrictEqual(_this7._subscribed[_i6], []);
                          assert.deepStrictEqual(_this7._unsubscribed[_i6], []);
                          _context5.next = 18;
                          break;

                        case 9:
                          _this7._unsubscribe[_i6]();

                          _this7._unsubscribe[_i6]();

                          _this7._unsubscribe[_i6]();

                          _this7._unsubscribe[_i6] = null;
                          _context5.next = 15;
                          return (0, _helpers.delay)(10);

                        case 15:
                          _this7.checkSubscribes(_this7._unsubscribed[_i6], expectedUnsubscribed);

                          assert.deepStrictEqual(_this7._subscribed[_i6], []);
                          _this7._unsubscribed[_i6] = [];

                        case 18:
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

      function unsubscribeAsync(_x10, _x11, _x12) {
        return _unsubscribeAsync.apply(this, arguments);
      }

      return unsubscribeAsync;
    }() // endregion

  }]);
  return Tester;
}();

exports.Tester = Tester;

function repeat(value, count) {
  var array = [];

  for (var i = 0; i < count; i++) {
    array.push(value);
  }

  return array;
}