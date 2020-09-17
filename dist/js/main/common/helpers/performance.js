"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.now = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

/* tslint:disable:no-shadowed-variable */
var now;
exports.now = now;

if (typeof performance !== 'undefined' && performance.now) {
  var _context;

  exports.now = now = (0, _bind.default)(_context = performance.now).call(_context, performance);
} else {
  var start = process.hrtime();

  exports.now = now = function now() {
    var end = process.hrtime(start);
    return end[0] * 1000 + end[1] / 1000000;
  };
}