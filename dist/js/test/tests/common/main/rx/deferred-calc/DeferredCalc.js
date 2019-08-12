"use strict";

var _DeferredCalc = require("../../../../../../main/common/rx/deferred-calc/DeferredCalc");

var _timing = require("../../../../../../main/common/rx/deferred-calc/timing");

var _Assert = require("../../../../../../main/common/test/Assert");

var _TestDeferred = require("./src/TestDeferred");

var _timing2 = require("./src/timing");

/* tslint:disable:no-empty no-identical-functions */
describe('common > main > rx > deferred-calc > DeferredCalc', function () {
  this.timeout(20000);
  const testDeferredCalc = _TestDeferred.TestDeferredCalc.test;
  after(function () {
    console.log('Total DeferredCalc tests >= ' + _TestDeferred.TestDeferredCalc.totalTests);
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
          type: _TestDeferred.EventType.CanBeCalc
        }]
      },
      actions: [deferredCalc => {}, deferredCalc => _TestDeferred.timing.addTime(0), deferredCalc => _TestDeferred.timing.addTime(1), deferredCalc => _TestDeferred.timing.addTime(10), deferredCalc => _TestDeferred.timing.addTime(100), deferredCalc => {
        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(100);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(100);
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
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 0,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 0,
          type: _TestDeferred.EventType.Completed
        }]
      },
      actions: [deferredCalc => {
        deferredCalc.calc();
      }, deferredCalc => {
        deferredCalc.calc();

        _TestDeferred.timing.addTime(0);
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
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 30,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 35,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 49,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 54,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 63,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 64,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 69,
          type: _TestDeferred.EventType.Completed
        }]
      },
      actions: [deferredCalc => {
        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(0);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(0);

        _TestDeferred.timing.addTime(9);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(0);

        _TestDeferred.timing.addTime(9);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(0);

        _TestDeferred.timing.addTime(12); // 30


        deferredCalc.calc();

        _TestDeferred.timing.addTime(0);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(0);

        _TestDeferred.timing.addTime(9);

        deferredCalc.invalidate();
        deferredCalc.calc();

        _TestDeferred.timing.addTime(0);

        _TestDeferred.timing.addTime(10);

        _TestDeferred.timing.addTime(4);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(0);

        _TestDeferred.timing.addTime(11);

        deferredCalc.calc();

        _TestDeferred.timing.addTime(9);
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
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 0,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 0,
          type: _TestDeferred.EventType.Completed
        }]
      },
      actions: [deferredCalc => {
        deferredCalc.calc();
      }, deferredCalc => {
        deferredCalc.calc();

        _TestDeferred.timing.addTime(0);
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
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 12,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 17,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 22,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 27,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 32,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 32,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 37,
          type: _TestDeferred.EventType.Completed
        }]
      },
      actions: [deferredCalc => {
        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(4);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(4);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(4); // 12


        deferredCalc.calc();
        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(4);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(4);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(1);

        deferredCalc.calc();

        _TestDeferred.timing.addTime(1);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(4);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(4);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(2);

        deferredCalc.calc();

        _TestDeferred.timing.addTime(5);
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
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 0,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 0,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 5,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 5,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 14,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 14,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 19,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 19,
          type: _TestDeferred.EventType.Completed
        }]
      },
      actions: [deferredCalc => {
        deferredCalc.calc();

        _TestDeferred.timing.addTime(3);

        deferredCalc.calc();

        _TestDeferred.timing.addTime(1);

        deferredCalc.calc();

        _TestDeferred.timing.addTime(10);

        deferredCalc.calc();
        deferredCalc.calc();

        _TestDeferred.timing.addTime(5);
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
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 0,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 5,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 25,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 25,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 30,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 50,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 50,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 55,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 75,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 75,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 80,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 100,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 100,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 105,
          type: _TestDeferred.EventType.Completed
        }]
      },
      actions: [deferredCalc => {
        _TestDeferred.timing.addTime(100);

        deferredCalc.autoInvalidateInterval = null;

        _TestDeferred.timing.addTime(5);
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
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 0,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 10,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 30,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 30,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 40,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 60,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 60,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 70,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 90,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 90,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 100,
          type: _TestDeferred.EventType.Completed
        }]
      },
      actions: [deferredCalc => {
        _TestDeferred.timing.addTime(90);

        deferredCalc.autoInvalidateInterval = null;

        _TestDeferred.timing.addTime(10);
      }]
    });
  });
  it('real timing', async function () {
    let events = [];
    const timeCoef = 2;

    const startTestTime = _timing.timingDefault.now();

    const deferredCalc = new _DeferredCalc.DeferredCalc({
      autoInvalidateInterval: 9 * timeCoef,
      throttleTime: 10 * timeCoef,
      maxThrottleTime: 100 * timeCoef,
      minTimeBetweenCalc: 5 * timeCoef,

      canBeCalcCallback() {
        events.push({
          time: _timing.timingDefault.now() - startTestTime,
          type: _TestDeferred.EventType.CanBeCalc
        });
        this.calc();
      },

      calcFunc(done) {
        events.push({
          time: _timing.timingDefault.now() - startTestTime,
          type: _TestDeferred.EventType.Calc
        });
        done();
      },

      calcCompletedCallback() {
        events.push({
          time: _timing.timingDefault.now() - startTestTime,
          type: _TestDeferred.EventType.Completed
        });
      }

    });
    await new Promise(resolve => setTimeout(resolve, 100 * timeCoef));
    deferredCalc.autoInvalidateInterval = null;
    await new Promise(resolve => setTimeout(resolve, 10 * timeCoef));

    for (let i = 0; i < events.length; i++) {
      _Assert.assert.ok(events[i].time >= 100 * timeCoef);

      _Assert.assert.ok(events[i].time < 150 * timeCoef);
    }

    (0, _TestDeferred.assertEvents)(events.map(o => ({
      type: o.type
    })), [{
      type: _TestDeferred.EventType.CanBeCalc
    }, {
      type: _TestDeferred.EventType.Calc
    }, {
      type: _TestDeferred.EventType.Completed
    }]);
    events = [];
    await new Promise(resolve => setTimeout(resolve, 100 * timeCoef));

    _Assert.assert.deepStrictEqual(events, []);
  });
  it('properties', async function () {
    const canBeCalcCallback = () => {};

    const calcFunc = () => {};

    const calcCompletedCallback = () => {};

    const deferredCalc = new _DeferredCalc.DeferredCalc({
      autoInvalidateInterval: 1,
      throttleTime: 2,
      maxThrottleTime: 3,
      minTimeBetweenCalc: 4,
      canBeCalcCallback: () => {},
      calcFunc: () => {},
      calcCompletedCallback: () => {},
      timing: new _timing2.TestTiming()
    });

    _Assert.assert.strictEqual(deferredCalc.autoInvalidateInterval, 1);

    _Assert.assert.strictEqual(deferredCalc.throttleTime, 2);

    _Assert.assert.strictEqual(deferredCalc.maxThrottleTime, 3);

    _Assert.assert.strictEqual(deferredCalc.minTimeBetweenCalc, 4);

    deferredCalc.autoInvalidateInterval = 11;
    deferredCalc.throttleTime = 12;
    deferredCalc.maxThrottleTime = 13;
    deferredCalc.minTimeBetweenCalc = 14;

    _Assert.assert.strictEqual(deferredCalc.autoInvalidateInterval, 11);

    _Assert.assert.strictEqual(deferredCalc.throttleTime, 12);

    _Assert.assert.strictEqual(deferredCalc.maxThrottleTime, 13);

    _Assert.assert.strictEqual(deferredCalc.minTimeBetweenCalc, 14);
  });
});