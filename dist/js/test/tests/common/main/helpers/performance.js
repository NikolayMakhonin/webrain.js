"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _performance = require("../../../../../main/common/helpers/performance");

var _Assert = require("../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../main/common/test/Mocha");

var _helpers = require("../../../../../main/common/time/helpers");

/* eslint-disable class-methods-use-this */
(0, _Mocha.describe)('common > helpers > performance', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
  return _regenerator.default.wrap(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          (0, _Mocha.it)('now', /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
            var interval, start;
            return _regenerator.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    interval = 200;
                    _context.next = 3;
                    return (0, _helpers.delay)(interval);

                  case 3:
                    start = (0, _performance.now)();
                    _context.next = 6;
                    return (0, _helpers.delay)(interval);

                  case 6:
                    _Assert.assert.equal(Math.round(((0, _performance.now)() - start) / interval), 1);

                    _context.next = 9;
                    return (0, _helpers.delay)(interval);

                  case 9:
                    _Assert.assert.equal(Math.round(((0, _performance.now)() - start) / interval), 2);

                    _context.next = 12;
                    return (0, _helpers.delay)(interval);

                  case 12:
                    _Assert.assert.equal(Math.round(((0, _performance.now)() - start) / interval), 3);

                  case 13:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          })));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  }, _callee2);
})));