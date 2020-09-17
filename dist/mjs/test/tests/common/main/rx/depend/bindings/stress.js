/* tslint:disable:no-identical-functions no-shadowed-variable */
import { webrainOptions } from '../../../../../../../main/common/helpers/webrainOptions';
import { describe, it } from '../../../../../../../main/common/test/Mocha';
import { randomTestBuilder, searchBestErrorBuilder, testIterationBuilder, testIteratorBuilder } from '../../../../../../../main/common/test/randomTest';
describe('common > main > rx > depend > bindings > stress', function () {
  this.timeout(24 * 60 * 60 * 1000);
  beforeEach(function () {
    webrainOptions.callState.garbageCollect.disabled = false;
    webrainOptions.callState.garbageCollect.bulkSize = 100;
    webrainOptions.callState.garbageCollect.interval = 1000;
    webrainOptions.callState.garbageCollect.minLifeTime = 500;
  });

  function createMetrics(testRunnerMetrics) {
    return {
      count: 0
    };
  }

  function optionsPatternBuilder(metrics, metricsMin) {
    return {
      metrics,
      metricsMin
    };
  }

  function optionsGenerator(rnd, {
    metrics,
    metricsMin
  }) {
    return {
      metrics,
      metricsMin
    };
  }

  function compareMetrics(metrics, metricsMin) {
    if (metrics.count !== metricsMin.count) {
      return metrics.count < metricsMin.count;
    }

    return true;
  }

  function createState(rnd, options) {
    return {
      options,
      x: 'qwe'
    };
  }

  function action(rnd, state) {} // TODO
  // region randomTest


  const randomTest = randomTestBuilder(createMetrics, optionsPatternBuilder, optionsGenerator, {
    compareMetrics,

    consoleThrowPredicate() {
      return this === 'error' || this === 'warn';
    },

    // searchBestError: searchBestErrorBuilderNode({
    // 	reportFilePath: './tmp/test-cases/depend/bindings/base.txt',
    // 	consoleOnlyBestErrors: true,
    // }),
    searchBestError: searchBestErrorBuilder({
      consoleOnlyBestErrors: true
    }),
    testIterator: testIteratorBuilder(createState, {
      stopPredicate(iterationNumber, timeStart, state) {
        return iterationNumber >= 100;
      },

      iteration: testIterationBuilder({
        action: {
          weight: 1,
          func: action
        }
      })
    })
  }); // endregion

  it('base', async function () {
    await randomTest({
      stopPredicate: testRunnerMetrics => {
        return testRunnerMetrics.iterationNumber >= 50;
      },
      customSeed: null,
      metricsMin: null,
      searchBestError: true
    });
  });
});