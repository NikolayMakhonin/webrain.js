"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.testIterationBuilder = testIterationBuilder;
exports.testIteratorBuilder = testIteratorBuilder;
exports.test = test;
exports.searchBestErrorBuilder = searchBestErrorBuilder;
exports.randomTestBuilder = randomTestBuilder;

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _ThenableSync = require("../async/ThenableSync");

var _Random = require("../random/Random");

var _interceptConsole = require("./interceptConsole");

var _marked3 = /*#__PURE__*/_regenerator.default.mark(test),
    _marked4 = /*#__PURE__*/_regenerator.default.mark(testRunner);

function testIterationBuilder(_ref) {
  var _marked = /*#__PURE__*/_regenerator.default.mark(testIteration);

  var before = _ref.before,
      action = _ref.action,
      waitAsyncRandom = _ref.waitAsyncRandom,
      waitAsyncAll = _ref.waitAsyncAll,
      after = _ref.after;
  var sumWeights = action.weight + (waitAsyncAll != null ? waitAsyncAll.weight : 0) + (waitAsyncRandom != null ? waitAsyncRandom.weight : 0);
  var waitAsyncRandomWeight = waitAsyncRandom != null ? waitAsyncRandom.weight / sumWeights : 0;
  var waitAsyncAllWeight = waitAsyncAll != null ? waitAsyncAll.weight / sumWeights : 0;
  var asyncs = [];

  function testIteration(rnd, state) {
    var step, index, async, _async;

    return _regenerator.default.wrap(function testIteration$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(before != null)) {
              _context.next = 3;
              break;
            }

            _context.next = 3;
            return before(rnd, state);

          case 3:
            step = rnd.next();

            if (!(step < asyncs.length * waitAsyncAllWeight)) {
              _context.next = 16;
              break;
            }

            if (!(waitAsyncAll.before != null)) {
              _context.next = 8;
              break;
            }

            _context.next = 8;
            return waitAsyncAll.before(rnd, state);

          case 8:
            _context.next = 10;
            return (0, _ThenableSync.resolveAsyncAll)(asyncs);

          case 10:
            asyncs.length = 0;

            if (!(waitAsyncAll.after != null)) {
              _context.next = 14;
              break;
            }

            _context.next = 14;
            return waitAsyncAll.after(rnd, state);

          case 14:
            _context.next = 44;
            break;

          case 16:
            if (!(step < asyncs.length * waitAsyncRandomWeight)) {
              _context.next = 31;
              break;
            }

            if (!(waitAsyncRandom.before != null)) {
              _context.next = 20;
              break;
            }

            _context.next = 20;
            return waitAsyncRandom.before(rnd, state);

          case 20:
            index = rnd.nextInt(asyncs.length);
            async = asyncs[index];
            asyncs[index] = asyncs[asyncs.length - 1];
            asyncs.length--;
            _context.next = 26;
            return async;

          case 26:
            if (!(waitAsyncRandom.after != null)) {
              _context.next = 29;
              break;
            }

            _context.next = 29;
            return waitAsyncRandom.after(rnd, state);

          case 29:
            _context.next = 44;
            break;

          case 31:
            if (!(action.before != null)) {
              _context.next = 34;
              break;
            }

            _context.next = 34;
            return action.before(rnd, state);

          case 34:
            _async = action.func(rnd.nextRandom(), state);

            if (!(waitAsyncRandomWeight === 0 && waitAsyncAllWeight === 0)) {
              _context.next = 40;
              break;
            }

            _context.next = 38;
            return _async;

          case 38:
            _context.next = 41;
            break;

          case 40:
            // if (isAsync(async)) {
            asyncs.push(_async);

          case 41:
            if (!(action.after != null)) {
              _context.next = 44;
              break;
            }

            _context.next = 44;
            return action.after(rnd, state);

          case 44:
            if (!(after != null)) {
              _context.next = 47;
              break;
            }

            _context.next = 47;
            return after(rnd, state);

          case 47:
          case "end":
            return _context.stop();
        }
      }
    }, _marked);
  }

  return testIteration;
} // endregion


