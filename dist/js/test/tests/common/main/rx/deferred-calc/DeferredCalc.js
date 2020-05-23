"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _DeferredCalc = require("../../../../../../main/common/rx/deferred-calc/DeferredCalc");

var _timing = require("../../../../../../main/common/rx/deferred-calc/timing");

var _Assert = require("../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../main/common/test/Mocha");

var _TestDeferred = require("./src/TestDeferred");

/* tslint:disable:no-empty no-identical-functions */
(0, _Mocha.describe)('common > main > rx > deferred-calc > DeferredCalc', function () {
  this.timeout(20000);
  var testDeferredCalc = _TestDeferred.TestDeferredCalc.test;
  after(function () {
    console.log('Total DeferredCalc tests >= ' + _TestDeferred.TestDeferredCalc.totalTests);
  });
  (0, _Mocha.it)('init', function () {
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
      actions: [function (deferredCalc) {}, function (deferredCalc) {
        return _TestDeferred.timing.addTime(0);
      }, function (deferredCalc) {
        return _TestDeferred.timing.addTime(1);
      }, function (deferredCalc) {
        return _TestDeferred.timing.addTime(10);
      }, function (deferredCalc) {
        return _TestDeferred.timing.addTime(100);
      }, function (deferredCalc) {
        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(100);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(100);
      }]
    });
  });
  (0, _Mocha.it)('calc only after invalidate', function () {
    testDeferredCalc({
      calcTime: [5],
      throttleTime: [null, 0],
      maxThrottleTime: [null, 0, 10],
      minTimeBetweenCalc: [null, 0],
      autoInvalidateInterval: [null],
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
          time: 15,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 15,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 20,
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
          time: 30,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 35,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 40,
          type: _TestDeferred.EventType.Completed
        }]
      },
      actions: [function (deferredCalc) {
        deferredCalc.calc();
        deferredCalc.calc();
        deferredCalc.calc();

        _TestDeferred.timing.addTime(5);

        deferredCalc.calc();
        deferredCalc.calc();

        _TestDeferred.timing.addTime(5);

        deferredCalc.calc();

        _TestDeferred.timing.addTime(5); // 15


        deferredCalc.invalidate();
        deferredCalc.calc();
        deferredCalc.calc();

        _TestDeferred.timing.addTime(5);

        deferredCalc.calc();
        deferredCalc.calc();

        _TestDeferred.timing.addTime(5);

        deferredCalc.invalidate();
        deferredCalc.calc();
        deferredCalc.invalidate();
        deferredCalc.calc();

        _TestDeferred.timing.addTime(4);

        deferredCalc.calc();

        _TestDeferred.timing.addTime(1);

        _TestDeferred.timing.addTime(5);

        deferredCalc.calc();

        _TestDeferred.timing.addTime(5);
      }]
    });
  });
  (0, _Mocha.it)('throttleTime', function () {
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
      actions: [function (deferredCalc) {
        deferredCalc.calc();
      }, function (deferredCalc) {
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
      actions: [function (deferredCalc) {
        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(0);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(0);

        _TestDeferred.timing.addTime(9);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(0);

        _TestDeferred.timing.addTime(9); // 18


        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(0);

        _TestDeferred.timing.addTime(12); // 30


        deferredCalc.calc();

        _TestDeferred.timing.addTime(0);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(0);

        _TestDeferred.timing.addTime(9); // 39


        deferredCalc.invalidate();
        deferredCalc.reCalc();

        _TestDeferred.timing.addTime(0);

        _TestDeferred.timing.addTime(10); // 49


        _TestDeferred.timing.addTime(4); // 53


        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(0);

        _TestDeferred.timing.addTime(11); // 64


        deferredCalc.calc();

        _TestDeferred.timing.addTime(9);
      }]
    });
  });
  (0, _Mocha.it)('maxThrottleTime', function () {
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
      actions: [function (deferredCalc) {
        deferredCalc.calc();
      }, function (deferredCalc) {
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
      actions: [function (deferredCalc) {
        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(4);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(4);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(4); // 12


        deferredCalc.calc();
        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(4); // 16


        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(4); // 20


        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(1); // 21


        deferredCalc.reCalc();

        _TestDeferred.timing.addTime(1); // 22


        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(4); // 26


        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(4); // 30


        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(2); // 32


        deferredCalc.calc();

        _TestDeferred.timing.addTime(5);
      }]
    });
  });
  (0, _Mocha.it)('minTimeBetweenCalc', function () {
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
          type: _TestDeferred.EventType.CanBeCalc
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
      actions: [function (deferredCalc) {
        deferredCalc.calc();

        _TestDeferred.timing.addTime(3);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(1);

        deferredCalc.calc();

        _TestDeferred.timing.addTime(10);

        deferredCalc.reCalc();
        deferredCalc.reCalc();

        _TestDeferred.timing.addTime(5);
      }]
    });
  });
  (0, _Mocha.it)('autoInvalidateInterval', function () {
    testDeferredCalc({
      calcTime: [5],
      throttleTime: [10],
      maxThrottleTime: [20],
      minTimeBetweenCalc: [40],
      autoInvalidateInterval: [100],
      autoCalc: [true],
      expected: {
        events: [{
          time: 10,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 10,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 15,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 120,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 120,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 125,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 230,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 230,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 235,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 275,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 275,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 280,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 385,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 385,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 390,
          type: _TestDeferred.EventType.Completed
        }, {
          time: 495,
          type: _TestDeferred.EventType.CanBeCalc
        }, {
          time: 495,
          type: _TestDeferred.EventType.Calc
        }, {
          time: 500,
          type: _TestDeferred.EventType.Completed
        }]
      },
      actions: [function (deferredCalc) {
        _TestDeferred.timing.addTime(250);

        deferredCalc.invalidate();

        _TestDeferred.timing.addTime(250);

        deferredCalc.autoInvalidateInterval = null;
      }]
    });
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
      actions: [function (deferredCalc) {
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
      actions: [function (deferredCalc) {
        _TestDeferred.timing.addTime(90);

        deferredCalc.autoInvalidateInterval = null;

        _TestDeferred.timing.addTime(10);
      }]
    });
  });
  (0, _Mocha.it)('real timing', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var events, timeCoef, startTestTime, deferredCalc, checkEventTypes, i, event;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            events = [];
            timeCoef = 2;
            startTestTime = _timing.timingDefault.now();
            deferredCalc = new _DeferredCalc.DeferredCalc({
              canBeCalcCallback: function canBeCalcCallback() {
                events.push({
                  time: _timing.timingDefault.now() - startTestTime,
                  type: _TestDeferred.EventType.CanBeCalc
                });
                this.calc();
              },
              calcFunc: function calcFunc() {
                events.push({
                  time: _timing.timingDefault.now() - startTestTime,
                  type: _TestDeferred.EventType.Calc
                });
                this.done();
              },
              calcCompletedCallback: function calcCompletedCallback() {
                events.push({
                  time: _timing.timingDefault.now() - startTestTime,
                  type: _TestDeferred.EventType.Completed
                });
              },
              options: {
                autoInvalidateInterval: 9 * timeCoef,
                throttleTime: 10 * timeCoef,
                maxThrottleTime: 100 * timeCoef,
                minTimeBetweenCalc: 5 * timeCoef
              }
            });
            _context.next = 6;
            return new _promise.default(function (resolve) {
              return (0, _setTimeout2.default)(resolve, 100 * timeCoef);
            });

          case 6:
            deferredCalc.autoInvalidateInterval = null;
            _context.next = 9;
            return new _promise.default(function (resolve) {
              return (0, _setTimeout2.default)(resolve, 10 * timeCoef);
            });

          case 9:
            _Assert.assert.strictEqual(events.length % 3, 0);

            _Assert.assert.ok(events.length / 3 > 2);

            checkEventTypes = [_TestDeferred.EventType.CanBeCalc, _TestDeferred.EventType.Calc, _TestDeferred.EventType.Completed];

            for (i = 0; i < events.length; i++) {
              event = events[i];

              _Assert.assert.ok(event.time < 100 * timeCoef, event.time + '');

              _Assert.assert.strictEqual(event.type, checkEventTypes[i % 3]);
            }

            events = [];
            _context.next = 16;
            return new _promise.default(function (resolve) {
              return (0, _setTimeout2.default)(resolve, 100 * timeCoef);
            });

          case 16:
            _Assert.assert.deepStrictEqual(events, []);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  (0, _Mocha.it)('properties', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
    var canBeCalcCallback, calcFunc, calcCompletedCallback, deferredCalc;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            canBeCalcCallback = function canBeCalcCallback() {};

            calcFunc = function calcFunc() {};

            calcCompletedCallback = function calcCompletedCallback() {};

            deferredCalc = new _DeferredCalc.DeferredCalc({
              canBeCalcCallback: function canBeCalcCallback() {},
              calcFunc: function calcFunc() {},
              calcCompletedCallback: function calcCompletedCallback() {},
              options: {
                autoInvalidateInterval: 1,
                throttleTime: 2,
                maxThrottleTime: 3,
                minTimeBetweenCalc: 4,
                timing: new _TestDeferred.TestTimingForDeferredCalc()
              }
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

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});