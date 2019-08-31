"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeDependencies = subscribeDependencies;
exports.DependenciesBuilder = void 0;

var _deepSubscribe = require("../../deep-subscribe/deep-subscribe");

var _RuleBuilder = require("../../deep-subscribe/RuleBuilder");

class DependenciesBuilder {
  constructor(buildSourceRule) {
    this.dependencies = [];
    this.buildSourceRule = buildSourceRule;
  }

  actionOn(buildRule, action, predicate) {
    const {
      buildSourceRule
    } = this;
    let ruleBuilder = new _RuleBuilder.RuleBuilder();

    if (buildSourceRule) {
      ruleBuilder = buildSourceRule(ruleBuilder);
    }

    ruleBuilder = buildRule(ruleBuilder);
    const ruleBase = ruleBuilder && ruleBuilder.result;

    if (ruleBase == null) {
      throw new Error('buildRule() return null or not initialized RuleBuilder');
    }

    this.dependencies.push([ruleBase, predicate ? (target, value, parent, propertyName) => {
      if (predicate(value, parent)) {
        action(target, value, parent, propertyName);
      }
    } : action]);
    return this;
  }

}

exports.DependenciesBuilder = DependenciesBuilder;

function subscribeDependencies(subscribeObject, actionTarget, dependencies) {
  const unsubscribers = [];

  for (let i = 0, len = dependencies.length; i < len; i++) {
    const [rule, action] = dependencies[i];
    unsubscribers.push((0, _deepSubscribe.deepSubscribeRule)(subscribeObject, (value, parent, propertyName) => {
      action(actionTarget, value, parent, propertyName);
      return null;
    }, true, rule));
  }

  return () => {
    for (let i = 0, len = unsubscribers.length; i < len; i++) {
      unsubscribers[i]();
    }
  };
}