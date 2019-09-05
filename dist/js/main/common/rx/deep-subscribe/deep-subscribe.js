"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.deepSubscribeRule = deepSubscribeRule;
exports.deepSubscribe = deepSubscribe;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

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

  var propertiesPathStr = propertiesPath ? propertiesPath() : '';
  ex.propertiesPath = propertiesPathStr;
  ex.message += "\nObject property path: ".concat(propertiesPathStr);
  throw ex;
}

function deepSubscribeAsync(object, subscribeValue, immediate, ruleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent) {
  var unsubscribe;
  (0, _ThenableSync.resolveAsync)(object, function (o) {
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

  var itemUniqueId = (0, _objectUniqueId.getObjectUniqueId)(value);
  var unsubscribe = unsubscribers[itemUniqueId];

  if (unsubscribe) {
    // unsubscribers[itemUniqueId] = null // faster but there is a danger of memory overflow with nulls
    delete unsubscribers[itemUniqueId];
    unsubscribe();
  }
}

function subscribeNext(object, subscribeValue, immediate, ruleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent, ruleDescription) {
  function subscribeLeafDefaultProperty(value, debugPropertyName, debugParent, ruleDescription) {
    return (0, _rulesSubscribe.subscribeDefaultProperty)(value, true, function (val) {
      return subscribeLeaf(val, debugPropertyName, debugParent, ruleDescription);
    }) || subscribeLeaf(value, debugPropertyName, debugParent, ruleDescription);
  }

  function setUnsubscribeLeaf(itemUniqueId, unsubscribeValue) {
    var unsubscribe = function unsubscribe() {
      // PROF: 371 - 0.8%
      if (unsubscribeValue) {
        // leafUnsubscribers[itemUniqueId] = null // faster but there is a danger of memory overflow with nulls
        delete leafUnsubscribers[itemUniqueId];
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
      var _unsubscribeValue2 = (0, _helpers.checkIsFuncOrNull)(subscribeValue(value, debugParent, debugPropertyName));

      if (_unsubscribeValue2) {
        var _context;

        _unsubscribeValue2();

        throw new Error("You should not return unsubscribe function for non Object value.\n" + "For subscribe value types use their object wrappers: Number, Boolean, String classes.\n" + (0, _concat.default)(_context = "Unsubscribe function: ".concat(_unsubscribeValue2, "\nValue: ")).call(_context, value, "\n") + "Value property path: ".concat((propertiesPath ? propertiesPath() + '.' : '') + (debugPropertyName == null ? '' : debugPropertyName + '(' + ruleDescription + ')')));
      }

      return null;
    }

    var itemUniqueId = (0, _objectUniqueId.getObjectUniqueId)(value);
    var unsubscribe = leafUnsubscribers[itemUniqueId];

    if (unsubscribe) {
      return unsubscribe;
    }

    var unsubscribeValue = (0, _helpers.checkIsFuncOrNull)(subscribeValue(value, debugParent, debugPropertyName));

    if (unsubscribeValue) {
      return setUnsubscribeLeaf(itemUniqueId, unsubscribeValue);
    }
  }

  var unsubscribers;
  var iteration;

  if (!ruleIterator || (iteration = ruleIterator.next()).done) {
    var subscribeLeafFunc = (0, _rulesSubscribe.hasDefaultProperty)(object) ? subscribeLeafDefaultProperty : subscribeLeaf;
    return subscribeLeafFunc(object, debugPropertyName, object, ruleDescription);
  }

  return (0, _iterateRule.subscribeNextRule)(ruleIterator, iteration, function (nextRuleIterator) {
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
          item = (0, _ThenableSync.resolveAsync)(item);

          if ((0, _async.isThenable)(item)) {
            return deepSubscribeItemAsync(item, debugPropertyName);
          }

          var _subscribeLeafFunc = (0, _rulesSubscribe.hasDefaultProperty)(item) ? subscribeLeafDefaultProperty : subscribeLeaf;

          return _subscribeLeafFunc(item, debugPropertyName, object, rule.description);
        } catch (err) {
          catchHandlerLeaf(err, debugPropertyName);
          return null;
        }
      };
    }

    return (0, _helpers.checkIsFuncOrNull)(rule.subscribe(object, immediate, function (item, debugPropertyName) {
      // PROF: 1212 - 2.6%
      var unsubscribe;
      var itemUniqueId;

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
        var _context2;

        if (item instanceof Object) {
          unsubscribers[itemUniqueId] = unsubscribe;
          return;
        }

        unsubscribe();
        throw new Error("You should not return unsubscribe function for non Object value.\n" + "For subscribe value types use their object wrappers: Number, Boolean, String classes.\n" + (0, _concat.default)(_context2 = "Unsubscribe function: ".concat(unsubscribe, "\nValue: ")).call(_context2, item, "\n") + "Value property path: ".concat((propertiesPath ? propertiesPath() + '.' : '') + (debugPropertyName == null ? '' : debugPropertyName + '(' + rule.description + ')')));
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
    object = (0, _ThenableSync.resolveAsync)(object);
    var subscribeNextFunc = (0, _async.isThenable)(object) ? deepSubscribeAsync : subscribeNext;
    return subscribeNextFunc(object, subscribeValue, immediate, ruleIterator, leafUnsubscribers, propertiesPath, debugPropertyName, debugParent);
  } catch (err) {
    catchHandler(err, propertiesPath);
    return null;
  }
}

function deepSubscribeRule(object, subscribeValue, immediate, rule) {
  return (0, _helpers.toSingleCall)(deepSubscribeRuleIterator(object, subscribeValue, immediate, (0, _getIterator2.default)((0, _iterateRule.iterateRule)(rule))));
}

function deepSubscribe(object, subscribeValue, immediate, ruleBuilder) {
  return (0, _helpers.toSingleCall)(deepSubscribeRule(object, subscribeValue, immediate, ruleBuilder(new _RuleBuilder.RuleBuilder()).result));
}