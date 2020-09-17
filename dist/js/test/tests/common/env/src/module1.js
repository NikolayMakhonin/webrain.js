"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.var1 = exports.func1 = void 0;

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

/* eslint-disable quote-props,func-style,no-var,prefer-rest-params */
var func1 = function func1(p1) {
  for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  return p1 + " " + (p1 === null || p1 === void 0 ? void 0 : p1.length) + " " + params.length + " " + (0, _from.default)(arguments).length;
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