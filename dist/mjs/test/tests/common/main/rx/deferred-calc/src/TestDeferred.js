import { DeferredCalc } from '../../../../../../../main/common/rx/deferred-calc/DeferredCalc';
import { assert } from '../../../../../../../main/common/test/Assert';
import { TestVariants, THIS } from '../../../src/helpers/TestVariants';
import { TestTiming } from './timing';
export let EventType;

(function (EventType) {
  EventType[EventType["CanBeCalc"] = 0] = "CanBeCalc";
  EventType[EventType["Calc"] = 1] = "Calc";
  EventType[EventType["Completed"] = 2] = "Completed";
})(EventType || (EventType = {}));

export class TestTimingForDeferredCalc extends TestTiming {
  setTimeout(handler, timeout) {
    return super.setTimeout(handler, timeout - 1);
  }

}
export const timing = new TestTimingForDeferredCalc();
timing.addTime(1000);
let staticAutoCalc;
let staticCalcTime;
let testStartTime;
let staticEvents = [];
let staticDeferredCalc;
staticDeferredCalc = new DeferredCalc({
  canBeCalcCallback() {
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
  },

  calcFunc() {
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
      this.done();
    } else {
      timing.setTimeout(() => this.done(), staticCalcTime + 1);
    }
  },

  calcCompletedCallback() {
    if (staticDeferredCalc) {
      assert.strictEqual(this, staticDeferredCalc);
    } else {
      assert.ok(this);
    }

    staticEvents.push({
      time: timing.now() - testStartTime,
      type: EventType.Completed
    });
  },

  options: {
    timing
  }
});

function eventsToDisplay(events) {
  return events.map(event => {
    return { ...event,
      type: event.type == null ? event.type : EventType[event.type]
    };
  });
}

export function assertEvents(events, excepted) {
  events = eventsToDisplay(events);
  excepted = eventsToDisplay(excepted);
  assert.deepStrictEqual(events, excepted);
}
export class TestDeferredCalc extends TestVariants {
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
          deferredCalc = new DeferredCalc({
            canBeCalcCallback() {
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
            },

            calcFunc() {
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
                this.done();
              } else {
                timing.setTimeout(() => this.done(), calcTime + 1);
              }
            },

            calcCompletedCallback() {
              if (deferredCalc) {
                assert.strictEqual(this, deferredCalc);
              } else {
                assert.ok(this);
              }

              events.push({
                time: timing.now() - testStartTime,
                type: EventType.Completed
              });
            },

            options: {
              timing,
              minTimeBetweenCalc: options.minTimeBetweenCalc,
              throttleTime: options.throttleTime,
              maxThrottleTime: options.maxThrottleTime,
              autoInvalidateInterval: options.autoInvalidateInterval
            }
          });
        }

        const propertyChangedEvents = [];

        if (deferredCalc.propertyChanged) {
          unsubscribePropertyChanged = deferredCalc.propertyChanged.subscribe(event => {
            propertyChangedEvents.push(event);
          });
        }

        if (options.expected.error) {
          assert.throws(() => options.action(deferredCalc), options.expected.error);
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
TestDeferredCalc.totalTests = 0;
TestDeferredCalc._instance = new TestDeferredCalc();