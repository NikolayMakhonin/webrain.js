/* tslint:disable */
import { iterateRule, subscribeNextRule } from './iterate-rule';
import { RuleBuilder } from "./RuleBuilder";
import { PeekIterator } from "./helpers/PeekIterator"; // const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)

var nextUnsubscribePropertyId = 0;

function deepSubscribeRuleIterator(object, subscribeValue, immediate, ruleIterator, propertiesPath) {
  var subscribeNext = function subscribeNext() {
    var unsubscribePropertyName;
    return subscribeNextRule(ruleIterator, function (nextRuleIterator) {
      return deepSubscribeRuleIterator(object, subscribeValue, immediate, nextRuleIterator, propertiesPath);
    }, function (rule, getNextRuleIterator) {
      var subscribeItem = function subscribeItem(item, debugPropertyName) {
        var newPropertiesPath = function newPropertiesPath() {
          return (propertiesPath ? propertiesPath() + '.' : '') + debugPropertyName + '(' + rule.description + ')';
        };

        var subscribe = function subscribe() {
          return deepSubscribeRuleIterator(item, subscribeValue, immediate, getNextRuleIterator ? getNextRuleIterator() : null, newPropertiesPath);
        };

        if (!(item instanceof Object)) {
          var _unsubscribe = subscribe();

          if (_unsubscribe) {
            _unsubscribe();

            throw new Error("You should not return unsubscribe function for non Object value.\nFor subscribe value types use their object wrappers: Number, Boolean, String classes.\nUnsubscribe function: ".concat(_unsubscribe, "\nValue: ").concat(item, "\nValue property path: ").concat(newPropertiesPath()));
          }

          return;
        }

        if (!unsubscribePropertyName) {
          unsubscribePropertyName = rule.unsubscribePropertyName; // + '_' + (nextUnsubscribePropertyId++)
        }

        var unsubscribe = item[unsubscribePropertyName];

        if (!unsubscribe) {
          // if (typeof unsubscribe === 'undefined') {
          Object.defineProperty(item, unsubscribePropertyName, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: subscribe()
          }); // } else {
          // 	item[unsubscribePropertyName] = subscribe()
          // }
        }
      };

      var unsubscribeItem = function unsubscribeItem(item, debugPropertyName) {
        if (!(item instanceof Object)) {
          return;
        }

        if (!unsubscribePropertyName) {
          return;
        }

        var unsubscribe = item[unsubscribePropertyName];

        if (unsubscribe) {
          delete item[unsubscribePropertyName];
          unsubscribe(); // item[unsubscribePropertyName] = null
        }
      };

      return rule.subscribe(object, immediate, subscribeItem, unsubscribeItem);
    }, function () {
      return subscribeValue(object);
    });
  };

  try {
    return subscribeNext();
  } catch (ex) {
    if (ex.propertiesPath) {
      throw ex;
    }

    var propertiesPathStr = propertiesPath ? propertiesPath() : '';
    ex.propertiesPath = propertiesPathStr;
    ex.message += "\nObject property path: ".concat(propertiesPathStr);
    throw ex;
  }
}

export function deepSubscribeRule(object, subscribeValue, immediate, rule) {
  return deepSubscribeRuleIterator(object, subscribeValue, immediate, new PeekIterator(iterateRule(rule)[Symbol.iterator]()));
}
export function deepSubscribe(object, subscribeValue, immediate, ruleBuilder) {
  return deepSubscribeRule(object, subscribeValue, immediate, ruleBuilder(new RuleBuilder()).rule);
}