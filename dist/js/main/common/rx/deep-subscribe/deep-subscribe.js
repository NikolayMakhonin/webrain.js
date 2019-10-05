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

var _common = require("./contracts/common");

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

function subscribeNext(object, valueSubscriber, immediate, ruleIterator, propertiesPath, propertyName, parent, ruleDescription, iteration) {
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
          unsubscribe = (0, _helpers.checkIsFuncOrNull)(subscribeNext(o, valueSubscriber, immediate, ruleIterator, propertiesPath, propertyName, parent, ruleDescription, iteration));
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
    }
  } // endregion

  var unsubscribers;
  var unsubscribersCount;

  if (isLeaf) {
    return valueSubscriber.change(propertyName, void 0, object, parent, _common.ValueChangeType.Subscribe, null, propertiesPath, ruleDescription);
  }

  function subscribeNode(rule, getNextRuleIterable) {
    var catchHandlerItem = function catchHandlerItem(err, propertyName) {
      catchHandler(err, function () {
        return (propertiesPath ? propertiesPath() + '.' : '') + (propertyName == null ? '' : propertyName + '(' + rule.description + ')');
      });
    };

    var changeNext = function changeNext(key, oldItem, newItem, changeType, keyType, parent, iterator, iteration) {
      if ((changeType & _common.ValueChangeType.Unsubscribe) !== 0 && oldItem instanceof Object && unsubscribers) {
        var itemUniqueId = (0, _objectUniqueId.getObjectUniqueId)(oldItem);
        var unsubscribeCount = unsubscribersCount[itemUniqueId];

        if (unsubscribeCount) {
          if (unsubscribeCount > 1) {
            unsubscribersCount[itemUniqueId] = unsubscribeCount - 1;
          } else {
            var _unsubscribe = unsubscribers[itemUniqueId]; // unsubscribers[itemUniqueId] = null // faster but there is a danger of memory overflow with nulls

            delete unsubscribers[itemUniqueId];
            delete unsubscribersCount[itemUniqueId];

            if ((0, _isArray.default)(_unsubscribe)) {
              for (var i = 0, len = _unsubscribe.length; i < len; i++) {
                _unsubscribe[i]();
              }
            } else {
              _unsubscribe();
            }
          }
        }
      }

      if ((changeType & _common.ValueChangeType.Subscribe) !== 0) {
        var _unsubscribe2;

        var _itemUniqueId;

        if (newItem instanceof Object) {
          if (!unsubscribers) {
            unsubscribers = rule.unsubscribers; // + '_' + (nextUnsubscribePropertyId++)

            unsubscribersCount = rule.unsubscribersCount;
          }

          _itemUniqueId = (0, _objectUniqueId.getObjectUniqueId)(newItem);
          _unsubscribe2 = unsubscribers[_itemUniqueId];
        }

        if (_unsubscribe2) {
          unsubscribersCount[_itemUniqueId]++;
        } else {
          _unsubscribe2 = (0, _helpers.checkIsFuncOrNull)(subscribeNext(newItem, valueSubscriber, immediate, iterator, function () {
            return (propertiesPath ? propertiesPath() + '.' : '') + (key + '(' + rule.description + ')');
          }, key, parent, rule.description, iteration));

          if (_unsubscribe2) {
            if (!(newItem instanceof Object)) {
              _unsubscribe2();

              throw new Error('You should not return unsubscribe function for non Object value.\n' + 'For subscribe value types use their object wrappers: Number, Boolean, String classes.\n' + ("Unsubscribe function: " + _unsubscribe2 + "\nValue: " + newItem + "\n") + ("Value property path: " + ((propertiesPath ? propertiesPath() + '.' : '') + (key + '(' + rule.description + ')'))));
            } else {
              var chainUnsubscribe = unsubscribers[_itemUniqueId];

              if (!chainUnsubscribe) {
                unsubscribers[_itemUniqueId] = _unsubscribe2;
                unsubscribersCount[_itemUniqueId] = 1;
              } else {
                if ((0, _isArray.default)(chainUnsubscribe)) {
                  chainUnsubscribe.push(_unsubscribe2);
                } else {
                  unsubscribers[_itemUniqueId] = [chainUnsubscribe, _unsubscribe2];
                  unsubscribersCount[_itemUniqueId] = 1;
                }
              }
            }
          }
        }
      }
    };

    var changeLeaf = function changeLeaf(key, oldItem, newItem, changeType, keyType, parent) {
      (0, _helpers.checkIsFuncOrNull)(valueSubscriber.change(key, oldItem, newItem, parent, changeType, keyType, function () {
        return (propertiesPath ? propertiesPath() + '.' : '') + (propertyName == null ? '' : propertyName + '(' + rule.description + ')');
      }, rule.description));
    };

    var changeItem = function changeItem(key, oldItem, newItem, changeType, keyType) {
      var oldIsLeaf;

      if ((changeType & _common.ValueChangeType.Unsubscribe) !== 0) {
        var oldItemIterator = getNextRuleIterable && (0, _getIterator2.default)(getNextRuleIterable(oldItem));
        var oldItemIteration = oldItemIterator && oldItemIterator.next();

        var _isLeaf = !oldItemIteration || oldItemIteration.done;

        if (_isLeaf || oldItemIteration.value.type !== _rules.RuleType.Never && typeof oldItem !== 'undefined') {
          oldIsLeaf = _isLeaf && !(oldItem instanceof Object);
        }
      }

      var newIsLeaf;
      var newItemIterator;
      var newItemIteration;

      if ((changeType & _common.ValueChangeType.Subscribe) !== 0) {
        newItemIterator = getNextRuleIterable && (0, _getIterator2.default)(getNextRuleIterable(newItem));
        newItemIteration = newItemIterator && newItemIterator.next();

        var _isLeaf2 = !newItemIteration || newItemIteration.done;

        if (_isLeaf2 || newItemIteration.value.type !== _rules.RuleType.Never && typeof newItem !== 'undefined') {
          newIsLeaf = _isLeaf2 && !(newItem instanceof Object);
        }
      }

      var itemParent = object;

      if (keyType == null) {
        key = propertyName;
        itemParent = parent;
      }

      if (oldIsLeaf === newIsLeaf) {
        if (newIsLeaf != null) {
          if (newIsLeaf) {
            changeLeaf(key, oldItem, newItem, changeType, keyType, itemParent);
          } else {
            changeNext(key, oldItem, newItem, changeType, keyType, itemParent, newItemIterator, newItemIteration);
          }
        }
      } else {
        if (oldIsLeaf != null) {
          if (oldIsLeaf) {
            changeLeaf(key, oldItem, void 0, _common.ValueChangeType.Unsubscribe, keyType, itemParent);
          } else {
            changeNext(key, oldItem, void 0, _common.ValueChangeType.Unsubscribe, keyType, itemParent, newItemIterator, newItemIteration);
          }
        }

        if (newIsLeaf != null) {
          if (newIsLeaf) {
            changeLeaf(key, void 0, newItem, _common.ValueChangeType.Subscribe, keyType, itemParent);
          } else {
            changeNext(key, void 0, newItem, _common.ValueChangeType.Subscribe, keyType, itemParent, newItemIterator, newItemIteration);
          }
        }
      }
    };

    return (0, _helpers.checkIsFuncOrNull)(rule.subscribe(object, immediate, function (key, oldItem, newItem, changeType, keyType) {
      oldItem = (0, _ThenableSync.resolveAsync)(oldItem);
      newItem = (0, _ThenableSync.resolveAsync)(newItem);

      if (!(0, _async.isThenable)(oldItem) && !(0, _async.isThenable)(newItem)) {
        try {
          changeItem(key, oldItem, newItem, changeType, keyType);
        } catch (err) {
          catchHandlerItem(err, key);
        }

        return;
      }

      (0, _ThenableSync.resolveAsync)((0, _ThenableSync.resolveAsync)(oldItem, function (o) {
        oldItem = o;
        return newItem;
      }, null, true), function (o) {
        newItem = o;
        changeItem(key, oldItem, newItem, changeType, keyType);
      }, function (err) {
        catchHandlerItem(err, key);
      });
    }));
  }

  return (0, _iterateRule.subscribeNextRule)(ruleIterator, iteration, function (nextRuleIterator) {
    return deepSubscribeRuleIterator(object, valueSubscriber, immediate, nextRuleIterator, propertiesPath, propertyName, parent);
  }, subscribeNode);
}

