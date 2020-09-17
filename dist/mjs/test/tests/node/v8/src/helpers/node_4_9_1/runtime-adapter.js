import { OptimizationStatus } from '../contracts';
import * as v8 from './runtime';

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
      return OptimizationStatus.IsFunction | OptimizationStatus.Interpreted;

    case _OptimizationStatus.Optimized:
      return OptimizationStatus.IsFunction | OptimizationStatus.Optimized;

    case _OptimizationStatus.AlwaysOptimized:
      return OptimizationStatus.IsFunction | OptimizationStatus.AlwaysOptimize;

    case _OptimizationStatus.NeverOptimized:
      return OptimizationStatus.IsFunction | OptimizationStatus.NeverOptimize;

    case _OptimizationStatus.MaybeDeoptimized:
      return OptimizationStatus.IsFunction | OptimizationStatus.MaybeDeopted;

    case _OptimizationStatus.TurboFanned:
      return OptimizationStatus.IsFunction | OptimizationStatus.Optimized | OptimizationStatus.TurboFanned;

    default:
      throw new Error('Unknown _OptimizationStatus: ' + status);
  }
}

function GetOptimizationStatus(fn) {
  return convertOptimizationStatus(v8.GetOptimizationStatus(fn));
}

export default { ...v8,
  GetOptimizationStatus
};