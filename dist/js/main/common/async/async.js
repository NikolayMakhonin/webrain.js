"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isThenable = isThenable;
exports.resolveIterator = resolveIterator;
exports.resolveThenable = resolveThenable;
exports.resolveValue = resolveValue;
exports.ResolveResult = void 0;

var _helpers = require("../helpers/helpers");

function isThenable(value) {
  return value != null && typeof value.then === 'function';
}

let ResolveResult;
exports.ResolveResult = ResolveResult;

(function (ResolveResult) {
  ResolveResult[ResolveResult["None"] = 0] = "None";
  ResolveResult[ResolveResult["ImmediateResolved"] = 1] = "ImmediateResolved";
  ResolveResult[ResolveResult["ImmediateRejected"] = 2] = "ImmediateRejected";
  ResolveResult[ResolveResult["Deferred"] = 3] = "Deferred";
})(ResolveResult || (exports.ResolveResult = ResolveResult = {}));

function resolveIterator(iterator, onImmediate, onDeferred, reject) {
  if (!(0, _helpers.isIterator)(iterator)) {
    return ResolveResult.None;
  }

  function iterate(nextValue, nextOnImmediate, nextOnDeferred) {
    while (true) {
      const iteratorResult = iterator.next(nextValue);

      if (iteratorResult.done) {
        nextOnImmediate(iteratorResult.value);
        return ResolveResult.ImmediateResolved;
      }

      switch (_resolveValue(iteratorResult.value, o => {
        nextValue = o;
      }, o => iterate(o, nextOnDeferred, nextOnDeferred), reject)) {
        case ResolveResult.Deferred:
          return ResolveResult.Deferred;

        case ResolveResult.ImmediateRejected:
          return ResolveResult.ImmediateRejected;
      }
    }
  }

  return iterate(void 0, onImmediate, onDeferred);
}

function resolveThenable(thenable, onImmediate, onDeferred, reject) {
  if (!isThenable(thenable)) {
    return ResolveResult.None;
  }

  let result = ResolveResult.Deferred;
  let immediate = true;
  (thenable.thenLast || thenable.then).call(thenable, value => {
    if (immediate) {
      result = ResolveResult.ImmediateResolved;
      onImmediate(value);
    } else {
      onDeferred(value);
    }
  }, err => {
    if (immediate) {
      result = ResolveResult.ImmediateRejected;
    }

    reject(err);
  });
  immediate = false;
  return result;
}

function _resolveValue(value, onImmediate, onDeferred, reject) {
  const nextOnImmediate = o => {
    value = o;
  };

  const nextOnDeferred = val => {
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

function resolveValue(value, onImmediate, onDeferred, reject) {
  try {
    return _resolveValue(value, onImmediate, onDeferred, reject);
  } catch (err) {
    const onResult = o => {
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