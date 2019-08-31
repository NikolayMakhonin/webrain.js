"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CalcPropertyDependenciesBuilder = void 0;

var _DependenciesBuilder = require("./DependenciesBuilder");

class CalcPropertyDependenciesBuilder extends _DependenciesBuilder.DependenciesBuilder {
  constructor(buildSourceRule) {
    super(buildSourceRule);
  }

  invalidateOn(buildRule, predicate) {
    this.actionOn(buildRule, target => {
      target.invalidate();
    }, predicate);
    return this;
  }

  clearOn(buildRule, predicate) {
    this.actionOn(buildRule, target => {
      target.clear();
    }, predicate);
    return this;
  }

}

exports.CalcPropertyDependenciesBuilder = CalcPropertyDependenciesBuilder;