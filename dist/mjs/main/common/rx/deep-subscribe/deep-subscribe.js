/* tslint:disable */
import { iterateRule, subscribeNextRule } from './iterate-rule';
import { RuleBuilder } from "./RuleBuilder";
import { PeekIterator } from "./helpers/PeekIterator";
import { checkUnsubscribe } from "./helpers/common";
import { getObjectUniqueId } from "../../lists/helpers/object-unique-id"; // const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)

var nextUnsubscribePropertyId = 0;

function deepSubscribeRuleIterator(object, subscribeValue, immediate, ruleIterator, propertiesPath, debugPropertyName, debugParent) {
  var subscribeNext = function subscribeNext(object) {
    var unsubscribePropertyName;
    return subscribeNextRule(ruleIterator, function (nextRuleIterator) {
      return deepSubscribeRuleIterator(object, subscribeValue, immediate, nextRuleIterator, propertiesPath, debugPropertyName, debugParent);
    }, function (rule, getNextRuleIterator) {
      var subscribeItem = function subscribeItem(item, debugPropertyName) {
        var newPropertiesPath = function newPropertiesPath() {
          return (propertiesPath ? propertiesPath() + '.' : '') + debugPropertyName + '(' + rule.description + ')';
        };

        var subscribe = function subscribe() {
          return deepSubscribeRuleIterator(item, subscribeValue, immediate, getNextRuleIterator ? getNextRuleIterator() : null, newPropertiesPath, debugPropertyName, object);
        };

        if (!(item instanceof Object)) {
          var _unsubscribe = checkUnsubscribe(subscribe());

          if (_unsubscribe) {
            _unsubscribe();

            throw new Error("You should not return unsubscribe function for non Object value.\nFor subscribe value types use their object wrappers: Number, Boolean, String classes.\nUnsubscribe function: ".concat(_unsubscribe, "\nValue: ").concat(item, "\nValue property path: ").concat(newPropertiesPath()));
          }

          return;
        }

        if (!unsubscribePropertyName) {
          unsubscribePropertyName = rule.unsubscribePropertyName; // + '_' + (nextUnsubscribePropertyId++)
        }

        var itemUniqueId = getObjectUniqueId(item);
        var unsubscribe = unsubscribePropertyName[itemUniqueId];

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
          unsubscribePropertyName[itemUniqueId] = checkUnsubscribe(subscribe()); // } else {
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

        var itemUniqueId = getObjectUniqueId(item);
        var unsubscribe = unsubscribePropertyName[itemUniqueId];

        if (unsubscribe) {
          delete unsubscribePropertyName[itemUniqueId];
          unsubscribe(); // item[unsubscribePropertyName] = null
        }
      };

      return checkUnsubscribe(rule.subscribe(object, immediate, subscribeItem, unsubscribeItem));
    }, function () {
      return subscribeValue(object, debugParent, debugPropertyName);
    });
  };

  var catchHandler = function catchHandler(ex) {
    if (ex.propertiesPath) {
      throw ex;
    }

    var propertiesPathStr = propertiesPath ? propertiesPath() : '';
    ex.propertiesPath = propertiesPathStr;
    ex.message += "\nObject property path: ".concat(propertiesPathStr);
    throw ex;
  };

  try {
    // Resolve Promises
    if (object != null && typeof object.then === 'function') {
      var unsubscribe;
      Promise.resolve(object).then(function (o) {
        if (!unsubscribe) {
          unsubscribe = subscribeNext(o); // if (typeof unsubscribe !== 'function') {
          // 	throw new Error(`unsubscribe is not a function: ${unsubscribe}`)
          // }
        }

        return o;
      }).catch(catchHandler);
      return function () {
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

export function deepSubscribeRule(object, subscribeValue, immediate, rule) {
  return deepSubscribeRuleIterator(object, subscribeValue, immediate, new PeekIterator(iterateRule(rule)[Symbol.iterator]()));
}
export function deepSubscribe(object, subscribeValue, immediate, ruleBuilder) {
  return deepSubscribeRule(object, subscribeValue, immediate, ruleBuilder(new RuleBuilder()).rule);
}