import { deepSubscribeRule } from '../../deep-subscribe/deep-subscribe';
import { RuleBuilder } from '../../deep-subscribe/RuleBuilder';
export class DependenciesBuilder {
  constructor(buildSourceRule) {
    this.dependencies = [];
    this.buildSourceRule = buildSourceRule;
  }

  actionOn(buildRule, action, predicate) {
    const {
      buildSourceRule
    } = this;
    let ruleBuilder = new RuleBuilder();

    if (buildSourceRule) {
      ruleBuilder = buildSourceRule(ruleBuilder);
    }

    ruleBuilder = buildRule(ruleBuilder);
    const ruleBase = ruleBuilder && ruleBuilder.result();

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
export function subscribeDependencies(subscribeObject, actionTarget, dependencies) {
  const unsubscribers = [];

  for (let i = 0, len = dependencies.length; i < len; i++) {
    const [rule, action] = dependencies[i];
    unsubscribers.push(deepSubscribeRule({
      object: subscribeObject,

      subscribeValue(value, parent, propertyName) {
        action(actionTarget, value, parent, propertyName);
      },

      unsubscribeValue(value, parent, propertyName) {
        action(actionTarget, void 0, parent, propertyName);
      },

      rule
    }));
  }

  return () => {
    for (let i = 0, len = unsubscribers.length; i < len; i++) {
      unsubscribers[i]();
    }
  };
}