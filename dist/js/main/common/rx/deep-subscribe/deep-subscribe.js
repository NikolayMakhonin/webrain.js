"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepSubscribeRule = deepSubscribeRule;
exports.deepSubscribe = deepSubscribe;

var _iterateRule = require("./iterate-rule");

var _RuleBuilder = require("./RuleBuilder");

var _objectUniqueId = require("../../lists/helpers/object-unique-id");

var _helpers = require("../../helpers/helpers");

/* tslint:disable */
// const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0
function deepSubscribeRuleIterator(object, subscribeValue, immediate, ruleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent) {
  const subscribeNext = object => {
    let unsubscribers;

    if (!leafUnsubscribers) {
      leafUnsubscribers = [];
    }

    const subscribeNested = (value, subscribe, getUnsubscribers, newPropertiesPath) => {
      if (!(value instanceof Object)) {
        const unsubscribe = (0, _helpers.checkIsFuncOrNull)(subscribe());

        if (unsubscribe) {
          unsubscribe();
          throw new Error(`You should not return unsubscribe function for non Object value.\nFor subscribe value types use their object wrappers: Number, Boolean, String classes.\nUnsubscribe function: ${unsubscribe}\nValue: ${value}\nValue property path: ${newPropertiesPath ? newPropertiesPath() : propertiesPath ? propertiesPath() : ''}`);
        }

        return false;
      }

      const unsubscribers = getUnsubscribers();
      const itemUniqueId = (0, _objectUniqueId.getObjectUniqueId)(value);
      let unsubscribe = unsubscribers[itemUniqueId];

      if (!unsubscribe) {
        unsubscribers[itemUniqueId] = (0, _helpers.checkIsFuncOrNull)(subscribe()); // if (typeof unsubscribe === 'undefined') {
        //
        // 	!Warning defineProperty is slow
        // 	Object.defineProperty(item, unsubscribePropertyName, {
        // 		configurable: true,
        // 		enumerable: false,
        // 		writable: true,
        // 		value: checkUnsubscribe(subscribe()),
        // 	})
        //
        // 	item[unsubscribePropertyName] = checkUnsubscribe(subscribe())
        //
        // } else {
        // 	item[unsubscribePropertyName] = subscribe()
        // }
      }

      return true;
    };

    const unsubscribeNested = (value, unsubscribers) => {
      if (!(value instanceof Object)) {
        return;
      }

      if (!unsubscribers) {
        return;
      }

      const itemUniqueId = (0, _objectUniqueId.getObjectUniqueId)(value);
      const unsubscribe = unsubscribers[itemUniqueId];

      if (unsubscribe) {
        delete unsubscribers[itemUniqueId];
        unsubscribe(); // item[unsubscribePropertyName] = null
      }
    };

    return (0, _iterateRule.subscribeNextRule)(ruleIterator, nextRuleIterator => deepSubscribeRuleIterator(object, subscribeValue, immediate, nextRuleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent), (rule, getNextRuleIterator) => {
      const subscribeItem = (item, debugPropertyName) => {
        const newPropertiesPath = debugPropertyName == null ? null : () => (propertiesPath ? propertiesPath() + '.' : '') + debugPropertyName + '(' + rule.description + ')';

        const subscribe = () => deepSubscribeRuleIterator(item, subscribeValue, immediate, getNextRuleIterator ? getNextRuleIterator() : null, leafUnsubscribers, newPropertiesPath, debugPropertyName, object);

        subscribeNested(item, subscribe, () => {
          if (!unsubscribers) {
            unsubscribers = rule.unsubscribers; // + '_' + (nextUnsubscribePropertyId++)
          }

          return unsubscribers;
        }, newPropertiesPath);
      }; // noinspection JSUnusedLocalSymbols


      const unsubscribeItem = (item, debugPropertyName) => {
        unsubscribeNested(item, unsubscribers);
      };

      return (0, _helpers.checkIsFuncOrNull)(rule.subscribe(object, immediate, subscribeItem, unsubscribeItem));
    }, () => {
      if (subscribeNested(object, () => subscribeValue(object, debugParent, debugPropertyName), () => leafUnsubscribers)) {
        return () => {
          unsubscribeNested(object, leafUnsubscribers);
        };
      }

      return null;
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
  return (0, _helpers.toSingleCall)(deepSubscribeRuleIterator(object, subscribeValue, immediate, (0, _iterateRule.iterateRule)(rule)[Symbol.iterator]()));
}

function deepSubscribe(object, subscribeValue, immediate, ruleBuilder) {
  return (0, _helpers.toSingleCall)(deepSubscribeRule(object, subscribeValue, immediate, ruleBuilder(new _RuleBuilder.RuleBuilder()).result));
}