"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertEvents = assertEvents;
exports.TestDeferredCalc = exports.timing = exports.EventType = void 0;

var _DeferredCalc = require("../../../../../../../main/common/rx/deferred-calc/DeferredCalc");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _TestVariants = require("../../../src/helpers/TestVariants");

var _timing = require("./timing");

let EventType;
exports.EventType = EventType;

(function (EventType) {
  EventType[EventType["CanBeCalc"] = 0] = "CanBeCalc";
  EventType[EventType["Calc"] = 1] = "Calc";
  EventType[EventType["Completed"] = 2] = "Completed";
})(EventType || (exports.EventType = EventType = {}));

const timing = new _timing.TestTiming();
exports.timing = timing;
let staticAutoCalc;
let staticCalcTime;
let testStartTime;
let staticEvents = [];
let staticDeferredCalc;
staticDeferredCalc = new _DeferredCalc.DeferredCalc({
  timing,

  canBeCalcCallback() {
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

  calcFunc(done) {
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
      done();
    } else {
      timing.setTimeout(done, staticCalcTime);
    }
  },

  calcCompletedCallback() {
    if (staticDeferredCalc) {
      _Assert.assert.strictEqual(this, staticDeferredCalc);
    } else {
      _Assert.assert.ok(this);
    }

    staticEvents.push({
      time: timing.now() - testStartTime,
      type: EventType.Completed
    });
  }

});

function eventsToDisplay(events) {
  return events.map(event => {
    return { ...event,
      type: event.type == null ? event.type : EventType[event.type]
    };
  });
}

function assertEvents(events, excepted) {
  events = eventsToDisplay(events);
  excepted = eventsToDisplay(excepted);

  _Assert.assert.deepStrictEqual(events, excepted);
}

class TestDeferredCalc extends _TestVariants.TestVariants {
  constructor() {
    super();
    this.baseOptionsVariants = {
      calcTime: [0],
      throttleTime: [null],
      maxThrottleTime: [null],
      minTimeBetweenCalc: [null],
      autoInvalidateInterval: [null],
      reuseInstance: [false, true],
      autoCalc: [false]
    };
  }

  testVariant(options) {
    let error;

    for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
      let unsubscribePropertyChanged;

      try {
        const expectedEvents = options.expected.events.slice();
        let events;
        let deferredCalc;

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
          const autoCalc = options.autoCalc;
          const calcTime = options.calcTime;
          deferredCalc = new _DeferredCalc.DeferredCalc({
            timing,

            canBeCalcCallback() {
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

            calcFunc(done) {
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
                done();
              } else {
                timing.setTimeout(done, calcTime);
              }
            },

            calcCompletedCallback() {
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

            minTimeBetweenCalc: options.minTimeBetweenCalc,
            throttleTime: options.throttleTime,
            maxThrottleTime: options.maxThrottleTime,
            autoInvalidateInterval: options.autoInvalidateInterval
          });
        }

        const propertyChangedEvents = [];

        if (deferredCalc.propertyChanged) {
          unsubscribePropertyChanged = deferredCalc.propertyChanged.subscribe(event => {
            propertyChangedEvents.push(event);
          });
        }

        if (options.expected.error) {
          _Assert.assert.throws(() => options.action(deferredCalc), options.expected.error);
        } else {
          _Assert.assert.deepStrictEqual(options.action(deferredCalc), options.expected.returnValue === _TestVariants.THIS ? deferredCalc : options.expected.returnValue);
        }

        assertEvents(events, expectedEvents);
        events.splice(0, events.length);
        timing.addTime(Math.max(options.throttleTime || 0, options.maxThrottleTime || 0, options.minTimeBetweenCalc || 0, options.autoInvalidateInterval || 0) + options.calcTime + 1);
        assertEvents(events, []);

        if (unsubscribePropertyChanged) {
          unsubscribePropertyChanged();
        }

        _Assert.assert.deepStrictEqual(propertyChangedEvents, options.expected.propertyChanged || []);

        break;
      } catch (ex) {
        if (!debugIteration) {
          console.log(`Error in: ${options.description}\n${JSON.stringify(options, null, 4)}\n${options.action.toString()}\n${ex.stack}`);
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

  static test(testCases) {
    TestDeferredCalc._instance.test(testCases);
  }

}

exports.TestDeferredCalc = TestDeferredCalc;
TestDeferredCalc.totalTests = 0;
TestDeferredCalc._instance = new TestDeferredCalc();