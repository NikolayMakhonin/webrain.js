/* tslint:disable */
import { iterateRule, subscribeNextRule } from './iterate-rule';
import { RuleBuilder } from "./RuleBuilder";

function deepSubscribeRuleIterator(object, subscribe, immediate, ruleIterator, propertiesPath) {
  var subscribeNext = function subscribeNext() {
    var unsubscribePropertyName;
    return subscribeNextRule(ruleIterator, function (nextRuleIterator) {
      return deepSubscribeRuleIterator(object, subscribe, immediate, nextRuleIterator, propertiesPath);
    }, function (rule) {
      function subscribeItem(item, debugPropertyName) {
        var newPropertiesPath = (propertiesPath ? propertiesPath + '.' : '') + debugPropertyName + '(' + rule.description + ')';

        var subscribe = function subscribe() {
          return deepSubscribeRuleIterator(item, subscribe, immediate, ruleIterator, newPropertiesPath);
        };

        if (!(item instanceof Object)) {
          var _unsubscribe = subscribe();

          if (_unsubscribe) {
            throw new Error("You should not return unsubscribe function (".concat(_unsubscribe, ") for non Object value (").concat(object, ").\nFor subscribe value types use their object wrappers: Number, Boolean, String classes.\nValue property path: ").concat(newPropertiesPath));
          }

          return;
        }

        if (!unsubscribePropertyName) {
          unsubscribePropertyName = Math.random().toString(36);
        }

        var unsubscribe = item[unsubscribePropertyName];

        if (!unsubscribe) {
          unsubscribe = subscribe();
          Object.defineProperty(item, unsubscribePropertyName, {
            configurable: true,
            enumerable: false,
            writable: false,
            value: unsubscribe
          });
        }
      }

      function unsubscribeItem(item, debugPropertyName) {
        if (!(item instanceof Object)) {
          return;
        }

        if (!unsubscribePropertyName) {
          return;
        }

        var unsubscribe = item[unsubscribePropertyName];

        if (unsubscribe) {
          unsubscribe();
          delete item[unsubscribePropertyName];
        }
      }

      return rule.subscribe(object, immediate, subscribeItem, unsubscribeItem);
    }, function () {
      return subscribe(object);
    });
  };

  try {
    return subscribeNext();
  } catch (ex) {
    ex.message += "\nObject property path: ".concat(propertiesPath);
    throw ex;
  }
}

export function deepSubscribeRule(object, subscribe, immediate, rule) {
  return deepSubscribeRuleIterator(object, subscribe, immediate, iterateRule(rule)[Symbol.iterator]());
}
export function deepSubscribe(object, subscribe, immediate, ruleBuilder) {
  return deepSubscribeRule(object, subscribe, immediate, ruleBuilder(new RuleBuilder()).rule);
}