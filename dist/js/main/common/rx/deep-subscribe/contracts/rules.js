"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleType = void 0;
let RuleType;
exports.RuleType = RuleType;

(function (RuleType) {
  RuleType[RuleType["Nothing"] = 0] = "Nothing";
  RuleType[RuleType["Action"] = 1] = "Action";
  RuleType[RuleType["Any"] = 2] = "Any";
  RuleType[RuleType["Repeat"] = 3] = "Repeat";
})(RuleType || (exports.RuleType = RuleType = {}));