import { isThenable } from '../../../async/async';
import { ThenableSync } from '../../../async/ThenableSync';
import { DeferredCalc } from '../../deferred-calc/DeferredCalc';
import { makeDependentFunc } from './CallState';
import { InternalError } from './helpers'; // region makeDeferredFunc

class SimpleThenable {
  constructor() {
    this._subscribers = null;
    this._resolved = false;
  }

  then(done) {
    if (this._resolved) {
      done();
    } else {
      let {
        _subscribers
      } = this;

      if (_subscribers == null) {
        this._subscribers = _subscribers = [];
      }

      _subscribers.push(done);
    }

    return null;
  }

  resolve() {
    if (this._resolved) {
      throw new InternalError('Multiple call resolve()');
    }

    this._resolved = true;
    const {
      _subscribers
    } = this;

    if (_subscribers != null) {
      this._subscribers = null;

      for (let i = 0, len = _subscribers.length; i < len; i++) {
        _subscribers[i]();
      }
    }
  }

  reset() {
    this._resolved = false;
    const {
      _subscribers
    } = this;

    if (_subscribers != null && _subscribers.length > 0) {
      throw new InternalError('reset when it has subscribers');
    }
  }

}

export function _initDeferredCallState(state, funcCall, deferredOptions) {
  const options = {
    delayBeforeCalc: deferredOptions.delayBeforeCalc,
    minTimeBetweenCalc: deferredOptions.minTimeBetweenCalc,
    autoInvalidateInterval: deferredOptions.autoInvalidateInterval,
    timing: null
  };
  state.deferredOptions = options;
  const thenable = new SimpleThenable();

  const _deferredCalc = new DeferredCalc({
    shouldInvalidate() {
      state.invalidate();
    },

    calcCompletedCallback() {
      thenable.resolve();
    },

    options,
    dontImmediateInvalidate: true
  });

  state._deferredCalc = _deferredCalc;
  const iteratorResult = {
    value: thenable,
    done: false
  };
  let stage = 2;
  const iterator = {
    next: () => {
      switch (stage) {
        case 0:
          {
            stage = 1;
            thenable.reset();

            _deferredCalc.invalidate();

            iteratorResult.value = thenable;
            iteratorResult.done = false;
            return iteratorResult;
          }

        case 1:
          {
            stage = 2;
            const value = funcCall(state);

            if (isThenable(value) && !(value instanceof ThenableSync)) {
              state._internalError('You should use iterator or ThenableSync instead Promise for async functions');
            }

            iteratorResult.value = value;
            iteratorResult.done = true;
            return iteratorResult;
          }

        default:
          throw new InternalError('stage == ' + stage);
      }
    },
    [Symbol.iterator]: () => {
      if (stage !== 2) {
        throw new InternalError('stage == ' + stage);
      }

      stage = 0;
      return iterator;
    }
  };
  state.funcCall = iterator[Symbol.iterator];
}
/** Inner this as CallState */

export function makeDeferredFunc(func, funcCall, defaultOptions, initCallState) {
  return makeDependentFunc(func, null, state => {
    _initDeferredCallState(state, funcCall, defaultOptions);

    if (initCallState != null) {
      initCallState(state);
    }
  });
} // endregion
// region depend / dependX

export function _funcCall(state) {
  return state.callWithArgs(state._this, state.func);
}
/**
 * Inner this same as outer this
 * @param func
 * @param deferredOptions
 * @param canAlwaysRecalc sync, no deferred, without dependencies
 */

export function depend(func, deferredOptions, initCallState, canAlwaysRecalc) {
  if (canAlwaysRecalc && deferredOptions != null) {
    throw new InternalError('canAlwaysRecalc should not be deferred');
  }

  return deferredOptions == null ? makeDependentFunc(func, _funcCall, initCallState, canAlwaysRecalc) : makeDeferredFunc(func, _funcCall, deferredOptions, initCallState);
}
export function funcCallX(state) {
  return state.callWithArgs(state, state.func);
}
/**
 * Inner this as CallState
 * @param func
 * @param deferredOptions
 */

export function dependX(func, deferredOptions, initCallState) {
  return deferredOptions == null ? makeDependentFunc(func, funcCallX, initCallState, false) : makeDeferredFunc(func, funcCallX, deferredOptions, initCallState);
} // endregion
// region dependLazy
// export function dependLazy<
// 	TThis,
// 	TArgs extends any[],
// 	TResult,
// >(
// 	func: Func<
// 		TThis,
// 		TArgs,
// 		TResult
// 	>,
// ): Func<
// 	TThis,
// 	TArgs,
// 	TResult
// > {
// 	return function() {
// 		const state = getOrCreateCallState(func).apply(this, arguments)
// 		const value = state.getValue()
// 		if (!isThenable(value)) {
// 			return value
// 		}
//
// 		value
// 			.then(() => {
// 				state.
// 			})
// 	}
// }
// endregion