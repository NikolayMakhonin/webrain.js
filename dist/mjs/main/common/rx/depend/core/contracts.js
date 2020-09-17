/* tslint:disable:no-circular-imports */
export let CallStatus;

(function (CallStatus) {
  CallStatus[CallStatus["Flag_None"] = 0] = "Flag_None";
  CallStatus[CallStatus["Flag_Invalidating"] = 1] = "Flag_Invalidating";
  CallStatus[CallStatus["Flag_Invalidated"] = 2] = "Flag_Invalidated";
  CallStatus[CallStatus["Mask_Invalidate"] = 3] = "Mask_Invalidate";
  CallStatus[CallStatus["Flag_Recalc"] = 4] = "Flag_Recalc";
  CallStatus[CallStatus["Flag_Parent_Invalidating"] = 8] = "Flag_Parent_Invalidating";
  CallStatus[CallStatus["Flag_Parent_Invalidated"] = 16] = "Flag_Parent_Invalidated";
  CallStatus[CallStatus["Mask_Parent_Invalidate"] = 24] = "Mask_Parent_Invalidate";
  CallStatus[CallStatus["Flag_Parent_Recalc"] = 32] = "Flag_Parent_Recalc";
  CallStatus[CallStatus["Flag_Check"] = 128] = "Flag_Check";
  CallStatus[CallStatus["Flag_Calculating"] = 256] = "Flag_Calculating";
  CallStatus[CallStatus["Flag_Async"] = 512] = "Flag_Async";
  CallStatus[CallStatus["Flag_Calculated"] = 1024] = "Flag_Calculated";
  CallStatus[CallStatus["Mask_Calculate"] = 1920] = "Mask_Calculate";
  CallStatus[CallStatus["Flag_HasValue"] = 2048] = "Flag_HasValue";
  CallStatus[CallStatus["Flag_HasError"] = 4096] = "Flag_HasError";
  CallStatus[CallStatus["Flag_InternalError"] = 8192] = "Flag_InternalError";
})(CallStatus || (CallStatus = {}));

export let CallStatusShort;

(function (CallStatusShort) {
  CallStatusShort["Handling"] = "Handling";
  CallStatusShort["Invalidated"] = "Invalidated";
  CallStatusShort["CalculatedValue"] = "CalculatedValue";
  CallStatusShort["CalculatedError"] = "CalculatedError";
})(CallStatusShort || (CallStatusShort = {}));