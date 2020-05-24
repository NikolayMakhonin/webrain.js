"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _webrainOptions = require("../../../../../../../main/common/helpers/webrainOptions");

var _Mocha = require("../../../../../../../main/common/test/Mocha");

var _stressTest = require("../src/stress-test");

/* tslint:disable:no-identical-functions no-shadowed-variable */
(0, _Mocha.describe)('common > main > rx > depend > stress', function () {
  this.timeout(60 * 60 * 1000);
  beforeEach(function () {
    _webrainOptions.webrainOptions.callState.garbageCollect.disabled = false;
    _webrainOptions.webrainOptions.callState.garbageCollect.bulkSize = 100;
    _webrainOptions.webrainOptions.callState.garbageCollect.interval = 1000;
    _webrainOptions.webrainOptions.callState.garbageCollect.minLifeTime = 500;
  });
  (0, _Mocha.it)('all', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _stressTest.stressTest)({
              // seed: 649781656,
              testsCount: 10,
              iterationsPerCall: 500,
              maxLevelsCount: [1, 10],
              maxFuncsCount: [1, 10],
              maxCallsCount: [1, 100],
              countRootCalls: [1, 5],
              disableAsync: null,
              disableDeferred: null,
              disableLazy: null
            });

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  (0, _Mocha.xit)('async + deferred + sync + lazy', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _stressTest.stressTest)({
              // seed: 1,
              testsCount: 1000,
              iterationsPerCall: 2000,
              maxLevelsCount: [1, 10],
              maxFuncsCount: [1, 10],
              maxCallsCount: [1, 100],
              countRootCalls: [1, 5],
              disableAsync: false,
              disableDeferred: false,
              disableLazy: false
            });

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  (0, _Mocha.xit)('async + deferred + sync', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return (0, _stressTest.stressTest)({
              // seed: 1,
              testsCount: 100,
              iterationsPerTest: 200000,
              maxLevelsCount: 10,
              maxFuncsCount: 10,
              maxCallsCount: 100,
              countRootCalls: 5,
              disableAsync: false,
              disableDeferred: false,
              disableLazy: true
            });

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  (0, _Mocha.xit)('deferred + sync', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return (0, _stressTest.stressTest)({
              // seed: 843622927,
              testsCount: 100,
              iterationsPerTest: 200000,
              maxLevelsCount: 10,
              maxFuncsCount: 10,
              maxCallsCount: 100,
              countRootCalls: 5,
              disableAsync: true,
              disableDeferred: false,
              disableLazy: true
            });

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
  (0, _Mocha.xit)('async + sync + lazy', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return (0, _stressTest.stressTest)({
              // seed: 593595214,
              testsCount: 100,
              iterationsPerTest: 200000,
              maxLevelsCount: 10,
              maxFuncsCount: 10,
              maxCallsCount: 100,
              countRootCalls: 5,
              disableAsync: false,
              disableDeferred: true,
              disableLazy: false
            });

          case 2:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  })));
  (0, _Mocha.xit)('async + sync', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6() {
    return _regenerator.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return (0, _stressTest.stressTest)({
              // seed: 788871949,
              testsCount: 100,
              iterationsPerTest: 200000,
              maxLevelsCount: 10,
              maxFuncsCount: 10,
              maxCallsCount: 100,
              countRootCalls: 5,
              disableAsync: false,
              disableDeferred: true,
              disableLazy: true
            });

          case 2:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  })));
  (0, _Mocha.xit)('sync + lazy', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7() {
    return _regenerator.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return (0, _stressTest.stressTest)({
              // seed: 92684389,
              testsCount: 100,
              iterationsPerTest: 200000,
              maxLevelsCount: 10,
              maxFuncsCount: 10,
              maxCallsCount: 100,
              countRootCalls: 5,
              disableAsync: true,
              disableDeferred: true,
              disableLazy: false
            });

          case 2:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  })));
  (0, _Mocha.xit)('sync', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee8() {
    return _regenerator.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return (0, _stressTest.stressTest)({
              // seed: 1,
              testsCount: 100,
              iterationsPerTest: 200000,
              maxLevelsCount: 10,
              maxFuncsCount: 10,
              maxCallsCount: 100,
              countRootCalls: 5,
              disableAsync: true,
              disableDeferred: true,
              disableLazy: true
            });

          case 2:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  })));
});