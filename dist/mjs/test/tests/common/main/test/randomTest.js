/* tslint:disable:no-identical-functions no-shadowed-variable */
import { assert } from '../../../../../main/common/test/Assert';
import { describe, it } from '../../../../../main/common/test/Mocha';
import { randomTestBuilder, searchBestErrorBuilder, testIterationBuilder, testIteratorBuilder } from '../../../../../main/common/test/randomTest';
describe('common > main > test > randomTest', function () {
  this.timeout(24 * 60 * 60 * 1000); // region metrics

  function createMetrics(testRunnerMetrics) {
    return {
      metric: 0
    };
  }

  function compareMetrics(metrics, metricsMin) {
    if (metrics.metric !== metricsMin.metric) {
      return metrics.metric < metricsMin.metric ? -1 : 0;
    }

    return 0;
  } // endregion
  // region options


  function optionsPatternBuilder(metrics, metricsMin) {
    return {
      option: ['value1', 'value2'],
      metrics,
      metricsMin
    };
  }

  function optionsGenerator(rnd, {
    option,
    metrics,
    metricsMin
  }) {
    return {
      option: rnd.nextArrayItem(option),
      metrics,
      metricsMin
    };
  }

  // endregion
  // region state
  function createState(rnd, options) {
    return {
      value: 'state_' + options.option,
      options
    };
  }

  // endregion
  // region action
  function action(rnd, state) {
    assert.ok(['state_value1', 'state_value2'].indexOf(state.value) >= 0);
    assert.ok(['value1', 'value2'].indexOf(state.options.option) >= 0);
    assert.ok(typeof state.options.metrics.metric === 'number');
  } // endregion
  // region testIteration


  const testIteration = testIterationBuilder({
    action: {
      weight: 1,
      func: action
    }
  }); // endregion
  // region testIterator

  const testIterator = testIteratorBuilder(createState, {
    stopPredicate(iterationNumber, timeStart, state) {
      return iterationNumber >= 100;
    },

    testIteration
  }); // endregion
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
    testIterator
  }); // endregion
  // it('factory', async function() {
  // 	const result = randomTestFactory()
  // 		.createMetrics(() => {
  // 			return {
  // 				count: 123,
  // 			}
  // 		})
  // 		// .compareMetrics((metrics, metricsMin): number => {
  // 		// 	if (metrics.count !== metricsMin.count) {
  // 		// 		return metrics.count < metricsMin.count ? -1 : 0
  // 		// 	}
  // 		// 	return 0
  // 		// })
  // 		.optionsPatternBuilder((metrics, metricsMin) => {
  // 			return {
  // 				metrics,
  // 				metricsMin,
  // 			}
  // 		})
  // 		.optionsGenerator((rnd: Random, {
  // 			metrics,
  // 			metricsMin,
  // 		}) => {
  // 			return {
  // 				metrics,
  // 				metricsMin,
  // 			}
  // 		})
  // 		.createState((rnd, options) => {
  // 			return {
  // 				options,
  // 				x: 'qwe',
  // 			}
  // 		})
  // 		.action((rnd, state) => {
  // 			// TODO
  // 		})
  // })

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