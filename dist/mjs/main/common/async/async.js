import { isIterator } from '../helpers/helpers';
export function isThenable(value) {
  return value != null && typeof value.then === 'function';
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

export function resolveIterator(iterator, isError, onImmediate, onDeferred, customResolveValue) {
  if (!isIterator(iterator)) {
    return ResolveResult.None;
  }

  function iterate(nextValue, isThrow, nextOnImmediate, nextOnDeferred) {
    const body = () => {
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

        const result = _resolveValue(iteratorResult.value, isError, (o, nextIsError) => {
          nextValue = o;
          isThrow = nextIsError;
        }, (o, nextIsError) => {
          iterate(o, nextIsError, nextOnDeferred, nextOnDeferred);
        }, customResolveValue);

        if ((result & ResolveResult.Deferred) !== 0) {
          return result;
        }
      }
    };

    try {
      return body();
    } catch (err) {
      nextOnImmediate(err, true);
      return ResolveResult.ImmediateError;
    }
  }

  return iterate(void 0, false, onImmediate, onDeferred);
}
export function resolveThenable(thenable, isError, onImmediate, onDeferred) {
  if (!isThenable(thenable)) {
    return ResolveResult.None;
  }

  let result = isError ? ResolveResult.DeferredError : ResolveResult.Deferred;
  let deferred;
  (thenable.thenLast || thenable.then).call(thenable, value => {
    if (deferred) {
      onDeferred(value, isError);
    } else {
      result = isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
      onImmediate(value, isError);
    }
  }, err => {
    if (deferred) {
      onDeferred(err, true);
    } else {
      result = ResolveResult.ImmediateError;
      onImmediate(err, true);
    }
  });
  deferred = true;
  return result;
}

function _resolveValue(value, isError, onImmediate, onDeferred, customResolveValue) {
  const nextOnImmediate = (o, nextIsError) => {
    if (nextIsError) {
      isError = true;
    }

    value = o;
  };

  const nextOnDeferred = (val, nextIsError) => {
    _resolveValue(val, isError || nextIsError, onDeferred, onDeferred, customResolveValue);
  };

  while (true) {
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

      if (newValue !== value) {
        value = newValue;
        continue;
      }
    }

    onImmediate(value, isError);
    return isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
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