// region testIteratorBuilder
function testIteratorBuilder(createState, _ref2) {
  var _marked2 = /*#__PURE__*/_regenerator.default.mark(_iterator);

  var before = _ref2.before,
      stopPredicate = _ref2.stopPredicate,
      testIteration = _ref2.testIteration,
      after = _ref2.after,
      consoleThrowPredicate = _ref2.consoleThrowPredicate;

  function _iterator(rnd, options) {
    var state, timeStart, iterationNumber, doStop;
    return _regenerator.default.wrap(function _iterator$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return createState(rnd, options);

          case 2:
            state = _context2.sent;

            if (!(before != null)) {
              _context2.next = 6;
              break;
            }

            _context2.next = 6;
            return before(rnd, state);

          case 6:
            timeStart = (0, _now.default)();
            iterationNumber = 0;

          case 8:
            if (!true) {
              _context2.next = 19;
              break;
            }

            _context2.next = 11;
            return stopPredicate(iterationNumber, timeStart, state);

          case 11:
            doStop = _context2.sent;

            if (!doStop) {
              _context2.next = 14;
              break;
            }

            return _context2.abrupt("break", 19);

          case 14:
            _context2.next = 16;
            return testIteration(rnd, state);

          case 16:
            iterationNumber++;
            _context2.next = 8;
            break;

          case 19:
            if (!(after != null)) {
              _context2.next = 22;
              break;
            }

            _context2.next = 22;
            return after(rnd, state);

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, _marked2);
  }

  function iterator(rnd, options) {
    return (0, _interceptConsole.throwOnConsoleError)(this, consoleThrowPredicate, function () {
      return _iterator(rnd, options);
    });
  }

  return iterator;
} // endregion


// region test
function test(seed, optionsPattern, optionsGenerator, testIterator) {
  var rnd, options;
  return _regenerator.default.wrap(function test$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (seed == null) {
            seed = new _Random.Random().nextSeed();
          }

          console.log("\r\nseed = " + seed);
          rnd = new _Random.Random(seed);
          _context3.next = 5;
          return optionsGenerator(rnd, optionsPattern);

        case 5:
          options = _context3.sent;
          _context3.next = 8;
          return testIterator(rnd, options);

        case 8:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked3);
} // endregion


// region testRunner
function testRunner(_this, _ref3) {
  var stopPredicate, func, testRunnerMetrics, timeStart, now, doStop;
  return _regenerator.default.wrap(function testRunner$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          stopPredicate = _ref3.stopPredicate, func = _ref3.func, testRunnerMetrics = _ref3.testRunnerMetrics;
          timeStart = (0, _now.default)();

          if (testRunnerMetrics == null) {
            testRunnerMetrics = {};
          }

          testRunnerMetrics.iterationNumber = 0;

        case 4:
          if (!true) {
            _context4.next = 17;
            break;
          }

          now = (0, _now.default)();
          testRunnerMetrics.timeFromStart = now - timeStart;
          _context4.next = 9;
          return stopPredicate(testRunnerMetrics);

        case 9:
          doStop = _context4.sent;

          if (!doStop) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("break", 17);

        case 12:
          _context4.next = 14;
          return func.call(_this, testRunnerMetrics);

        case 14:
          testRunnerMetrics.iterationNumber++;
          _context4.next = 4;
          break;

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, _marked4);
} // endregion


