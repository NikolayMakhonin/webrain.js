import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { isThenable, ResolveResult, resolveValue, resolveValueFunc } from './async';
export var ThenableSyncStatus;

(function (ThenableSyncStatus) {
  ThenableSyncStatus["Resolving"] = "Resolving";
  ThenableSyncStatus["Resolved"] = "Resolved";
  ThenableSyncStatus["Rejected"] = "Rejected";
})(ThenableSyncStatus || (ThenableSyncStatus = {}));

export function createResolved(value) {
  var thenable = new ThenableSync();
  thenable.resolve(value);
  return thenable;
}
export function createRejected(error) {
  var thenable = new ThenableSync();
  thenable.reject(error);
  return thenable;
}
export var ThenableSync =
/*#__PURE__*/
function () {
  function ThenableSync(executor) {
    _classCallCheck(this, ThenableSync);

    if (executor) {
      try {
        executor(this.resolve.bind(this), this.reject.bind(this));
      } catch (err) {
        this.reject(err);
      }
    }
  } // region resolve


  _createClass(ThenableSync, [{
    key: "resolve",
    value: function resolve(value) {
      if (this._status != null) {
        throw new Error("Multiple call resolve/reject() is forbidden; status = ".concat(this._status));
      }

      this._resolve(value);
    }
  }, {
    key: "_resolve",
    value: function _resolve(value) {
      var _this = this;

      var _status = this._status;

      if (_status != null && _status !== ThenableSyncStatus.Resolving) {
        throw new Error("Multiple call resolve/reject() is forbidden; status = ".concat(_status));
      }

      var result = resolveValue(value, function (o, e) {
        if (e) {
          _this._reject(o);
        } else {
          value = o;
        }
      }, function (o, e) {
        if (e) {
          _this._reject(o);
        } else {
          _this._resolve(o);
        }
      });

      if ((result & ResolveResult.Deferred) !== 0) {
        this._status = ThenableSyncStatus.Resolving;
        return;
      }

      if ((result & ResolveResult.Error) !== 0) {
        return;
      }

      this._status = ThenableSyncStatus.Resolved;
      this._value = value;
      var _onfulfilled = this._onfulfilled;

      if (_onfulfilled) {
        this._onfulfilled = void 0;
        this._onrejected = void 0;

        for (var i = 0, len = _onfulfilled.length; i < len; i++) {
          _onfulfilled[i](value);
        }
      }
    } // endregion
    // region reject

  }, {
    key: "reject",
    value: function reject(error) {
      if (this._status != null) {
        throw new Error("Multiple call resolve/reject() is forbidden; status = ".concat(this._status));
      }

      this._reject(error);
    }
  }, {
    key: "_reject",
    value: function _reject(error) {
      var _this2 = this;

      var _status = this._status;

      if (_status != null && _status !== ThenableSyncStatus.Resolving) {
        throw new Error("Multiple call resolve/reject() is forbidden; status = ".concat(_status));
      }

      var result = resolveValue(error, function (o, e) {
        error = o;
      }, function (o, e) {
        _this2._reject(o);
      });

      if ((result & ResolveResult.Deferred) !== 0) {
        this._status = ThenableSyncStatus.Resolving;
        return;
      }

      this._status = ThenableSyncStatus.Rejected;
      this._error = error;
      var _onrejected = this._onrejected;

      if (_onrejected) {
        this._onfulfilled = void 0;
        this._onrejected = void 0;

        for (var i = 0, len = _onrejected.length; i < len; i++) {
          _onrejected[i](error);
        }
      }
    } // endregion
    // region then

  }, {
    key: "_then",
    value: function _then(onfulfilled, onrejected, lastExpression) {
      var reject = function reject(error) {
        if (!onrejected) {
          if (lastExpression) {
            throw error;
          }

          return ThenableSync.createRejected(error);
        }

        var isError;

        error = function () {
          try {
            return onrejected(error);
          } catch (err) {
            isError = true;
            return err;
          }
        }();

        var result = resolveAsync(error, null, null, !lastExpression);

        if (isThenable(result)) {
          return isError ? result.then(function (o) {
            return createRejected(o);
          }) : result;
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
            var _value = this._value;

            if (!onfulfilled) {
              return lastExpression ? _value : this;
            }

            var isError;

            _value = function () {
              try {
                return onfulfilled(_value);
              } catch (err) {
                isError = true;
                return err;
              }
            }();

            if (isError) {
              var result = resolveAsync(_value, null, null, !lastExpression);

              if (isThenable(result)) {
                return result.then(function (o) {
                  return reject(o);
                }, onrejected);
              }

              return reject(result);
            } else {
              var _result = resolveAsync(_value, null, onrejected, !lastExpression);

              return lastExpression || isThenable(_result) ? _result : createResolved(_result);
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

            var _result2 = new ThenableSync();

            var _onrejected = this._onrejected;

            if (!_onrejected) {
              this._onrejected = _onrejected = [];
            }

            var rejected = onrejected ? function (value) {
              var isError;

              value = function () {
                try {
                  return onrejected(value);
                } catch (err) {
                  isError = true;
                  return err;
                }
              }();

              if (isError) {
                _result2.reject(value);
              } else {
                _result2.resolve(value);
              }
            } : function (value) {
              _result2.reject(value);
            };

            _onrejected.push(rejected);

            var _onfulfilled = this._onfulfilled;

            if (!_onfulfilled) {
              this._onfulfilled = _onfulfilled = [];
            }

            _onfulfilled.push(onfulfilled ? function (value) {
              var isError;

              value = function () {
                try {
                  return onfulfilled(value);
                } catch (err) {
                  isError = true;
                  return err;
                }
              }();

              if (isError) {
                resolveValue(value, rejected, rejected);
              } else {
                _result2.resolve(value);
              }
            } : function (value) {
              _result2.resolve(value);
            });

            return _result2;
          }
      }
    }
  }, {
    key: "then",
    value: function then(onfulfilled, onrejected) {
      return this._then(onfulfilled, onrejected, false);
    }
  }, {
    key: "thenLast",
    value: function thenLast(onfulfilled, onrejected) {
      return this._then(onfulfilled, onrejected, true);
    } // endregion
    // region static helpers
    // endregion

  }]);

  return ThenableSync;
}();
ThenableSync.createResolved = createResolved;
ThenableSync.createRejected = createRejected;
ThenableSync.isThenable = isThenable;
ThenableSync.resolve = resolveAsync;
export function resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateError) {
  var result;
  var isError;

  var onResult = function onResult(o, e) {
    result = o;
    isError = e;
  };

  var thenable;

  var createThenable = function createThenable() {
    if (!thenable) {
      thenable = new ThenableSync(function (resolve, reject) {
        onResult = function onResult(o, e) {
          if (e) {
            reject(o);
          } else {
            resolve(o);
          }
        };
      });
    }

    return thenable;
  };

  var resolveOnResult = function resolveOnResult(o, e) {
    var handler = e ? onrejected : onfulfilled;

    if (handler) {
      if ((resolveValueFunc(function () {
        return handler(o);
      }, function (o2, e2) {
        onResult(o2, e2);
      }, function (o2, e2) {
        onResult(o2, e2);
      }) & ResolveResult.Deferred) !== 0) {
        result = createThenable();
      }
    } else {
      onResult(o, e);
    }
  };

  if ((resolveValue(input, resolveOnResult, resolveOnResult) & ResolveResult.Deferred) !== 0) {
    return createThenable();
  }

  if (isError) {
    if (dontThrowOnImmediateError) {
      return ThenableSync.createRejected(result);
    }

    throw result;
  }

  return result;
}
export function resolveAsyncFunc(func, onfulfilled, onrejected, dontThrowOnImmediateReject) {
  try {
    return resolveAsync(func(), onfulfilled, onrejected, dontThrowOnImmediateReject);
  } catch (err) {
    return resolveAsync(err, onrejected, onrejected, dontThrowOnImmediateReject);
  }
}