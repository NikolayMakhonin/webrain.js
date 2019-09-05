"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.RuleType = void 0;
var RuleType;
exports.RuleType = RuleType;

(function (RuleType) {
  RuleType[RuleType["Nothing"] = 0] = "Nothing";
  RuleType[RuleType["Action"] = 1] = "Action";
  RuleType[RuleType["Any"] = 2] = "Any";
  RuleType[RuleType["Repeat"] = 3] = "Repeat";
})(RuleType || (exports.RuleType = RuleType = {}));