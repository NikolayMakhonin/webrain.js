/* tslint:disable:no-circular-imports */
import { equals, isIterator } from '../helpers/helpers';
import { getCurrentState, setCurrentState } from '../rx/depend/core/current-state';
export function isThenable(value) {
  return value != null && typeof value === 'object' && typeof value.then === 'function';
}
export function isAsync(value) {
  return isThenable(value) || isIterator(value);
}
export let ResolveResult;

(function (ResolveResult) {
  ResolveResult[ResolveResult["None"] = 0] = "None";
  ResolveResult[ResolveResult["Immediate"] = 1] = "Immediate";
  ResolveResult[ResolveResult["Deferred"] = 2] = "Deferred";
  ResolveResult[ResolveResult["Error"] = 4] = "Error";
  ResolveResult[ResolveResult["ImmediateError"] = 5] = "ImmediateError";
  ResolveResult[ResolveResult["DeferredError"] = 6] = "DeferredError";
})(ResolveResult || (ResolveResult = {}));

function resolveIterator(iterator, isError, onImmediate, onDeferred, customResolveValue) {
  if (!isIterator(iterator)) {
    return ResolveResult.None;
  }

  function iterate(nextValue, isThrow, nextOnImmediate, nextOnDeferred) {
    let _onImmediate;

    let _onDeferred;

    try {
      while (true) {
        let iteratorResult;

        if (isThrow) {
          isThrow = false;
          iteratorResult = iterator.throw(nextValue);
        } else {
          iteratorResult = iterator.next(nextValue);
        }

        if (iteratorResult.done) {
          nextOnImmediate(iteratorResult.value, isError);
          return isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
        }

        if (_onImmediate == null) {
          _onImmediate = (o, nextIsError) => {
            nextValue = o;
            isThrow = nextIsError;
          };
        }

        if (_onDeferred == null) {
          _onDeferred = (o, nextIsError) => {
            iterate(o, nextIsError, nextOnDeferred, nextOnDeferred);
          };
        }

        const result = _resolveValue(iteratorResult.value, false, _onImmediate, _onDeferred, customResolveValue);

        if ((result & ResolveResult.Deferred) !== 0) {
          return result;
        }
      }
    } catch (err) {
      nextOnImmediate(err, true);
      return ResolveResult.ImmediateError;
    }
  }

  return iterate(void 0, false, onImmediate, onDeferred);
}

function resolveThenable(thenable, isError, onImmediate, onDeferred) {
  if (!isThenable(thenable)) {
    return ResolveResult.None;
  }

  let result = isError ? ResolveResult.DeferredError : ResolveResult.Deferred;
  let deferred;

  const _onfulfilled = value => {
    if (deferred) {
      onDeferred(value, isError);
    } else {
      result = isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
      onImmediate(value, isError);
    }
  };

  const _onrejected = err => {
    if (deferred) {
      onDeferred(err, true);
    } else {
      result = ResolveResult.ImmediateError;
      onImmediate(err, true);
    }
  };

  if (thenable.thenLast != null) {
    thenable.thenLast(_onfulfilled, _onrejected);
  } else {
    thenable.then(_onfulfilled, _onrejected);
  }

  deferred = true;
  return result;
}

function _resolveValue(value, isError, onImmediate, onDeferred, customResolveValue, callState) {
  const prevCallState = getCurrentState();

  if (callState == null) {
    callState = prevCallState;
  } else {
    setCurrentState(callState);
  }

  try {
    const nextOnImmediate = (o, nextIsError) => {
      if (nextIsError) {
        isError = true;
      }

      value = o;
    };

    const nextOnDeferred = (val, nextIsError) => {
      _resolveValue(val, isError || nextIsError, onDeferred, onDeferred, customResolveValue, callState);
    };

    let iterations = 0;

    while (true) {
      iterations++;

      if (iterations > 1000) {
        throw new Error('_resolveAsync infinity loop');
      }

      {
        const result = resolveThenable(value, isError, nextOnImmediate, nextOnDeferred);

        if ((result & ResolveResult.Deferred) !== 0) {
          return result;
        }

        if ((result & ResolveResult.Immediate) !== 0) {
          continue;
        }
      }
      {
        const result = resolveIterator(value, isError, nextOnImmediate, nextOnDeferred, customResolveValue);

        if ((result & ResolveResult.Deferred) !== 0) {
          return result;
        }

        if ((result & ResolveResult.Immediate) !== 0) {
          continue;
        }
      }

      if (value != null && customResolveValue != null) {
        const newValue = customResolveValue(value);

        if (!equals(newValue, value)) {
          value = newValue;
          continue;
        }
      }

      onImmediate(value, isError);
      return isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
    }
  } finally {
    setCurrentState(prevCallState);
  }
}

export function resolveValue(value, onImmediate, onDeferred, customResolveValue) {
  return _resolveValue(value, false, onImmediate, onDeferred, customResolveValue);
}
export function resolveValueFunc(func, onImmediate, onDeferred, customResolveValue) {
  try {
    return resolveValue(func(), onImmediate, onDeferred, customResolveValue);
  } catch (err) {
    onImmediate(err, true);
    return ResolveResult.ImmediateError;
  }
}