"use strict";

exports.__esModule = true;
exports.isThenable = isThenable;
exports.isAsync = isAsync;
exports.resolveIterator = resolveIterator;
exports.resolveThenable = resolveThenable;
exports.resolveValue = resolveValue;
exports.resolveValueFunc = resolveValueFunc;
exports.ResolveResult = void 0;

var _helpers = require("../helpers/helpers");

function isThenable(value) {
  return value != null && typeof value.then === 'function';
}

function isAsync(value) {
  return isThenable(value) || (0, _helpers.isIterator)(value);
}

var ResolveResult;
exports.ResolveResult = ResolveResult;

(function (ResolveResult) {
  ResolveResult[ResolveResult["None"] = 0] = "None";
  ResolveResult[ResolveResult["Immediate"] = 1] = "Immediate";
  ResolveResult[ResolveResult["Deferred"] = 2] = "Deferred";
  ResolveResult[ResolveResult["Error"] = 4] = "Error";
  ResolveResult[ResolveResult["ImmediateError"] = 5] = "ImmediateError";
  ResolveResult[ResolveResult["DeferredError"] = 6] = "DeferredError";
})(ResolveResult || (exports.ResolveResult = ResolveResult = {}));

function resolveIterator(iterator, isError, onImmediate, onDeferred, customResolveValue) {
  if (!(0, _helpers.isIterator)(iterator)) {
    return ResolveResult.None;
  }

  function iterate(nextValue, isThrow, nextOnImmediate, nextOnDeferred) {
    var body = function body() {
      while (true) {
        var iteratorResult = void 0;

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

        var result = _resolveValue(iteratorResult.value, false, function (o, nextIsError) {
          nextValue = o;
          isThrow = nextIsError;
        }, function (o, nextIsError) {
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

function resolveThenable(thenable, isError, onImmediate, onDeferred) {
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

function _resolveValue(value, isError, onImmediate, onDeferred, customResolveValue) {
  var nextOnImmediate = function nextOnImmediate(o, nextIsError) {
    if (nextIsError) {
      isError = true;
    }

    value = o;
  };

  var nextOnDeferred = function nextOnDeferred(val, nextIsError) {
    _resolveValue(val, isError || nextIsError, onDeferred, onDeferred, customResolveValue);
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
      var _result = resolveIterator(value, isError, nextOnImmediate, nextOnDeferred, customResolveValue);

      if ((_result & ResolveResult.Deferred) !== 0) {
        return _result;
      }

      if ((_result & ResolveResult.Immediate) !== 0) {
        continue;
      }
    }

    if (value != null && customResolveValue != null) {
      var newValue = customResolveValue(value);

      if (newValue !== value) {
        value = newValue;
        continue;
      }
    }

    onImmediate(value, isError);
    return isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
  }
}

function resolveValue(value, onImmediate, onDeferred, customResolveValue) {
  return _resolveValue(value, false, onImmediate, onDeferred, customResolveValue);
}

function resolveValueFunc(func, onImmediate, onDeferred, customResolveValue) {
  try {
    return resolveValue(func(), onImmediate, onDeferred, customResolveValue);
  } catch (err) {
    onImmediate(err, true);
    return ResolveResult.ImmediateError;
  }
}