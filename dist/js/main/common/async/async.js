"use strict";

exports.__esModule = true;
exports.isThenable = isThenable;
exports.isAsync = isAsync;
exports.resolveValue = resolveValue;
exports.resolveValueFunc = resolveValueFunc;
exports.ResolveResult = void 0;

var _helpers = require("../helpers/helpers");

var _currentState = require("../rx/depend/core/current-state");

/* tslint:disable:no-circular-imports */
function isThenable(value) {
  return value != null && typeof value === 'object' && typeof value.then === 'function';
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
    var _onImmediate;

    var _onDeferred;

    try {
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

        if (_onImmediate == null) {
          _onImmediate = function _onImmediate(o, nextIsError) {
            nextValue = o;
            isThrow = nextIsError;
          };
        }

        if (_onDeferred == null) {
          _onDeferred = function _onDeferred(o, nextIsError) {
            iterate(o, nextIsError, nextOnDeferred, nextOnDeferred);
          };
        }

        var result = _resolveValue(iteratorResult.value, false, _onImmediate, _onDeferred, customResolveValue);

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

  var result = isError ? ResolveResult.DeferredError : ResolveResult.Deferred;
  var deferred;

  var _onfulfilled = function _onfulfilled(value) {
    if (deferred) {
      onDeferred(value, isError);
    } else {
      result = isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
      onImmediate(value, isError);
    }
  };

  var _onrejected = function _onrejected(err) {
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
  var prevCallState = (0, _currentState.getCurrentState)();

  if (callState == null) {
    callState = prevCallState;
  } else {
    (0, _currentState.setCurrentState)(callState);
  }

  try {
    var nextOnImmediate = function nextOnImmediate(o, nextIsError) {
      if (nextIsError) {
        isError = true;
      }

      value = o;
    };

    var nextOnDeferred = function nextOnDeferred(val, nextIsError) {
      _resolveValue(val, isError || nextIsError, onDeferred, onDeferred, customResolveValue, callState);
    };

    var iterations = 0;

    while (true) {
      iterations++;

      if (iterations > 1000) {
        throw new Error('_resolveAsync infinity loop');
      }

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

        if (!(0, _helpers.equals)(newValue, value)) {
          value = newValue;
          continue;
        }
      }

      onImmediate(value, isError);
      return isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
    }
  } finally {
    (0, _currentState.setCurrentState)(prevCallState);
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