function deepSubscribeRuleIterator(object, valueSubscriber, immediate, ruleIterator, propertiesPath, propertyName, parent) {
  if (!immediate) {
    throw new Error('immediate == false is deprecated');
  }

  try {
    return subscribeNext(object, valueSubscriber, immediate, ruleIterator, propertiesPath, propertyName, parent);
  } catch (err) {
    catchHandler(err, propertiesPath);
    return null;
  }
}

function deepSubscribeRule(_ref) {
  var object = _ref.object,
      changeValue = _ref.changeValue,
      lastValue = _ref.lastValue,
      _ref$immediate = _ref.immediate,
      immediate = _ref$immediate === void 0 ? true : _ref$immediate,
      rule = _ref.rule;
  return (0, _helpers.toSingleCall)(deepSubscribeRuleIterator(object, new _ObjectSubscriber.ObjectSubscriber(changeValue, lastValue), immediate, (0, _getIterator2.default)((0, _iterateRule.iterateRule)(object, rule))));
}

function deepSubscribe(_ref2) {
  var object = _ref2.object,
      changeValue = _ref2.changeValue,
      lastValue = _ref2.lastValue,
      _ref2$immediate = _ref2.immediate,
      immediate = _ref2$immediate === void 0 ? true : _ref2$immediate,
      ruleBuilder = _ref2.ruleBuilder;
  return (0, _helpers.toSingleCall)(deepSubscribeRule({
    object: object,
    changeValue: changeValue,
    lastValue: lastValue,
    immediate: immediate,
    rule: ruleBuilder(new _RuleBuilder.RuleBuilder()).result()
  }));
}