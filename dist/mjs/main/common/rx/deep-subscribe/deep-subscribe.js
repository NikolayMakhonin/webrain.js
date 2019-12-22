/* tslint:disable:no-shadowed-variable no-array-delete*/
import { isThenable } from '../../async/async';
import { resolveAsync } from '../../async/ThenableSync';
import { checkIsFuncOrNull, toSingleCall } from '../../helpers/helpers';
import { getObjectUniqueId } from '../../helpers/object-unique-id';
import { Debugger } from '../Debugger';
import { ValueChangeType } from './contracts/common';
import { RuleType } from './contracts/rules';
import { PropertiesPath } from './helpers/PropertiesPath';
import { iterateRule, subscribeNextRule } from './iterate-rule';
import { ObjectSubscriber } from './ObjectSubscriber';
import { RuleBuilder } from './RuleBuilder'; // const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0

function getRuleType(iteration) {
  return iteration && (iteration.done ? null : Array.isArray(iteration.value) ? iteration.value.length ? iteration.value[0].type : null : iteration.value.type);
}

function catchHandler(ex, propertiesPath) {
  if (ex.propertiesPath) {
    throw ex;
  }

  const propertiesPathStr = propertiesPath + '';
  ex.propertiesPath = propertiesPathStr;
  ex.message += `\nObject property path: ${propertiesPathStr}`;
  throw ex;
}

