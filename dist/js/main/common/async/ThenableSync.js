"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.createResolved = createResolved;
exports.createRejected = createRejected;
exports.resolveAsync = resolveAsync;
exports.resolveAsyncFunc = resolveAsyncFunc;
exports.resolveAsyncAll = resolveAsyncAll;
exports.resolveAsyncAny = resolveAsyncAny;
exports.ThenableSync = exports.ThenableSyncStatus = void 0;

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _async = require("./async");

var _marked =
/*#__PURE__*/
_regenerator.default.mark(_resolveAsyncAll);

var ThenableSyncStatus;
exports.ThenableSyncStatus = ThenableSyncStatus;

(function (ThenableSyncStatus) {
  ThenableSyncStatus["Resolving"] = "Resolving";
  ThenableSyncStatus["Resolved"] = "Resolved";
  ThenableSyncStatus["Rejected"] = "Rejected";
})(ThenableSyncStatus || (exports.ThenableSyncStatus = ThenableSyncStatus = {}));

function createResolved(value, customResolveValue) {
  var thenable = new ThenableSync(null, customResolveValue);
  thenable.resolve(value);
  return thenable;
}

function createRejected(error, customResolveValue) {
  var thenable = new ThenableSync(null, customResolveValue);
  thenable.reject(error);
  return thenable;
}

