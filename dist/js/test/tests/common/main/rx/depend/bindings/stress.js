"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _webrainOptions = require("../../../../../../../main/common/helpers/webrainOptions");

var _Mocha = require("../../../../../../../main/common/test/Mocha");

var _randomTest = require("../../../../../../../main/common/test/randomTest");

/* tslint:disable:no-identical-functions no-shadowed-variable */
(0, _Mocha.describe)('common > main > rx > depend > bindings > stress', function () {
  this.timeout(24 * 60 * 60 * 1000);
  beforeEach(function () {
    _webrainOptions.webrainOptions.callState.garbageCollect.disabled = false;
    _webrainOptions.webrainOptions.callState.garbageCollect.bulkSize = 100;
    _webrainOptions.webrainOptions.callState.garbageCollect.interval = 1000;
    _webrainOptions.webrainOptions.callState.garbageCollect.minLifeTime = 500;
  });

  function createMetrics(testRunnerMetrics) {
    return {
      count: 0
    };
  }

  function optionsPatternBuilder(metrics, metricsMin) {
    return {
      metrics: metrics,
      metricsMin: metricsMin
    };
  }

  function optionsGenerator(rnd, _ref) {
    var metrics = _ref.metrics,
        metricsMin = _ref.metricsMin;
    return {
      metrics: metrics,
      metricsMin: metricsMin
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
      options: options,
      x: 'qwe'
    };
  }

  function action(rnd, state) {} // TODO
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
    testIterator: (0, _randomTest.testIteratorBuilder)(createState, {
      stopPredicate: function stopPredicate(iterationNumber, timeStart, state) {
        return iterationNumber >= 100;
      },
      iteration: (0, _randomTest.testIterationBuilder)({
        action: {
          weight: 1,
          func: action
        }
      })
    })
  }); // endregion

  (0, _Mocha.it)('base', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
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
            return _context.stop();
        }
      }
    }, _callee);
  })));
});