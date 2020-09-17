import { getCurrentState, setCurrentState } from '../rx/depend/core/current-state';
import { isAsync, isThenable, ResolveResult, resolveValue, resolveValueFunc } from './async';
export let ThenableSyncStatus;

(function (ThenableSyncStatus) {
  ThenableSyncStatus["Resolving"] = "Resolving";
  ThenableSyncStatus["Resolved"] = "Resolved";
  ThenableSyncStatus["Rejected"] = "Rejected";
})(ThenableSyncStatus || (ThenableSyncStatus = {}));

export function createResolved(value, customResolveValue) {
  const thenable = new ThenableSync(null, customResolveValue);
  thenable.resolve(value);
  return thenable;
}
export function createRejected(error, customResolveValue) {
  const thenable = new ThenableSync(null, customResolveValue);
  thenable.reject(error);
  return thenable;
}
export class ThenableSync {
  constructor(executor, customResolveValue) {
    this._onfulfilled = null;
    this._onrejected = null;
    this._value = void 0;
    this._error = null;
    this._status = null;
    this._customResolveValue = customResolveValue;

    if (executor) {
      try {
        executor(this.resolve.bind(this), this.reject.bind(this));
      } catch (err) {
        this.reject(err);
      }
    }
  } // region resolve


  resolve(value) {
    if (this._status != null) {
      throw new Error(`Multiple call resolve/reject() is forbidden; status = ${this._status}`);
    }

    this._resolve(value);
  }

  _resolve(value) {
    const {
      _status
    } = this;

    if (_status != null && _status !== ThenableSyncStatus.Resolving) {
      throw new Error(`Multiple call resolve/reject() is forbidden; status = ${_status}`);
    }

    const result = resolveValue(value, (o, e) => {
      if (e) {
        this._reject(o);
      } else {
        this.__resolve(o);
      }
    }, (o, e) => {
      if (e) {
        this._reject(o);
      } else {
        this._resolve(o);
      }
    }, this._customResolveValue);

    if ((result & ResolveResult.Deferred) !== 0) {
      this._status = ThenableSyncStatus.Resolving;
      return;
    }

    if ((result & ResolveResult.Error) !== 0) {
      return;
    }
  }

  __resolve(value) {
    this._status = ThenableSyncStatus.Resolved;
    this._value = value;
    const {
      _onfulfilled
    } = this;

    if (_onfulfilled) {
      this._onfulfilled = void 0;
      this._onrejected = void 0;

      for (let i = 0, len = _onfulfilled.length; i < len; i++) {
        _onfulfilled[i](value);
      }
    }
  } // endregion
  // region reject


  reject(error) {
    if (this._status != null) {
      throw new Error(`Multiple call resolve/reject() is forbidden; status = ${this._status}`);
    }

    this._reject(error);
  }

  _reject(error) {
    const {
      _status
    } = this;

    if (_status != null && _status !== ThenableSyncStatus.Resolving) {
      throw new Error(`Multiple call resolve/reject() is forbidden; status = ${_status}`);
    }

    const result = resolveValue(error, o => {
      this.__reject(o);
    }, o => {
      this._reject(o);
    }, this._customResolveValue);

    if ((result & ResolveResult.Deferred) !== 0) {
      this._status = ThenableSyncStatus.Resolving;
      return;
    }
  }

  __reject(error) {
    this._status = ThenableSyncStatus.Rejected;
    this._error = error;
    const {
      _onrejected
    } = this;

    if (_onrejected) {
      this._onfulfilled = void 0;
      this._onrejected = void 0;

      for (let i = 0, len = _onrejected.length; i < len; i++) {
        _onrejected[i](error);
      }
    }
  } // endregion
  // region then


  _then(onfulfilled, onrejected, lastExpression, customResolveValue) {
    const reject = error => {
      if (!onrejected) {
        if (lastExpression) {
          throw error;
        }

        return ThenableSync.createRejected(error, customResolveValue);
      }

      let isError;

      try {
        error = onrejected(error);
      } catch (err) {
        isError = true;
        error = err;
      }

      const result = resolveAsync(error, null, null, !lastExpression, customResolveValue);

      if (isThenable(result)) {
        return isError ? result.then(o => createRejected(o, customResolveValue)) : result;
      }

      if (lastExpression) {
        if (!isError) {
          return result;
        }

        throw result;
      }

      return isError ? createRejected(result, customResolveValue) : createResolved(result, customResolveValue);
    };

    switch (this._status) {
      case ThenableSyncStatus.Resolved:
        {
          let {
            _value
          } = this;

          if (!onfulfilled) {
            return lastExpression ? _value : this;
          }

          let isError;

          try {
            _value = onfulfilled(_value);
          } catch (err) {
            isError = true;
            _value = err;
          }

          if (isError) {
            const result = resolveAsync(_value, null, null, !lastExpression, customResolveValue);

            if (isThenable(result)) {
              return result.then(reject, onrejected);
            }

            return reject(result);
          } else {
            const result = resolveAsync(_value, null, onrejected, !lastExpression, customResolveValue);
            return lastExpression || isThenable(result) ? result : createResolved(result, customResolveValue);
          }
        }

      case ThenableSyncStatus.Rejected:
        if (!onrejected && !lastExpression && (!customResolveValue || customResolveValue === this._customResolveValue)) {
          return this;
        }

        return reject(this._error);

      default:
        {
          if (!onfulfilled && !onrejected && (!customResolveValue || customResolveValue === this._customResolveValue)) {
            return this;
          }

          const result = new ThenableSync(null, customResolveValue);
          let {
            _onrejected
          } = this;

          if (!_onrejected) {
            this._onrejected = _onrejected = [];
          }

          const callState = getCurrentState();
          const rejected = onrejected ? value => {
            let isError;
            const prevState = getCurrentState();

            try {
              setCurrentState(callState);
              value = onrejected(value);
            } catch (err) {
              isError = true;
              value = err;
            } finally {
              setCurrentState(prevState);
            }

            if (isError) {
              result.reject(value);
            } else {
              result.resolve(value);
            }
          } : value => {
            result.reject(value);
          };

          _onrejected.push(rejected);

          let {
            _onfulfilled
          } = this;

          if (!_onfulfilled) {
            this._onfulfilled = _onfulfilled = [];
          }

          _onfulfilled.push(onfulfilled ? value => {
            let isError;
            const prevState = getCurrentState();

            try {
              setCurrentState(callState);
              value = onfulfilled(value);
            } catch (err) {
              isError = true;
              value = err;
            } finally {
              setCurrentState(prevState);
            }

            if (isError) {
              resolveValue(value, rejected, rejected, customResolveValue);
            } else {
              result.resolve(value);
            }
          } : value => {
            result.resolve(value);
          });

          return result;
        }
    }
  }

