"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _Assert = require("../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../main/common/test/Mocha");

var _randomTest = require("../../../../../main/common/test/randomTest");

/* tslint:disable:no-identical-functions no-shadowed-variable */
(0, _Mocha.describe)('common > main > test > randomTest', function () {
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
      metrics: metrics,
      metricsMin: metricsMin
    };
  }

  function optionsGenerator(rnd, _ref) {
    var option = _ref.option,
        metrics = _ref.metrics,
        metricsMin = _ref.metricsMin;
    return {
      option: rnd.nextArrayItem(option),
      metrics: metrics,
      metricsMin: metricsMin
    };
  }

  // endregion
  // region state
  function createState(rnd, options) {
    return {
      value: 'state_' + options.option,
      options: options
    };
  }

  // endregion
  // region action
  function action(rnd, state) {
    var _context, _context2;

    _Assert.assert.ok((0, _indexOf.default)(_context = ['state_value1', 'state_value2']).call(_context, state.value) >= 0);

    _Assert.assert.ok((0, _indexOf.default)(_context2 = ['value1', 'value2']).call(_context2, state.options.option) >= 0);

    _Assert.assert.ok(typeof state.options.metrics.metric === 'number');
  } // endregion
  // region testIteration


  var testIteration = (0, _randomTest.testIterationBuilder)({
    action: {
      weight: 1,
      func: action
    }
  }); // endregion
  // region testIterator

  var testIterator = (0, _randomTest.testIteratorBuilder)(createState, {
    stopPredicate: function stopPredicate(iterationNumber, timeStart, state) {
      return iterationNumber >= 100;
    },
    testIteration: testIteration
  }); // endregion
  // region randomTest

  var randomTest = (0, _randomTest.randomTestBuilder)(createMetrics, optionsPatternBuilder, optionsGenerator, {
    compareMetrics: compareMetrics,
    consoleThrowPredicate: function consoleThrowPredicate() {
      return this === 'error' || this === 'warn';
    },
    // searchBestError: searchBestErrorBuilderNode({
    // 	reportFilePath: './tmp/test-cases/depend/bindings/base.txt',
    // 	consoleOnlyBestErrors: true,
    // }),
    searchBestError: (0, _randomTest.searchBestErrorBuilder)({
      consoleOnlyBestErrors: true
    }),
    testIterator: testIterator
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

  (0, _Mocha.it)('base', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    return _regenerator.default.wrap(function _callee$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return randomTest({
              stopPredicate: function stopPredicate(testRunnerMetrics) {
                return testRunnerMetrics.iterationNumber >= 50;
              },
              customSeed: null,
              metricsMin: null,
              searchBestError: true
            });

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee);
  })));
});