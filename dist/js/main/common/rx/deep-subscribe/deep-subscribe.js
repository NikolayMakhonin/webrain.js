"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.deepSubscribeRule = deepSubscribeRule;
exports.deepSubscribe = deepSubscribe;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _async = require("../../async/async");

var _ThenableSync = require("../../async/ThenableSync");

var _helpers = require("../../helpers/helpers");

var _objectUniqueId = require("../../helpers/object-unique-id");

var _rules = require("./contracts/rules");

var _iterateRule = require("./iterate-rule");

var _ObjectSubscriber = require("./ObjectSubscriber");

var _RuleBuilder = require("./RuleBuilder");

/* tslint:disable:no-shadowed-variable no-array-delete*/
function catchHandler(ex, propertiesPath) {
  if (ex.propertiesPath) {
    throw ex;
  }

  var propertiesPathStr = propertiesPath ? propertiesPath() : '';
  ex.propertiesPath = propertiesPathStr;
  ex.message += "\nObject property path: " + propertiesPathStr;
  throw ex;
}

function unsubscribeNested(value, unsubscribers, unsubscribersCount) {
  if (!(value instanceof Object)) {
    return;
  }

  if (!unsubscribers) {
    return;
  }

  var itemUniqueId = (0, _objectUniqueId.getObjectUniqueId)(value);
  var unsubscribeCount = unsubscribersCount[itemUniqueId];

  if (!unsubscribeCount) {
    return;
  }

  if (unsubscribeCount > 1) {
    unsubscribersCount[itemUniqueId] = unsubscribeCount - 1;
  } else {
    var unsubscribe = unsubscribers[itemUniqueId]; // unsubscribers[itemUniqueId] = null // faster but there is a danger of memory overflow with nulls

    delete unsubscribers[itemUniqueId];
    delete unsubscribersCount[itemUniqueId];

    if ((0, _isArray.default)(unsubscribe)) {
      for (var i = 0, len = unsubscribe.length; i < len; i++) {
        unsubscribe[i]();
      }
    } else {
      unsubscribe();
    }
  }
}