  then(onfulfilled, onrejected, customResolveValue) {
    return this._then(onfulfilled, onrejected, false, customResolveValue === false ? null : customResolveValue || this._customResolveValue);
  }

  thenLast(onfulfilled, onrejected, customResolveValue) {
    return this._then(onfulfilled, onrejected, true, customResolveValue === false ? null : customResolveValue || this._customResolveValue);
  } // endregion
  // region static helpers
  // endregion


}
ThenableSync.createResolved = createResolved;
ThenableSync.createRejected = createRejected;
ThenableSync.isThenable = isThenable;
ThenableSync.resolve = resolveAsync;
export function resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue) {
  // Optimization
  if (!onfulfilled && !isAsync(input)) {
    if (input != null && customResolveValue) {
      const newInput = customResolveValue(input);

      if (input === newInput) {
        return input;
      }

      input = newInput;
    } else {
      return input;
    }
  }

  return _resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue);
}

function _resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue) {
  let result;
  let isError;

  let onResult = (o, e) => {
    result = o;
    isError = e;
  };

  let thenable;

  const createThenable = () => {
    if (!thenable) {
      thenable = new ThenableSync((resolve, reject) => {
        onResult = (o, e) => {
          if (e) {
            reject(o);
          } else {
            resolve(o);
          }
        };
      }, customResolveValue);
    }

    return thenable;
  };

  const resolveOnResult = (o, e) => {
    const handler = e ? onrejected : onfulfilled;

    if (handler) {
      if ((resolveValueFunc(() => handler(o), (o2, e2) => {
        onResult(o2, e2);
      }, (o2, e2) => {
        onResult(o2, e2);
      }, customResolveValue) & ResolveResult.Deferred) !== 0) {
        result = createThenable();
      }
    } else {
      onResult(o, e);
    }
  };

  if ((resolveValue(input, resolveOnResult, resolveOnResult, customResolveValue) & ResolveResult.Deferred) !== 0) {
    return createThenable();
  }

  if (isError) {
    if (dontThrowOnImmediateError) {
      return ThenableSync.createRejected(result, customResolveValue);
    }

    throw result;
  }

  return result;
}

export function resolveAsyncFunc(func, onfulfilled, onrejected, dontThrowOnImmediateReject, customResolveValue) {
  try {
    return resolveAsync(func(), onfulfilled, onrejected, dontThrowOnImmediateReject, customResolveValue);
  } catch (err) {
    return resolveAsync(err, onrejected, onrejected, dontThrowOnImmediateReject, customResolveValue);
  }
}

function* _resolveAsyncAll(inputPrepared) {
  const len = inputPrepared.length;

  for (let i = 0; i < len; i++) {
    inputPrepared[i] = yield inputPrepared[i];
  }

  return inputPrepared;
}

export function resolveAsyncAll(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue) {
  let resolved = true;
  const inputPrepared = input.map(o => {
    const item = resolveAsync(o, null, null, true, customResolveValue);

    if (resolved && isThenable(item)) {
      resolved = false;
    }

    return item;
  });
  return resolveAsync(resolved ? inputPrepared : _resolveAsyncAll(inputPrepared)[Symbol.iterator](), onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue);
}
export function resolveAsyncAny(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue) {
  const len = input.length;
  const inputPrepared = new Array(len);

  for (let i = 0; i < len; i++) {
    const item = resolveAsync(input[i], null, null, true, customResolveValue);

    if (!isThenable(item)) {
      return resolveAsync(item, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue);
    }

    inputPrepared[i] = item;
  }

  return resolveAsync(new ThenableSync((resolve, reject) => {
    inputPrepared.forEach(o => o.then(resolve, reject));
  }), onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue);
}