// region searchBestErrorBuilder
function searchBestErrorBuilder(_ref4) {
  var onFound = _ref4.onFound,
      consoleOnlyBestErrors = _ref4.consoleOnlyBestErrors;
  return /*#__PURE__*/_regenerator.default.mark(function _searchBestErrorBuilder(_this, _ref5) {
    var customSeed, metricsMin, _stopPredicate, createMetrics, compareMetrics, _func2, interceptConsoleDisabled, interceptConsoleDispose, interceptConsoleDisable, seedMin, errorMin, _reportMin, lastErrorIteration, lastErrorTime, minErrorIteration, minErrorTime, equalErrorIteration, equalErrorTime, _searchBestErrorMetrics;

    return _regenerator.default.wrap(function _searchBestErrorBuilder$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            interceptConsoleDisable = function _interceptConsoleDisa(_func) {
              interceptConsoleDisabled = true;

              try {
                return _func();
              } finally {
                interceptConsoleDisabled = false;
              }
            };

            customSeed = _ref5.customSeed, metricsMin = _ref5.metricsMin, _stopPredicate = _ref5.stopPredicate, createMetrics = _ref5.createMetrics, compareMetrics = _ref5.compareMetrics, _func2 = _ref5.func;
            interceptConsoleDispose = customSeed == null && consoleOnlyBestErrors && (0, _interceptConsole.interceptConsole)(function _consoleHandler() {
              return !interceptConsoleDisabled;
            });
            _context6.prev = 3;
            seedMin = null;
            errorMin = null;
            _reportMin = null;
            _searchBestErrorMetrics = {};
            _context6.next = 10;
            return testRunner(_this, {
              stopPredicate: function stopPredicate(testRunnerMetrics) {
                var now = (0, _now.default)();

                if (lastErrorIteration != null) {
                  testRunnerMetrics.iterationsFromLastError = testRunnerMetrics.iterationNumber - lastErrorIteration;
                }

                if (lastErrorTime != null) {
                  testRunnerMetrics.iterationsFromLastError = now - lastErrorTime;
                }

                if (minErrorIteration != null) {
                  testRunnerMetrics.iterationsFromMinError = testRunnerMetrics.iterationNumber - minErrorIteration;
                }

                if (minErrorTime != null) {
                  testRunnerMetrics.iterationsFromMinError = now - minErrorTime;
                }

                if (equalErrorIteration != null) {
                  testRunnerMetrics.iterationsFromEqualError = testRunnerMetrics.iterationNumber - equalErrorIteration;
                }

                if (equalErrorTime != null) {
                  testRunnerMetrics.iterationsFromEqualError = now - equalErrorTime;
                }

                return customSeed != null && testRunnerMetrics.iterationNumber >= 1 || _stopPredicate(testRunnerMetrics);
              },
              func: /*#__PURE__*/_regenerator.default.mark(function func(testRunnerMetrics) {
                var metrics, seed, compareMetricsResult;
                return _regenerator.default.wrap(function func$(_context5) {
                  while (1) {
                    switch (_context5.prev = _context5.next) {
                      case 0:
                        _context5.next = 2;
                        return createMetrics(testRunnerMetrics);

                      case 2:
                        metrics = _context5.sent;
                        seed = customSeed != null ? customSeed : new _Random.Random().nextInt(2 << 29);
                        _context5.prev = 4;
                        _context5.next = 7;
                        return _func2.call(this, seed, metrics, metricsMin || {});

                      case 7:
                        _context5.next = 31;
                        break;

                      case 9:
                        _context5.prev = 9;
                        _context5.t0 = _context5["catch"](4);
                        lastErrorIteration = testRunnerMetrics.iterationNumber;
                        lastErrorTime = (0, _now.default)();

                        if (!(customSeed != null)) {
                          _context5.next = 18;
                          break;
                        }

                        interceptConsoleDisable(function () {
                          return console.log("customSeed: " + customSeed, metrics);
                        });
                        throw _context5.t0;

                      case 18:
                        compareMetricsResult = errorMin == null ? null : compareMetrics(metrics, metricsMin);

                        if (!(compareMetricsResult == null || compareMetricsResult <= 0)) {
                          _context5.next = 31;
                          break;
                        }

                        equalErrorIteration = testRunnerMetrics.iterationNumber;
                        equalErrorTime = (0, _now.default)();

                        if (compareMetricsResult !== 0) {
                          minErrorIteration = testRunnerMetrics.iterationNumber;
                          minErrorTime = (0, _now.default)();
                        }

                        metricsMin = (0, _extends2.default)({}, metrics);
                        seedMin = seed;
                        errorMin = _context5.t0;
                        _reportMin = "\r\n\r\ncustomSeed: " + seedMin + ",\r\nmetricsMin: " + (0, _stringify.default)(metricsMin) + ",\r\n" + (errorMin.stack || errorMin);
                        interceptConsoleDisable(function () {
                          return console.error(_reportMin);
                        });

                        if (!onFound) {
                          _context5.next = 31;
                          break;
                        }

                        _context5.next = 31;
                        return onFound(_reportMin);

                      case 31:
                      case "end":
                        return _context5.stop();
                    }
                  }
                }, func, this, [[4, 9]]);
              }),
              testRunnerMetrics: _searchBestErrorMetrics
            });

          case 10:
            if (!errorMin) {
              _context6.next = 13;
              break;
            }

            interceptConsoleDisable(function () {
              return console.error(_reportMin);
            });
            throw errorMin;

          case 13:
            _context6.prev = 13;

            if (interceptConsoleDispose) {
              interceptConsoleDispose();
            }

            return _context6.finish(13);

          case 16:
          case "end":
            return _context6.stop();
        }
      }
    }, _searchBestErrorBuilder, null, [[3,, 13, 16]]);
  });
} // endregion