function subscribeNext(object, valueSubscriber, immediate, ruleIterator, propertiesPath, objectKey, objectKeyType, parent, rule, iteration) {
  if (!iteration && ruleIterator) {
    iteration = ruleIterator.next(); // if (isIterator(iteration.value)) {
    // 	throw new Error('deepSubscribe internal error: iteration.value is iterator')
    // }
  }

  const isLeaf = !iteration || iteration.done;

  if (!isLeaf && iteration.value.type === RuleType.Never) {
    return null;
  } // region resolve value


  {
    // tslint:disable-next-line
    object = resolveAsync(object);

    if (isThenable(object)) {
      let unsubscribe;
      resolveAsync(object, o => {
        if (!unsubscribe) {
          unsubscribe = checkIsFuncOrNull(subscribeNext(o, valueSubscriber, immediate, ruleIterator, propertiesPath, objectKey, objectKeyType, parent, rule, iteration));
        }

        return o;
      }, err => {
        catchHandler(err, propertiesPath);
      });
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }

        unsubscribe = true;
      };
    }
  } // endregion

  let unsubscribers;
  let unsubscribersCount;

  if (isLeaf) {
    return valueSubscriber.change(objectKey, void 0, object, parent, ValueChangeType.Subscribe, objectKeyType, propertiesPath, rule);
  }

  function subscribeNode(rule, getNextRuleIterable) {
    const catchHandlerItem = (err, value, key, keyType) => {
      catchHandler(err, new PropertiesPath(value, propertiesPath, key, keyType, rule));
    };

    const changeNext = (key, oldItem, newItem, changeType, keyType, parent, newPropertiesPath, iterator, iteration) => {
      if ((changeType & ValueChangeType.Unsubscribe) !== 0 && oldItem instanceof Object && unsubscribers) {
        const itemUniqueId = getObjectUniqueId(oldItem);
        const unsubscribeCount = unsubscribersCount[itemUniqueId];

        if (unsubscribeCount) {
          if (unsubscribeCount > 1) {
            unsubscribersCount[itemUniqueId] = unsubscribeCount - 1;
          } else {
            const unsubscribe = unsubscribers[itemUniqueId]; // unsubscribers[itemUniqueId] = null // faster but there is a danger of memory overflow with nulls

            delete unsubscribers[itemUniqueId];
            delete unsubscribersCount[itemUniqueId];

            if (Array.isArray(unsubscribe)) {
              for (let i = 0, len = unsubscribe.length; i < len; i++) {
                unsubscribe[i]();
              }
            } else {
              unsubscribe();
            }
          }
        }
      }

      if ((changeType & ValueChangeType.Subscribe) !== 0) {
        let unsubscribe;
        let itemUniqueId;

        if (newItem instanceof Object) {
          if (!unsubscribers) {
            unsubscribers = rule.unsubscribers; // + '_' + (nextUnsubscribePropertyId++)

            unsubscribersCount = rule.unsubscribersCount;
          }

          itemUniqueId = getObjectUniqueId(newItem);
          unsubscribe = unsubscribers[itemUniqueId];
        }

        if (unsubscribe) {
          unsubscribersCount[itemUniqueId]++;
        } else {
          unsubscribe = checkIsFuncOrNull(subscribeNext(newItem, valueSubscriber, immediate, iterator, newPropertiesPath, key, keyType, parent, rule, iteration));

          if (unsubscribe) {
            if (!(newItem instanceof Object)) {
              unsubscribe();
              throw new Error('You should not return unsubscribe function for non Object value.\n' + 'For subscribe value types use their object wrappers: Number, Boolean, String classes.\n' + `Unsubscribe function: ${unsubscribe}\nValue: ${newItem}\n` + `Value property path: ${new PropertiesPath(newItem, propertiesPath, key, keyType, rule)}`);
            } else {
              const chainUnsubscribe = unsubscribers[itemUniqueId];

              if (!chainUnsubscribe) {
                unsubscribers[itemUniqueId] = unsubscribe;
                unsubscribersCount[itemUniqueId] = 1;
              } else {
                if (Array.isArray(chainUnsubscribe)) {
                  chainUnsubscribe.push(unsubscribe);
                } else {
                  unsubscribers[itemUniqueId] = [chainUnsubscribe, unsubscribe];
                  unsubscribersCount[itemUniqueId] = 1;
                }
              }
            }
          }
        }
      }
    };

    const changeLeaf = (key, oldItem, newItem, changeType, keyType, parent, newPropertiesPath) => {
      checkIsFuncOrNull(valueSubscriber.change(key, oldItem, newItem, parent, changeType, keyType, newPropertiesPath, rule));
    };

    const changeItem = (key, oldItem, newItem, changeType, keyType) => {
      let debugOldIsLeaf;
      let oldIsLeaf;

      if ((changeType & ValueChangeType.Unsubscribe) !== 0) {
        const oldItemIterator = getNextRuleIterable && getNextRuleIterable(oldItem)[Symbol.iterator]();
        const oldItemIteration = oldItemIterator && oldItemIterator.next();
        const nextRuleType = getRuleType(oldItemIteration);

        if (nextRuleType == null || nextRuleType !== RuleType.Never && typeof oldItem !== 'undefined') {
          debugOldIsLeaf = nextRuleType == null;
          oldIsLeaf = nextRuleType == null && !(oldItem instanceof Object);
        }
      }

      let debugNewIsLeaf;
      let newIsLeaf;
      let newItemIterator;
      let newItemIteration;

      if ((changeType & ValueChangeType.Subscribe) !== 0) {
        newItemIterator = getNextRuleIterable && getNextRuleIterable(newItem)[Symbol.iterator]();
        newItemIteration = newItemIterator && newItemIterator.next();
        const nextRuleType = getRuleType(newItemIteration);

        if (nextRuleType == null || nextRuleType !== RuleType.Never && typeof newItem !== 'undefined') {
          debugNewIsLeaf = nextRuleType == null;
          newIsLeaf = nextRuleType == null && !(newItem instanceof Object);
        }
      }

      let itemParent = object;

      if (keyType == null) {
        key = objectKey;
        itemParent = parent;
      }

      const newPropertiesPath = new PropertiesPath(newItem, propertiesPath, key, keyType, rule);
      Debugger.Instance.onDeepSubscribe(key, oldItem, newItem, itemParent, changeType, keyType, newPropertiesPath, rule, debugOldIsLeaf, debugNewIsLeaf, valueSubscriber.debugTarget);

      if (oldIsLeaf === newIsLeaf) {
        if (newIsLeaf != null) {
          if (newIsLeaf) {
            changeLeaf(key, oldItem, newItem, changeType, keyType, itemParent, newPropertiesPath);
          } else {
            changeNext(key, oldItem, newItem, changeType, keyType, itemParent, newPropertiesPath, newItemIterator, newItemIteration);
          }
        }
      } else {
        if (oldIsLeaf != null) {
          if (oldIsLeaf) {
            changeLeaf(key, oldItem, void 0, ValueChangeType.Unsubscribe, keyType, itemParent, newPropertiesPath);
          } else {
            changeNext(key, oldItem, void 0, ValueChangeType.Unsubscribe, keyType, itemParent, newPropertiesPath, newItemIterator, newItemIteration);
          }
        }

        if (newIsLeaf != null) {
          if (newIsLeaf) {
            changeLeaf(key, void 0, newItem, ValueChangeType.Subscribe, keyType, itemParent, newPropertiesPath);
          } else {
            changeNext(key, void 0, newItem, ValueChangeType.Subscribe, keyType, itemParent, newPropertiesPath, newItemIterator, newItemIteration);
          }
        }
      }
    };

    return checkIsFuncOrNull(rule.subscribe(object, immediate, (key, oldItem, newItem, changeType, keyType) => {
      oldItem = resolveAsync(oldItem);
      newItem = resolveAsync(newItem);

      if (!isThenable(oldItem) && !isThenable(newItem)) {
        try {
          changeItem(key, oldItem, newItem, changeType, keyType);
        } catch (err) {
          catchHandlerItem(err, newItem, key, keyType);
        }

        return;
      }

      resolveAsync(resolveAsync(oldItem, o => {
        oldItem = o;
        return newItem;
      }, null, true), o => {
        newItem = o;
        changeItem(key, oldItem, newItem, changeType, keyType);
      }, err => {
        catchHandlerItem(err, newItem, key, keyType);
      });
    }, propertiesPath, rule));
  }

  return subscribeNextRule(ruleIterator, iteration, nextRuleIterator => deepSubscribeRuleIterator(object, valueSubscriber, immediate, nextRuleIterator, propertiesPath, objectKey, parent), subscribeNode);
}

function deepSubscribeRuleIterator(object, valueSubscriber, immediate, ruleIterator, propertiesPath, objectKey, objectKeyType, parent) {
  if (!immediate) {
    throw new Error('immediate == false is deprecated');
  }

  try {
    return subscribeNext(object, valueSubscriber, immediate, ruleIterator, propertiesPath, objectKey, objectKeyType, parent);
  } catch (err) {
    catchHandler(err, propertiesPath);
    return null;
  }
}

export function deepSubscribeRule({
  object,
  changeValue,
  lastValue,
  debugTarget,
  immediate = true,
  rule
}) {
  return toSingleCall(deepSubscribeRuleIterator(object, new ObjectSubscriber(changeValue, lastValue, debugTarget), immediate, iterateRule(object, rule)[Symbol.iterator](), // @ts-ignore
  new PropertiesPath(object)));
}
export function deepSubscribe({
  object,
  changeValue,
  lastValue,
  debugTarget,
  immediate = true,
  ruleBuilder
}) {
  return toSingleCall(deepSubscribeRule({
    object,
    changeValue,
    lastValue,
    debugTarget,
    immediate,
    rule: ruleBuilder(new RuleBuilder()).result()
  }));
}