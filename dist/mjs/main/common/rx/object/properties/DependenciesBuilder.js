import { webrainOptions } from '../../../helpers/webrainOptions';
import { deepSubscribeRule } from '../../deep-subscribe/deep-subscribe';
import { PropertiesPath } from '../../deep-subscribe/helpers/PropertiesPath';
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

    this.dependencies.push([ruleBase, predicate ? (target, value, parent, key, keyType, propertiesPath, rule) => {
      // prevent circular self dependency
      if (target === parent) {
        return;
      }

      if (predicate(value, parent, key, keyType, propertiesPath, rule)) {
        action(target, value, parent, key, keyType, propertiesPath, rule);
      }
    } : action]);
    return this;
  }

}
export function subscribeDependencies(subscribeObject, actionTarget, dependencies, states) {
  let unsubscribers = [];

  for (let i = 0, len = dependencies.length; i < len; i++) {
    const [_rule, action] = dependencies[i];
    let subscribed;
    let state = states && states[i];
    let subscribeState = state && state[i] && {};
    let unsubscribeState;
    const unsubscribe = deepSubscribeRule({
      object: subscribeObject,

      changeValue(key, oldValue, newValue, parent, changeType, keyType, propertiesPath, rule) {
        if (!subscribed && state) {
          const newPropertiesPath = new PropertiesPath(newValue, propertiesPath, key, keyType, rule);
          const {
            id
          } = newPropertiesPath;

          if (Object.prototype.hasOwnProperty.call(state, id)) {
            if (!subscribeState) {
              subscribeState = {
                [id]: true
              };
            } else if (typeof newValue === 'undefined' && subscribeState[id]) {
              return;
            } else {
              subscribeState[id] = true;
            }

            const stateValue = state[id].value;

            if (webrainOptions.equalsFunc(stateValue, newValue)) {
              return;
            } // action(actionTarget, stateValue, parent, key, keyType, propertiesPath, rule)

          }
        }

        if (unsubscribeState) {
          const newPropertiesPath = new PropertiesPath(oldValue, propertiesPath, key, keyType, rule);
          const {
            id
          } = newPropertiesPath;
          unsubscribeState[id] = newPropertiesPath;
        } else {
          action(actionTarget, newValue, parent, key, keyType, propertiesPath, rule);
        }
      },

      rule: _rule.clone(),
      debugTarget: actionTarget
    });
    unsubscribers.push(unsubscribe && (() => {
      unsubscribeState = {};
      unsubscribe();
      return unsubscribeState;
    }));

    if (state) {
      for (const id in state) {
        if (Object.prototype.hasOwnProperty.call(state, id) && (!subscribeState || !Object.prototype.hasOwnProperty.call(subscribeState, id))) {
          const propertiesPath = state[id];
          action(actionTarget, void 0, propertiesPath.parent && propertiesPath.parent.value, propertiesPath.key, propertiesPath.keyType, propertiesPath.parent, propertiesPath.rule);
          break;
        }
      }
    } else {
      state = null;
    }

    subscribed = true;
  }

  return () => {
    if (unsubscribers) {
      const _unsubscribers = unsubscribers;
      unsubscribers = null;
      return _unsubscribers.map(o => o && o());
    }
  };
}
export function dependenciesSubscriber(buildRule, action, predicate) {
  const {
    dependencies
  } = new DependenciesBuilder().actionOn(buildRule, action, predicate);
  return (source, target) => subscribeDependencies(source, target, dependencies);
}