var ThenableSync =
/*#__PURE__*/
function () {
  function ThenableSync(executor, customResolveValue) {
    (0, _classCallCheck2.default)(this, ThenableSync);

    if (customResolveValue != null) {
      this._customResolveValue = customResolveValue;
    }

    if (executor) {
      try {
        var _context, _context2;

        executor((0, _bind.default)(_context = this.resolve).call(_context, this), (0, _bind.default)(_context2 = this.reject).call(_context2, this));
      } catch (err) {
        this.reject(err);
      }
    }
  } // region resolve


  (0, _createClass2.default)(ThenableSync, [{
    key: "resolve",
    value: function resolve(value) {
      if (this._status != null) {
        throw new Error("Multiple call resolve/reject() is forbidden; status = " + this._status);
      }

      this._resolve(value);
    }
  }, {
    key: "_resolve",
    value: function _resolve(value) {
      var _this = this;

      var _status = this._status;

      if (_status != null && _status !== ThenableSyncStatus.Resolving) {
        throw new Error("Multiple call resolve/reject() is forbidden; status = " + _status);
      }

      var result = (0, _async.resolveValue)(value, function (o, e) {
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
      }, this._customResolveValue);

      if ((result & _async.ResolveResult.Deferred) !== 0) {
        this._status = ThenableSyncStatus.Resolving;
        return;
      }

      if ((result & _async.ResolveResult.Error) !== 0) {
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
        throw new Error("Multiple call resolve/reject() is forbidden; status = " + this._status);
      }

      this._reject(error);
    }
  }, {
    key: "_reject",
    value: function _reject(error) {
      var _this2 = this;

      var _status = this._status;

      if (_status != null && _status !== ThenableSyncStatus.Resolving) {
        throw new Error("Multiple call resolve/reject() is forbidden; status = " + _status);
      }

      var result = (0, _async.resolveValue)(error, function (o) {
        error = o;
      }, function (o) {
        _this2._reject(o);
      }, this._customResolveValue);

      if ((result & _async.ResolveResult.Deferred) !== 0) {
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
    value: function _then(onfulfilled, onrejected, lastExpression, customResolveValue) {
      var reject = function reject(error) {
        if (!onrejected) {
          if (lastExpression) {
            throw error;
          }

          return ThenableSync.createRejected(error, customResolveValue);
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

        var result = resolveAsync(error, null, null, !lastExpression, customResolveValue);

        if ((0, _async.isThenable)(result)) {
          return isError ? result.then(function (o) {
            return createRejected(o, customResolveValue);
          }) : result;
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
              var result = resolveAsync(_value, null, null, !lastExpression, customResolveValue);

              if ((0, _async.isThenable)(result)) {
                return result.then(function (o) {
                  return reject(o);
                }, onrejected);
              }

              return reject(result);
            } else {
              var _result = resolveAsync(_value, null, onrejected, !lastExpression, customResolveValue);

              return lastExpression || (0, _async.isThenable)(_result) ? _result : createResolved(_result, customResolveValue);
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

            var _result2 = new ThenableSync(null, customResolveValue);

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
                (0, _async.resolveValue)(value, rejected, rejected, customResolveValue);
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
    value: function then(onfulfilled, onrejected, customResolveValue) {
      return this._then(onfulfilled, onrejected, false, customResolveValue === false ? null : customResolveValue || this._customResolveValue);
    }
  }, {
    key: "thenLast",
    value: function thenLast(onfulfilled, onrejected, customResolveValue) {
      return this._then(onfulfilled, onrejected, true, customResolveValue === false ? null : customResolveValue || this._customResolveValue);
    } // endregion
    // region static helpers
    // endregion

  }]);
  return ThenableSync;
}();

exports.ThenableSync = ThenableSync;
ThenableSync.createResolved = createResolved;
ThenableSync.createRejected = createRejected;
ThenableSync.isThenable = _async.isThenable;
ThenableSync.resolve = resolveAsync;

function resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue) {
  // Optimization
  if (!onfulfilled && !(0, _async.isAsync)(input)) {
    if (input != null && customResolveValue) {
      var newInput = customResolveValue(input);

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
      }, customResolveValue);
    }

    return thenable;
  };

  var resolveOnResult = function resolveOnResult(o, e) {
    var handler = e ? onrejected : onfulfilled;

    if (handler) {
      if (((0, _async.resolveValueFunc)(function () {
        return handler(o);
      }, function (o2, e2) {
        onResult(o2, e2);
      }, function (o2, e2) {
        onResult(o2, e2);
      }, customResolveValue) & _async.ResolveResult.Deferred) !== 0) {
        result = createThenable();
      }
    } else {
      onResult(o, e);
    }
  };

  if (((0, _async.resolveValue)(input, resolveOnResult, resolveOnResult, customResolveValue) & _async.ResolveResult.Deferred) !== 0) {
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

function resolveAsyncFunc(func, onfulfilled, onrejected, dontThrowOnImmediateReject, customResolveValue) {
  try {
    return resolveAsync(func(), onfulfilled, onrejected, dontThrowOnImmediateReject, customResolveValue);
  } catch (err) {
    return resolveAsync(err, onrejected, onrejected, dontThrowOnImmediateReject, customResolveValue);
  }
}

function _resolveAsyncAll(inputPrepared) {
  var len, i;
  return _regenerator.default.wrap(function _resolveAsyncAll$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          len = inputPrepared.length;
          i = 0;

        case 2:
          if (!(i < len)) {
            _context3.next = 9;
            break;
          }

          _context3.next = 5;
          return inputPrepared[i];

        case 5:
          inputPrepared[i] = _context3.sent;

        case 6:
          i++;
          _context3.next = 2;
          break;

        case 9:
          return _context3.abrupt("return", inputPrepared);

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked);
}

function resolveAsyncAll(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue) {
  var resolved = true;
  var inputPrepared = (0, _map.default)(input).call(input, function (o) {
    var item = resolveAsync(o, null, null, true, customResolveValue);

    if (resolved && (0, _async.isThenable)(item)) {
      resolved = false;
    }

    return item;
  });
  return resolveAsync(resolved ? inputPrepared : (0, _getIterator2.default)(_resolveAsyncAll(inputPrepared)), onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue);
}

function resolveAsyncAny(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue) {
  var len = input.length;
  var inputPrepared = new Array(len);

  for (var i = 0; i < len; i++) {
    var item = resolveAsync(input[i], null, null, true, customResolveValue);

    if (!(0, _async.isThenable)(item)) {
      return resolveAsync(item, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue);
    }

    inputPrepared[i] = item;
  }

  return resolveAsync(new ThenableSync(function (resolve, reject) {
    (0, _forEach.default)(inputPrepared).call(inputPrepared, function (o) {
      return o.then(resolve, reject);
    });
  }), onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue);
}