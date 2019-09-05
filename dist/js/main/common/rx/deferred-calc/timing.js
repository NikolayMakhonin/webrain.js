"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.timingDefault = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var timingDefault = {
  now: _now.default,
  setTimeout: typeof window === 'undefined' ? _setTimeout2.default : (0, _bind.default)(_setTimeout2.default).call(_setTimeout2.default, window),
  clearTimeout: typeof window === 'undefined' ? clearTimeout : (0, _bind.default)(clearTimeout).call(clearTimeout, window)
};
exports.timingDefault = timingDefault;