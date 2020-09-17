import { isAsync } from '../async/async';
import { resolveAsync, resolveAsyncAll } from '../async/ThenableSync';
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

  function* iteration(rnd, state) {
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
      } else if (isAsync(async)) {
        async.push(async);
      }

      if (action.after != null) {
        yield action.after(rnd, state);
      }
    }

    if (after != null) {
      yield after(rnd, state);
    }
  }

  return iteration;
} // endregion

// region testIteratorBuilder
export function testIteratorBuilder(createState, {
  before,
  stopPredicate,
  iteration,
  after
}) {
  function* iterator(rnd, options) {
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

      yield iteration(rnd, state);
      iterationNumber++;
    }

    if (after != null) {
      yield after(rnd, state);
    }
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
      return interceptConsoleDisabled;
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

          return customSeed != null || stopPredicate(testRunnerMetrics);
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
  consoleThrowPredicate,
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

    return resolveAsync(throwOnConsoleError(_this, consoleThrowPredicate, function () {
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
            return func.call(this, customSeed, metrics, metricsMin);
          }

        });
      }
    }));
  };
} // endregion