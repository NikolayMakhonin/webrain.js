import { isThenable } from '../../async/async';
import { ThenableSync } from '../../async/ThenableSync';
import { webrainOptions } from '../../helpers/webrainOptions';
import { createConnector } from '../object/properties/helpers';
import { dependBindThis, getOrCreateCallState, subscribeCallState } from './core/CallState';
import { CallStatusShort } from './core/contracts';
import { dependX } from './core/depend';

function simpleCondition(value) {
  return value != null;
}

export function dependWait(func, condition, timeout, isLazy) {
  if (condition == null) {
    condition = simpleCondition;
  }

  if (timeout == null) {
    timeout = webrainOptions.timeouts.dependWait;
  }

  return dependX(function () {
    const state = this;
    const funcState = getOrCreateCallState(func).apply(state._this, arguments);
    const value = funcState.getValue(isLazy);

    if (!isThenable(value) && condition(value)) {
      return value;
    }

    return new ThenableSync((resolve, reject) => {
      let unsubscribe = funcState.subscribe(() => {
        if (unsubscribe == null) {
          return;
        }

        switch (funcState.statusShort) {
          case CallStatusShort.CalculatedValue:
            if (condition(funcState.value)) {
              unsubscribe();
              unsubscribe = null;
              resolve(funcState.value);
            }

            break;

          case CallStatusShort.CalculatedError:
            unsubscribe();
            unsubscribe = null;
            reject(funcState.error);
            break;

          case CallStatusShort.Invalidated:
            funcState.getValue(false, true);
            break;
        }
      });

      if (timeout != null && timeout > 0) {
        setTimeout(() => {
          if (unsubscribe == null) {
            return;
          }

          unsubscribe();
          unsubscribe = null;
          reject(new Error('Timeout error'));
        }, timeout);
      }
    });
  });
}
export function autoCalc(func, dontLogErrors) {
  return function () {
    return subscribeCallState(getOrCreateCallState(func).apply(this, arguments), dontLogErrors ? null : state => {
      if (state.statusShort === CallStatusShort.CalculatedError) {
        console.error(state.error);
      }
    });
  };
}
export function autoCalcConnect(object, connectorFactory, func, dontLogErrors) {
  return autoCalc(dependBindThis(createConnector(object, connectorFactory), func), dontLogErrors);
}
export function dependWrapThis(wrapThis, func) {
  return function (_this) {
    return dependBindThis(wrapThis(_this), func);
  };
}