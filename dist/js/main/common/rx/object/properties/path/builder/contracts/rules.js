"use strict";

exports.__esModule = true;
exports.RuleRepeatAction = exports.RuleType = void 0;
var RuleType;
exports.RuleType = RuleType;

(function (RuleType) {
  RuleType[RuleType["Nothing"] = 0] = "Nothing";
  RuleType[RuleType["Never"] = 1] = "Never";
  RuleType[RuleType["Action"] = 2] = "Action";
  RuleType[RuleType["If"] = 3] = "If";
  RuleType[RuleType["Any"] = 4] = "Any";
  RuleType[RuleType["Repeat"] = 5] = "Repeat";
})(RuleType || (exports.RuleType = RuleType = {}));

var RuleRepeatAction;
exports.RuleRepeatAction = RuleRepeatAction;

(function (RuleRepeatAction) {
  RuleRepeatAction[RuleRepeatAction["Never"] = 0] = "Never";
  RuleRepeatAction[RuleRepeatAction["Next"] = 1] = "Next";
  RuleRepeatAction[RuleRepeatAction["Fork"] = 2] = "Fork";
  RuleRepeatAction[RuleRepeatAction["All"] = 3] = "All";
})(RuleRepeatAction || (exports.RuleRepeatAction = RuleRepeatAction = {}));