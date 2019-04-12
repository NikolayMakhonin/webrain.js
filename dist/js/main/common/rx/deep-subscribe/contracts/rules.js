"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleType = void 0;
let RuleType;
exports.RuleType = RuleType;

(function (RuleType) {
  RuleType[RuleType["Action"] = 0] = "Action";
  RuleType[RuleType["Any"] = 1] = "Any";
  RuleType[RuleType["Repeat"] = 2] = "Repeat";
})(RuleType || (exports.RuleType = RuleType = {}));