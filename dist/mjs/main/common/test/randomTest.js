import { resolveAsyncAll, resolveAsyncFunc } from '../async/ThenableSync';
import { Random } from '../random/Random';
import { interceptConsole, throwOnConsoleError } from './interceptConsole';
export function testIterationBuilder({
  before,
  action,
  waitAsyncRandom,
  waitAsyncAll,
  after
}) {
  const sumWeights = action.weight + (waitAsyncAll != null ? waitAsyncAll.weight : 0) + (waitAsyncRandom != null ? waitAsyncRandom.weight : 0);
  const waitAsyncRandomWeight = waitAsyncRandom != null ? waitAsyncRandom.weight / sumWeights : 0;
  const waitAsyncAllWeight = waitAsyncAll != null ? waitAsyncAll.weight / sumWeights : 0;
  const asyncs = [];

  function* testIteration(rnd, state) {
    if (before != null) {
      yield before(rnd, state);
    }

    const step = rnd.next();

    if (step < asyncs.length * waitAsyncAllWeight) {
      // wait all
      if (waitAsyncAll.before != null) {
        yield waitAsyncAll.before(rnd, state);
      }

      yield resolveAsyncAll(asyncs);
      asyncs.length = 0;

      if (waitAsyncAll.after != null) {
        yield waitAsyncAll.after(rnd, state);
      }
    } else if (step < asyncs.length * waitAsyncRandomWeight) {
      // wait random
      if (waitAsyncRandom.before != null) {
        yield waitAsyncRandom.before(rnd, state);
      }

      const index = rnd.nextInt(asyncs.length);
      const async = asyncs[index];
      asyncs[index] = asyncs[asyncs.length - 1];
      asyncs.length--;
      yield async;

      if (waitAsyncRandom.after != null) {
        yield waitAsyncRandom.after(rnd, state);
      }
    } else {
      // action
      if (action.before != null) {
        yield action.before(rnd, state);
      }

      const async = action.func(rnd.nextRandom(), state);

      if (waitAsyncRandomWeight === 0 && waitAsyncAllWeight === 0) {
        yield async;
      } else {
        // if (isAsync(async)) {
        asyncs.push(async);
      }

      if (action.after != null) {
        yield action.after(rnd, state);
      }
    }

    if (after != null) {
      yield after(rnd, state);
    }
  }

  return testIteration;
} // endregion

// region testIteratorBuilder
export function testIteratorBuilder(createState, {
  before,
  stopPredicate,
  testIteration,
  after,
  consoleThrowPredicate
}) {
  function* _iterator(rnd, options) {
    const state = yield createState(rnd, options);

    if (before != null) {
      yield before(rnd, state);
    }

    const timeStart = Date.now();
    let iterationNumber = 0;

    while (true) {
      const doStop = yield stopPredicate(iterationNumber, timeStart, state);

      if (doStop) {
        break;
      }

      yield testIteration(rnd, state);
      iterationNumber++;
    }

    if (after != null) {
      yield after(rnd, state);
    }
  }

  function iterator(rnd, options) {
    return throwOnConsoleError(this, consoleThrowPredicate, () => {
      return _iterator(rnd, options);
    });
  }

  return iterator;
} // endregion

// region test
export function* test(seed, optionsPattern, optionsGenerator, testIterator) {
  if (seed == null) {
    seed = new Random().nextSeed();
  }

  console.log(`\r\nseed = ${seed}`);
  const rnd = new Random(seed);
  const options = yield optionsGenerator(rnd, optionsPattern);
  yield testIterator(rnd, options);
} // endregion

// region testRunner
function* testRunner(_this, {
  stopPredicate,
  func,
  testRunnerMetrics
}) {
  const timeStart = Date.now();

  if (testRunnerMetrics == null) {
    testRunnerMetrics = {};
  }

  testRunnerMetrics.iterationNumber = 0;

  while (true) {
    const now = Date.now();
    testRunnerMetrics.timeFromStart = now - timeStart;
    const doStop = yield stopPredicate(testRunnerMetrics);

    if (doStop) {
      break;
    }

    yield func.call(_this, testRunnerMetrics);
    testRunnerMetrics.iterationNumber++;
  }
} // endregion


