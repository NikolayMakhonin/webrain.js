"use strict";

exports.__esModule = true;
exports.subscribeDependencies = subscribeDependencies;
exports.DependenciesBuilder = void 0;

var _deepSubscribe = require("../../deep-subscribe/deep-subscribe");

var _RuleBuilder = require("../../deep-subscribe/RuleBuilder");

var DependenciesBuilder =
/*#__PURE__*/
function () {
  function DependenciesBuilder(buildSourceRule) {
    this.dependencies = [];
    this.buildSourceRule = buildSourceRule;
  }

  var _proto = DependenciesBuilder.prototype;

  _proto.actionOn = function actionOn(buildRule, action, predicate) {
    var buildSourceRule = this.buildSourceRule;
    var ruleBuilder = new _RuleBuilder.RuleBuilder();

    if (buildSourceRule) {
      ruleBuilder = buildSourceRule(ruleBuilder);
    }

    ruleBuilder = buildRule(ruleBuilder);
    var ruleBase = ruleBuilder && ruleBuilder.result;

    if (ruleBase == null) {
      throw new Error('buildRule() return null or not initialized RuleBuilder');
    }

    this.dependencies.push([ruleBase, predicate ? function (target, value, parent, propertyName) {
      if (predicate(value, parent)) {
        action(target, value, parent, propertyName);
      }
    } : action]);
    return this;
  };

  return DependenciesBuilder;
}();

exports.DependenciesBuilder = DependenciesBuilder;

function subscribeDependencies(subscribeObject, actionTarget, dependencies) {
  var unsubscribers = [];

  var _loop = function _loop(i, len) {
    var _dependencies$i = dependencies[i],
        rule = _dependencies$i[0],
        action = _dependencies$i[1];
    unsubscribers.push((0, _deepSubscribe.deepSubscribeRule)(subscribeObject, function (value, parent, propertyName) {
      action(actionTarget, value, parent, propertyName);
      return null;
    }, true, rule));
  };

  for (var i = 0, len = dependencies.length; i < len; i++) {
    _loop(i, len);
  }

  return function () {
    for (var i = 0, len = unsubscribers.length; i < len; i++) {
      unsubscribers[i]();
    }
  };
}