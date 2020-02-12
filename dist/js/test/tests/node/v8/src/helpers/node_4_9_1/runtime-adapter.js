"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _contracts = require("../contracts");

var v8 = _interopRequireWildcard(require("./runtime"));

var _OptimizationStatus;

(function (_OptimizationStatus) {
  _OptimizationStatus[_OptimizationStatus["Optimized"] = 1] = "Optimized";
  _OptimizationStatus[_OptimizationStatus["NotOptimized"] = 2] = "NotOptimized";
  _OptimizationStatus[_OptimizationStatus["AlwaysOptimized"] = 3] = "AlwaysOptimized";
  _OptimizationStatus[_OptimizationStatus["NeverOptimized"] = 4] = "NeverOptimized";
  _OptimizationStatus[_OptimizationStatus["MaybeDeoptimized"] = 6] = "MaybeDeoptimized";
  _OptimizationStatus[_OptimizationStatus["TurboFanned"] = 7] = "TurboFanned";
})(_OptimizationStatus || (_OptimizationStatus = {}));

function convertOptimizationStatus(status) {
  switch (status) {
    case _OptimizationStatus.NotOptimized:
      return _contracts.OptimizationStatus.IsFunction | _contracts.OptimizationStatus.Interpreted;

    case _OptimizationStatus.Optimized:
      return _contracts.OptimizationStatus.IsFunction | _contracts.OptimizationStatus.Optimized;

    case _OptimizationStatus.AlwaysOptimized:
      return _contracts.OptimizationStatus.IsFunction | _contracts.OptimizationStatus.AlwaysOptimize;

    case _OptimizationStatus.NeverOptimized:
      return _contracts.OptimizationStatus.IsFunction | _contracts.OptimizationStatus.NeverOptimize;

    case _OptimizationStatus.MaybeDeoptimized:
      return _contracts.OptimizationStatus.IsFunction | _contracts.OptimizationStatus.MaybeDeopted;

    case _OptimizationStatus.TurboFanned:
      return _contracts.OptimizationStatus.IsFunction | _contracts.OptimizationStatus.Optimized | _contracts.OptimizationStatus.TurboFanned;

    default:
      throw new Error('Unknown _OptimizationStatus: ' + status);
  }
}

function GetOptimizationStatus(fn) {
  return convertOptimizationStatus(v8.GetOptimizationStatus(fn));
}

var _default = (0, _extends2.default)({}, v8, {
  GetOptimizationStatus: GetOptimizationStatus
});

exports.default = _default;