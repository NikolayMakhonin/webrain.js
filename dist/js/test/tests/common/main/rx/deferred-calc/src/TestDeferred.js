"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.assertEvents = assertEvents;
exports.TestDeferredCalc = exports.timing = exports.TestTimingForDeferredCalc = exports.EventType = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _DeferredCalc = require("../../../../../../../main/common/rx/deferred-calc/DeferredCalc");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _TestVariants2 = require("../../../src/helpers/TestVariants");

var _timing = require("./timing");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

var EventType;
exports.EventType = EventType;

(function (EventType) {
  EventType[EventType["CanBeCalc"] = 0] = "CanBeCalc";
  EventType[EventType["Calc"] = 1] = "Calc";
  EventType[EventType["Completed"] = 2] = "Completed";
})(EventType || (exports.EventType = EventType = {}));

var TestTimingForDeferredCalc = /*#__PURE__*/function (_TestTiming) {
  (0, _inherits2.default)(TestTimingForDeferredCalc, _TestTiming);

  var _super = _createSuper(TestTimingForDeferredCalc);

  function TestTimingForDeferredCalc() {
    (0, _classCallCheck2.default)(this, TestTimingForDeferredCalc);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(TestTimingForDeferredCalc, [{
    key: "setTimeout",
    value: function setTimeout(handler, timeout) {
      return (0, _get2.default)((0, _getPrototypeOf2.default)(TestTimingForDeferredCalc.prototype), "setTimeout", this).call(this, handler, timeout - 1);
    }
  }]);
  return TestTimingForDeferredCalc;
}(_timing.TestTiming);

exports.TestTimingForDeferredCalc = TestTimingForDeferredCalc;
var timing = new TestTimingForDeferredCalc();
exports.timing = timing;
timing.addTime(1000);
var staticAutoCalc;
var staticCalcTime;
var testStartTime;
var staticEvents = [];
var staticDeferredCalc;
staticDeferredCalc = new _DeferredCalc.DeferredCalc({
  canBeCalcCallback: function canBeCalcCallback() {
    if (staticDeferredCalc) {
      _Assert.assert.strictEqual(this, staticDeferredCalc);
    } else {
      _Assert.assert.ok(this);
    }

    staticEvents.push({
      time: timing.now() - testStartTime,
      type: EventType.CanBeCalc
    });

    if (staticAutoCalc) {
      staticDeferredCalc.calc();
    }
  },
  calcFunc: function calcFunc() {
    var _this = this;

    if (staticDeferredCalc) {
      _Assert.assert.strictEqual(this, staticDeferredCalc);
    } else {
      _Assert.assert.ok(this);
    }

    staticEvents.push({
      time: timing.now() - testStartTime,
      type: EventType.Calc
    });

    if (!staticCalcTime) {
      this.done();
    } else {
      timing.setTimeout(function () {
        return _this.done();
      }, staticCalcTime + 1);
    }
  },
  calcCompletedCallback: function calcCompletedCallback() {
    if (staticDeferredCalc) {
      _Assert.assert.strictEqual(this, staticDeferredCalc);
    } else {
      _Assert.assert.ok(this);
    }

    staticEvents.push({
      time: timing.now() - testStartTime,
      type: EventType.Completed
    });
  },
  options: {
    timing: timing
  }
});

function eventsToDisplay(events) {
  return (0, _map.default)(events).call(events, function (event) {
    return (0, _extends2.default)((0, _extends2.default)({}, event), {}, {
      type: event.type == null ? event.type : EventType[event.type]
    });
  });
}

function assertEvents(events, excepted) {
  events = eventsToDisplay(events);
  excepted = eventsToDisplay(excepted);

  _Assert.assert.deepStrictEqual(events, excepted);
}

var TestDeferredCalc = /*#__PURE__*/function (_TestVariants) {
  (0, _inherits2.default)(TestDeferredCalc, _TestVariants);

  var _super2 = _createSuper(TestDeferredCalc);

  function TestDeferredCalc() {
    var _this2;

    (0, _classCallCheck2.default)(this, TestDeferredCalc);
    _this2 = _super2.call(this);
    _this2.baseOptionsVariants = {
      calcTime: [0],
      throttleTime: [null],
      maxThrottleTime: [null],
      minTimeBetweenCalc: [null],
      autoInvalidateInterval: [null],
      reuseInstance: [false, true],
      autoCalc: [false]
    };
    return _this2;
  }

  (0, _createClass2.default)(TestDeferredCalc, [{
    key: "testVariant",
    value: function testVariant(options) {
      var error;

      for (var debugIteration = 0; debugIteration < 3; debugIteration++) {
        var unsubscribePropertyChanged = void 0;

        try {
          var _ret = function () {
            var _context;

            var expectedEvents = (0, _slice.default)(_context = options.expected.events).call(_context);
            var events = void 0;
            var deferredCalc = void 0;

            if (options.reuseInstance) {
              staticCalcTime = 0;
              staticAutoCalc = false;
              staticDeferredCalc.minTimeBetweenCalc = null;
              staticDeferredCalc.throttleTime = null;
              staticDeferredCalc.maxThrottleTime = null;
              staticDeferredCalc.autoInvalidateInterval = null;
              staticDeferredCalc.calc();
              timing.addTime(options.minTimeBetweenCalc);
              testStartTime = timing.now();
              events = staticEvents = [];
              deferredCalc = staticDeferredCalc;
              staticAutoCalc = options.autoCalc;
              staticCalcTime = options.calcTime;
              staticDeferredCalc.minTimeBetweenCalc = options.minTimeBetweenCalc;
              staticDeferredCalc.throttleTime = options.throttleTime;
              staticDeferredCalc.maxThrottleTime = options.maxThrottleTime;
              staticDeferredCalc.autoInvalidateInterval = options.autoInvalidateInterval;
              staticDeferredCalc.invalidate();
            } else {
              testStartTime = timing.now();
              events = [];
              var autoCalc = options.autoCalc;
              var calcTime = options.calcTime;
              deferredCalc = new _DeferredCalc.DeferredCalc({
                canBeCalcCallback: function canBeCalcCallback() {
                  if (deferredCalc) {
                    _Assert.assert.strictEqual(this, deferredCalc);
                  } else {
                    _Assert.assert.ok(this);
                  }

                  events.push({
                    time: timing.now() - testStartTime,
                    type: EventType.CanBeCalc
                  });

                  if (autoCalc) {
                    this.calc();
                  }
                },
                calcFunc: function calcFunc() {
                  var _this3 = this;

                  if (deferredCalc) {
                    _Assert.assert.strictEqual(this, deferredCalc);
                  } else {
                    _Assert.assert.ok(this);
                  }

                  events.push({
                    time: timing.now() - testStartTime,
                    type: EventType.Calc
                  });

                  if (!calcTime) {
                    this.done();
                  } else {
                    timing.setTimeout(function () {
                      return _this3.done();
                    }, calcTime + 1);
                  }
                },
                calcCompletedCallback: function calcCompletedCallback() {
                  if (deferredCalc) {
                    _Assert.assert.strictEqual(this, deferredCalc);
                  } else {
                    _Assert.assert.ok(this);
                  }

                  events.push({
                    time: timing.now() - testStartTime,
                    type: EventType.Completed
                  });
                },
                options: {
                  timing: timing,
                  minTimeBetweenCalc: options.minTimeBetweenCalc,
                  throttleTime: options.throttleTime,
                  maxThrottleTime: options.maxThrottleTime,
                  autoInvalidateInterval: options.autoInvalidateInterval
                }
              });
            }

            var propertyChangedEvents = [];

            if (deferredCalc.propertyChanged) {
              unsubscribePropertyChanged = deferredCalc.propertyChanged.subscribe(function (event) {
                propertyChangedEvents.push(event);
              });
            }

            if (options.expected.error) {
              _Assert.assert.throws(function () {
                return options.action(deferredCalc);
              }, options.expected.error);
            } else {
              _Assert.assert.deepStrictEqual(options.action(deferredCalc), options.expected.returnValue === _TestVariants2.THIS ? deferredCalc : options.expected.returnValue);
            }

            assertEvents(events, expectedEvents);
            (0, _splice.default)(events).call(events, 0, events.length);
            timing.addTime(Math.max(options.throttleTime || 0, options.maxThrottleTime || 0, options.minTimeBetweenCalc || 0, options.autoInvalidateInterval || 0) + options.calcTime + 1);
            assertEvents(events, []);

            if (unsubscribePropertyChanged) {
              unsubscribePropertyChanged();
            }

            _Assert.assert.deepStrictEqual(propertyChangedEvents, options.expected.propertyChanged || []);

            return "break";
          }();

          if (_ret === "break") break;
        } catch (ex) {
          if (!debugIteration) {
            console.log("Error in: " + options.description + "\n" + (0, _stringify.default)(options, null, 4) + "\n" + options.action.toString() + "\n" + ex.stack);
            error = ex;
          }
        } finally {
          if (unsubscribePropertyChanged) {
            unsubscribePropertyChanged();
          }

          TestDeferredCalc.totalTests++;
        }
      }

      if (error) {
        throw error;
      }
    }
  }], [{
    key: "test",
    value: function test(testCases) {
      TestDeferredCalc._instance.test(testCases);
    }
  }]);
  return TestDeferredCalc;
}(_TestVariants2.TestVariants);

exports.TestDeferredCalc = TestDeferredCalc;
TestDeferredCalc.totalTests = 0;
TestDeferredCalc._instance = new TestDeferredCalc();