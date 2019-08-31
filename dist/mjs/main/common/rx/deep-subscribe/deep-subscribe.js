/* tslint:disable */
import { isThenable } from '../../async/async';
import { resolveAsync } from '../../async/ThenableSync';
import { iterateRule, subscribeNextRule } from './iterate-rule';
import { RuleBuilder } from "./RuleBuilder";
import { getObjectUniqueId } from "../../lists/helpers/object-unique-id";
import { checkIsFuncOrNull, toSingleCall } from "../../helpers/helpers";
import { hasDefaultProperty, subscribeDefaultProperty } from './rules-subscribe'; // const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0

function catchHandler(ex, propertiesPath) {
  if (ex.propertiesPath) {
    throw ex;
  }

  var propertiesPathStr = propertiesPath ? propertiesPath() : '';
  ex.propertiesPath = propertiesPathStr;
  ex.message += "\nObject property path: ".concat(propertiesPathStr);
  throw ex;
}

function deepSubscribeAsync(object, subscribeValue, immediate, ruleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent) {
  var unsubscribe;
  resolveAsync(object, function (o) {
    if (!unsubscribe) {
      unsubscribe = subscribeNext(o, subscribeValue, immediate, ruleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent); // if (typeof unsubscribe !== 'function') {
      // 	throw new Error(`unsubscribe is not a function: ${unsubscribe}`)
      // }
    }

    return o;
  }, function (err) {
    return catchHandler(err, propertiesPath);
  });
  return function () {
    if (typeof unsubscribe === 'function') {
      unsubscribe();
    }

    unsubscribe = true;
  };
}

function unsubscribeNested(value, unsubscribers) {
  if (!(value instanceof Object)) {
    return;
  }

  if (!unsubscribers) {
    return;
  }

  var itemUniqueId = getObjectUniqueId(value);
  var unsubscribe = unsubscribers[itemUniqueId];

  if (unsubscribe) {
    unsubscribers[itemUniqueId] = null; // TODO: should be deleted later
    // delete unsubscribers[itemUniqueId]

    unsubscribe();
  }
}

