export let OptimizationStatus;

(function (OptimizationStatus) {
  OptimizationStatus[OptimizationStatus["IsFunction"] = 1] = "IsFunction";
  OptimizationStatus[OptimizationStatus["NeverOptimize"] = 2] = "NeverOptimize";
  OptimizationStatus[OptimizationStatus["AlwaysOptimize"] = 4] = "AlwaysOptimize";
  OptimizationStatus[OptimizationStatus["MaybeDeopted"] = 8] = "MaybeDeopted";
  OptimizationStatus[OptimizationStatus["Optimized"] = 16] = "Optimized";
  OptimizationStatus[OptimizationStatus["TurboFanned"] = 32] = "TurboFanned";
  OptimizationStatus[OptimizationStatus["Interpreted"] = 64] = "Interpreted";
  OptimizationStatus[OptimizationStatus["MarkedForOptimization"] = 128] = "MarkedForOptimization";
  OptimizationStatus[OptimizationStatus["MarkedForConcurrentOptimization"] = 256] = "MarkedForConcurrentOptimization";
  OptimizationStatus[OptimizationStatus["OptimizingConcurrently"] = 512] = "OptimizingConcurrently";
  OptimizationStatus[OptimizationStatus["IsExecuting"] = 1024] = "IsExecuting";
  OptimizationStatus[OptimizationStatus["TopmostFrameIsTurboFanned"] = 2048] = "TopmostFrameIsTurboFanned";
  OptimizationStatus[OptimizationStatus["LiteMode"] = 4096] = "LiteMode";
  OptimizationStatus[OptimizationStatus["MarkedForDeoptimization"] = 8192] = "MarkedForDeoptimization";
})(OptimizationStatus || (OptimizationStatus = {}));