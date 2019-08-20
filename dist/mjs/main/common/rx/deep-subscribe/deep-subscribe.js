/* tslint:disable */
import { iterateRule, subscribeNextRule } from './iterate-rule';
import { RuleBuilder } from "./RuleBuilder";
import { PeekIterator } from "./helpers/PeekIterator";
import { getObjectUniqueId } from "../../lists/helpers/object-unique-id";
import { checkIsFuncOrNull, toSingleCall } from "../../helpers/helpers"; // const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0

function deepSubscribeRuleIterator(object, subscribeValue, immediate, ruleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent) {
  var subscribeNext = function subscribeNext(object) {
    var unsubscribers;

    if (!leafUnsubscribers) {
      leafUnsubscribers = [];
    }

    var subscribeNested = function subscribeNested(value, subscribe, getUnsubscribers, newPropertiesPath) {
      if (!(value instanceof Object)) {
        var _unsubscribe = checkIsFuncOrNull(subscribe());

        if (_unsubscribe) {
          _unsubscribe();

          throw new Error("You should not return unsubscribe function for non Object value.\nFor subscribe value types use their object wrappers: Number, Boolean, String classes.\nUnsubscribe function: ".concat(_unsubscribe, "\nValue: ").concat(value, "\nValue property path: ").concat(newPropertiesPath ? newPropertiesPath() : propertiesPath ? propertiesPath() : ''));
        }

        return false;
      }

      var unsubscribers = getUnsubscribers();
      var itemUniqueId = getObjectUniqueId(value);
      var unsubscribe = unsubscribers[itemUniqueId];

      if (!unsubscribe) {
        unsubscribers[itemUniqueId] = checkIsFuncOrNull(subscribe()); // if (typeof unsubscribe === 'undefined') {
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

    var unsubscribeNested = function unsubscribeNested(value, unsubscribers) {
      if (!(value instanceof Object)) {
        return;
      }

      if (!unsubscribers) {
        return;
      }

      var itemUniqueId = getObjectUniqueId(value);
      var unsubscribe = unsubscribers[itemUniqueId];

      if (unsubscribe) {
        delete unsubscribers[itemUniqueId];
        unsubscribe(); // item[unsubscribePropertyName] = null
      }
    };

    return subscribeNextRule(ruleIterator, function (nextRuleIterator) {
      return deepSubscribeRuleIterator(object, subscribeValue, immediate, nextRuleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent);
    }, function (rule, getNextRuleIterator) {
      var subscribeItem = function subscribeItem(item, debugPropertyName) {
        var newPropertiesPath = debugPropertyName == null ? null : function () {
          return (propertiesPath ? propertiesPath() + '.' : '') + debugPropertyName + '(' + rule.description + ')';
        };

        var subscribe = function subscribe() {
          return deepSubscribeRuleIterator(item, subscribeValue, immediate, getNextRuleIterator ? getNextRuleIterator() : null, leafUnsubscribers, newPropertiesPath, debugPropertyName, object);
        };

        subscribeNested(item, subscribe, function () {
          if (!unsubscribers) {
            unsubscribers = rule.unsubscribers; // + '_' + (nextUnsubscribePropertyId++)
          }

          return unsubscribers;
        }, newPropertiesPath);
      };

      var unsubscribeItem = function unsubscribeItem(item, debugPropertyName) {
        unsubscribeNested(item, unsubscribers);
      };

      return checkIsFuncOrNull(rule.subscribe(object, immediate, subscribeItem, unsubscribeItem));
    }, function () {
      if (subscribeNested(object, function () {
        return subscribeValue(object, debugParent, debugPropertyName);
      }, function () {
        return leafUnsubscribers;
      })) {
        return function () {
          unsubscribeNested(object, leafUnsubscribers);
        };
      }

      return null;
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
      })["catch"](catchHandler);
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
  return toSingleCall(deepSubscribeRuleIterator(object, subscribeValue, immediate, new PeekIterator(iterateRule(rule)[Symbol.iterator]())));
}
export function deepSubscribe(object, subscribeValue, immediate, ruleBuilder) {
  return toSingleCall(deepSubscribeRule(object, subscribeValue, immediate, ruleBuilder(new RuleBuilder()).result));
}