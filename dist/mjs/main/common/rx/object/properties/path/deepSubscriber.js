import { resolveAsync, ThenableSync } from '../../../../async/ThenableSync';
import { ALWAYS_CHANGE_VALUE, getOrCreateCallState, subscribeCallState } from '../../../../rx/depend/core/CallState';
import { depend } from '../../../../rx/depend/core/depend';
import { CallStatusShort } from '../../../depend/core/contracts';
import { RuleBuilder } from './builder/RuleBuilder';
import { SubscribeObjectType } from './builder/rules-subscribe';
import { forEachRule } from './forEachRule';
import { resolveValueProperty } from './resolve';
const dependForEachRule = depend(function (rule, emitLastValue) {
  return resolveAsync(new ThenableSync((resolve, reject) => {
    let rejected = false;
    let lastValue;
    let asyncCount = 1;
    forEachRule(rule, this, value => {
      lastValue = value;
    }, null, null, null, (subRule, object, next) => {
      if (rejected) {
        return;
      }

      asyncCount++;
      resolveAsync(object, o => {
        if (rejected) {
          return;
        }

        subRule.subscribe(o, next);
        asyncCount--;

        if (asyncCount < 0) {
          throw new Error(`asyncCount == ${asyncCount}`);
        }

        if (asyncCount === 0) {
          resolve(lastValue);
        }
      }, err => {
        if (rejected) {
          return;
        }

        rejected = true;
        reject(err);
      }, null, subRule.subType === SubscribeObjectType.ValueProperty ? null : resolveValueProperty);
    });
    asyncCount--;

    if (asyncCount < 0) {
      throw new Error(`asyncCount == ${asyncCount}`);
    }

    if (!rejected && asyncCount === 0) {
      resolve(lastValue);
    }
  }), emitLastValue ? null : () => ALWAYS_CHANGE_VALUE, null, null, resolveValueProperty);
});
export function deepSubscriber({
  object,
  rule,
  build,
  subscriber,
  emitLastValue
}) {
  if (rule == null) {
    rule = build(new RuleBuilder({
      autoInsertValuePropertyDefault: false
    })).result();
  }

  return function subscribe(_object, _subscriber) {
    if (!_subscriber) {
      _subscriber = subscriber;
    }

    return subscribeCallState(getOrCreateCallState(dependForEachRule).call(_object || object, rule, emitLastValue), state => {
      if (state.statusShort === CallStatusShort.CalculatedError) {
        console.error(state.error);
      }

      _subscriber(state);
    });
  };
}