function subscribeNext(object, valueSubscriber, immediate, ruleIterator, leafUnsubscribers, leafUnsubscribersCount, propertiesPath, propertyName, parent, ruleDescription, iteration) {
  if (!iteration && ruleIterator) {
    iteration = ruleIterator.next();
  }

  var isLeaf = !iteration || iteration.done;

  if (!isLeaf && iteration.value.type === _rules.RuleType.Never) {
    return null;
  } // region resolve value


  {
    // tslint:disable-next-line
    object = (0, _ThenableSync.resolveAsync)(object);

    if ((0, _async.isThenable)(object)) {
      var unsubscribe;
      (0, _ThenableSync.resolveAsync)(object, function (o) {
        if (!unsubscribe) {
          unsubscribe = subscribeNext(o, valueSubscriber, immediate, ruleIterator, leafUnsubscribers, leafUnsubscribersCount, propertiesPath, propertyName, parent, ruleDescription, iteration); // if (typeof unsubscribe !== 'function') {
          // 	throw new Error(`unsubscribe is not a function: ${unsubscribe}`)
          // }
        }

        return o;
      }, function (err) {
        catchHandler(err, propertiesPath);
      });
      return function () {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }

        unsubscribe = true;
      };
    } // if (hasDefaultProperty(object as any)
    // 	&& (!iteration || iteration.value == null || iteration.value.subType !== SubscribeObjectType.ValueProperty)
    // ) {
    // 	const result = subscribeDefaultProperty<TValue>(
    // 		object as any,
    // 		true,
    // 		(item: TValue, nextPropertyName) => subscribeNext<TValue>(
    // 			item,
    // 			valueSubscriber,
    // 			immediate,
    // 			ruleIterator,
    // 			leafUnsubscribers,
    // 			leafUnsubscribersCount,
    // 			propertiesPath,
    // 			nextPropertyName != null ? nextPropertyName : propertyName,
    // 			nextPropertyName != null ? object : parent,
    // 			null,
    // 			iteration,
    // 		),
    // 	)
    // 	if (result) {
    // 		return result
    // 	}
    // }

  } // endregion

  function subscribeLeaf(value, propertyName, parent, ruleDescription, catchHandlerLeaf) {
    // @ts-ignore
    value = (0, _ThenableSync.resolveAsync)(value);

    if ((0, _async.isThenable)(value)) {
      var _unsubscribe;

      (0, _ThenableSync.resolveAsync)(value, function (o) {
        if (!_unsubscribe) {
          _unsubscribe = subscribeLeaf(o, propertyName, parent, ruleDescription, catchHandlerLeaf); // if (typeof unsubscribe !== 'function') {
          // 	throw new Error(`unsubscribe is not a function: ${unsubscribe}`)
          // }
        }

        return o;
      }, function (err) {
        catchHandlerLeaf(err, propertyName);
      }); // tslint:disable-next-line:no-identical-functions

      return function () {
        if (typeof _unsubscribe === 'function') {
          _unsubscribe();
        }

        _unsubscribe = true;
      };
    } // if (hasDefaultProperty(value as any)) {
    // 	const result = subscribeDefaultProperty<TValue>(
    // 		value as any,
    // 		true,
    // 		(item: TValue, nextPropertyName) =>
    // 			subscribeLeaf(
    // 				item,
    // 				nextPropertyName != null ? nextPropertyName : propertyName,
    // 				nextPropertyName != null ? value : parent,
    // 				null,
    // 				catchHandlerLeaf,
    // 			),
    // 	)
    // 	if (result) {
    // 		return result
    // 	}
    // }


    return valueSubscriber.subscribe(value, parent, propertyName, propertiesPath, ruleDescription);
  }

  var unsubscribers;
  var unsubscribersCount;

  if (isLeaf) {
    return subscribeLeaf(object, propertyName, parent, ruleDescription, function (err) {
      catchHandler(err, propertiesPath);
    });
  }

  function subscribeNode(rule, getNextRuleIterable) {
    var catchHandlerItem = function catchHandlerItem(err, propertyName) {
      catchHandler(err, function () {
        return (propertiesPath ? propertiesPath() + '.' : '') + (propertyName == null ? '' : propertyName + '(' + rule.description + ')');
      });
    };

    var deepSubscribeItemNext = function deepSubscribeItemNext(item, propertyName, parent, iterator, iteration) {
      try {
        return subscribeNext(item, valueSubscriber, immediate, iterator, leafUnsubscribers, leafUnsubscribersCount, function () {
          return (propertiesPath ? propertiesPath() + '.' : '') + (propertyName == null ? '' : propertyName + '(' + rule.description + ')');
        }, propertyName, parent, rule.description, iteration);
      } catch (err) {
        catchHandlerItem(err, propertyName);
        return null;
      }
    };

    var deepSubscribeItemLeaf = function deepSubscribeItemLeaf(item, propertyName, parent) {
      try {
        return subscribeLeaf(item, propertyName, parent, rule.description, catchHandlerItem);
      } catch (err) {
        catchHandlerItem(err, propertyName);
        return null;
      }
    };

    var deepSubscribeItem = function deepSubscribeItem(item, propertyName, parent, iterator, iteration) {
      if (!iteration || iteration.done) {
        return deepSubscribeItemLeaf(item, propertyName, parent);
      } else {
        return deepSubscribeItemNext(item, propertyName, parent, iterator, iteration);
      }
    };

    return (0, _helpers.checkIsFuncOrNull)(rule.subscribe(object, immediate, function (item, nextPropertyName) {
      var iterator = getNextRuleIterable && (0, _getIterator2.default)(getNextRuleIterable(item));
      var iteration = iterator && iterator.next();
      var isLeaf = !iteration || iteration.done;

      if (!isLeaf && iteration.value.type === _rules.RuleType.Never) {
        return;
      }

      if (!isLeaf && typeof item === 'undefined') {
        return;
      }

      var nextParent = object;

      if (nextPropertyName == null) {
        nextPropertyName = propertyName;
        nextParent = parent;
      }

      if (isLeaf && !(item instanceof Object)) {
        (0, _helpers.checkIsFuncOrNull)(deepSubscribeItem(item, nextPropertyName, nextParent, iterator, iteration));
        return;
      }

      var unsubscribe;
      var itemUniqueId;

      if (item instanceof Object) {
        if (!unsubscribers) {
          unsubscribers = rule.unsubscribers; // + '_' + (nextUnsubscribePropertyId++)

          unsubscribersCount = rule.unsubscribersCount;
        }

        itemUniqueId = (0, _objectUniqueId.getObjectUniqueId)(item);
        unsubscribe = unsubscribers[itemUniqueId];

        if (unsubscribe) {
          unsubscribersCount[itemUniqueId]++;
          return;
        }
      }

      unsubscribe = (0, _helpers.checkIsFuncOrNull)(deepSubscribeItem(item, nextPropertyName, nextParent, iterator, iteration));

      if (unsubscribe) {
        if (item instanceof Object) {
          var chainUnsubscribe = unsubscribers[itemUniqueId];

          if (chainUnsubscribe) {
            if ((0, _isArray.default)(chainUnsubscribe)) {
              chainUnsubscribe.push(unsubscribe);
              return;
            }

            unsubscribers[itemUniqueId] = [chainUnsubscribe, unsubscribe];
          } else {
            unsubscribers[itemUniqueId] = unsubscribe;
          }

          unsubscribersCount[itemUniqueId] = 1;
          return;
        }

        unsubscribe();
        throw new Error('You should not return unsubscribe function for non Object value.\n' + 'For subscribe value types use their object wrappers: Number, Boolean, String classes.\n' + ("Unsubscribe function: " + unsubscribe + "\nValue: " + item + "\n") + ("Value property path: " + ((propertiesPath ? propertiesPath() + '.' : '') + (nextPropertyName == null ? '' : nextPropertyName + '(' + rule.description + ')'))));
      }
    }, function (item, nextPropertyName) {
      var iterator = getNextRuleIterable && (0, _getIterator2.default)(getNextRuleIterable(item));
      var iteration = iterator && iterator.next();
      var isLeaf = !iteration || iteration.done;

      if (!isLeaf && iteration.value.type === _rules.RuleType.Never) {
        return;
      }

      if (!isLeaf && typeof item === 'undefined') {
        return;
      }

      if (isLeaf && !(item instanceof Object)) {
        var nextParent = object;

        if (nextPropertyName == null) {
          nextPropertyName = propertyName;
          nextParent = parent;
        }

        valueSubscriber.unsubscribe(item, nextParent, nextPropertyName);
      } else {
        unsubscribeNested(item, unsubscribers, unsubscribersCount);
      }
    }));
  }

  return (0, _iterateRule.subscribeNextRule)(ruleIterator, iteration, function (nextRuleIterator) {
    return deepSubscribeRuleIterator(object, valueSubscriber, immediate, nextRuleIterator, leafUnsubscribers, leafUnsubscribersCount, propertiesPath, propertyName, parent);
  }, subscribeNode);
}

