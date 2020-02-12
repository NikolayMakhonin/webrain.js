"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _Mocha = require("../../../../../../main/common/test/Mocha");

var _helpers = require("./src/helpers");

/* tslint:disable:no-identical-functions no-shadowed-variable */
(0, _Mocha.describe)('common > main > rx > depend > dependent-func', function () {
  (0, _Mocha.it)('base',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _helpers.baseTest)();

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  (0, _Mocha.it)('perceptron', function () {
    this.timeout(20000);

    var _createPerceptron = (0, _helpers.createPerceptron)(50, 50),
        countFuncs = _createPerceptron.countFuncs,
        input = _createPerceptron.input,
        inputState = _createPerceptron.inputState,
        output = _createPerceptron.output;
  });
});