"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepSubscribeRule = deepSubscribeRule;
exports.deepSubscribe = deepSubscribe;

var _async = require("../../async/async");

var _ThenableSync = require("../../async/ThenableSync");

var _iterateRule = require("./iterate-rule");

var _RuleBuilder = require("./RuleBuilder");

var _objectUniqueId = require("../../lists/helpers/object-unique-id");

var _helpers = require("../../helpers/helpers");

var _rulesSubscribe = require("./rules-subscribe");

/* tslint:disable */
// const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0
function catchHandler(ex, propertiesPath) {
  if (ex.propertiesPath) {
    throw ex;
  }

  const propertiesPathStr = propertiesPath ? propertiesPath() : '';
  ex.propertiesPath = propertiesPathStr;
  ex.message += `\nObject property path: ${propertiesPathStr}`;
  throw ex;
}

function deepSubscribeAsync(object, subscribeValue, immediate, ruleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent) {
  let unsubscribe;
  (0, _ThenableSync.resolveAsync)(object, o => {
    if (!unsubscribe) {
      unsubscribe = subscribeNext(o, subscribeValue, immediate, ruleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent); // if (typeof unsubscribe !== 'function') {
      // 	throw new Error(`unsubscribe is not a function: ${unsubscribe}`)
      // }
    }

    return o;
  }, err => catchHandler(err, propertiesPath));
  return () => {
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

  const itemUniqueId = (0, _objectUniqueId.getObjectUniqueId)(value);
  const unsubscribe = unsubscribers[itemUniqueId];

  if (unsubscribe) {
    unsubscribers[itemUniqueId] = null; // TODO: should be deleted later
    // delete unsubscribers[itemUniqueId]

    unsubscribe();
  }
}

function subscribeNext(object, subscribeValue, immediate, ruleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent, ruleDescription) {
  function subscribeLeafDefaultProperty(value, debugPropertyName, debugParent, ruleDescription) {
    return (0, _rulesSubscribe.subscribeDefaultProperty)(value, true, val => subscribeLeaf(val, debugPropertyName, debugParent, ruleDescription)) || subscribeLeaf(value, debugPropertyName, debugParent, ruleDescription);
  }

  function setUnsubscribeLeaf(itemUniqueId, unsubscribeValue) {
    const unsubscribe = () => {
      // PROF: 371 - 0.8%
      if (unsubscribeValue) {
        leafUnsubscribers[itemUniqueId] = null; // TODO: should be deleted later
        // delete unsubscribers[itemUniqueId]

        const _unsubscribeValue = unsubscribeValue;
        unsubscribeValue = null;

        _unsubscribeValue();
      }
    };

    leafUnsubscribers[itemUniqueId] = unsubscribe;
    return unsubscribe;
  }

  function subscribeLeaf(value, debugPropertyName, debugParent, ruleDescription) {
    if (!(value instanceof Object)) {
      const unsubscribeValue = (0, _helpers.checkIsFuncOrNull)(subscribeValue(value, debugParent, debugPropertyName));

      if (unsubscribeValue) {
        unsubscribeValue();
        throw new Error(`You should not return unsubscribe function for non Object value.\n` + `For subscribe value types use their object wrappers: Number, Boolean, String classes.\n` + `Unsubscribe function: ${unsubscribeValue}\nValue: ${value}\n` + `Value property path: ${(propertiesPath ? propertiesPath() + '.' : '') + (debugPropertyName == null ? '' : debugPropertyName + '(' + ruleDescription + ')')}`);
      }

      return null;
    }

    const itemUniqueId = (0, _objectUniqueId.getObjectUniqueId)(value);
    let unsubscribe = leafUnsubscribers[itemUniqueId];

    if (unsubscribe) {
      return unsubscribe;
    }

    let unsubscribeValue = (0, _helpers.checkIsFuncOrNull)(subscribeValue(value, debugParent, debugPropertyName));

    if (unsubscribeValue) {
      return setUnsubscribeLeaf(itemUniqueId, unsubscribeValue);
    }
  }

  let unsubscribers;
  let iteration;

  if (!ruleIterator || (iteration = ruleIterator.next()).done) {
    const subscribeLeafFunc = (0, _rulesSubscribe.hasDefaultProperty)(object) ? subscribeLeafDefaultProperty : subscribeLeaf;
    return subscribeLeafFunc(object, debugPropertyName, object, ruleDescription);
  }

  return (0, _iterateRule.subscribeNextRule)(ruleIterator, iteration, nextRuleIterator => deepSubscribeRuleIterator(object, subscribeValue, immediate, nextRuleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent), (rule, getNextRuleIterator) => {
    let deepSubscribeItem;

    if (getNextRuleIterator) {
      deepSubscribeItem = (item, debugPropertyName) => deepSubscribeRuleIterator(item, subscribeValue, immediate, getNextRuleIterator(), leafUnsubscribers, () => (propertiesPath ? propertiesPath() + '.' : '') + (debugPropertyName == null ? '' : debugPropertyName + '(' + rule.description + ')'), debugPropertyName, object);
    } else {
      const deepSubscribeItemAsync = (item, debugPropertyName) => {
        return deepSubscribeAsync(item, subscribeValue, immediate, null, leafUnsubscribers, () => (propertiesPath ? propertiesPath() + '.' : '') + (debugPropertyName == null ? '' : debugPropertyName + '(' + rule.description + ')'), debugPropertyName, object);
      };

      const catchHandlerLeaf = (err, debugPropertyName) => {
        catchHandler(err, () => (propertiesPath ? propertiesPath() + '.' : '') + (debugPropertyName == null ? '' : debugPropertyName + '(' + rule.description + ')'));
      };

      deepSubscribeItem = (item, debugPropertyName) => {
        try {
          item = (0, _ThenableSync.resolveAsync)(item);

          if ((0, _async.isThenable)(item)) {
            return deepSubscribeItemAsync(item, debugPropertyName);
          }

          const subscribeLeafFunc = (0, _rulesSubscribe.hasDefaultProperty)(item) ? subscribeLeafDefaultProperty : subscribeLeaf;
          return subscribeLeafFunc(item, debugPropertyName, object, rule.description);
        } catch (err) {
          catchHandlerLeaf(err, debugPropertyName);
          return null;
        }
      };
    }

    return (0, _helpers.checkIsFuncOrNull)(rule.subscribe(object, immediate, (item, debugPropertyName) => {
      // PROF: 1212 - 2.6%
      let unsubscribe;
      let itemUniqueId;

      if (item instanceof Object) {
        if (!unsubscribers) {
          unsubscribers = rule.unsubscribers; // + '_' + (nextUnsubscribePropertyId++)
        }

        itemUniqueId = (0, _objectUniqueId.getObjectUniqueId)(item);
        unsubscribe = unsubscribers[itemUniqueId];

        if (unsubscribe) {
          return;
        }
      }

      unsubscribe = (0, _helpers.checkIsFuncOrNull)(deepSubscribeItem(item, debugPropertyName));

      if (unsubscribe) {
        if (item instanceof Object) {
          unsubscribers[itemUniqueId] = unsubscribe;
          return;
        }

        unsubscribe();
        throw new Error(`You should not return unsubscribe function for non Object value.\n` + `For subscribe value types use their object wrappers: Number, Boolean, String classes.\n` + `Unsubscribe function: ${unsubscribe}\nValue: ${item}\n` + `Value property path: ${(propertiesPath ? propertiesPath() + '.' : '') + (debugPropertyName == null ? '' : debugPropertyName + '(' + rule.description + ')')}`);
      }
    }, (item, debugPropertyName) => {
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
    object = (0, _ThenableSync.resolveAsync)(object);
    const subscribeNextFunc = (0, _async.isThenable)(object) ? deepSubscribeAsync : subscribeNext;
    return subscribeNextFunc(object, subscribeValue, immediate, ruleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent);
  } catch (err) {
    catchHandler(err, propertiesPath);
    return null;
  }
}

function deepSubscribeRule(object, subscribeValue, immediate, rule) {
  return (0, _helpers.toSingleCall)(deepSubscribeRuleIterator(object, subscribeValue, immediate, (0, _iterateRule.iterateRule)(rule)[Symbol.iterator]()));
}

function deepSubscribe(object, subscribeValue, immediate, ruleBuilder) {
  return (0, _helpers.toSingleCall)(deepSubscribeRule(object, subscribeValue, immediate, ruleBuilder(new _RuleBuilder.RuleBuilder()).result));
}