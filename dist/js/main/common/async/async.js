"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.isThenable = isThenable;
exports.isAsync = isAsync;
exports.registerStateProvider = registerStateProvider;
exports.resolveValue = resolveValue;
exports.resolveValueFunc = resolveValueFunc;
exports.stateProviderDefault = exports.ResolveResult = void 0;

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _helpers = require("../helpers/helpers");

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

var CombinedStateProvider = /*#__PURE__*/function () {
  function CombinedStateProvider() {
    (0, _classCallCheck2.default)(this, CombinedStateProvider);
    this._stateProviders = [];
    this._stateProvidersWereUsed = false;
  }

  (0, _createClass2.default)(CombinedStateProvider, [{
    key: "registerStateProvider",
    value: function registerStateProvider(stateProvider) {
      var _context;

      if (this._stateProvidersWereUsed) {
        throw new Error('You should add state provider only before using them');
      }

      if ((0, _indexOf.default)(_context = this._stateProviders).call(_context, stateProvider) >= 0) {
        throw new Error('stateProvider already registered');
      }

      this._stateProviders.push(stateProvider);
    }
  }, {
    key: "getState",
    value: function getState() {
      this._stateProvidersWereUsed = true;
      var len = this._stateProviders.length;

      if (len === 0) {
        return null;
      }

      if (len === 1) {
        return this._stateProviders[0].getState();
      }

      var states = [];

      for (var i = 0; i < len; i++) {
        states[i] = this._stateProviders[i].getState();
      }

      return states;
    }
  }, {
    key: "setState",
    value: function setState(state) {
      if (!this._stateProvidersWereUsed) {
        throw new Error('Unexpected behavior');
      }

      var len = this._stateProviders.length;

      if (len === 0) {
        throw new Error('Unexpected behavior');
      }

      if (len === 1) {
        this._stateProviders[0].setState(state);

        return;
      }

      if (!(0, _isArray.default)(state) || state.length !== len) {
        throw new Error('Unexpected behavior');
      }

      for (var i = 0; i < len; i++) {
        this._stateProviders[i].setState(state[i]);
      }
    }
  }]);
  return CombinedStateProvider;
}();

var stateProviderDefault = new CombinedStateProvider();
exports.stateProviderDefault = stateProviderDefault;

function registerStateProvider(stateProvider) {
  stateProviderDefault.registerStateProvider(stateProvider);
}

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
          _onImmediate = __onImmediate;
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

    function __onImmediate(o, nextIsError) {
      nextValue = o;
      isThrow = nextIsError;
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
  var prevCallState = stateProviderDefault.getState();

  if (callState == null) {
    callState = prevCallState;
  } else {
    stateProviderDefault.setState(callState);
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
    stateProviderDefault.setState(prevCallState);
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