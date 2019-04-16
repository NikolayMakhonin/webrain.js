"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepSubscribeRule = deepSubscribeRule;
exports.deepSubscribe = deepSubscribe;

var _iterateRule = require("./iterate-rule");

var _RuleBuilder = require("./RuleBuilder");

var _PeekIterator = require("./helpers/PeekIterator");

/* tslint:disable */
// const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
let nextUnsubscribePropertyId = 0;

function deepSubscribeRuleIterator(object, subscribeValue, immediate, ruleIterator, propertiesPath) {
  const subscribeNext = () => {
    let unsubscribePropertyName;
    return (0, _iterateRule.subscribeNextRule)(ruleIterator, nextRuleIterator => deepSubscribeRuleIterator(object, subscribeValue, immediate, nextRuleIterator, propertiesPath), (rule, getNextRuleIterator) => {
      const subscribeItem = (item, debugPropertyName) => {
        const newPropertiesPath = () => (propertiesPath ? propertiesPath() + '.' : '') + debugPropertyName + '(' + rule.description + ')';

        const subscribe = () => deepSubscribeRuleIterator(item, subscribeValue, immediate, getNextRuleIterator ? getNextRuleIterator() : null, newPropertiesPath);

        if (!(item instanceof Object)) {
          const unsubscribe = subscribe();

          if (unsubscribe) {
            unsubscribe();
            throw new Error(`You should not return unsubscribe function for non Object value.\nFor subscribe value types use their object wrappers: Number, Boolean, String classes.\nUnsubscribe function: ${unsubscribe}\nValue: ${item}\nValue property path: ${newPropertiesPath()}`);
          }

          return;
        }

        if (!unsubscribePropertyName) {
          unsubscribePropertyName = rule.unsubscribePropertyName; // + '_' + (nextUnsubscribePropertyId++)
        }

        let unsubscribe = item[unsubscribePropertyName];

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

      const unsubscribeItem = (item, debugPropertyName) => {
        if (!(item instanceof Object)) {
          return;
        }

        if (!unsubscribePropertyName) {
          return;
        }

        const unsubscribe = item[unsubscribePropertyName];

        if (unsubscribe) {
          delete item[unsubscribePropertyName];
          unsubscribe(); // item[unsubscribePropertyName] = null
        }
      };

      return rule.subscribe(object, immediate, subscribeItem, unsubscribeItem);
    }, () => {
      return subscribeValue(object);
    });
  };

  try {
    return subscribeNext();
  } catch (ex) {
    if (ex.propertiesPath) {
      throw ex;
    }

    const propertiesPathStr = propertiesPath ? propertiesPath() : '';
    ex.propertiesPath = propertiesPathStr;
    ex.message += `\nObject property path: ${propertiesPathStr}`;
    throw ex;
  }
}

function deepSubscribeRule(object, subscribeValue, immediate, rule) {
  return deepSubscribeRuleIterator(object, subscribeValue, immediate, new _PeekIterator.PeekIterator((0, _iterateRule.iterateRule)(rule)[Symbol.iterator]()));
}

function deepSubscribe(object, subscribeValue, immediate, ruleBuilder) {
  return deepSubscribeRule(object, subscribeValue, immediate, ruleBuilder(new _RuleBuilder.RuleBuilder()).rule);
}