"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createResolved = createResolved;
exports.createRejected = createRejected;
exports.resolveAsync = resolveAsync;
exports.ThenableSync = exports.ThenableSyncStatus = void 0;

var _async = require("./async");

let ThenableSyncStatus;
exports.ThenableSyncStatus = ThenableSyncStatus;

(function (ThenableSyncStatus) {
  ThenableSyncStatus["Resolving"] = "Resolving";
  ThenableSyncStatus["Resolved"] = "Resolved";
  ThenableSyncStatus["Rejected"] = "Rejected";
})(ThenableSyncStatus || (exports.ThenableSyncStatus = ThenableSyncStatus = {}));

function createResolved(value) {
  const thenable = new ThenableSync();
  thenable.resolve(value);
  return thenable;
}

function createRejected(error) {
  const thenable = new ThenableSync();
  thenable.reject(error);
  return thenable;
}

class ThenableSync {
  constructor(executor) {
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

    switch ((0, _async.resolveValue)(value, o => {
      value = o;
    }, o => {
      this._resolve(o);
    }, o => {
      this._reject(o);
    })) {
      case _async.ResolveResult.Deferred:
        this._status = ThenableSyncStatus.Resolving;
        return;

      case _async.ResolveResult.ImmediateRejected:
        return;
    }

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

    switch ((0, _async.resolveValue)(error, o => {
      error = o;
    }, o => {
      this._reject(o);
    }, o => {
      this._reject(o);
    })) {
      case _async.ResolveResult.Deferred:
        this._status = ThenableSyncStatus.Resolving;
        return;

      case _async.ResolveResult.ImmediateRejected:
        return;
    }

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


  _then(onfulfilled, onrejected, lastExpression) {
    const reject = error => {
      if (!onrejected) {
        if (lastExpression) {
          throw error;
        }

        return ThenableSync.createRejected(error);
      }

      let isError;

      error = (() => {
        try {
          return onrejected(error);
        } catch (err) {
          isError = true;
          return err;
        }
      })();

      const result = resolveAsync(error, null, null, !lastExpression);

      if ((0, _async.isThenable)(result)) {
        return isError ? result.then(o => createRejected(o)) : result;
      }

      if (lastExpression) {
        if (!isError) {
          return result;
        }

        throw result;
      }

      return isError ? createRejected(result) : createResolved(result);
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

          _value = (() => {
            try {
              return onfulfilled(_value);
            } catch (err) {
              isError = true;
              return err;
            }
          })();

          if (isError) {
            const result = resolveAsync(_value, null, null, !lastExpression);

            if ((0, _async.isThenable)(result)) {
              return result.then(o => reject(o), onrejected);
            }

            return reject(result);
          } else {
            const result = resolveAsync(_value, null, onrejected, !lastExpression);
            return lastExpression || (0, _async.isThenable)(result) ? result : createResolved(result);
          }
        }

      case ThenableSyncStatus.Rejected:
        if (!onrejected && !lastExpression) {
          return this;
        }

        return reject(this._error);

      default:
        {
          if (!onfulfilled && !onrejected) {
            return this;
          }

          const result = new ThenableSync();
          let {
            _onrejected
          } = this;

          if (!_onrejected) {
            this._onrejected = _onrejected = [];
          }

          const rejected = onrejected ? value => {
            let isError;

            value = (() => {
              try {
                return onrejected(value);
              } catch (err) {
                isError = true;
                return err;
              }
            })();

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

            value = (() => {
              try {
                return onfulfilled(value);
              } catch (err) {
                isError = true;
                return err;
              }
            })();

            if (isError) {
              (0, _async.resolveValue)(value, rejected, rejected, rejected);
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

  then(onfulfilled, onrejected) {
    return this._then(onfulfilled, onrejected, false);
  }

  thenLast(onfulfilled, onrejected) {
    return this._then(onfulfilled, onrejected, true);
  } // endregion
  // region static helpers
  // endregion


}

exports.ThenableSync = ThenableSync;
ThenableSync.createResolved = createResolved;
ThenableSync.createRejected = createRejected;
ThenableSync.isThenable = _async.isThenable;
ThenableSync.resolve = resolveAsync;

function resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateReject) {
  let error;
  let resolve;

  let reject = err => {
    error = err;
  };

  let result;

  const onreject = o => {
    if (onrejected) {
      if (resolve) {
        (0, _async.resolveValue)(onrejected(o), resolve, resolve, reject);
      } else {
        (0, _async.resolveValue)(onrejected(o), val => {
          result = val;
        }, resolve, reject);
      }
    } else {
      reject(o);
    }
  };

  switch ((0, _async.resolveValue)(input, o => {
    if (onfulfilled) {
      if ((0, _async.resolveValue)(onfulfilled(o), val => {
        result = val;
      }, resolve, onreject) === _async.ResolveResult.Deferred) {
        result = new ThenableSync((r, e) => {
          resolve = r;
          reject = e;
        });
      }
    } else {
      result = o;
    }
  }, o => {
    if (onfulfilled) {
      (0, _async.resolveValue)(onfulfilled(o), resolve, resolve, onreject);
    } else {
      resolve(o);
    }
  }, onreject)) {
    case _async.ResolveResult.Deferred:
      return new ThenableSync((r, e) => {
        resolve = r;
        reject = e;
      });

    case _async.ResolveResult.ImmediateRejected:
      if (dontThrowOnImmediateReject) {
        return createRejected(error);
      }

      throw error;
  }

  return result;
}