function subscribeNext(object, subscribeValue, immediate, ruleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent, ruleDescription) {
  function subscribeLeafDefaultProperty(value, debugPropertyName, debugParent, ruleDescription) {
    return subscribeDefaultProperty(value, true, function (val) {
      return subscribeLeaf(val, debugPropertyName, debugParent, ruleDescription);
    }) || subscribeLeaf(value, debugPropertyName, debugParent, ruleDescription);
  }

  function setUnsubscribeLeaf(itemUniqueId, unsubscribeValue) {
    var unsubscribe = function unsubscribe() {
      // PROF: 371 - 0.8%
      if (unsubscribeValue) {
        leafUnsubscribers[itemUniqueId] = null; // TODO: should be deleted later
        // delete unsubscribers[itemUniqueId]

        var _unsubscribeValue = unsubscribeValue;
        unsubscribeValue = null;

        _unsubscribeValue();
      }
    };

    leafUnsubscribers[itemUniqueId] = unsubscribe;
    return unsubscribe;
  }

  function subscribeLeaf(value, debugPropertyName, debugParent, ruleDescription) {
    if (!(value instanceof Object)) {
      var _unsubscribeValue2 = checkIsFuncOrNull(subscribeValue(value, debugParent, debugPropertyName));

      if (_unsubscribeValue2) {
        _unsubscribeValue2();

        throw new Error("You should not return unsubscribe function for non Object value.\n" + "For subscribe value types use their object wrappers: Number, Boolean, String classes.\n" + "Unsubscribe function: ".concat(_unsubscribeValue2, "\nValue: ").concat(value, "\n") + "Value property path: ".concat((propertiesPath ? propertiesPath() + '.' : '') + (debugPropertyName == null ? '' : debugPropertyName + '(' + ruleDescription + ')')));
      }

      return null;
    }

    var itemUniqueId = getObjectUniqueId(value);
    var unsubscribe = leafUnsubscribers[itemUniqueId];

    if (unsubscribe) {
      return unsubscribe;
    }

    var unsubscribeValue = checkIsFuncOrNull(subscribeValue(value, debugParent, debugPropertyName));

    if (unsubscribeValue) {
      return setUnsubscribeLeaf(itemUniqueId, unsubscribeValue);
    }
  }

  var unsubscribers;
  var iteration;

  if (!ruleIterator || (iteration = ruleIterator.next()).done) {
    var subscribeLeafFunc = hasDefaultProperty(object) ? subscribeLeafDefaultProperty : subscribeLeaf;
    return subscribeLeafFunc(object, debugPropertyName, object, ruleDescription);
  }

  return subscribeNextRule(ruleIterator, iteration, function (nextRuleIterator) {
    return deepSubscribeRuleIterator(object, subscribeValue, immediate, nextRuleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent);
  }, function (rule, getNextRuleIterator) {
    var deepSubscribeItem;

    if (getNextRuleIterator) {
      deepSubscribeItem = function deepSubscribeItem(item, debugPropertyName) {
        return deepSubscribeRuleIterator(item, subscribeValue, immediate, getNextRuleIterator(), leafUnsubscribers, function () {
          return (propertiesPath ? propertiesPath() + '.' : '') + (debugPropertyName == null ? '' : debugPropertyName + '(' + rule.description + ')');
        }, debugPropertyName, object);
      };
    } else {
      var deepSubscribeItemAsync = function deepSubscribeItemAsync(item, debugPropertyName) {
        return deepSubscribeAsync(item, subscribeValue, immediate, null, leafUnsubscribers, function () {
          return (propertiesPath ? propertiesPath() + '.' : '') + (debugPropertyName == null ? '' : debugPropertyName + '(' + rule.description + ')');
        }, debugPropertyName, object);
      };

      var catchHandlerLeaf = function catchHandlerLeaf(err, debugPropertyName) {
        catchHandler(err, function () {
          return (propertiesPath ? propertiesPath() + '.' : '') + (debugPropertyName == null ? '' : debugPropertyName + '(' + rule.description + ')');
        });
      };

      deepSubscribeItem = function deepSubscribeItem(item, debugPropertyName) {
        try {
          item = resolveAsync(item);

          if (isThenable(item)) {
            return deepSubscribeItemAsync(item, debugPropertyName);
          }

          var _subscribeLeafFunc = hasDefaultProperty(item) ? subscribeLeafDefaultProperty : subscribeLeaf;

          return _subscribeLeafFunc(item, debugPropertyName, object, rule.description);
        } catch (err) {
          catchHandlerLeaf(err, debugPropertyName);
          return null;
        }
      };
    }

    return checkIsFuncOrNull(rule.subscribe(object, immediate, function (item, debugPropertyName) {
      // PROF: 1212 - 2.6%
      var unsubscribe;
      var itemUniqueId;

      if (item instanceof Object) {
        if (!unsubscribers) {
          unsubscribers = rule.unsubscribers; // + '_' + (nextUnsubscribePropertyId++)
        }

        itemUniqueId = getObjectUniqueId(item);
        unsubscribe = unsubscribers[itemUniqueId];

        if (unsubscribe) {
          return;
        }
      }

      unsubscribe = checkIsFuncOrNull(deepSubscribeItem(item, debugPropertyName));

      if (unsubscribe) {
        if (item instanceof Object) {
          unsubscribers[itemUniqueId] = unsubscribe;
          return;
        }

        unsubscribe();
        throw new Error("You should not return unsubscribe function for non Object value.\n" + "For subscribe value types use their object wrappers: Number, Boolean, String classes.\n" + "Unsubscribe function: ".concat(unsubscribe, "\nValue: ").concat(item, "\n") + "Value property path: ".concat((propertiesPath ? propertiesPath() + '.' : '') + (debugPropertyName == null ? '' : debugPropertyName + '(' + rule.description + ')')));
      }
    }, function (item, debugPropertyName) {
      // PROF: 431 - 0.9%
      unsubscribeNested(item, unsubscribers);
    }));
  });
}

function deepSubscribeRuleIterator(object, subscribeValue, immediate, ruleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent) {
  // PROF: 1158 - 2.4%
  if (!immediate) {
    throw new Error('immediate == false is deprecated');
  }

  if (!leafUnsubscribers) {
    leafUnsubscribers = [];
  }

  try {
    object = resolveAsync(object);
    var subscribeNextFunc = isThenable(object) ? deepSubscribeAsync : subscribeNext;
    return subscribeNextFunc(object, subscribeValue, immediate, ruleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent);
  } catch (err) {
    catchHandler(err, propertiesPath);
    return null;
  }
}

export function deepSubscribeRule(object, subscribeValue, immediate, rule) {
  return toSingleCall(deepSubscribeRuleIterator(object, subscribeValue, immediate, iterateRule(rule)[Symbol.iterator]()));
}
export function deepSubscribe(object, subscribeValue, immediate, ruleBuilder) {
  return toSingleCall(deepSubscribeRule(object, subscribeValue, immediate, ruleBuilder(new RuleBuilder()).result));
}