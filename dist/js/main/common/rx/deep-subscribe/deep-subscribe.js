"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepSubscribeRule = deepSubscribeRule;
exports.deepSubscribe = deepSubscribe;

var _iterateRule = require("./iterate-rule");

var _RuleBuilder = require("./RuleBuilder");

var _PeekIterator = require("./helpers/PeekIterator");

var _common = require("./helpers/common");

var _objectUniqueId = require("../../lists/helpers/object-unique-id");

/* tslint:disable */
// const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
let nextUnsubscribePropertyId = 0;

function deepSubscribeRuleIterator(object, subscribeValue, immediate, ruleIterator, propertiesPath, debugPropertyName, debugParent) {
  const subscribeNext = object => {
    let unsubscribePropertyName;
    return (0, _iterateRule.subscribeNextRule)(ruleIterator, nextRuleIterator => deepSubscribeRuleIterator(object, subscribeValue, immediate, nextRuleIterator, propertiesPath, debugPropertyName, debugParent), (rule, getNextRuleIterator) => {
      const subscribeItem = (item, debugPropertyName) => {
        const newPropertiesPath = () => (propertiesPath ? propertiesPath() + '.' : '') + debugPropertyName + '(' + rule.description + ')';

        const subscribe = () => deepSubscribeRuleIterator(item, subscribeValue, immediate, getNextRuleIterator ? getNextRuleIterator() : null, newPropertiesPath, debugPropertyName, object);

        if (!(item instanceof Object)) {
          const unsubscribe = (0, _common.checkUnsubscribe)(subscribe());

          if (unsubscribe) {
            unsubscribe();
            throw new Error(`You should not return unsubscribe function for non Object value.\nFor subscribe value types use their object wrappers: Number, Boolean, String classes.\nUnsubscribe function: ${unsubscribe}\nValue: ${item}\nValue property path: ${newPropertiesPath()}`);
          }

          return;
        }

        if (!unsubscribePropertyName) {
          unsubscribePropertyName = rule.unsubscribePropertyName; // + '_' + (nextUnsubscribePropertyId++)
        }

        const itemUniqueId = (0, _objectUniqueId.getObjectUniqueId)(item);
        let unsubscribe = unsubscribePropertyName[itemUniqueId];

        if (!unsubscribe) {
          // if (typeof unsubscribe === 'undefined') {
          // !Warning defineProperty is slow
          // Object.defineProperty(item, unsubscribePropertyName, {
          // 	configurable: true,
          // 	enumerable: false,
          // 	writable: true,
          // 	value: checkUnsubscribe(subscribe()),
          // })
          // item[unsubscribePropertyName] = checkUnsubscribe(subscribe())
          unsubscribePropertyName[itemUniqueId] = (0, _common.checkUnsubscribe)(subscribe()); // } else {
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

        const itemUniqueId = (0, _objectUniqueId.getObjectUniqueId)(item);
        const unsubscribe = unsubscribePropertyName[itemUniqueId];

        if (unsubscribe) {
          delete unsubscribePropertyName[itemUniqueId];
          unsubscribe(); // item[unsubscribePropertyName] = null
        }
      };

      return (0, _common.checkUnsubscribe)(rule.subscribe(object, immediate, subscribeItem, unsubscribeItem));
    }, () => {
      return subscribeValue(object, debugParent, debugPropertyName);
    });
  };

  const catchHandler = ex => {
    if (ex.propertiesPath) {
      throw ex;
    }

    const propertiesPathStr = propertiesPath ? propertiesPath() : '';
    ex.propertiesPath = propertiesPathStr;
    ex.message += `\nObject property path: ${propertiesPathStr}`;
    throw ex;
  };

  try {
    // Resolve Promises
    if (object != null && typeof object.then === 'function') {
      let unsubscribe;
      Promise.resolve(object).then(o => {
        if (!unsubscribe) {
          unsubscribe = subscribeNext(o); // if (typeof unsubscribe !== 'function') {
          // 	throw new Error(`unsubscribe is not a function: ${unsubscribe}`)
          // }
        }

        return o;
      }).catch(catchHandler);
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }

        unsubscribe = true;
      };
    }

    return subscribeNext(object);
  } catch (ex) {
    catchHandler(ex);
  }
}

function deepSubscribeRule(object, subscribeValue, immediate, rule) {
  return deepSubscribeRuleIterator(object, subscribeValue, immediate, new _PeekIterator.PeekIterator((0, _iterateRule.iterateRule)(rule)[Symbol.iterator]()));
}

function deepSubscribe(object, subscribeValue, immediate, ruleBuilder) {
  return deepSubscribeRule(object, subscribeValue, immediate, ruleBuilder(new _RuleBuilder.RuleBuilder()).rule);
}