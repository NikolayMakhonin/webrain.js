import { isIterator } from '../helpers/helpers';
export function isThenable(value) {
  return value != null && typeof value.then === 'function';
}
export var ResolveResult;

(function (ResolveResult) {
  ResolveResult[ResolveResult["None"] = 0] = "None";
  ResolveResult[ResolveResult["Immediate"] = 1] = "Immediate";
  ResolveResult[ResolveResult["Deferred"] = 2] = "Deferred";
  ResolveResult[ResolveResult["Error"] = 4] = "Error";
  ResolveResult[ResolveResult["ImmediateError"] = 5] = "ImmediateError";
  ResolveResult[ResolveResult["DeferredError"] = 6] = "DeferredError";
})(ResolveResult || (ResolveResult = {}));

export function resolveIterator(iterator, isError, onImmediate, onDeferred) {
  if (!isIterator(iterator)) {
    return ResolveResult.None;
  }

  function iterate(nextValue, isThrow, nextOnImmediate, nextOnDeferred) {
    var body = function body() {
      while (true) {
        var iteratorResult = void 0;

        if (isThrow) {
          isThrow = false;
          iteratorResult = iterator["throw"](nextValue);
        } else {
          iteratorResult = iterator.next(nextValue);
        }

        if (iteratorResult.done) {
          nextOnImmediate(iteratorResult.value, isError);
          return isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
        }

        var result = _resolveValue(iteratorResult.value, isError, function (o, nextIsError) {
          nextValue = o;
          isThrow = nextIsError;
        }, function (o, nextIsError) {
          iterate(o, nextIsError, nextOnDeferred, nextOnDeferred);
        });

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

  var result = isError ? ResolveResult.DeferredError : ResolveResult.Deferred;
  var deferred;
  (thenable.thenLast || thenable.then).call(thenable, function (value) {
    if (deferred) {
      onDeferred(value, isError);
    } else {
      result = isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
      onImmediate(value, isError);
    }
  }, function (err) {
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

function _resolveValue(value, isError, onImmediate, onDeferred) {
  var nextOnImmediate = function nextOnImmediate(o, nextIsError) {
    if (nextIsError) {
      isError = true;
    }

    value = o;
  };

  var nextOnDeferred = function nextOnDeferred(val, nextIsError) {
    _resolveValue(val, isError || nextIsError, onDeferred, onDeferred);
  };

  while (true) {
    {
      var result = resolveThenable(value, isError, nextOnImmediate, nextOnDeferred);

      if ((result & ResolveResult.Deferred) !== 0) {
        return result;
      }

      if ((result & ResolveResult.Immediate) !== 0) {
        continue;
      }
    }
    {
      var _result = resolveIterator(value, isError, nextOnImmediate, nextOnDeferred);

      if ((_result & ResolveResult.Deferred) !== 0) {
        return _result;
      }

      if ((_result & ResolveResult.Immediate) !== 0) {
        continue;
      }
    }
    onImmediate(value, isError);
    return isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
  }
}

export function resolveValue(value, onImmediate, onDeferred) {
  return _resolveValue(value, false, onImmediate, onDeferred);
}
export function resolveValueFunc(func, onImmediate, onDeferred) {
  try {
    return resolveValue(func(), onImmediate, onDeferred);
  } catch (err) {
    onImmediate(err, true);
    return ResolveResult.ImmediateError;
  }
}