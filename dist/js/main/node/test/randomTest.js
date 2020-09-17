"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.searchBestErrorBuilderNode = searchBestErrorBuilderNode;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _path = _interopRequireDefault(require("path"));

var _randomTest = require("../../common/test/randomTest");

// tslint:disable-next-line:no-var-requires
var fse = require('fs-extra'); // region searchBestErrorBuilder


function searchBestErrorBuilderNode(_ref) {
  var reportFilePath = _ref.reportFilePath,
      _onFound = _ref.onFound,
      consoleOnlyBestErrors = _ref.consoleOnlyBestErrors;

  var testCasesFile = _path.default.resolve(reportFilePath);

  var testCasesDir = _path.default.dirname(testCasesFile);

  var searchBestError = (0, _randomTest.searchBestErrorBuilder)({
    consoleOnlyBestErrors: consoleOnlyBestErrors,
    onFound: /*#__PURE__*/_regenerator.default.mark(function onFound(reportMin) {
      return _regenerator.default.wrap(function onFound$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fse.appendFile(testCasesFile, reportMin);

            case 2:
              if (_onFound) {
                _onFound(reportMin);
              }

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, onFound);
    })
  });
  return /*#__PURE__*/_regenerator.default.mark(function _callee(_this, _ref2) {
    var customSeed, metricsMin, stopPredicate, createMetrics, compareMetrics, func;
    return _regenerator.default.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            customSeed = _ref2.customSeed, metricsMin = _ref2.metricsMin, stopPredicate = _ref2.stopPredicate, createMetrics = _ref2.createMetrics, compareMetrics = _ref2.compareMetrics, func = _ref2.func;
            _context2.next = 3;
            return fse.pathExists(testCasesDir);

          case 3:
            if (_context2.sent) {
              _context2.next = 6;
              break;
            }

            _context2.next = 6;
            return fse.mkdirp(testCasesDir);

          case 6:
            _context2.next = 8;
            return fse.writeFile(testCasesFile, '');

          case 8:
            _context2.next = 10;
            return searchBestError(_this, {
              customSeed: customSeed,
              metricsMin: metricsMin,
              stopPredicate: stopPredicate,
              createMetrics: createMetrics,
              compareMetrics: compareMetrics,
              func: func
            });

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee);
  });
} // endregion