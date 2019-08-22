import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

import { DeferredCalc } from '../../../../../../../main/common/rx/deferred-calc/DeferredCalc';
import { assert } from '../../../../../../../main/common/test/Assert';
import { TestVariants, THIS } from '../../../src/helpers/TestVariants';
import { TestTiming } from './timing';
export var EventType;

(function (EventType) {
  EventType[EventType["CanBeCalc"] = 0] = "CanBeCalc";
  EventType[EventType["Calc"] = 1] = "Calc";
  EventType[EventType["Completed"] = 2] = "Completed";
})(EventType || (EventType = {}));

export var timing = new TestTiming();
var staticAutoCalc;
var staticCalcTime;
var testStartTime;
var staticEvents = [];
var staticDeferredCalc;
staticDeferredCalc = new DeferredCalc(function () {
  if (staticDeferredCalc) {
    assert.strictEqual(this, staticDeferredCalc);
  } else {
    assert.ok(this);
  }

  staticEvents.push({
    time: timing.now() - testStartTime,
    type: EventType.CanBeCalc
  });

  if (staticAutoCalc) {
    staticDeferredCalc.calc();
  }
}, function (done) {
  if (staticDeferredCalc) {
    assert.strictEqual(this, staticDeferredCalc);
  } else {
    assert.ok(this);
  }

  staticEvents.push({
    time: timing.now() - testStartTime,
    type: EventType.Calc
  });

  if (!staticCalcTime) {
    done();
  } else {
    timing.setTimeout(done, staticCalcTime);
  }
}, function () {
  if (staticDeferredCalc) {
    assert.strictEqual(this, staticDeferredCalc);
  } else {
    assert.ok(this);
  }

  staticEvents.push({
    time: timing.now() - testStartTime,
    type: EventType.Completed
  });
}, {
  timing: timing
});

function eventsToDisplay(events) {
  return events.map(function (event) {
    return _objectSpread({}, event, {
      type: event.type == null ? event.type : EventType[event.type]
    });
  });
}

export function assertEvents(events, excepted) {
  events = eventsToDisplay(events);
  excepted = eventsToDisplay(excepted);
  assert.deepStrictEqual(events, excepted);
}
export var TestDeferredCalc =
/*#__PURE__*/
function (_TestVariants) {
  _inherits(TestDeferredCalc, _TestVariants);

  function TestDeferredCalc() {
    var _this;

    _classCallCheck(this, TestDeferredCalc);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TestDeferredCalc).call(this));
    _this.baseOptionsVariants = {
      calcTime: [0],
      throttleTime: [null],
      maxThrottleTime: [null],
      minTimeBetweenCalc: [null],
      autoInvalidateInterval: [null],
      reuseInstance: [false, true],
      autoCalc: [false]
    };
    return _this;
  }

  _createClass(TestDeferredCalc, [{
    key: "testVariant",
    value: function testVariant(options) {
      var error;

      for (var debugIteration = 0; debugIteration < 3; debugIteration++) {
        var unsubscribePropertyChanged = void 0;

        try {
          var _ret = function () {
            var expectedEvents = options.expected.events.slice();
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
              deferredCalc = new DeferredCalc(function () {
                if (deferredCalc) {
                  assert.strictEqual(this, deferredCalc);
                } else {
                  assert.ok(this);
                }

                events.push({
                  time: timing.now() - testStartTime,
                  type: EventType.CanBeCalc
                });

                if (autoCalc) {
                  this.calc();
                }
              }, function (done) {
                if (deferredCalc) {
                  assert.strictEqual(this, deferredCalc);
                } else {
                  assert.ok(this);
                }

                events.push({
                  time: timing.now() - testStartTime,
                  type: EventType.Calc
                });

                if (!calcTime) {
                  done();
                } else {
                  timing.setTimeout(done, calcTime);
                }
              }, function () {
                if (deferredCalc) {
                  assert.strictEqual(this, deferredCalc);
                } else {
                  assert.ok(this);
                }

                events.push({
                  time: timing.now() - testStartTime,
                  type: EventType.Completed
                });
              }, {
                timing: timing,
                minTimeBetweenCalc: options.minTimeBetweenCalc,
                throttleTime: options.throttleTime,
                maxThrottleTime: options.maxThrottleTime,
                autoInvalidateInterval: options.autoInvalidateInterval
              });
            }

            var propertyChangedEvents = [];

            if (deferredCalc.propertyChanged) {
              unsubscribePropertyChanged = deferredCalc.propertyChanged.subscribe(function (event) {
                propertyChangedEvents.push(event);
              });
            }

            if (options.expected.error) {
              assert["throws"](function () {
                return options.action(deferredCalc);
              }, options.expected.error);
            } else {
              assert.deepStrictEqual(options.action(deferredCalc), options.expected.returnValue === THIS ? deferredCalc : options.expected.returnValue);
            }

            assertEvents(events, expectedEvents);
            events.splice(0, events.length);
            timing.addTime(Math.max(options.throttleTime || 0, options.maxThrottleTime || 0, options.minTimeBetweenCalc || 0, options.autoInvalidateInterval || 0) + options.calcTime + 1);
            assertEvents(events, []);

            if (unsubscribePropertyChanged) {
              unsubscribePropertyChanged();
            }

            assert.deepStrictEqual(propertyChangedEvents, options.expected.propertyChanged || []);
            return "break";
          }();

          if (_ret === "break") break;
        } catch (ex) {
          if (!debugIteration) {
            console.log("Error in: ".concat(options.description, "\n").concat(JSON.stringify(options, null, 4), "\n").concat(options.action.toString(), "\n").concat(ex.stack));
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
}(TestVariants);
TestDeferredCalc.totalTests = 0;
TestDeferredCalc._instance = new TestDeferredCalc();