// region randomTestBuilder
function randomTestBuilder(createMetrics, optionsPatternBuilder, optionsGenerator, _ref6) {
  var compareMetrics = _ref6.compareMetrics,
      _searchBestError = _ref6.searchBestError,
      testIterator = _ref6.testIterator;
  return function randomTest(_ref7) {
    var _this2 = this;

    var _marked5 = /*#__PURE__*/_regenerator.default.mark(func);

    var stopPredicate = _ref7.stopPredicate,
        searchBestError = _ref7.searchBestError,
        customSeed = _ref7.customSeed,
        metricsMin = _ref7.metricsMin;

    var _this = this;

    function func(seed, metrics, _metricsMin) {
      var optionsPattern;
      return _regenerator.default.wrap(function func$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return optionsPatternBuilder(metrics, _metricsMin);

            case 2:
              optionsPattern = _context7.sent;
              return _context7.abrupt("return", test(seed, optionsPattern, optionsGenerator, testIterator));

            case 4:
            case "end":
              return _context7.stop();
          }
        }
      }, _marked5);
    }

    return (0, _ThenableSync.resolveAsyncFunc)(function () {
      if (searchBestError) {
        return _searchBestError(_this2, {
          customSeed: customSeed,
          metricsMin: metricsMin,
          stopPredicate: stopPredicate,
          createMetrics: createMetrics,
          compareMetrics: compareMetrics,
          func: func
        });
      }

      return testRunner(_this2, {
        stopPredicate: stopPredicate,
        func: function (_func3) {
          var _marked6 = /*#__PURE__*/_regenerator.default.mark(func);

          function func(_x) {
            var _args8 = arguments;
            return _regenerator.default.wrap(function func$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    return _context8.delegateYield(_func3.apply(this, _args8), "t0", 1);

                  case 1:
                    return _context8.abrupt("return", _context8.t0);

                  case 2:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _marked6, this);
          }

          func.toString = function () {
            return _func3.toString();
          };

          return func;
        }( /*#__PURE__*/_regenerator.default.mark(function _callee(testRunnerMetrics) {
          var metrics;
          return _regenerator.default.wrap(function _callee$(_context9) {
            while (1) {
              switch (_context9.prev = _context9.next) {
                case 0:
                  _context9.next = 2;
                  return createMetrics(testRunnerMetrics);

                case 2:
                  metrics = _context9.sent;
                  return _context9.abrupt("return", func.call(this, customSeed, metrics, metricsMin || {}));

                case 4:
                case "end":
                  return _context9.stop();
              }
            }
          }, _callee, this);
        }))
      });
    });
  };
} // endregion
// // region builder
//
// // type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N
// type If<T, Y, N> = T extends boolean ? (T extends false ? N : Y) : N
// type Not<T> = T extends true ? false : true
// type IfNever<T, Y, N> = [T] extends [never] ? Y : N
// type IsNever<T> = IfNever<T, true, false>
// type NotNever<T> = IfNever<T, false, true>
//
// export type IRandomTestFactory<
// 	TMetrics = never,
// 	TOptionsPattern = never,
// 	TOptions = never,
// 	TState = never,
// 	HasCreateMetrics = false,
// 	HasCompareMetrics = false,
// 	HasOptionsPatternBuilder = false,
// 	HasOptionsGenerator = false,
// 	HasCreateState = false,
// 	HasAction = false,
// > = {}
// & If<HasCreateMetrics, {}, {
// 	createMetrics<_TMetrics>(value: TCreateMetrics<_TMetrics>): IRandomTestFactory<
// 		_TMetrics, TOptionsPattern, TOptions, TState,
// 		true, HasCompareMetrics, HasOptionsPatternBuilder, HasOptionsGenerator, HasCreateState, HasAction
// 	>,
// }>
// & If<HasCompareMetrics | IsNever<TMetrics>, {}, {
// 	compareMetrics(value: TCompareMetrics<TMetrics>): IRandomTestFactory<
// 		TMetrics, TOptionsPattern, TOptions, TState,
// 		HasCreateMetrics, true, HasOptionsPatternBuilder, HasOptionsGenerator, HasCreateState, HasAction
// 	>,
// }>
// & If<HasOptionsPatternBuilder | IsNever<TMetrics>, {}, {
// 	optionsPatternBuilder<_TOptionsPattern>(
// 		value: TTestOptionsPatternBuilder<TMetrics, _TOptionsPattern>,
// 	): IRandomTestFactory<
// 		TMetrics, _TOptionsPattern, TOptions, TState,
// 		HasCreateMetrics, HasCompareMetrics, true, HasOptionsGenerator, HasCreateState, HasAction
// 	>,
// }>
// & If<HasOptionsGenerator | IsNever<TOptionsPattern>, {}, {
// 	optionsGenerator<_TOptions>(value: TTestOptionsGenerator<TOptionsPattern, _TOptions>): IRandomTestFactory<
// 		TMetrics, TOptionsPattern, _TOptions, TState,
// 		HasCreateMetrics, HasCompareMetrics, HasOptionsPatternBuilder, true, HasCreateState, HasAction
// 	>,
// }>
// & If<HasCreateState | IsNever<TOptions>, {}, {
// 	createState<_TState>(value: TCreateState<TOptions, _TState>): IRandomTestFactory<
// 		TMetrics, TOptionsPattern, TOptions, _TState,
// 		HasCreateMetrics, HasCompareMetrics, HasOptionsPatternBuilder, HasOptionsGenerator, true, HasAction
// 	>,
// }>
// & If<HasAction | IsNever<TState>, {}, {
// 	action(value: TTestAction<TState>): IRandomTestFactory<
// 		TMetrics, TOptionsPattern, TOptions, TState,
// 		HasCreateMetrics, HasCompareMetrics, HasOptionsPatternBuilder, HasOptionsGenerator, HasCreateState, true
// 	>,
// }>
//
// class RandomTestFactory<
// 	TMetrics = any,
// 	TOptionsPattern = any,
// 	TOptions = any,
// 	TState = any,
// > {
// 	private _createMetrics: TCreateMetrics<any>
// 	private _compareMetrics: TCompareMetrics<any>
// 	private _optionsPatternBuilder: TTestOptionsPatternBuilder<TMetrics, TOptionsPattern>
// 	private _optionsGenerator: TTestOptionsGenerator<TOptionsPattern, TOptions>
// 	private _createState: TCreateState<TOptions, TState>
// 	private _action: TTestAction<TState>
//
// 	public createMetrics<_TMetrics>(value: TCreateMetrics<_TMetrics>) {
// 		this._createMetrics = value
// 		return this
// 	}
//
// 	public compareMetrics(value: TCompareMetrics<TMetrics>) {
// 		this._compareMetrics = value
// 		return this
// 	}
//
// 	public optionsPatternBuilder(value: TTestOptionsPatternBuilder<TMetrics, TOptionsPattern>) {
// 		this._optionsPatternBuilder = value
// 		return this
// 	}
//
// 	public optionsGenerator(value: TTestOptionsGenerator<TOptionsPattern, TOptions>) {
// 		this._optionsGenerator = value
// 		return this
// 	}
//
// 	public createState(value: TCreateState<TOptions, TState>) {
// 		this._createState = value
// 		return this
// 	}
//
// 	public action(value: TTestAction<TState>) {
// 		this._action = value
// 		return this
// 	}
//
// 	public testIterationBuilder
// }
//
// export function randomTestFactory(): IRandomTestFactory {
// 	return new RandomTestFactory() as any
// }
//
// // endregion