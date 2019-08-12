import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";

/* tslint:disable:no-empty no-identical-functions */
import { DeferredCalc } from '../../../../../../main/common/rx/deferred-calc/DeferredCalc';
import { timingDefault } from '../../../../../../main/common/rx/deferred-calc/timing';
import { assert } from '../../../../../../main/common/test/Assert';
import { assertEvents, EventType, TestDeferredCalc, timing } from './src/TestDeferred';
import { TestTiming } from './src/timing';
describe('common > main > rx > deferred-calc > DeferredCalc', function () {
  this.timeout(20000);
  var testDeferredCalc = TestDeferredCalc.test;
  after(function () {
    console.log('Total DeferredCalc tests >= ' + TestDeferredCalc.totalTests);
  });
  it('base', function () {
    testDeferredCalc({
      calcTime: [0, 1, 10],
      throttleTime: [null, 0],
      maxThrottleTime: [null, 0, 1, 10],
      minTimeBetweenCalc: [null, 0, 1, 10],
      autoInvalidateInterval: [null, 0, 1, 10],
      expected: {
        events: [{
          time: 0,
          type: EventType.CanBeCalc
        }]
      },
      actions: [function (deferredCalc) {}, function (deferredCalc) {
        return timing.addTime(0);
      }, function (deferredCalc) {
        return timing.addTime(1);
      }, function (deferredCalc) {
        return timing.addTime(10);
      }, function (deferredCalc) {
        return timing.addTime(100);
      }, function (deferredCalc) {
        deferredCalc.invalidate();
        timing.addTime(100);
        deferredCalc.invalidate();
        timing.addTime(100);
      }]
    });
  });
  it('throttleTime', function () {
    testDeferredCalc({
      calcTime: [0],
      throttleTime: [null, 0],
      maxThrottleTime: [null, 0, 1, 10],
      minTimeBetweenCalc: [null, 0, 1, 10],
      autoInvalidateInterval: [null],
      expected: {
        events: [{
          time: 0,
          type: EventType.CanBeCalc
        }, {
          time: 0,
          type: EventType.Calc
        }, {
          time: 0,
          type: EventType.Completed
        }]
      },
      actions: [function (deferredCalc) {
        deferredCalc.calc();
      }, function (deferredCalc) {
        deferredCalc.calc();
        timing.addTime(0);
      }]
    });
    testDeferredCalc({
      calcTime: [5],
      throttleTime: [10],
      maxThrottleTime: [null, 100],
      minTimeBetweenCalc: [null, 0, 1, 5],
      autoInvalidateInterval: [null],
      expected: {
        events: [{
          time: 28,
          type: EventType.CanBeCalc
        }, {
          time: 30,
          type: EventType.Calc
        }, {
          time: 35,
          type: EventType.Completed
        }, {
          time: 49,
          type: EventType.Calc
        }, {
          time: 54,
          type: EventType.Completed
        }, {
          time: 63,
          type: EventType.CanBeCalc
        }, {
          time: 64,
          type: EventType.Calc
        }, {
          time: 69,
          type: EventType.Completed
        }]
      },
      actions: [function (deferredCalc) {
        deferredCalc.invalidate();
        timing.addTime(0);
        deferredCalc.invalidate();
        timing.addTime(0);
        timing.addTime(9);
        deferredCalc.invalidate();
        timing.addTime(0);
        timing.addTime(9);
        deferredCalc.invalidate();
        timing.addTime(0);
        timing.addTime(12); // 30

        deferredCalc.calc();
        timing.addTime(0);
        deferredCalc.invalidate();
        timing.addTime(0);
        timing.addTime(9);
        deferredCalc.invalidate();
        deferredCalc.calc();
        timing.addTime(0);
        timing.addTime(10);
        timing.addTime(4);
        deferredCalc.invalidate();
        timing.addTime(0);
        timing.addTime(11);
        deferredCalc.calc();
        timing.addTime(9);
      }]
    });
  });
  it('maxThrottleTime', function () {
    testDeferredCalc({
      calcTime: [0],
      throttleTime: [10],
      maxThrottleTime: [0],
      minTimeBetweenCalc: [null, 0, 1, 10],
      autoInvalidateInterval: [null],
      expected: {
        events: [{
          time: 0,
          type: EventType.CanBeCalc
        }, {
          time: 0,
          type: EventType.Calc
        }, {
          time: 0,
          type: EventType.Completed
        }]
      },
      actions: [function (deferredCalc) {
        deferredCalc.calc();
      }, function (deferredCalc) {
        deferredCalc.calc();
        timing.addTime(0);
      }]
    });
    testDeferredCalc({
      calcTime: [5],
      throttleTime: [5],
      maxThrottleTime: [10],
      minTimeBetweenCalc: [null, 0, 1, 5],
      autoInvalidateInterval: [null],
      expected: {
        events: [{
          time: 10,
          type: EventType.CanBeCalc
        }, {
          time: 12,
          type: EventType.Calc
        }, {
          time: 17,
          type: EventType.Completed
        }, {
          time: 22,
          type: EventType.Calc
        }, {
          time: 27,
          type: EventType.Completed
        }, {
          time: 32,
          type: EventType.CanBeCalc
        }, {
          time: 32,
          type: EventType.Calc
        }, {
          time: 37,
          type: EventType.Completed
        }]
      },
      actions: [function (deferredCalc) {
        deferredCalc.invalidate();
        timing.addTime(4);
        deferredCalc.invalidate();
        timing.addTime(4);
        deferredCalc.invalidate();
        timing.addTime(4); // 12

        deferredCalc.calc();
        deferredCalc.invalidate();
        timing.addTime(4);
        deferredCalc.invalidate();
        timing.addTime(4);
        deferredCalc.invalidate();
        timing.addTime(1);
        deferredCalc.calc();
        timing.addTime(1);
        deferredCalc.invalidate();
        timing.addTime(4);
        deferredCalc.invalidate();
        timing.addTime(4);
        deferredCalc.invalidate();
        timing.addTime(2);
        deferredCalc.calc();
        timing.addTime(5);
      }]
    });
  });
  it('minTimeBetweenCalc', function () {
    testDeferredCalc({
      calcTime: [0],
      throttleTime: [0],
      maxThrottleTime: [0],
      minTimeBetweenCalc: [5],
      autoInvalidateInterval: [null],
      expected: {
        events: [{
          time: 0,
          type: EventType.CanBeCalc
        }, {
          time: 0,
          type: EventType.Calc
        }, {
          time: 0,
          type: EventType.Completed
        }, {
          time: 5,
          type: EventType.Calc
        }, {
          time: 5,
          type: EventType.Completed
        }, {
          time: 14,
          type: EventType.Calc
        }, {
          time: 14,
          type: EventType.Completed
        }, {
          time: 19,
          type: EventType.Calc
        }, {
          time: 19,
          type: EventType.Completed
        }]
      },
      actions: [function (deferredCalc) {
        deferredCalc.calc();
        timing.addTime(3);
        deferredCalc.calc();
        timing.addTime(1);
        deferredCalc.calc();
        timing.addTime(10);
        deferredCalc.calc();
        deferredCalc.calc();
        timing.addTime(5);
      }]
    });
  });
  it('autoInvalidateInterval', function () {
    testDeferredCalc({
      calcTime: [5],
      throttleTime: [0],
      maxThrottleTime: [0],
      minTimeBetweenCalc: [20],
      autoInvalidateInterval: [15],
      autoCalc: [true],
      expected: {
        events: [{
          time: 0,
          type: EventType.CanBeCalc
        }, {
          time: 0,
          type: EventType.Calc
        }, {
          time: 5,
          type: EventType.Completed
        }, {
          time: 25,
          type: EventType.CanBeCalc
        }, {
          time: 25,
          type: EventType.Calc
        }, {
          time: 30,
          type: EventType.Completed
        }, {
          time: 50,
          type: EventType.CanBeCalc
        }, {
          time: 50,
          type: EventType.Calc
        }, {
          time: 55,
          type: EventType.Completed
        }, {
          time: 75,
          type: EventType.CanBeCalc
        }, {
          time: 75,
          type: EventType.Calc
        }, {
          time: 80,
          type: EventType.Completed
        }, {
          time: 100,
          type: EventType.CanBeCalc
        }, {
          time: 100,
          type: EventType.Calc
        }, {
          time: 105,
          type: EventType.Completed
        }]
      },
      actions: [function (deferredCalc) {
        timing.addTime(100);
        deferredCalc.autoInvalidateInterval = null;
        timing.addTime(5);
      }]
    });
    testDeferredCalc({
      calcTime: [10],
      throttleTime: [0],
      maxThrottleTime: [0],
      minTimeBetweenCalc: [20],
      autoInvalidateInterval: [5],
      autoCalc: [true],
      expected: {
        events: [{
          time: 0,
          type: EventType.CanBeCalc
        }, {
          time: 0,
          type: EventType.Calc
        }, {
          time: 10,
          type: EventType.Completed
        }, {
          time: 30,
          type: EventType.CanBeCalc
        }, {
          time: 30,
          type: EventType.Calc
        }, {
          time: 40,
          type: EventType.Completed
        }, {
          time: 60,
          type: EventType.CanBeCalc
        }, {
          time: 60,
          type: EventType.Calc
        }, {
          time: 70,
          type: EventType.Completed
        }, {
          time: 90,
          type: EventType.CanBeCalc
        }, {
          time: 90,
          type: EventType.Calc
        }, {
          time: 100,
          type: EventType.Completed
        }]
      },
      actions: [function (deferredCalc) {
        timing.addTime(90);
        deferredCalc.autoInvalidateInterval = null;
        timing.addTime(10);
      }]
    });
  });
  it('real timing',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee() {
    var events, timeCoef, startTestTime, deferredCalc, i;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            events = [];
            timeCoef = 2;
            startTestTime = timingDefault.now();
            deferredCalc = new DeferredCalc({
              autoInvalidateInterval: 9 * timeCoef,
              throttleTime: 10 * timeCoef,
              maxThrottleTime: 100 * timeCoef,
              minTimeBetweenCalc: 5 * timeCoef,
              canBeCalcCallback: function canBeCalcCallback() {
                events.push({
                  time: timingDefault.now() - startTestTime,
                  type: EventType.CanBeCalc
                });
                this.calc();
              },
              calcFunc: function calcFunc(done) {
                events.push({
                  time: timingDefault.now() - startTestTime,
                  type: EventType.Calc
                });
                done();
              },
              calcCompletedCallback: function calcCompletedCallback() {
                events.push({
                  time: timingDefault.now() - startTestTime,
                  type: EventType.Completed
                });
              }
            });
            _context.next = 6;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 100 * timeCoef);
            });

          case 6:
            deferredCalc.autoInvalidateInterval = null;
            _context.next = 9;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 10 * timeCoef);
            });

          case 9:
            for (i = 0; i < events.length; i++) {
              assert.ok(events[i].time >= 100 * timeCoef);
              assert.ok(events[i].time < 150 * timeCoef);
            }

            assertEvents(events.map(function (o) {
              return {
                type: o.type
              };
            }), [{
              type: EventType.CanBeCalc
            }, {
              type: EventType.Calc
            }, {
              type: EventType.Completed
            }]);
            events = [];
            _context.next = 14;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 100 * timeCoef);
            });

          case 14:
            assert.deepStrictEqual(events, []);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('properties',
  /*#__PURE__*/
  _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2() {
    var canBeCalcCallback, calcFunc, calcCompletedCallback, deferredCalc;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            canBeCalcCallback = function canBeCalcCallback() {};

            calcFunc = function calcFunc() {};

            calcCompletedCallback = function calcCompletedCallback() {};

            deferredCalc = new DeferredCalc({
              autoInvalidateInterval: 1,
              throttleTime: 2,
              maxThrottleTime: 3,
              minTimeBetweenCalc: 4,
              canBeCalcCallback: function canBeCalcCallback() {},
              calcFunc: function calcFunc() {},
              calcCompletedCallback: function calcCompletedCallback() {},
              timing: new TestTiming()
            });
            assert.strictEqual(deferredCalc.autoInvalidateInterval, 1);
            assert.strictEqual(deferredCalc.throttleTime, 2);
            assert.strictEqual(deferredCalc.maxThrottleTime, 3);
            assert.strictEqual(deferredCalc.minTimeBetweenCalc, 4);
            deferredCalc.autoInvalidateInterval = 11;
            deferredCalc.throttleTime = 12;
            deferredCalc.maxThrottleTime = 13;
            deferredCalc.minTimeBetweenCalc = 14;
            assert.strictEqual(deferredCalc.autoInvalidateInterval, 11);
            assert.strictEqual(deferredCalc.throttleTime, 12);
            assert.strictEqual(deferredCalc.maxThrottleTime, 13);
            assert.strictEqual(deferredCalc.minTimeBetweenCalc, 14);

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});