// region searchBestErrorBuilder
export function searchBestErrorBuilder({
  onFound,
  consoleOnlyBestErrors
}) {
  return function* (_this, {
    customSeed,
    metricsMin,
    stopPredicate,
    createMetrics,
    compareMetrics,
    func
  }) {
    let interceptConsoleDisabled;
    const interceptConsoleDispose = customSeed == null && consoleOnlyBestErrors && interceptConsole(function () {
      return !interceptConsoleDisabled;
    });

    function interceptConsoleDisable(_func) {
      interceptConsoleDisabled = true;

      try {
        return _func();
      } finally {
        interceptConsoleDisabled = false;
      }
    }

    try {
      let seedMin = null;
      let errorMin = null;
      let reportMin = null;
      let lastErrorIteration;
      let lastErrorTime;
      let minErrorIteration;
      let minErrorTime;
      let equalErrorIteration;
      let equalErrorTime;
      const searchBestErrorMetrics = {};
      yield testRunner(_this, {
        stopPredicate: testRunnerMetrics => {
          const now = Date.now();

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

          return customSeed != null && testRunnerMetrics.iterationNumber >= 1 || stopPredicate(testRunnerMetrics);
        },

        *func(testRunnerMetrics) {
          const metrics = yield createMetrics(testRunnerMetrics);
          const seed = customSeed != null ? customSeed : new Random().nextInt(2 << 29);

          try {
            yield func.call(this, seed, metrics, metricsMin || {});
          } catch (error) {
            lastErrorIteration = testRunnerMetrics.iterationNumber;
            lastErrorTime = Date.now();

            if (customSeed != null) {
              interceptConsoleDisable(() => console.log(`customSeed: ${customSeed}`, metrics));
              throw error;
            } else {
              const compareMetricsResult = errorMin == null ? null : compareMetrics(metrics, metricsMin);

              if (compareMetricsResult == null || compareMetricsResult <= 0) {
                equalErrorIteration = testRunnerMetrics.iterationNumber;
                equalErrorTime = Date.now();

                if (compareMetricsResult !== 0) {
                  minErrorIteration = testRunnerMetrics.iterationNumber;
                  minErrorTime = Date.now();
                }

                metricsMin = { ...metrics
                };
                seedMin = seed;
                errorMin = error;
                reportMin = `\r\n\r\ncustomSeed: ${seedMin},\r\nmetricsMin: ${JSON.stringify(metricsMin)},\r\n${errorMin.stack || errorMin}`;
                interceptConsoleDisable(() => console.error(reportMin));

                if (onFound) {
                  yield onFound(reportMin);
                }
              }
            }
          }
        },

        testRunnerMetrics: searchBestErrorMetrics
      });

      if (errorMin) {
        interceptConsoleDisable(() => console.error(reportMin));
        throw errorMin;
      }
    } finally {
      if (interceptConsoleDispose) {
        interceptConsoleDispose();
      }
    }
  };
} // endregion

// region randomTestBuilder
export function randomTestBuilder(createMetrics, optionsPatternBuilder, optionsGenerator, {
  compareMetrics,
  searchBestError: _searchBestError,
  testIterator
}) {
  return function randomTest({
    stopPredicate,
    searchBestError,
    customSeed,
    metricsMin
  }) {
    const _this = this;

    function* func(seed, metrics, _metricsMin) {
      const optionsPattern = yield optionsPatternBuilder(metrics, _metricsMin);
      return test(seed, optionsPattern, optionsGenerator, testIterator);
    }

    return resolveAsyncFunc(() => {
      if (searchBestError) {
        return _searchBestError(this, {
          customSeed,
          metricsMin,
          stopPredicate,
          createMetrics,
          compareMetrics,
          func
        });
      } else {
        return testRunner(this, {
          stopPredicate,

          *func(testRunnerMetrics) {
            const metrics = yield createMetrics(testRunnerMetrics);
            return func.call(this, customSeed, metrics, metricsMin || {});
          }

        });
      }
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