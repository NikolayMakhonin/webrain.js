"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepSubscribeRule = deepSubscribeRule;
exports.deepSubscribe = deepSubscribe;

var _iterateRule = require("./iterate-rule");

var _RuleBuilder = require("./RuleBuilder");

/* tslint:disable */
function deepSubscribeRuleIterator(object, subscribe, immediate, ruleIterator, propertiesPath) {
  const subscribeNext = () => {
    let unsubscribePropertyName;
    return (0, _iterateRule.subscribeNextRule)(ruleIterator, nextRuleIterator => deepSubscribeRuleIterator(object, subscribe, immediate, nextRuleIterator, propertiesPath), rule => {
      function subscribeItem(item, debugPropertyName) {
        const newPropertiesPath = (propertiesPath ? propertiesPath + '.' : '') + debugPropertyName + '(' + rule.description + ')';

        const subscribe = () => deepSubscribeRuleIterator(item, subscribe, immediate, ruleIterator, newPropertiesPath);

        if (!(item instanceof Object)) {
          const unsubscribe = subscribe();

          if (unsubscribe) {
            throw new Error(`You should not return unsubscribe function (${unsubscribe}) for non Object value (${object}).\nFor subscribe value types use their object wrappers: Number, Boolean, String classes.\nValue property path: ${newPropertiesPath}`);
          }

          return;
        }

        if (!unsubscribePropertyName) {
          unsubscribePropertyName = Math.random().toString(36);
        }

        let unsubscribe = item[unsubscribePropertyName];

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

        const unsubscribe = item[unsubscribePropertyName];

        if (unsubscribe) {
          unsubscribe();
          delete item[unsubscribePropertyName];
        }
      }

      return rule.subscribe(object, immediate, subscribeItem, unsubscribeItem);
    }, () => {
      return subscribe(object);
    });
  };

  try {
    return subscribeNext();
  } catch (ex) {
    ex.message += `\nObject property path: ${propertiesPath}`;
    throw ex;
  }
}

function deepSubscribeRule(object, subscribe, immediate, rule) {
  return deepSubscribeRuleIterator(object, subscribe, immediate, (0, _iterateRule.iterateRule)(rule)[Symbol.iterator]());
}

function deepSubscribe(object, subscribe, immediate, ruleBuilder) {
  return deepSubscribeRule(object, subscribe, immediate, ruleBuilder(new _RuleBuilder.RuleBuilder()).rule);
}