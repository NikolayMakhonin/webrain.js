"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _async = require("../../../../../main/common/async/async");

var _Assert = require("../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../main/common/test/Mocha");

var _helpers = require("../../../../../main/common/time/helpers");

var _TimeLimit = require("../../../../../main/common/time/TimeLimit");

var _TimeLimits = require("../../../../../main/common/time/TimeLimits");

(0, _Mocha.xdescribe)('time-limits', function () {
  (0, _Mocha.it)('TimeLimit: constructor',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var timeLimit;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            timeLimit = new _TimeLimit.TimeLimit(5, 0.1);

            _Assert.assert.strictEqual(timeLimit.count, 5);

            _Assert.assert.strictEqual(timeLimit.time, 0.1);

            _Assert.assert.strictEqual(typeof timeLimit.getWaitTime, 'function');

            _Assert.assert.strictEqual(typeof timeLimit.wait, 'function');

            _Assert.assert.strictEqual(typeof timeLimit.run, 'function');

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  var timeoutCoef = 7 * 2;

  function addTimeLimits(result, prefix, timeLimit) {
    function add(key, timeLimits) {
      result[key] = timeLimits(key);
    }

    add(prefix + 'timeLimit', function (key) {
      return timeLimit(key);
    });
    add(prefix + 'new TimeLimits(timeLimit)', function (key) {
      return new _TimeLimits.TimeLimits(timeLimit(key));
    });
    add(prefix + 'new TimeLimits(timeLimit, timeLimit)', function (key) {
      return new _TimeLimits.TimeLimits(timeLimit(key), timeLimit(key));
    });
    add(prefix + 'new TimeLimits(timeLimit, timeLimit, timeLimit)', function (key) {
      return new _TimeLimits.TimeLimits(timeLimit(key), timeLimit(key), timeLimit(key));
    });
    add(prefix + 'new TimeLimits(new TimeLimits(timeLimit))', function (key) {
      return new _TimeLimits.TimeLimits(new _TimeLimits.TimeLimits(timeLimit(key)));
    });
    add(prefix + 'new TimeLimits(new TimeLimits(new TimeLimits(timeLimit)))', function (key) {
      return new _TimeLimits.TimeLimits(new _TimeLimits.TimeLimits(new _TimeLimits.TimeLimits(timeLimit(key))));
    });
    add(prefix + 'new TimeLimits(...<complex>...)', function (key) {
      return new _TimeLimits.TimeLimits(new _TimeLimits.TimeLimits(new _TimeLimits.TimeLimits(timeLimit(key))), new _TimeLimits.TimeLimits(new _TimeLimits.TimeLimits(timeLimit(key), timeLimit(key))), new _TimeLimits.TimeLimits(new _TimeLimits.TimeLimits(timeLimit(key), timeLimit(key), new _TimeLimits.TimeLimits(new _TimeLimits.TimeLimits(timeLimit(key)), new _TimeLimits.TimeLimits(timeLimit(key), timeLimit(key))))));
    });
  }

  function generateTimeLimits(count, time) {
    var result = {};
    var equalTimeLimits = {};
    addTimeLimits(result, '(equal) ', function (key) {
      var timeLimit = equalTimeLimits[key];

      if (!timeLimit) {
        timeLimit = new _TimeLimit.TimeLimit(count, time);
        equalTimeLimits[key] = timeLimit;
      }

      return timeLimit;
    });
    addTimeLimits(result, '(diff) ', function (key) {
      return new _TimeLimit.TimeLimit(count, time);
    });
    return result;
  }

  function timeLimitsIterator(_x, _x2, _x3) {
    return _timeLimitsIterator.apply(this, arguments);
  }

  function _timeLimitsIterator() {
    _timeLimitsIterator = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee11(count, time, iterate) {
      var timeLimits, name, timeLimit;
      return _regenerator.default.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              timeLimits = generateTimeLimits(count, time);
              _context11.t0 = (0, _keys.default)(_regenerator.default).call(_regenerator.default, timeLimits);

            case 2:
              if ((_context11.t1 = _context11.t0()).done) {
                _context11.next = 18;
                break;
              }

              name = _context11.t1.value;

              if (timeLimits.hasOwnProperty(name)) {
                _context11.next = 6;
                break;
              }

              return _context11.abrupt("continue", 2);

            case 6:
              // console.log('TimeLimits: ' + name)
              timeLimit = timeLimits[name];
              _context11.prev = 7;
              _context11.next = 10;
              return iterate(timeLimit);

            case 10:
              _context11.next = 16;
              break;

            case 12:
              _context11.prev = 12;
              _context11.t2 = _context11["catch"](7);
              console.log('Error in ' + name);
              throw _context11.t2;

            case 16:
              _context11.next = 2;
              break;

            case 18:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11, null, [[7, 12]]);
    }));
    return _timeLimitsIterator.apply(this, arguments);
  }

  (0, _Mocha.it)('TimeLimit: result',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4() {
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            this.timeout(2000 * timeoutCoef);

            _Assert.assert.strictEqual(new _TimeLimits.TimeLimits().run(function () {
              return '1';
            }), '1');

            _context4.next = 4;
            return timeLimitsIterator(3, 100,
            /*#__PURE__*/
            function () {
              var _ref3 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee3(timeLimit) {
                var result;
                return _regenerator.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        result = timeLimit.run(function () {
                          return '1';
                        });

                        _Assert.assert.strictEqual(result, '1');

                        _context3.next = 4;
                        return timeLimit.run(function () {
                          return '2';
                        });

                      case 4:
                        result = _context3.sent;

                        _Assert.assert.strictEqual(result, '2');

                        _context3.next = 8;
                        return timeLimit.run(
                        /*#__PURE__*/
                        (0, _asyncToGenerator2.default)(
                        /*#__PURE__*/
                        _regenerator.default.mark(function _callee2() {
                          return _regenerator.default.wrap(function _callee2$(_context2) {
                            while (1) {
                              switch (_context2.prev = _context2.next) {
                                case 0:
                                  return _context2.abrupt("return", '3');

                                case 1:
                                case "end":
                                  return _context2.stop();
                              }
                            }
                          }, _callee2);
                        })));

                      case 8:
                        result = _context3.sent;

                        _Assert.assert.strictEqual(result, '3');

                        result = timeLimit.run(function () {
                          return '4';
                        });

                        _Assert.assert.ok((0, _async.isAsync)(result), result + '');

                        _context3.next = 14;
                        return result;

                      case 14:
                        result = _context3.sent;

                        _Assert.assert.strictEqual(result, '4');

                      case 16:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x4) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  })));
  (0, _Mocha.it)('TimeLimit: countActive',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee7() {
    return _regenerator.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            this.timeout(30000 * timeoutCoef);
            _context7.next = 3;
            return timeLimitsIterator(3, 10,
            /*#__PURE__*/
            function () {
              var _ref6 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee6(timeLimit) {
                var countActive, func, tasks, i;
                return _regenerator.default.wrap(function _callee6$(_context6) {
                  while (1) {
                    switch (_context6.prev = _context6.next) {
                      case 0:
                        countActive = 0;

                        func =
                        /*#__PURE__*/
                        function () {
                          var _ref7 = (0, _asyncToGenerator2.default)(
                          /*#__PURE__*/
                          _regenerator.default.mark(function _callee5() {
                            return _regenerator.default.wrap(function _callee5$(_context5) {
                              while (1) {
                                switch (_context5.prev = _context5.next) {
                                  case 0:
                                    // assert.ok(countActive < 3)
                                    // console.log('countActive = ' + countActive)
                                    countActive++;
                                    _context5.next = 3;
                                    return (0, _helpers.delay)(10);

                                  case 3:
                                    countActive--;
                                    return _context5.abrupt("return", true);

                                  case 5:
                                  case "end":
                                    return _context5.stop();
                                }
                              }
                            }, _callee5);
                          }));

                          return function func() {
                            return _ref7.apply(this, arguments);
                          };
                        }();

                        _Assert.assert.strictEqual(countActive, 0);

                        tasks = [];

                        for (i = 0; i < 100; i++) {
                          tasks.push(timeLimit.run(func));
                        }

                        _context6.next = 7;
                        return _promise.default.all(tasks);

                      case 7:
                        if (countActive) {
                          console.log((0, _stringify.default)(timeLimit.debug), tasks);
                        }

                        _Assert.assert.strictEqual(countActive, 0);

                      case 9:
                      case "end":
                        return _context6.stop();
                    }
                  }
                }, _callee6);
              }));

              return function (_x5) {
                return _ref6.apply(this, arguments);
              };
            }());

          case 3:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, this);
  })));
  (0, _Mocha.it)('TimeLimit',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee10() {
    return _regenerator.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            this.timeout(30000 * timeoutCoef);
            _context10.next = 3;
            return timeLimitsIterator(5, 100,
            /*#__PURE__*/
            function () {
              var _ref9 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee9(timeLimit) {
                var callCount, func, EPSILON, nextTestNumber, test, bigDelayMaxCount, i;
                return _regenerator.default.wrap(function _callee9$(_context9) {
                  while (1) {
                    switch (_context9.prev = _context9.next) {
                      case 0:
                        callCount = 0;

                        func = function func() {
                          return callCount++;
                        };

                        EPSILON = 20;
                        nextTestNumber = 0;

                        test =
                        /*#__PURE__*/
                        function () {
                          var _ref10 = (0, _asyncToGenerator2.default)(
                          /*#__PURE__*/
                          _regenerator.default.mark(function _callee8(checkTimeFrom, checkTimeTo) {
                            var testNumber, t0, result, t1, error;
                            return _regenerator.default.wrap(function _callee8$(_context8) {
                              while (1) {
                                switch (_context8.prev = _context8.next) {
                                  case 0:
                                    testNumber = nextTestNumber++;
                                    t0 = new Date().getTime();
                                    _context8.next = 4;
                                    return timeLimit.run(func);

                                  case 4:
                                    result = _context8.sent;

                                    _Assert.assert.ok(typeof result === 'number');

                                    t1 = new Date().getTime();

                                    if (checkTimeFrom != null) {
                                      _Assert.assert.ok(t1 - t0 >= checkTimeFrom - EPSILON, testNumber + ": t1 - t0 (" + (t1 - t0) + ") < " + checkTimeFrom + "\n" + (0, _stringify.default)(timeLimit.debug, null, 4));
                                    }

                                    if (!(checkTimeTo != null)) {
                                      _context8.next = 14;
                                      break;
                                    }

                                    if (!(t1 - t0 > checkTimeTo + EPSILON)) {
                                      _context8.next = 13;
                                      break;
                                    }

                                    error = new Error(testNumber + ": t1 - t0 (" + (t1 - t0) + ") > " + checkTimeTo + "\n" + (0, _stringify.default)(timeLimit.debug, null, 4));
                                    error.type = 'BigDelay';
                                    throw error;

                                  case 13:
                                    _Assert.assert.ok(t1 - t0 <= checkTimeTo + EPSILON, testNumber + ": t1 - t0 (" + (t1 - t0) + ") > " + checkTimeTo + "\n" + (0, _stringify.default)(timeLimit.debug, null, 4));

                                  case 14:
                                  case "end":
                                    return _context8.stop();
                                }
                              }
                            }, _callee8);
                          }));

                          return function test(_x7, _x8) {
                            return _ref10.apply(this, arguments);
                          };
                        }();

                        bigDelayMaxCount = 0;
                        i = 2;

                      case 7:
                        if (!i--) {
                          _context9.next = 68;
                          break;
                        }

                        nextTestNumber = 0;
                        _context9.prev = 9;
                        _context9.next = 12;
                        return test(null, 2);

                      case 12:
                        _context9.next = 14;
                        return test(null, 2);

                      case 14:
                        _context9.next = 16;
                        return test(null, 2);

                      case 16:
                        _context9.next = 18;
                        return test(null, 2);

                      case 18:
                        _context9.next = 20;
                        return test(null, 2);

                      case 20:
                        // console.log(JSON.stringify(JSON.stringify(timeLimit.debug), null, 4))
                        _Assert.assert.strictEqual(callCount, 5); // , `i = ${i}\r\n${JSON.stringify(timeLimit.debug)}`)


                        callCount = 0;
                        _context9.next = 24;
                        return _promise.default.all([test(100, 300)]);

                      case 24:
                        _Assert.assert.strictEqual(callCount, 1, "i = " + i + "\r\n" + (0, _stringify.default)(timeLimit.debug));

                        callCount = 0;
                        _context9.next = 28;
                        return (0, _helpers.delay)(EPSILON);

                      case 28:
                        _context9.next = 30;
                        return test(null, 2);

                      case 30:
                        _context9.next = 32;
                        return test(null, 2);

                      case 32:
                        _context9.next = 34;
                        return test(null, 2);

                      case 34:
                        _context9.next = 36;
                        return test(null, 2);

                      case 36:
                        _Assert.assert.strictEqual(callCount, 4, "i = " + i + "\r\n" + (0, _stringify.default)(timeLimit.debug));

                        callCount = 0;
                        _context9.next = 40;
                        return (0, _helpers.delay)(300);

                      case 40:
                        _context9.next = 42;
                        return test(null, 2);

                      case 42:
                        _context9.next = 44;
                        return test(null, 2);

                      case 44:
                        _context9.next = 46;
                        return test(null, 2);

                      case 46:
                        _context9.next = 48;
                        return test(null, 2);

                      case 48:
                        _context9.next = 50;
                        return test(null, 2);

                      case 50:
                        _Assert.assert.strictEqual(callCount, 5, "i = " + i + "\r\n" + (0, _stringify.default)(timeLimit.debug));

                        callCount = 0;
                        _context9.next = 54;
                        return test(100, 300);

                      case 54:
                        _Assert.assert.strictEqual(callCount, 1, "i = " + i + "\r\n" + (0, _stringify.default)(timeLimit.debug));

                        callCount = 0;
                        _context9.next = 58;
                        return (0, _helpers.delay)(300);

                      case 58:
                        _Assert.assert.strictEqual(callCount, 0, "i = " + i + "\r\n" + (0, _stringify.default)(timeLimit.debug));

                        _context9.next = 66;
                        break;

                      case 61:
                        _context9.prev = 61;
                        _context9.t0 = _context9["catch"](9);

                        if (!(bigDelayMaxCount-- <= 0 || _context9.t0.type !== 'BigDelay')) {
                          _context9.next = 65;
                          break;
                        }

                        throw _context9.t0;

                      case 65:
                        console.log(_context9.t0.type, _context9.t0.message);

                      case 66:
                        _context9.next = 7;
                        break;

                      case 68:
                      case "end":
                        return _context9.stop();
                    }
                  }
                }, _callee9, null, [[9, 61]]);
              }));

              return function (_x6) {
                return _ref9.apply(this, arguments);
              };
            }());

          case 3:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, this);
  })));
});