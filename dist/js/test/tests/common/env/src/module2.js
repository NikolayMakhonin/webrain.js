"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.default = exports.var2 = void 0;

var _module = require("./module1");

/* eslint-disable no-var,quote-props */
var var2 = _module.var1;
exports.var2 = var2;
var _default = {
  func1: _module.func1,
  'var_2_1': var2,
  var_2_2: var2
};
exports.default = _default;