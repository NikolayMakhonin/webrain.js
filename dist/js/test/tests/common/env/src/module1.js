"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = exports.var1 = exports.func1 = void 0;

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

/* eslint-disable quote-props,func-style,no-var,prefer-rest-params */
var func1 = function func1(p1) {
  var _context, _context2, _context3;

  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  return (0, _concat.default)(_context = (0, _concat.default)(_context2 = (0, _concat.default)(_context3 = "".concat(p1, " ")).call(_context3, p1 === null || p1 === void 0 ? void 0 : p1.length, " ")).call(_context2, params.length, " ")).call(_context, (0, _from.default)(arguments).length);
};

exports.func1 = func1;
var var1 = 'var1';
exports.var1 = var1;
var _default = {
  func1: func1,
  'var_1_1': var1,
  var_1_2: var1
};
exports.default = _default;