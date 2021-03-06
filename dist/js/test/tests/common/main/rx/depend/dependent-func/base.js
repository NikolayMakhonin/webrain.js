"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _webrainOptions = require("../../../../../../../main/common/helpers/webrainOptions");

var _Mocha = require("../../../../../../../main/common/test/Mocha");

var _baseTests = require("../src/base-tests");

var _helpers = require("../src/helpers");

var _perceptron = require("../src/perceptron");

/* tslint:disable:no-identical-functions no-shadowed-variable */
(0, _Mocha.describe)('common > main > rx > depend > base', function () {
  beforeEach(function () {
    _webrainOptions.webrainOptions.callState.garbageCollect.disabled = true;
  });
  (0, _Mocha.it)('base', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            this.timeout(20000);
            _context.next = 3;
            return (0, _baseTests.baseTest)();

          case 3:
            (0, _helpers.clearCallStates)();

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
  (0, _Mocha.it)('lazy', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            this.timeout(20000);
            _context2.next = 3;
            return (0, _baseTests.lazyTest)();

          case 3:
            (0, _helpers.clearCallStates)();

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));
  (0, _Mocha.it)('perceptron', function () {
    this.timeout(20000);

    var _createPerceptron = (0, _perceptron.createPerceptron)(50, 50),
        countFuncs = _createPerceptron.countFuncs,
        input = _createPerceptron.input,
        inputState = _createPerceptron.inputState,
        output = _createPerceptron.output;

    (0, _helpers.clearCallStates)();
  });
});