function deepSubscribeRuleIterator(object, valueSubscriber, immediate, ruleIterator, leafUnsubscribers, leafUnsubscribersCount, propertiesPath, propertyName, parent) {
  if (!immediate) {
    throw new Error('immediate == false is deprecated');
  }

  if (!leafUnsubscribers) {
    leafUnsubscribers = [];
  }

  if (!leafUnsubscribersCount) {
    leafUnsubscribersCount = [];
  }

  try {
    return subscribeNext(object, valueSubscriber, immediate, ruleIterator, leafUnsubscribers, leafUnsubscribersCount, propertiesPath, propertyName, parent);
  } catch (err) {
    catchHandler(err, propertiesPath);
    return null;
  }
}

function deepSubscribeRule(_ref) {
  var object = _ref.object,
      subscribeValue = _ref.subscribeValue,
      unsubscribeValue = _ref.unsubscribeValue,
      lastValue = _ref.lastValue,
      _ref$immediate = _ref.immediate,
      immediate = _ref$immediate === void 0 ? true : _ref$immediate,
      rule = _ref.rule;
  return (0, _helpers.toSingleCall)(deepSubscribeRuleIterator(object, new _ObjectSubscriber.ObjectSubscriber(subscribeValue, unsubscribeValue, lastValue), immediate, (0, _getIterator2.default)((0, _iterateRule.iterateRule)(object, rule))));
}

function deepSubscribe(_ref2) {
  var object = _ref2.object,
      subscribeValue = _ref2.subscribeValue,
      unsubscribeValue = _ref2.unsubscribeValue,
      lastValue = _ref2.lastValue,
      _ref2$immediate = _ref2.immediate,
      immediate = _ref2$immediate === void 0 ? true : _ref2$immediate,
      ruleBuilder = _ref2.ruleBuilder;
  return (0, _helpers.toSingleCall)(deepSubscribeRule({
    object: object,
    subscribeValue: subscribeValue,
    unsubscribeValue: unsubscribeValue,
    lastValue: lastValue,
    immediate: immediate,
    rule: ruleBuilder(new _RuleBuilder.RuleBuilder()).result()
  }));
}