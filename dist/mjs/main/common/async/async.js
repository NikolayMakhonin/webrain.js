import { isIterator } from '../helpers/helpers';
export function isThenable(value) {
  return value != null && typeof value.then === 'function';
}
export var ResolveResult;

(function (ResolveResult) {
  ResolveResult[ResolveResult["None"] = 0] = "None";
  ResolveResult[ResolveResult["ImmediateResolved"] = 1] = "ImmediateResolved";
  ResolveResult[ResolveResult["ImmediateRejected"] = 2] = "ImmediateRejected";
  ResolveResult[ResolveResult["Deferred"] = 3] = "Deferred";
})(ResolveResult || (ResolveResult = {}));

export function resolveIterator(iterator, onImmediate, onDeferred, reject) {
  if (!isIterator(iterator)) {
    return ResolveResult.None;
  }

  function iterate(nextValue, nextOnImmediate, nextOnDeferred) {
    while (true) {
      var iteratorResult = iterator.next(nextValue);

      if (iteratorResult.done) {
        nextOnImmediate(iteratorResult.value);
        return ResolveResult.ImmediateResolved;
      }

      switch (_resolveValue(iteratorResult.value, function (o) {
        nextValue = o;
      }, function (o) {
        return iterate(o, nextOnDeferred, nextOnDeferred);
      }, reject)) {
        case ResolveResult.Deferred:
          return ResolveResult.Deferred;

        case ResolveResult.ImmediateRejected:
          return ResolveResult.ImmediateRejected;
      }
    }
  }

  return iterate(void 0, onImmediate, onDeferred);
}
export function resolveThenable(thenable, onImmediate, onDeferred, reject) {
  if (!isThenable(thenable)) {
    return ResolveResult.None;
  }

  var result = ResolveResult.Deferred;
  var immediate = true;
  (thenable.thenLast || thenable.then).call(thenable, function (value) {
    if (immediate) {
      result = ResolveResult.ImmediateResolved;
      onImmediate(value);
    } else {
      onDeferred(value);
    }
  }, function (err) {
    if (immediate) {
      result = ResolveResult.ImmediateRejected;
    }

    reject(err);
  });
  immediate = false;
  return result;
}

function _resolveValue(value, onImmediate, onDeferred, reject) {
  var nextOnImmediate = function nextOnImmediate(o) {
    value = o;
  };

  var nextOnDeferred = function nextOnDeferred(val) {
    _resolveValue(val, onDeferred, onDeferred, reject);
  };

  while (true) {
    switch (resolveThenable(value, nextOnImmediate, nextOnDeferred, reject)) {
      case ResolveResult.Deferred:
        return ResolveResult.Deferred;

      case ResolveResult.ImmediateRejected:
        return ResolveResult.ImmediateRejected;

      case ResolveResult.ImmediateResolved:
        continue;
    }

    switch (resolveIterator(value, nextOnImmediate, nextOnDeferred, reject)) {
      case ResolveResult.Deferred:
        return ResolveResult.Deferred;

      case ResolveResult.ImmediateRejected:
        return ResolveResult.ImmediateRejected;

      case ResolveResult.ImmediateResolved:
        continue;
    }

    onImmediate(value);
    return ResolveResult.ImmediateResolved;
  }
}

export function resolveValue(value, onImmediate, onDeferred, reject) {
  try {
    return _resolveValue(value, onImmediate, onDeferred, reject);
  } catch (err) {
    var onResult = function onResult(o) {
      try {
        reject(o);
      } catch (_unused) {
        throw o;
      }
    };

    if (_resolveValue(err, onResult, onResult, onResult) === ResolveResult.Deferred) {
      return ResolveResult.Deferred;
    }

    return ResolveResult.ImmediateRejected;
  }
}