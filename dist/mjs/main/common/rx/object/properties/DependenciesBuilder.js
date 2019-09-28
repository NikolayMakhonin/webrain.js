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

    this.dependencies.push([ruleBase, predicate ? (target, value, parent, key, keyType) => {
      // prevent circular self dependency
      if (target === parent) {
        return;
      }

      if (predicate(value, parent, key, keyType)) {
        action(target, value, parent, key, keyType);
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

      changeValue(key, oldValue, newValue, parent, changeType, keyType) {
        action(actionTarget, newValue, parent, key, keyType);
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