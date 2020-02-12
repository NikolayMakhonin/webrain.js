"use strict";

exports.__esModule = true;
exports.FuncCallStatus = void 0;
var FuncCallStatus;
exports.FuncCallStatus = FuncCallStatus;

(function (FuncCallStatus) {
  FuncCallStatus[FuncCallStatus["Invalidating"] = 1] = "Invalidating";
  FuncCallStatus[FuncCallStatus["Invalidated"] = 2] = "Invalidated";
  FuncCallStatus[FuncCallStatus["Calculating"] = 3] = "Calculating";
  FuncCallStatus[FuncCallStatus["CalculatingAsync"] = 4] = "CalculatingAsync";
  FuncCallStatus[FuncCallStatus["Calculated"] = 5] = "Calculated";
  FuncCallStatus[FuncCallStatus["Error"] = 6] = "Error";
})(FuncCallStatus || (exports.FuncCallStatus = FuncCallStatus = {}));