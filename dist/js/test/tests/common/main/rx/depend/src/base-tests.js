"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.baseTest = baseTest;
exports.lazyTest = lazyTest;

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _async = require("../../../../../../../main/common/async/async");

var _ThenableSync = require("../../../../../../../main/common/async/ThenableSync");

var _CallState = require("../../../../../../../main/common/rx/depend/core/CallState");

var _contracts = require("../../../../../../../main/common/rx/depend/core/contracts");

var _currentState = require("../../../../../../../main/common/rx/depend/core/current-state");

var _facade = require("../../../../../../../main/common/rx/depend/core/facade");

var _helpers = require("../../../../../../../main/common/rx/depend/core/helpers");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _helpers2 = require("../../../../../../../main/common/time/helpers");

/* tslint:disable:no-identical-functions no-shadowed-variable no-duplicate-string no-construct use-primitive-type */
if (typeof global !== 'undefined') {
  // for debug only
  global.statusToString = _CallState.statusToString;
} // region baseTest


var _callHistory = [];

function getCallId(funcId, _this) {
  var _context;

  var callId = funcId;

  for (var i = 0, len = arguments.length <= 2 ? 0 : arguments.length - 2; i < len; i++) {
    callId += (i + 2 < 2 || arguments.length <= i + 2 ? undefined : arguments[i + 2]) || 0;
  }

  callId += '(' + ((0, _isArray.default)(_this) ? (0, _map.default)(_context = (0, _filter.default)(_this).call(_this, function (o) {
    return !o.hasLoop;
  })).call(_context, function (o) {
    return o.id;
  }).join(',') : _this || 0) + ')';
  return callId;
}

var resultsAsError = [];

function setResultsAsError() {
  for (var _len = arguments.length, calls = new Array(_len), _key = 0; _key < _len; _key++) {
    calls[_key] = arguments[_key];
  }

  resultsAsError = (0, _map.default)(calls).call(calls, function (o) {
    return o.id;
  });
}

var alwaysChange = [];

function setAlwaysChange() {
  for (var _len2 = arguments.length, calls = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    calls[_key2] = arguments[_key2];
  }

  alwaysChange = (0, _map.default)(calls).call(calls, function (o) {
    return o.id;
  });
}

var lazyCalls = [];

function setLazyCalls() {
  for (var _len3 = arguments.length, calls = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    calls[_key3] = arguments[_key3];
  }

  lazyCalls = (0, _map.default)(calls).call(calls, function (o) {
    return o.id;
  });
}

function callIdToResult(callId) {
  var result = callId;

  if ((0, _indexOf.default)(alwaysChange).call(alwaysChange, callId) >= 0) {
    result = new String(result);
  }

  if ((0, _indexOf.default)(resultsAsError).call(resultsAsError, callId) >= 0) {
    throw result;
  }

  return result;
}

function getDeferredOptions(async) {
  return async ? {
    delayBeforeCalc: 1,
    minTimeBetweenCalc: 10
  } : {};
}

function funcSync(id, deferred) {
  var result = (0, _facade.depend)(function () {
    var _context2;

    var callId = getCallId.apply(void 0, (0, _concat.default)(_context2 = [id, this]).call(_context2, (0, _slice.default)(Array.prototype).call(arguments)));
    var isLazy = (0, _indexOf.default)(lazyCalls).call(lazyCalls, callId) >= 0;

    _callHistory.push(callId);

    var dependencies = this;
    var currentState = (0, _currentState.getCurrentState)();

    _Assert.assert.strictEqual(currentState.id, callId);

    if ((0, _isArray.default)(dependencies)) {
      for (var i = 0, len = dependencies.length; i < len * 2; i++) {
        var dependency = dependencies[i % len];

        if (isLazy) {
          var value = dependency.state.getValue(true);

          _Assert.assert.notOk(dependency.state.error);

          _Assert.assert.strictEqual((0, _async.isAsync)(value), false);

          if ((dependency.state.status & _contracts.CallStatus.Flag_Calculated) === 0) {
            _Assert.assert.strictEqual(value, dependency.state.value);
          } else {
            _Assert.assert.strictEqual(value + '', dependency.id);
          }
        } else {
          var _value = dependency();

          _Assert.assert.notOk(dependency.state.error);

          _Assert.assert.strictEqual(_value + '', dependency.id);
        }

        _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

        checkCurrentStateAsync(currentState);
      }
    }

    return callIdToResult(callId);
  }, !deferred ? null : getDeferredOptions(false));
  result.id = id;
  return result;
}

function funcSyncIterator(id, deferred) {
  var nested = /*#__PURE__*/_regenerator.default.mark(function nested(dependencies, currentState, isLazy) {
    var i, len, dependency, value, valueAsync, _value2;

    return _regenerator.default.wrap(function nested$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            _context3.next = 3;
            return 1;

          case 3:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            if (!(0, _isArray.default)(dependencies)) {
              _context3.next = 27;
              break;
            }

            i = 0, len = dependencies.length;

          case 6:
            if (!(i < len * 2)) {
              _context3.next = 27;
              break;
            }

            dependency = dependencies[i % len];

            if (!isLazy) {
              _context3.next = 15;
              break;
            }

            value = dependency.state.getValue(true);

            _Assert.assert.notOk(dependency.state.error);

            _Assert.assert.strictEqual((0, _async.isAsync)(value), false);

            if ((dependency.state.status & _contracts.CallStatus.Flag_Calculated) === 0) {
              _Assert.assert.strictEqual(value, dependency.state.value);
            } else {
              _Assert.assert.strictEqual(value + '', dependency.id);
            }

            _context3.next = 22;
            break;

          case 15:
            valueAsync = dependency();

            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            _context3.next = 19;
            return valueAsync;

          case 19:
            _value2 = _context3.sent;

            _Assert.assert.notOk(dependency.state.error);

            _Assert.assert.strictEqual(_value2 + '', dependency.id);

          case 22:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            checkCurrentStateAsync(currentState);

          case 24:
            i++;
            _context3.next = 6;
            break;

          case 27:
            return _context3.abrupt("return", 1);

          case 28:
          case "end":
            return _context3.stop();
        }
      }
    }, nested);
  });

  var run = /*#__PURE__*/_regenerator.default.mark(function run(callId, dependencies, currentState) {
    return _regenerator.default.wrap(function run$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            _context4.next = 3;
            return 1;

          case 3:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            _context4.next = 6;
            return nested(dependencies, currentState, (0, _indexOf.default)(lazyCalls).call(lazyCalls, callId) >= 0);

          case 6:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            return _context4.abrupt("return", callIdToResult(callId));

          case 8:
          case "end":
            return _context4.stop();
        }
      }
    }, run);
  });

  var result = (0, _facade.depend)(function () {
    var _context5;

    var callId = getCallId.apply(void 0, (0, _concat.default)(_context5 = [id, this]).call(_context5, (0, _slice.default)(Array.prototype).call(arguments)));

    _callHistory.push(callId);

    var currentState = (0, _currentState.getCurrentState)();

    _Assert.assert.strictEqual(currentState.id, callId);

    var res = run(callId, this, currentState);

    _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

    return res;
  }, !deferred ? null : getDeferredOptions(false));
  result.id = id;
  return result;
}

function funcAsync(id, deferred) {
  var nested = /*#__PURE__*/_regenerator.default.mark(function nested() {
    return _regenerator.default.wrap(function nested$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return 1;

          case 2:
            return _context6.abrupt("return", 1);

          case 3:
          case "end":
            return _context6.stop();
        }
      }
    }, nested);
  });

  var nestedAsync = /*#__PURE__*/_regenerator.default.mark(function nestedAsync(dependencies, currentState, isLazy) {
    var i, len, dependency, value, valueAsync, _value3;

    return _regenerator.default.wrap(function nestedAsync$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            _context7.next = 3;
            return 1;

          case 3:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            if (!dependencies) {
              _context7.next = 27;
              break;
            }

            i = 0, len = dependencies.length;

          case 6:
            if (!(i < len * 2)) {
              _context7.next = 27;
              break;
            }

            dependency = dependencies[i % len];

            if (!isLazy) {
              _context7.next = 15;
              break;
            }

            value = dependency.state.getValue(true);

            _Assert.assert.notOk(dependency.state.error);

            _Assert.assert.strictEqual((0, _async.isAsync)(value), false);

            if ((dependency.state.status & _contracts.CallStatus.Flag_Calculated) === 0) {
              _Assert.assert.strictEqual(value, dependency.state.value);
            } else {
              _Assert.assert.strictEqual(value + '', dependency.id);
            }

            _context7.next = 22;
            break;

          case 15:
            valueAsync = dependency();

            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            _context7.next = 19;
            return valueAsync;

          case 19:
            _value3 = _context7.sent;

            _Assert.assert.notOk(dependency.state.error);

            _Assert.assert.strictEqual(_value3 + '', dependency.id);

          case 22:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            checkCurrentStateAsync(currentState);

          case 24:
            i++;
            _context7.next = 6;
            break;

          case 27:
            _context7.next = 29;
            return (0, _helpers2.delay)(0);

          case 29:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            return _context7.abrupt("return", 1);

          case 31:
          case "end":
            return _context7.stop();
        }
      }
    }, nestedAsync);
  });

  var run = /*#__PURE__*/_regenerator.default.mark(function run(callId, dependencies, currentState) {
    return _regenerator.default.wrap(function run$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            _context8.next = 3;
            return 1;

          case 3:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            _context8.next = 6;
            return (0, _helpers2.delay)(0);

          case 6:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            _context8.next = 9;
            return nested();

          case 9:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            _context8.next = 12;
            return nestedAsync(dependencies, currentState, (0, _indexOf.default)(lazyCalls).call(lazyCalls, callId) >= 0);

          case 12:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

            return _context8.abrupt("return", callIdToResult(callId));

          case 14:
          case "end":
            return _context8.stop();
        }
      }
    }, run);
  });

  var result = (0, _facade.depend)(function () {
    var _context9;

    var callId = getCallId.apply(void 0, (0, _concat.default)(_context9 = [id, this]).call(_context9, (0, _slice.default)(Array.prototype).call(arguments)));

    _callHistory.push(callId);

    var currentState = (0, _currentState.getCurrentState)();

    _Assert.assert.strictEqual(currentState.id, callId);

    var res = run(callId, this, currentState);

    _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

    return res;
  }, !deferred ? null : getDeferredOptions(true));
  result.id = id;
  return result;
}

function _funcCall(func, callId, _this) {
  for (var _len4 = arguments.length, rest = new Array(_len4 > 3 ? _len4 - 3 : 0), _key4 = 3; _key4 < _len4; _key4++) {
    rest[_key4 - 3] = arguments[_key4];
  }

  var result = function result() {
    var currentState = (0, _currentState.getCurrentState)();
    var res = func.apply(_this, rest);

    _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), currentState);

    return res;
  };

  result.id = callId;
  result.state = (0, _CallState.getOrCreateCallState)(func).apply(_this, rest);

  _Assert.assert.ok(result.state);

  _Assert.assert.strictEqual(result.state.status, _contracts.CallStatus.Flag_Invalidated | _contracts.CallStatus.Flag_Recalc);

  result.state.id = callId;
  return result;
}

function clearState(call) {
  var oldState = call.state;
  var callId = oldState.id;
  var oldArgs;
  oldState.callWithArgs(null, function () {
    oldArgs = (0, _from.default)(arguments);
  });
  (0, _CallState.deleteCallState)(oldState);
  var newState = oldState.callWithArgs(oldState._this, (0, _CallState.getOrCreateCallState)(oldState.func));

  _Assert.assert.ok(newState);

  _Assert.assert.notStrictEqual(newState, oldState);

  _Assert.assert.strictEqual(newState._this, oldState._this);

  _Assert.assert.strictEqual(newState.func, oldState.func);

  var newArgs;
  newState.callWithArgs(null, function () {
    newArgs = (0, _from.default)(arguments);
  });

  _Assert.assert.deepStrictEqual(newArgs, oldArgs);

  newState.id = callId;
  call.state = newState;
}

function clearStates() {
  for (var i = 0, len = arguments.length; i < len; i++) {
    clearState(i < 0 || arguments.length <= i ? undefined : arguments[i]);
  }
}

function funcCall(func, _this) {
  var _context10, _context11;

  for (var _len5 = arguments.length, rest = new Array(_len5 > 2 ? _len5 - 2 : 0), _key5 = 2; _key5 < _len5; _key5++) {
    rest[_key5 - 2] = arguments[_key5];
  }

  var callId = getCallId.apply(void 0, (0, _concat.default)(_context10 = [func.id, _this]).call(_context10, rest));
  return _funcCall.apply(void 0, (0, _concat.default)(_context11 = [func, callId, _this]).call(_context11, rest));
}

var ThisObj = /*#__PURE__*/function () {
  function ThisObj(value) {
    (0, _classCallCheck2.default)(this, ThisObj);
    this.value = value;
  }

  (0, _createClass2.default)(ThisObj, [{
    key: "toString",
    value: function toString() {
      return this.value;
    }
  }]);
  return ThisObj;
}();

function checkSync(value) {
  _Assert.assert.notOk((0, _async.isThenable)(value));

  return value;
}

function checkAsync(value) {
  _Assert.assert.ok((0, _async.isThenable)(value));

  return value;
}

var callHistoryCheckDisabled = false;

function checkCallHistory() {
  if (callHistoryCheckDisabled) {
    _callHistory.length = 0;
    return;
  }

  for (var _len6 = arguments.length, callHistory = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    callHistory[_key6] = arguments[_key6];
  }

  _Assert.assert.deepStrictEqual(_callHistory, (0, _map.default)(callHistory).call(callHistory, function (o) {
    return o.id;
  }));

  _callHistory.length = 0;
}

function checkDependenciesDuplicates() {
  var set = new _set.default();

  for (var i = 0, len = arguments.length; i < len; i++) {
    var _ref = i < 0 || arguments.length <= i ? undefined : arguments[i],
        state = _ref.state;

    var _unsubscribers = state._unsubscribers,
        _unsubscribersLength = state._unsubscribersLength;

    if (_unsubscribers != null) {
      for (var j = 0, _len7 = _unsubscribersLength; j < _len7; j++) {
        var id = _unsubscribers[j].state.id;

        _Assert.assert.ok(id, state.id);

        _Assert.assert.notOk(set.has(id), "Duplicate " + id + " in " + state.id);

        set.add(id);
      }

      set.clear();
    }
  }
}

var ResultType;

(function (ResultType) {
  ResultType[ResultType["Any"] = 0] = "Any";
  ResultType[ResultType["Error"] = 1] = "Error";
  ResultType[ResultType["Value"] = 2] = "Value";
})(ResultType || (ResultType = {}));

function checkFuncSync(resultType, funcCall) {
  checkCallHistory();
  checkDependenciesDuplicates(funcCall);

  _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), null);

  var value;
  var error;

  try {
    value = checkSync(funcCall());
  } catch (err) {
    if (err instanceof _helpers.InternalError) {
      _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), null);

      throw err;
    }

    error = err;
  }

  _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), null);

  if (resultType === ResultType.Error || resultType === ResultType.Any && error) {// if (resultsAsError.indexOf(error + '') < 0) {
    // 	assert.fail(`funcCall.id = ${funcCall.id}, error = ${error}`)
    // }
  } else if (resultType === ResultType.Value || resultType === ResultType.Any && !error) {
    _Assert.assert.notOk(funcCall.state.error);

    _Assert.assert.strictEqual(value + '', funcCall.id);
  } else {
    throw new Error('Unknown ResultType: ' + resultType);
  } // assertStatus(funcCall.state.status)


  for (var _len8 = arguments.length, callHistory = new Array(_len8 > 2 ? _len8 - 2 : 0), _key7 = 2; _key7 < _len8; _key7++) {
    callHistory[_key7 - 2] = arguments[_key7];
  }

  checkCallHistory.apply(void 0, callHistory);
}

function checkFuncAsync(resultType, funcCall) {
  for (var _len9 = arguments.length, callHistory = new Array(_len9 > 2 ? _len9 - 2 : 0), _key8 = 2; _key8 < _len9; _key8++) {
    callHistory[_key8 - 2] = arguments[_key8];
  }

  checkCallHistory();
  checkDependenciesDuplicates(funcCall);

  _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), null);

  var thenable;

  try {
    thenable = checkAsync(funcCall()).then(function (o) {
      _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), null);

      return o;
    }, function (o) {
      _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), null);

      return _ThenableSync.ThenableSync.createRejected(o);
    });
  } catch (err) {
    if (err instanceof _helpers.InternalError) {
      _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), null);

      throw err;
    }

    _Assert.assert.fail(err);
  } // assertStatus(funcCall.state.status)


  checkCallHistory.apply(void 0, callHistory);
  return (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var _context12;

    var value, error;
    return _regenerator.default.wrap(function _callee$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), null);

            _context13.prev = 1;
            _context13.next = 4;
            return thenable;

          case 4:
            value = _context13.sent;
            _context13.next = 13;
            break;

          case 7:
            _context13.prev = 7;
            _context13.t0 = _context13["catch"](1);

            if (!(_context13.t0 instanceof _helpers.InternalError)) {
              _context13.next = 12;
              break;
            }

            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), null);

            throw _context13.t0;

          case 12:
            error = _context13.t0;

          case 13:
            _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), null);

            if (!(resultType === ResultType.Error || resultType === ResultType.Any && error)) {
              _context13.next = 18;
              break;
            }

            _Assert.assert.ok(error); // if (resultsAsError.indexOf(error + '') < 0) {
            // 	assert.fail(`funcCall.id = ${funcCall.id}, error = ${error}`)
            // }


            _context13.next = 24;
            break;

          case 18:
            if (!(resultType === ResultType.Value || resultType === ResultType.Any && !error)) {
              _context13.next = 23;
              break;
            }

            _Assert.assert.notOk(funcCall.state.error);

            _Assert.assert.strictEqual(value + '', funcCall.id);

            _context13.next = 24;
            break;

          case 23:
            throw new Error('Unknown ResultType: ' + resultType);

          case 24:
            // assertStatus(funcCall.state.status)
            checkDependenciesDuplicates.apply(void 0, (0, _concat.default)(_context12 = [funcCall]).call(_context12, callHistory));

          case 25:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee, null, [[1, 7]]);
  }))();
}

var statusesShort = {
  i: _contracts.CallStatus.Flag_Invalidating,
  I: _contracts.CallStatus.Flag_Invalidated,
  f: _contracts.CallStatus.Flag_Invalidating | _contracts.CallStatus.Flag_Recalc,
  F: _contracts.CallStatus.Flag_Invalidated | _contracts.CallStatus.Flag_Recalc,
  x: _contracts.CallStatus.Flag_Check,
  c: _contracts.CallStatus.Flag_Calculating,
  a: _contracts.CallStatus.Flag_Async,
  C: _contracts.CallStatus.Flag_Calculated,
  V: _contracts.CallStatus.Flag_HasValue,
  E: _contracts.CallStatus.Flag_HasError
};

function parseStatusShort(statusShort) {
  var status = 0;

  for (var i = 0, len = statusShort.length; i < len; i++) {
    status |= statusesShort[statusShort[i]];
  }

  return status;
}

function statusToShortString(status) {
  var result = '';

  if ((status & _contracts.CallStatus.Flag_Invalidating) !== 0) {
    result += 'i';
    status &= ~_contracts.CallStatus.Flag_Invalidating;
  }

  if ((status & _contracts.CallStatus.Flag_Invalidated) !== 0) {
    result += 'I';
    status &= ~_contracts.CallStatus.Flag_Invalidated;
  }

  if ((status & _contracts.CallStatus.Flag_Recalc) !== 0) {
    result += 'r';
    status &= ~_contracts.CallStatus.Flag_Recalc;
  }

  if ((status & _contracts.CallStatus.Flag_Check) !== 0) {
    result += 'x';
    status &= ~_contracts.CallStatus.Flag_Check;
  }

  if ((status & _contracts.CallStatus.Flag_Calculating) !== 0) {
    result += 'c';
    status &= ~_contracts.CallStatus.Flag_Calculating;
  }

  if ((status & _contracts.CallStatus.Flag_Async) !== 0) {
    result += 'a';
    status &= ~_contracts.CallStatus.Flag_Async;
  }

  if ((status & _contracts.CallStatus.Flag_Calculated) !== 0) {
    result += 'C';
    status &= ~_contracts.CallStatus.Flag_Calculated;
  }

  if ((status & _contracts.CallStatus.Flag_HasValue) !== 0) {
    result += 'V';
    status &= ~_contracts.CallStatus.Flag_HasValue;
  }

  if ((status & _contracts.CallStatus.Flag_HasError) !== 0) {
    result += 'E';
    status &= ~_contracts.CallStatus.Flag_HasError;
  }

  if (status !== 0) {
    result += status;
  }

  return result;
}

function checkStatuses() {
  for (var _len10 = arguments.length, funcCalls = new Array(_len10), _key9 = 0; _key9 < _len10; _key9++) {
    funcCalls[_key9] = arguments[_key9];
  }

  return function () {
    for (var _len11 = arguments.length, statusesShort = new Array(_len11), _key10 = 0; _key10 < _len11; _key10++) {
      statusesShort[_key10] = arguments[_key10];
    }

    _Assert.assert.deepStrictEqual((0, _map.default)(funcCalls).call(funcCalls, function (o) {
      return statusToShortString(o.state.status);
    }), statusesShort);
  };
}

function _invalidate() {
  checkCallHistory();

  for (var _len12 = arguments.length, funcCalls = new Array(_len12), _key11 = 0; _key11 < _len12; _key11++) {
    funcCalls[_key11] = arguments[_key11];
  }

  for (var i = 0; i < funcCalls.length; i++) {
    funcCalls[i].state.invalidate();
  }

  checkCallHistory();
}

function _checkFuncNotChanged() {
  for (var i = 0, len = arguments.length; i < len; i++) {
    checkFuncSync(ResultType.Any, i < 0 || arguments.length <= i ? undefined : arguments[i]);
  }
}

function checkFuncNotChanged(allFuncCalls) {
  for (var _len13 = arguments.length, changedFuncCalls = new Array(_len13 > 1 ? _len13 - 1 : 0), _key12 = 1; _key12 < _len13; _key12++) {
    changedFuncCalls[_key12 - 1] = arguments[_key12];
  }

  _checkFuncNotChanged.apply(void 0, (0, _filter.default)(allFuncCalls).call(allFuncCalls, function (o) {
    return (0, _indexOf.default)(changedFuncCalls).call(changedFuncCalls, o) < 0;
  }));
}

function isInvalidated(funcCall) {
  return (funcCall.state.status & _contracts.CallStatus.Mask_Invalidate) !== 0;
} // export function assertStatus(status: FuncCallStatus) {
// 	assert.ok(checkStatus(status), statusToString(status))
// }


function getSubscribers(state) {
  var subscribers = [];

  for (var link = state._subscribersFirst; link !== null;) {
    subscribers.push(link.value);
    link = link.next;
  }

  return subscribers;
}

function checkSubscribers(funcCall) {
  var _context14, _context15, _context16;

  var ids = (0, _sort.default)(_context14 = (0, _map.default)(_context15 = getSubscribers(funcCall.state)).call(_context15, function (o) {
    return o.id;
  })).call(_context14);

  for (var _len14 = arguments.length, subscribersFuncCalls = new Array(_len14 > 1 ? _len14 - 1 : 0), _key13 = 1; _key13 < _len14; _key13++) {
    subscribersFuncCalls[_key13 - 1] = arguments[_key13];
  }

  var checkIds = (0, _sort.default)(_context16 = (0, _map.default)(subscribersFuncCalls).call(subscribersFuncCalls, function (o) {
    return o.id;
  })).call(_context16);

  _Assert.assert.deepStrictEqual(ids, checkIds, funcCall.id);
}

function checkUnsubscribers(funcCall) {
  var _context17, _context18, _context19, _context20;

  var ids = funcCall.state._unsubscribers === null || funcCall.state._unsubscribersLength === 0 ? [] : (0, _sort.default)(_context17 = (0, _map.default)(_context18 = (0, _filter.default)(_context19 = funcCall.state._unsubscribers).call(_context19, function (o) {
    return o;
  })).call(_context18, function (o) {
    return o.state.id;
  })).call(_context17);

  for (var _len15 = arguments.length, unsubscribersFuncCalls = new Array(_len15 > 1 ? _len15 - 1 : 0), _key14 = 1; _key14 < _len15; _key14++) {
    unsubscribersFuncCalls[_key14 - 1] = arguments[_key14];
  }

  var checkIds = (0, _sort.default)(_context20 = (0, _map.default)(unsubscribersFuncCalls).call(unsubscribersFuncCalls, function (o) {
    return o.id;
  })).call(_context20);

  _Assert.assert.deepStrictEqual(ids, checkIds, funcCall.id);
}

function checkCurrentStateAsync(state) {
  _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), state);

  return (0, _ThenableSync.resolveAsync)((0, _ThenableSync.resolveAsync)((0, _helpers2.delay)(0), function () {
    _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), state);

    throw 1;
  }, function () {
    _Assert.assert.fail();
  }), function () {
    _Assert.assert.fail();
  }, function () {
    _Assert.assert.strictEqual((0, _currentState.getCurrentState)(), state);
  });
}

function checkCurrentStateAsyncContinuous(state) {
  var stop = false;

  function start() {
    return _start.apply(this, arguments);
  } // noinspection JSIgnoredPromiseFromCall


  function _start() {
    _start = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
      return _regenerator.default.wrap(function _callee2$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              if (stop) {
                _context21.next = 5;
                break;
              }

              _context21.next = 3;
              return checkCurrentStateAsync(state);

            case 3:
              _context21.next = 0;
              break;

            case 5:
            case "end":
              return _context21.stop();
          }
        }
      }, _callee2);
    }));
    return _start.apply(this, arguments);
  }

  start();
  return function () {
    stop = true;
  };
}

function baseTest(_x) {
  return _baseTest.apply(this, arguments);
}

function _baseTest() {
  _baseTest = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee6(deferred) {
    var _context25;

    var stopCheckCurrentState, S, I, A, S0, I0, A0, S1, I1, S2, I2, A2, allFuncs, _checkStatuses, _checkSubscribersAll, _checkUnsubscribersAll, checkSubscribersAll, promise1, promise2, SL, IL, AL, SL3_dependencies, SL3, SL4, SL5, IL3_dependencies, IL3, IL4, IL5, AL3_dependencies, AL3, AL4, AL5;

    return _regenerator.default.wrap(function _callee6$(_context26) {
      while (1) {
        switch (_context26.prev = _context26.next) {
          case 0:
            checkSubscribersAll = function _checkSubscribersAll3() {
              _checkSubscribersAll();

              _checkUnsubscribersAll();
            };

            _checkUnsubscribersAll = function _checkUnsubscribersAl() {
              checkUnsubscribers(S0);
              checkUnsubscribers(I0);
              checkUnsubscribers(A0);
              checkUnsubscribers(S1, S0, I0);
              checkUnsubscribers(I1, I0, A0);
              checkUnsubscribers(S2, S1);
              checkUnsubscribers(I2, S1, I1);
              checkUnsubscribers(A2, I1);
            };

            _checkSubscribersAll = function _checkSubscribersAll2() {
              checkSubscribers(S0, S1);
              checkSubscribers(I0, S1, I1);
              checkSubscribers(A0, I1);
              checkSubscribers(S1, S2, I2);
              checkSubscribers(I1, I2, A2);
              checkSubscribers(S2);
              checkSubscribers(I2);
              checkSubscribers(A2);
            };

            if (!(deferred == null)) {
              _context26.next = 9;
              break;
            }

            _context26.next = 6;
            return baseTest(false);

          case 6:
            _context26.next = 8;
            return baseTest(true);

          case 8:
            return _context26.abrupt("return", _context26.sent);

          case 9:
            stopCheckCurrentState = checkCurrentStateAsyncContinuous(null);
            callHistoryCheckDisabled = deferred; // region init

            S = funcSync('S', deferred);
            I = funcSyncIterator('I', deferred);
            A = funcAsync('A', deferred);
            S0 = funcCall(S); // S(0)

            I0 = funcCall(I, null); // I(0)

            A0 = funcCall(A, new ThisObj('_')); // A(_)

            S1 = funcCall(S, [S0, I0], 1); // S1(S(0),I(0))

            I1 = funcCall(I, [I0, A0], 1); // I1(I(0),A(_))

            S2 = funcCall(S, [S1], 2, void 0); // S20(S1(S(0),I(0)))

            I2 = funcCall(I, [S1, I1], 2, null); // I20(S1(S(0),I(0)),I1(I(0),A(_)))

            A2 = funcCall(A, [I1], 2, 2); // A22(I1(I(0),A(_)))

            setAlwaysChange(I0, I1, I2);
            allFuncs = [S0, I0, A0, S1, I1, S2, I2, A2];
            _checkStatuses = checkStatuses.apply(void 0, allFuncs);

            // endregion
            // region check init
            _Assert.assert.strictEqual(S0.id, 'S(0)');

            _Assert.assert.strictEqual(I0.id, 'I(0)');

            _Assert.assert.strictEqual(A0.id, 'A(_)');

            _Assert.assert.strictEqual(S1.id, 'S1(S(0),I(0))');

            _Assert.assert.strictEqual(I1.id, 'I1(I(0),A(_))');

            _Assert.assert.strictEqual(S2.id, 'S20(S1(S(0),I(0)))');

            _Assert.assert.strictEqual(I2.id, 'I20(S1(S(0),I(0)),I1(I(0),A(_)))');

            _Assert.assert.strictEqual(A2.id, 'A22(I1(I(0),A(_)))'); // endregion
            // region base tests


            _checkStatuses('Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir');

            checkFuncSync(ResultType.Value, S0, S0);

            _checkStatuses('CV', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir');

            checkFuncSync(ResultType.Value, I0, I0);

            _checkStatuses('CV', 'CV', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir');

            _context26.next = 40;
            return checkFuncAsync(ResultType.Value, A0, A0);

          case 40:
            _checkStatuses('CV', 'CV', 'CV', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir');

            checkFuncSync(ResultType.Value, S1, S1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'Ir', 'Ir', 'Ir', 'Ir');

            checkFuncSync(ResultType.Value, I1, I1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'Ir', 'Ir', 'Ir');

            checkFuncSync(ResultType.Value, S2, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'Ir', 'Ir');

            checkFuncSync(ResultType.Value, I2, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'Ir');

            _context26.next = 51;
            return checkFuncAsync(ResultType.Value, A2, A2);

          case 51:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkSubscribersAll();
            checkFuncNotChanged(allFuncs); // endregion
            // region Without Errors
            // region invalidate
            // region Forward
            // region level 2

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkSubscribersAll();

            _invalidate(S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IrV', 'CV', 'CV');

            checkFuncSync(ResultType.Value, S2, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkSubscribersAll();
            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkSubscribersAll();

            _invalidate(I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrV', 'CV');

            checkFuncSync(ResultType.Value, I2, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkSubscribersAll();
            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkSubscribersAll();

            _invalidate(A2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrV');

            _context26.next = 76;
            return checkFuncAsync(ResultType.Value, A2, A2);

          case 76:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkSubscribersAll();
            checkFuncNotChanged(allFuncs); // endregion
            // region level 1

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkSubscribersAll();

            _invalidate(S1);

            _checkStatuses('CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV', 'CV');

            checkFuncSync(ResultType.Value, S2, S1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV');

            checkFuncSync(ResultType.Value, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkSubscribersAll();
            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkSubscribersAll();

            _invalidate(I1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV');

            checkFuncSync(ResultType.Value, I2, I1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrV');

            _context26.next = 97;
            return checkFuncAsync(ResultType.Value, A2, A2);

          case 97:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkSubscribersAll();
            checkFuncNotChanged(allFuncs); // endregion
            // region level 0

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(S0);

            _checkStatuses('IrV', 'CV', 'CV', 'IV', 'CV', 'IV', 'IV', 'CV'); // console.log(allFuncs.filter(isInvalidated).map(o => o.id))


            checkFuncSync(ResultType.Value, S2, S0);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV');

            checkFuncSync(ResultType.Value, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(I0);

            _checkStatuses('CV', 'IrV', 'CV', 'IV', 'IV', 'IV', 'IV', 'IV');

            checkFuncSync(ResultType.Value, S2, I0, S1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV');

            checkFuncSync(ResultType.Value, I2, I1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrV');

            _context26.next = 117;
            return checkFuncAsync(ResultType.Value, A2, A2);

          case 117:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(A0);

            _checkStatuses('CV', 'CV', 'IrV', 'CV', 'IV', 'CV', 'IV', 'IV');

            _context26.next = 124;
            return checkFuncAsync(ResultType.Value, I2, A0);

          case 124:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IV');

            checkFuncSync(ResultType.Value, A2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs); // endregion
            // endregion
            // region Backward
            // region level 0

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(A0);

            _checkStatuses('CV', 'CV', 'IrV', 'CV', 'IV', 'CV', 'IV', 'IV');

            _context26.next = 133;
            return checkFuncAsync(ResultType.Value, A2, A0);

          case 133:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV');

            checkFuncSync(ResultType.Value, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(I0);

            _checkStatuses('CV', 'IrV', 'CV', 'IV', 'IV', 'IV', 'IV', 'IV');

            _context26.next = 142;
            return checkFuncAsync(ResultType.Value, A2, I0, I1, A2);

          case 142:
            _checkStatuses('CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IrV', 'CV');

            checkFuncSync(ResultType.Value, I2, I2, S1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'CV');

            checkFuncSync(ResultType.Value, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(S0);

            _checkStatuses('IrV', 'CV', 'CV', 'IV', 'CV', 'IV', 'IV', 'CV');

            checkFuncSync(ResultType.Value, I2, S0);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'CV');

            checkFuncSync(ResultType.Value, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs); // endregion
            // region level 1

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(I1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV');

            _context26.next = 161;
            return checkFuncAsync(ResultType.Value, A2, I1, A2);

          case 161:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrV', 'CV');

            checkFuncSync(ResultType.Value, I2, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(S1);

            _checkStatuses('CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV', 'CV');

            checkFuncSync(ResultType.Value, I2, S1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'CV');

            checkFuncSync(ResultType.Value, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs); // endregion
            // region level 2

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(A2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrV');

            _context26.next = 178;
            return checkFuncAsync(ResultType.Value, A2, A2);

          case 178:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrV', 'CV');

            checkFuncSync(ResultType.Value, I2, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IrV', 'CV', 'CV');

            checkFuncSync(ResultType.Value, S2, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs); // endregion
            // endregion
            // endregion
            // region invalidate during calc async

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(I1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV');

            checkFuncSync(ResultType.Value, I2, I1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrV');

            promise1 = checkFuncAsync(ResultType.Value, A2, A2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'caV');

            _invalidate(I1);

            checkUnsubscribers(A2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'caV');

            checkFuncSync(ResultType.Value, I2, I1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'caV');

            _context26.next = 206;
            return promise1;

          case 206:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncSync(ResultType.Value, A2);
            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(A0);

            _checkStatuses('CV', 'CV', 'IrV', 'CV', 'IV', 'CV', 'IV', 'IV');

            promise1 = checkFuncAsync(ResultType.Value, A2, A0);

            _checkStatuses('CV', 'CV', 'caV', 'CV', 'xaV', 'CV', 'IV', 'xaV');

            _invalidate(A0);

            _checkStatuses('CV', 'CV', 'IrcaV', 'CV', 'IxaV', 'CV', 'IV', 'IxaV');

            promise2 = checkFuncAsync(ResultType.Value, I2);

            _checkStatuses('CV', 'CV', 'IrcaV', 'CV', 'IxaV', 'CV', 'xaV', 'IxaV');

            _context26.next = 220;
            return checkFuncAsync(ResultType.Value, A0);

          case 220:
            _checkStatuses('CV', 'CV', 'IrV', 'CV', 'IV', 'CV', 'IV', 'IV');

            _invalidate(I0);

            _checkStatuses('CV', 'IrV', 'IrV', 'IV', 'IV', 'IV', 'IV', 'IV');

            _context26.next = 225;
            return promise1;

          case 225:
            _checkStatuses('CV', 'IrV', 'IrV', 'IV', 'IV', 'IV', 'IV', 'IV');

            _context26.next = 228;
            return checkFuncAsync(ResultType.Value, I2, I0, S1, I1, A0);

          case 228:
            checkCallHistory(I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'IrV');

            _context26.next = 232;
            return promise2;

          case 232:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'IrV');

            checkCallHistory();
            _context26.next = 236;
            return checkFuncAsync(ResultType.Value, A2, A2);

          case 236:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'CV');

            checkFuncSync(ResultType.Value, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(A0, I0);

            _checkStatuses('CV', 'IrV', 'IrV', 'IV', 'IV', 'IV', 'IV', 'IV');

            promise1 = checkFuncAsync(ResultType.Value, A2, I0, I1, A0);

            _checkStatuses('CV', 'CV', 'caV', 'IrV', 'caV', 'IV', 'IV', 'xaV');

            _invalidate(A0);

            _checkStatuses('CV', 'CV', 'IrcaV', 'IrV', 'IcaV', 'IV', 'IV', 'IxaV');

            promise2 = checkFuncAsync(ResultType.Value, I2, S1);

            _checkStatuses('CV', 'CV', 'IrcaV', 'CV', 'IcaV', 'IV', 'xaV', 'IxaV');

            _context26.next = 251;
            return checkFuncAsync(ResultType.Value, A0);

          case 251:
            checkCallHistory(A0);

            _checkStatuses('CV', 'CV', 'caV', 'CV', 'IcaV', 'IV', 'xaV', 'IxaV');

            _context26.next = 255;
            return checkFuncAsync(ResultType.Value, A0);

          case 255:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'caV');

            checkCallHistory(A2, I2);

            _invalidate(I0);

            _checkStatuses('CV', 'IrV', 'CV', 'IV', 'IV', 'IV', 'IV', 'caV');

            _context26.next = 261;
            return promise1;

          case 261:
            _checkStatuses('CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IrV', 'CV');

            checkCallHistory(I0, I1);
            checkFuncSync(ResultType.Value, I2, I2, S1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'CV');

            _context26.next = 267;
            return promise2;

          case 267:
            checkCallHistory();
            checkFuncSync(ResultType.Value, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV'); // endregion
            // endregion
            // region With Errors
            // region invalidate
            // region Forward
            // region level 2
            // region error


            setResultsAsError(S2, I2, A2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IrV', 'CV', 'CV');

            checkFuncSync(ResultType.Error, S2, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CV', 'CV');

            _invalidate(I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'IrV', 'CV');

            checkFuncSync(ResultType.Error, I2, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CVE', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CVE', 'CV');

            _invalidate(A2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CVE', 'IrV');

            _context26.next = 290;
            return checkFuncAsync(ResultType.Error, A2, A2);

          case 290:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CVE', 'CVE');

            checkFuncNotChanged(allFuncs); // endregion
            // region value

            setResultsAsError();

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CVE', 'CVE');

            _invalidate(S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IrVE', 'CVE', 'CVE');

            checkFuncSync(ResultType.Value, S2, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CVE');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CVE');

            _invalidate(I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrVE', 'CVE');

            checkFuncSync(ResultType.Value, I2, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CVE');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CVE');

            _invalidate(A2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrVE');

            _context26.next = 310;
            return checkFuncAsync(ResultType.Value, A2, A2);

          case 310:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs); // endregion
            // endregion
            // region level 1

            setResultsAsError(S1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(S1);

            _checkStatuses('CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV', 'CV');

            checkFuncSync(ResultType.Error, S2, S1, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'IrV', 'CV');

            checkFuncSync(ResultType.Error, I2, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE', 'CV');

            _invalidate(S1);

            _checkStatuses('CV', 'CV', 'CV', 'IrVE', 'CV', 'IVE', 'IVE', 'CV');

            checkFuncSync(ResultType.Error, S2, S1);

            _checkStatuses('CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'IVE', 'CV');

            checkFuncSync(ResultType.Error, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE', 'CV');

            checkFuncNotChanged(allFuncs);
            setResultsAsError();

            _checkStatuses('CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE', 'CV');

            _invalidate(S1);

            _checkStatuses('CV', 'CV', 'CV', 'IrVE', 'CV', 'IVE', 'IVE', 'CV');

            checkFuncSync(ResultType.Value, S2, S1, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrVE', 'CV');

            checkFuncSync(ResultType.Value, I2, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(S1);

            _checkStatuses('CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV', 'CV');

            checkFuncSync(ResultType.Value, S2, S1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV');

            checkFuncSync(ResultType.Value, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);
            setResultsAsError(I1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(I1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV');

            checkFuncSync(ResultType.Error, I2, I1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'IrV');

            _context26.next = 354;
            return checkFuncAsync(ResultType.Error, A2, A2);

          case 354:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE');

            _invalidate(I1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrVE', 'CV', 'IVE', 'IVE');

            checkFuncSync(ResultType.Error, I2, I1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'IrVE');

            _context26.next = 363;
            return checkFuncAsync(ResultType.Error, A2, A2);

          case 363:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE');

            checkFuncNotChanged(allFuncs);
            setResultsAsError();

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE');

            _invalidate(I1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrVE', 'CV', 'IVE', 'IVE');

            checkFuncSync(ResultType.Value, I2, I1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrVE');

            _context26.next = 373;
            return checkFuncAsync(ResultType.Value, A2, A2);

          case 373:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(I1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV');

            checkFuncSync(ResultType.Value, I2, I1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrV');

            _context26.next = 382;
            return checkFuncAsync(ResultType.Value, A2, A2);

          case 382:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs); // endregion
            // region level 0

            setResultsAsError(S0);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(S0);

            _checkStatuses('IrV', 'CV', 'CV', 'IV', 'CV', 'IV', 'IV', 'CV'); // console.log(allFuncs.filter(isInvalidated).map(o => o.id))


            checkFuncSync(ResultType.Error, S2, S0, S1, S2);

            _checkStatuses('CVE', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'IrV', 'CV');

            checkFuncSync(ResultType.Error, I2, I2);

            _checkStatuses('CVE', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CVE', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE', 'CV');

            _invalidate(S0);

            _checkStatuses('IrVE', 'CV', 'CV', 'IVE', 'CV', 'IVE', 'IVE', 'CV'); // console.log(allFuncs.filter(isInvalidated).map(o => o.id))


            checkFuncSync(ResultType.Error, S2, S0);

            _checkStatuses('CVE', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'IVE', 'CV');

            checkFuncSync(ResultType.Error, I2);

            _checkStatuses('CVE', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE', 'CV');

            checkFuncNotChanged(allFuncs);
            setResultsAsError();

            _checkStatuses('CVE', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE', 'CV');

            _invalidate(S0);

            _checkStatuses('IrVE', 'CV', 'CV', 'IVE', 'CV', 'IVE', 'IVE', 'CV'); // console.log(allFuncs.filter(isInvalidated).map(o => o.id))


            checkFuncSync(ResultType.Value, S2, S0, S1, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrVE', 'CV');

            checkFuncSync(ResultType.Value, I2, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(S0);

            _checkStatuses('IrV', 'CV', 'CV', 'IV', 'CV', 'IV', 'IV', 'CV'); // console.log(allFuncs.filter(isInvalidated).map(o => o.id))


            checkFuncSync(ResultType.Value, S2, S0);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV');

            checkFuncSync(ResultType.Value, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);
            setResultsAsError(I0);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(I0);

            _checkStatuses('CV', 'IrV', 'CV', 'IV', 'IV', 'IV', 'IV', 'IV');

            checkFuncSync(ResultType.Error, S2, I0, S1, S2);

            _checkStatuses('CV', 'CVE', 'CV', 'CVE', 'IrV', 'CVE', 'IrV', 'IV');

            checkFuncSync(ResultType.Error, I2, I2);

            _checkStatuses('CV', 'CVE', 'CV', 'CVE', 'IrV', 'CVE', 'CVE', 'IV');

            _context26.next = 428;
            return checkFuncAsync(ResultType.Error, A2, I1, A2);

          case 428:
            _checkStatuses('CV', 'CVE', 'CV', 'CVE', 'CVE', 'CVE', 'CVE', 'CVE');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CVE', 'CV', 'CVE', 'CVE', 'CVE', 'CVE', 'CVE');

            _invalidate(I0);

            _checkStatuses('CV', 'IrVE', 'CV', 'IVE', 'IVE', 'IVE', 'IVE', 'IVE');

            checkFuncSync(ResultType.Error, S2, I0, S1, S2);

            _checkStatuses('CV', 'CVE', 'CV', 'CVE', 'IrVE', 'CVE', 'IrVE', 'IVE');

            checkFuncSync(ResultType.Error, I2, I2);

            _checkStatuses('CV', 'CVE', 'CV', 'CVE', 'IrVE', 'CVE', 'CVE', 'IVE');

            _context26.next = 439;
            return checkFuncAsync(ResultType.Error, A2, I1, A2);

          case 439:
            _checkStatuses('CV', 'CVE', 'CV', 'CVE', 'CVE', 'CVE', 'CVE', 'CVE');

            checkFuncNotChanged(allFuncs);
            setResultsAsError();

            _checkStatuses('CV', 'CVE', 'CV', 'CVE', 'CVE', 'CVE', 'CVE', 'CVE');

            _invalidate(I0);

            _checkStatuses('CV', 'IrVE', 'CV', 'IVE', 'IVE', 'IVE', 'IVE', 'IVE');

            checkFuncSync(ResultType.Value, S2, I0, S1, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrVE', 'CV', 'IrVE', 'IVE');

            checkFuncSync(ResultType.Value, I2, I2, I1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrVE');

            _context26.next = 451;
            return checkFuncAsync(ResultType.Value, A2, A2);

          case 451:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(I0);

            _checkStatuses('CV', 'IrV', 'CV', 'IV', 'IV', 'IV', 'IV', 'IV');

            checkFuncSync(ResultType.Value, S2, I0, S1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV');

            checkFuncSync(ResultType.Value, I2, I1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrV');

            _context26.next = 462;
            return checkFuncAsync(ResultType.Value, A2, A2);

          case 462:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);
            setResultsAsError(A0);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(A0);

            _checkStatuses('CV', 'CV', 'IrV', 'CV', 'IV', 'CV', 'IV', 'IV');

            _context26.next = 470;
            return checkFuncAsync(ResultType.Error, I2, A0);

          case 470:
            checkCallHistory(I1, I2);

            _checkStatuses('CV', 'CV', 'CVE', 'CV', 'CVE', 'CV', 'CVE', 'IrV');

            _context26.next = 474;
            return checkFuncAsync(ResultType.Error, A2, A2);

          case 474:
            _checkStatuses('CV', 'CV', 'CVE', 'CV', 'CVE', 'CV', 'CVE', 'CVE');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CVE', 'CV', 'CVE', 'CV', 'CVE', 'CVE');

            _invalidate(A0);

            _checkStatuses('CV', 'CV', 'IrVE', 'CV', 'IVE', 'CV', 'IVE', 'IVE');

            _context26.next = 481;
            return checkFuncAsync(ResultType.Error, I2, A0);

          case 481:
            _checkStatuses('CV', 'CV', 'CVE', 'CV', 'CVE', 'CV', 'CVE', 'IVE');

            checkFuncSync(ResultType.Error, A2);

            _checkStatuses('CV', 'CV', 'CVE', 'CV', 'CVE', 'CV', 'CVE', 'CVE');

            checkFuncNotChanged(allFuncs);
            setResultsAsError();

            _checkStatuses('CV', 'CV', 'CVE', 'CV', 'CVE', 'CV', 'CVE', 'CVE');

            _invalidate(A0);

            _checkStatuses('CV', 'CV', 'IrVE', 'CV', 'IVE', 'CV', 'IVE', 'IVE');

            _context26.next = 491;
            return checkFuncAsync(ResultType.Value, I2, A0);

          case 491:
            checkCallHistory(I1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrVE');

            _context26.next = 495;
            return checkFuncAsync(ResultType.Value, A2, A2);

          case 495:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(A0);

            _checkStatuses('CV', 'CV', 'IrV', 'CV', 'IV', 'CV', 'IV', 'IV');

            _context26.next = 502;
            return checkFuncAsync(ResultType.Value, I2, A0);

          case 502:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IV');

            checkFuncSync(ResultType.Value, A2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs); // endregion
            // endregion
            // region Backward
            // region level 0

            setResultsAsError(A0);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(A0);

            _checkStatuses('CV', 'CV', 'IrV', 'CV', 'IV', 'CV', 'IV', 'IV');

            _context26.next = 512;
            return checkFuncAsync(ResultType.Error, A2, A0);

          case 512:
            checkCallHistory(I1, A2);

            _checkStatuses('CV', 'CV', 'CVE', 'CV', 'CVE', 'CV', 'IrV', 'CVE');

            checkFuncSync(ResultType.Error, I2, I2);

            _checkStatuses('CV', 'CV', 'CVE', 'CV', 'CVE', 'CV', 'CVE', 'CVE');

            checkFuncNotChanged(allFuncs);
            setResultsAsError();

            _checkStatuses('CV', 'CV', 'CVE', 'CV', 'CVE', 'CV', 'CVE', 'CVE');

            _invalidate(A0);

            _checkStatuses('CV', 'CV', 'IrVE', 'CV', 'IVE', 'CV', 'IVE', 'IVE');

            _context26.next = 523;
            return checkFuncAsync(ResultType.Value, A2, A0);

          case 523:
            checkCallHistory(I1, A2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrVE', 'CV');

            checkFuncSync(ResultType.Value, I2, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(A0);

            _checkStatuses('CV', 'CV', 'IrV', 'CV', 'IV', 'CV', 'IV', 'IV');

            _context26.next = 533;
            return checkFuncAsync(ResultType.Value, A2, A0);

          case 533:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV');

            checkFuncSync(ResultType.Value, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);
            setResultsAsError(I0);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(I0);

            _checkStatuses('CV', 'IrV', 'CV', 'IV', 'IV', 'IV', 'IV', 'IV');

            _context26.next = 543;
            return checkFuncAsync(ResultType.Error, A2, I0, I1, A2);

          case 543:
            _checkStatuses('CV', 'CVE', 'CV', 'IrV', 'CVE', 'IV', 'IrV', 'CVE');

            checkFuncSync(ResultType.Error, I2, I2, S1);

            _checkStatuses('CV', 'CVE', 'CV', 'CVE', 'CVE', 'IrV', 'CVE', 'CVE');

            checkFuncSync(ResultType.Error, S2, S2);

            _checkStatuses('CV', 'CVE', 'CV', 'CVE', 'CVE', 'CVE', 'CVE', 'CVE');

            checkFuncNotChanged(allFuncs);
            setResultsAsError();

            _checkStatuses('CV', 'CVE', 'CV', 'CVE', 'CVE', 'CVE', 'CVE', 'CVE');

            _invalidate(I0);

            _checkStatuses('CV', 'IrVE', 'CV', 'IVE', 'IVE', 'IVE', 'IVE', 'IVE');

            _context26.next = 555;
            return checkFuncAsync(ResultType.Value, A2, I0, I1, A2);

          case 555:
            _checkStatuses('CV', 'CV', 'CV', 'IrVE', 'CV', 'IVE', 'IVE', 'CV');

            checkFuncSync(ResultType.Value, I2, S1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IrVE', 'CV', 'CV');

            checkFuncSync(ResultType.Value, S2, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(I0);

            _checkStatuses('CV', 'IrV', 'CV', 'IV', 'IV', 'IV', 'IV', 'IV');

            _context26.next = 566;
            return checkFuncAsync(ResultType.Value, A2, I0, I1, A2);

          case 566:
            _checkStatuses('CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IrV', 'CV');

            checkFuncSync(ResultType.Value, I2, I2, S1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'CV');

            checkFuncSync(ResultType.Value, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);
            setResultsAsError(S0);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(S0);

            _checkStatuses('IrV', 'CV', 'CV', 'IV', 'CV', 'IV', 'IV', 'CV');

            checkFuncSync(ResultType.Error, I2, S0, S1, I2);

            _checkStatuses('CVE', 'CV', 'CV', 'CVE', 'CV', 'IrV', 'CVE', 'CV');

            checkFuncSync(ResultType.Error, S2, S2);

            _checkStatuses('CVE', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE', 'CV');

            checkFuncNotChanged(allFuncs);
            setResultsAsError();

            _checkStatuses('CVE', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE', 'CV');

            _invalidate(S0);

            _checkStatuses('IrVE', 'CV', 'CV', 'IVE', 'CV', 'IVE', 'IVE', 'CV');

            checkFuncSync(ResultType.Value, I2, S0, S1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IrVE', 'CV', 'CV');

            checkFuncSync(ResultType.Value, S2, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(S0);

            _checkStatuses('IrV', 'CV', 'CV', 'IV', 'CV', 'IV', 'IV', 'CV');

            checkFuncSync(ResultType.Value, I2, S0);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'CV');

            checkFuncSync(ResultType.Value, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs); // endregion
            // region level 1

            setResultsAsError(I1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(I1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV');

            _context26.next = 604;
            return checkFuncAsync(ResultType.Error, A2, I1, A2);

          case 604:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CVE', 'CV', 'IrV', 'CVE');

            checkFuncSync(ResultType.Error, I2, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE');

            checkFuncNotChanged(allFuncs);
            setResultsAsError();

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE');

            _invalidate(I1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrVE', 'CV', 'IVE', 'IVE');

            _context26.next = 614;
            return checkFuncAsync(ResultType.Value, A2, I1, A2);

          case 614:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrVE', 'CV');

            checkFuncSync(ResultType.Value, I2, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(I1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV');

            _context26.next = 623;
            return checkFuncAsync(ResultType.Value, A2, I1, A2);

          case 623:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrV', 'CV');

            checkFuncSync(ResultType.Value, I2, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);
            setResultsAsError(S1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(S1);

            _checkStatuses('CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV', 'CV');

            checkFuncSync(ResultType.Error, I2, S1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CVE', 'CV', 'IrV', 'CVE', 'CV');

            checkFuncSync(ResultType.Error, S2, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE', 'CV');

            checkFuncNotChanged(allFuncs);
            setResultsAsError();

            _checkStatuses('CV', 'CV', 'CV', 'CVE', 'CV', 'CVE', 'CVE', 'CV');

            _invalidate(S1);

            _checkStatuses('CV', 'CV', 'CV', 'IrVE', 'CV', 'IVE', 'IVE', 'CV');

            checkFuncSync(ResultType.Value, I2, S1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IrVE', 'CV', 'CV');

            checkFuncSync(ResultType.Value, S2, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(S1);

            _checkStatuses('CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV', 'CV');

            checkFuncSync(ResultType.Value, I2, S1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'CV');

            checkFuncSync(ResultType.Value, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs); // endregion
            // region level 2
            // region error

            setResultsAsError(S2, I2, A2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(A2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrV');

            _context26.next = 659;
            return checkFuncAsync(ResultType.Error, A2, A2);

          case 659:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CVE');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CVE');

            _invalidate(I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrV', 'CVE');

            checkFuncSync(ResultType.Error, I2, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CVE');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CVE');

            _invalidate(S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IrV', 'CVE', 'CVE');

            checkFuncSync(ResultType.Error, S2, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CVE', 'CVE');

            checkFuncNotChanged(allFuncs); // endregion
            // region value

            setResultsAsError();

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CVE', 'CVE');

            _invalidate(A2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CVE', 'IrVE');

            _context26.next = 679;
            return checkFuncAsync(ResultType.Value, A2, A2);

          case 679:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CVE', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CVE', 'CV');

            _invalidate(I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'IrVE', 'CV');

            checkFuncSync(ResultType.Value, I2, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CVE', 'CV', 'CV');

            _invalidate(S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IrVE', 'CV', 'CV');

            checkFuncSync(ResultType.Value, S2, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs); // endregion
            // endregion
            // endregion
            // endregion
            // region invalidate during calc async

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(I1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IV');

            checkFuncSync(ResultType.Value, I2, I1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'IrV');

            promise1 = checkFuncAsync(ResultType.Value, A2, A2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'caV');

            _invalidate(I1);

            checkUnsubscribers(A2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'caV');

            checkFuncSync(ResultType.Value, I2, I1, I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'caV');

            _context26.next = 707;
            return promise1;

          case 707:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncSync(ResultType.Value, A2);
            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(A0);

            _checkStatuses('CV', 'CV', 'IrV', 'CV', 'IV', 'CV', 'IV', 'IV');

            promise1 = checkFuncAsync(ResultType.Value, A2, A0);

            _checkStatuses('CV', 'CV', 'caV', 'CV', 'xaV', 'CV', 'IV', 'xaV');

            _invalidate(A0);

            _checkStatuses('CV', 'CV', 'IrcaV', 'CV', 'IxaV', 'CV', 'IV', 'IxaV');

            promise2 = checkFuncAsync(ResultType.Value, I2);

            _checkStatuses('CV', 'CV', 'IrcaV', 'CV', 'IxaV', 'CV', 'xaV', 'IxaV');

            _context26.next = 721;
            return checkFuncAsync(ResultType.Value, A0);

          case 721:
            _checkStatuses('CV', 'CV', 'IrV', 'CV', 'IV', 'CV', 'IV', 'IV');

            _invalidate(I0);

            _checkStatuses('CV', 'IrV', 'IrV', 'IV', 'IV', 'IV', 'IV', 'IV');

            _context26.next = 726;
            return promise1;

          case 726:
            _checkStatuses('CV', 'IrV', 'IrV', 'IV', 'IV', 'IV', 'IV', 'IV');

            _context26.next = 729;
            return checkFuncAsync(ResultType.Value, I2, I0, S1, I1, A0);

          case 729:
            checkCallHistory(I2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'IrV');

            _context26.next = 733;
            return promise2;

          case 733:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'IrV');

            checkCallHistory();
            _context26.next = 737;
            return checkFuncAsync(ResultType.Value, A2, A2);

          case 737:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'CV');

            checkFuncSync(ResultType.Value, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            _invalidate(A0, I0);

            _checkStatuses('CV', 'IrV', 'IrV', 'IV', 'IV', 'IV', 'IV', 'IV');

            promise1 = checkFuncAsync(ResultType.Value, A2, I0, I1, A0);

            _checkStatuses('CV', 'CV', 'caV', 'IrV', 'caV', 'IV', 'IV', 'xaV');

            _invalidate(A0);

            _checkStatuses('CV', 'CV', 'IrcaV', 'IrV', 'IcaV', 'IV', 'IV', 'IxaV');

            promise2 = checkFuncAsync(ResultType.Value, I2, S1);

            _checkStatuses('CV', 'CV', 'IrcaV', 'CV', 'IcaV', 'IV', 'xaV', 'IxaV');

            _context26.next = 752;
            return checkFuncAsync(ResultType.Value, A0);

          case 752:
            checkCallHistory(A0);

            _checkStatuses('CV', 'CV', 'caV', 'CV', 'IcaV', 'IV', 'xaV', 'IxaV');

            _context26.next = 756;
            return checkFuncAsync(ResultType.Value, A0);

          case 756:
            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'caV');

            checkCallHistory(A2, I2);

            _invalidate(I0);

            _checkStatuses('CV', 'IrV', 'CV', 'IV', 'IV', 'IV', 'IV', 'caV');

            _context26.next = 762;
            return promise1;

          case 762:
            _checkStatuses('CV', 'CV', 'CV', 'IrV', 'CV', 'IV', 'IrV', 'CV');

            checkCallHistory(I0, I1);
            checkFuncSync(ResultType.Value, I2, I2, S1);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'IV', 'CV', 'CV');

            _context26.next = 768;
            return promise2;

          case 768:
            checkCallHistory();
            checkFuncSync(ResultType.Value, S2);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV');

            checkFuncNotChanged(allFuncs);

            _checkStatuses('CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV', 'CV'); // endregion
            // endregion
            // region Loops
            // region init


            SL = funcSync('SL', deferred);
            IL = funcSyncIterator('IL', deferred);
            AL = funcAsync('AL', deferred);
            SL3_dependencies = [];
            SL3 = _funcCall(SL, 'SL33()', SL3_dependencies, 3, 3);
            SL4 = _funcCall(SL, 'SL44()', [SL3], 4, 4);
            SL5 = _funcCall(SL, 'SL55()', [SL4], 5, 5);
            SL3.hasLoop = true;
            SL4.hasLoop = true;
            SL5.hasLoop = true;
            IL3_dependencies = [];
            IL3 = _funcCall(IL, 'IL33()', IL3_dependencies, 3, 3);
            IL4 = _funcCall(IL, 'IL44()', [IL3], 4, 4);
            IL5 = _funcCall(IL, 'IL55()', [IL4], 5, 5);
            IL3.hasLoop = true;
            IL4.hasLoop = true;
            IL5.hasLoop = true;
            AL3_dependencies = [];
            AL3 = _funcCall(AL, 'AL33()', AL3_dependencies, 3, 3);
            AL4 = _funcCall(AL, 'AL44()', [AL3], 4, 4);
            AL5 = _funcCall(AL, 'AL55()', [AL4], 5, 5);
            AL3.hasLoop = true;
            AL4.hasLoop = true;
            AL5.hasLoop = true; // endregion
            // region check init

            SL3_dependencies.push(SL5);

            _Assert.assert.strictEqual(SL3.id, 'SL33()');

            _Assert.assert.strictEqual(SL4.id, 'SL44()');

            _Assert.assert.strictEqual(SL5.id, 'SL55()');

            IL3_dependencies.push(IL5);

            _Assert.assert.strictEqual(IL3.id, 'IL33()');

            _Assert.assert.strictEqual(IL4.id, 'IL44()');

            _Assert.assert.strictEqual(IL5.id, 'IL55()');

            AL3_dependencies.push(AL5);

            _Assert.assert.strictEqual(AL3.id, 'AL33()');

            _Assert.assert.strictEqual(AL4.id, 'AL44()');

            _Assert.assert.strictEqual(AL5.id, 'AL55()'); // endregion
            // region sync


            _Assert.assert.throws(function () {
              checkFuncSync(ResultType.Value, SL3, SL3);
            }, _helpers.InternalError, /\bsync loop\b/i);

            checkCallHistory(SL3, SL5, SL4);

            _Assert.assert.throws(function () {
              checkFuncSync(ResultType.Value, SL4, SL4);
            }, _helpers.InternalError, /\bsync loop\b/i);

            checkCallHistory();

            _Assert.assert.throws(function () {
              checkFuncSync(ResultType.Value, SL5, SL5);
            }, _helpers.InternalError, /\bsync loop\b/i);

            checkCallHistory(); // endregion
            // region iterator

            _Assert.assert.throws(function () {
              checkFuncSync(ResultType.Value, IL3, IL3);
            }, _helpers.InternalError, /\bsync loop\b/i);

            checkCallHistory(IL3, IL5, IL4);

            _Assert.assert.throws(function () {
              checkFuncSync(ResultType.Value, IL4, IL4);
            }, _helpers.InternalError, /\bsync loop\b/i); // checkCallHistory(IL4, IL3, IL5)


            _Assert.assert.throws(function () {
              checkFuncSync(ResultType.Value, IL5, IL5);
            }, _helpers.InternalError, /\bsync loop\b/i); // checkCallHistory(IL5, IL4, IL3)
            // endregion
            // region async


            _context26.next = 821;
            return _Assert.assert.throwsAsync( /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
              return _regenerator.default.wrap(function _callee3$(_context22) {
                while (1) {
                  switch (_context22.prev = _context22.next) {
                    case 0:
                      _context22.next = 2;
                      return checkFuncAsync(ResultType.Value, AL3, AL3);

                    case 2:
                    case "end":
                      return _context22.stop();
                  }
                }
              }, _callee3);
            })), _helpers.InternalError, /\basync loop\b/i);

          case 821:
            checkCallHistory(AL5, AL4);
            _context26.next = 824;
            return _Assert.assert.throwsAsync( /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4() {
              return _regenerator.default.wrap(function _callee4$(_context23) {
                while (1) {
                  switch (_context23.prev = _context23.next) {
                    case 0:
                      _context23.next = 2;
                      return checkFuncAsync(ResultType.Value, AL4);

                    case 2:
                    case "end":
                      return _context23.stop();
                  }
                }
              }, _callee4);
            })), _helpers.InternalError, /\basync loop\b/i);

          case 824:
            checkCallHistory();
            _context26.next = 827;
            return _Assert.assert.throwsAsync( /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5() {
              return _regenerator.default.wrap(function _callee5$(_context24) {
                while (1) {
                  switch (_context24.prev = _context24.next) {
                    case 0:
                      _context24.next = 2;
                      return checkFuncAsync(ResultType.Value, AL5);

                    case 2:
                    case "end":
                      return _context24.stop();
                  }
                }
              }, _callee5);
            })), _helpers.InternalError, /\basync loop\b/i);

          case 827:
            checkCallHistory(); // endregion
            // endregion

            setAlwaysChange();
            stopCheckCurrentState();
            return _context26.abrupt("return", {
              states: (0, _map.default)(_context25 = [S0, I0, A0, S1, I1, S2, I2, A2, AL3, AL4, AL5]).call(_context25, function (o) {
                return o.state;
              })
            });

          case 831:
          case "end":
            return _context26.stop();
        }
      }
    }, _callee6);
  }));
  return _baseTest.apply(this, arguments);
}

function lazyTest(_x2) {
  return _lazyTest.apply(this, arguments);
} // endregion


function _lazyTest() {
  _lazyTest = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee7(deferred) {
    var _context27, _context28;

    var stopCheckCurrentState, S, A, SL, AL, A0, S1, SL1, A1, AL1, A2, AL2, allFuncs, _checkStatuses, _clearStates, promise1, promise2, promise3;

    return _regenerator.default.wrap(function _callee7$(_context29) {
      while (1) {
        switch (_context29.prev = _context29.next) {
          case 0:
            _clearStates = function _clearStates2() {
              clearStates.apply(void 0, allFuncs);
            };

            if (!(deferred == null)) {
              _context29.next = 7;
              break;
            }

            _context29.next = 4;
            return lazyTest(false);

          case 4:
            _context29.next = 6;
            return lazyTest(true);

          case 6:
            return _context29.abrupt("return", _context29.sent);

          case 7:
            stopCheckCurrentState = checkCurrentStateAsyncContinuous(null);
            callHistoryCheckDisabled = deferred; // region init

            S = funcSync('S', deferred);
            A = funcAsync('A', deferred);
            SL = funcSync('SL', deferred);
            AL = funcAsync('AL', deferred);
            A0 = funcCall(A, new ThisObj('_')); // A(_)

            S1 = funcCall(S, [A0], 1); // S1(A(_))

            SL1 = funcCall(SL, [A0], 1); // SL1(A(_))

            A1 = funcCall(A, [A0], 1); // A1(A(_))

            AL1 = funcCall(AL, [A0], 1); // AL1(A(_))

            A2 = funcCall(A, [A0], 2); // A2(A(_))

            AL2 = funcCall(AL, [A0], 2); // AL2(A(_))

            setLazyCalls(SL1, AL1, AL2);
            allFuncs = [A0, S1, SL1, A1, AL1, A2, AL2];
            _checkStatuses = checkStatuses.apply(void 0, allFuncs); // function _checkSubscribersAll() {
            // 	checkSubscribers(S0, S1)
            // 	checkSubscribers(I0, S1, I1)
            // 	checkSubscribers(A0, I1)
            // 	checkSubscribers(S1, S2, I2)
            // 	checkSubscribers(I1, I2, A2)
            // 	checkSubscribers(S2)
            // 	checkSubscribers(I2)
            // 	checkSubscribers(A2)
            // }
            //
            // function _checkUnsubscribersAll() {
            // 	checkUnsubscribers(S0)
            // 	checkUnsubscribers(I0)
            // 	checkUnsubscribers(A0)
            // 	checkUnsubscribers(S1, S0, I0)
            // 	checkUnsubscribers(I1, I0, A0)
            // 	checkUnsubscribers(S2, S1)
            // 	checkUnsubscribers(I2, S1, I1)
            // 	checkUnsubscribers(A2, I1)
            // }
            //
            // function checkSubscribersAll() {
            // 	_checkSubscribersAll()
            // 	_checkUnsubscribersAll()
            // }

            // endregion
            // region check init
            _Assert.assert.strictEqual(A0.id, 'A(_)');

            _Assert.assert.strictEqual(S1.id, 'S1(A(_))');

            _Assert.assert.strictEqual(SL1.id, 'SL1(A(_))');

            _Assert.assert.strictEqual(A1.id, 'A1(A(_))');

            _Assert.assert.strictEqual(AL1.id, 'AL1(A(_))');

            _Assert.assert.strictEqual(A2.id, 'A2(A(_))');

            _Assert.assert.strictEqual(AL2.id, 'AL2(A(_))'); // endregion
            // region base tests
            // SL


            _checkStatuses('Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir');

            checkFuncSync(ResultType.Value, SL1, SL1, A0);

            _checkStatuses('ca', 'Ir', 'CV', 'Ir', 'Ir', 'Ir', 'Ir');

            _context29.next = 35;
            return checkFuncAsync(ResultType.Value, A0);

          case 35:
            _checkStatuses('CV', 'Ir', 'IrV', 'Ir', 'Ir', 'Ir', 'Ir');

            checkFuncSync(ResultType.Value, SL1, SL1);

            _checkStatuses('CV', 'Ir', 'CV', 'Ir', 'Ir', 'Ir', 'Ir');

            _invalidate(A0);

            _checkStatuses('IrV', 'Ir', 'IV', 'Ir', 'Ir', 'Ir', 'Ir');

            checkFuncSync(ResultType.Value, SL1, A0);

            _checkStatuses('caV', 'Ir', 'CV', 'Ir', 'Ir', 'Ir', 'Ir');

            _context29.next = 44;
            return checkFuncAsync(ResultType.Value, A0);

          case 44:
            _checkStatuses('CV', 'Ir', 'CV', 'Ir', 'Ir', 'Ir', 'Ir');

            checkCallHistory();

            _clearStates(); // SL-A


            _checkStatuses('Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir');

            checkFuncSync(ResultType.Value, SL1, SL1, A0);

            _checkStatuses('ca', 'Ir', 'CV', 'Ir', 'Ir', 'Ir', 'Ir');

            promise1 = checkFuncAsync(ResultType.Value, A1, A1);

            _checkStatuses('ca', 'Ir', 'CV', 'ca', 'Ir', 'Ir', 'Ir');

            _context29.next = 54;
            return promise1;

          case 54:
            _checkStatuses('CV', 'Ir', 'IrV', 'CV', 'Ir', 'Ir', 'Ir');

            checkFuncSync(ResultType.Value, SL1, SL1);

            _checkStatuses('CV', 'Ir', 'CV', 'CV', 'Ir', 'Ir', 'Ir');

            checkCallHistory();

            _clearStates(); // SL-A-AL


            _checkStatuses('Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir');

            checkFuncSync(ResultType.Value, SL1, SL1, A0);

            _checkStatuses('ca', 'Ir', 'CV', 'Ir', 'Ir', 'Ir', 'Ir');

            promise1 = checkFuncAsync(ResultType.Value, A1, A1);

            _checkStatuses('ca', 'Ir', 'CV', 'ca', 'Ir', 'Ir', 'Ir');

            promise2 = checkFuncAsync(ResultType.Value, AL1, AL1);

            _checkStatuses('ca', 'Ir', 'CV', 'ca', 'ca', 'Ir', 'Ir');

            _context29.next = 68;
            return promise1;

          case 68:
            _context29.next = 70;
            return promise2;

          case 70:
            _context29.next = 72;
            return A0();

          case 72:
            _context29.next = 74;
            return (0, _helpers2.delay)(100);

          case 74:
            // TODO: test result is different sometimes
            // _checkStatuses('CV',  'Ir', 'IrV',   'CV', 'IrV', 'Ir', 'Ir')
            // checkFuncSync(ResultType.Value, SL1, SL1)
            // _checkStatuses('CV',  'Ir', 'CV',   'CV', 'IrV', 'Ir', 'Ir')
            // promise2 = checkFuncAsync(ResultType.Value, AL1, AL1)
            // _checkStatuses('CV',  'Ir', 'CV',   'CV', 'caV', 'Ir', 'Ir')
            // await promise2
            // _checkStatuses('CV',  'Ir', 'CV',   'CV', 'CV', 'Ir', 'Ir')
            // checkCallHistory()
            _clearStates(); // AL-AL


            _checkStatuses('Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir');

            promise1 = checkFuncAsync(ResultType.Value, AL1, AL1);

            _checkStatuses('Ir', 'Ir', 'Ir', 'Ir', 'ca', 'Ir', 'Ir');

            promise2 = checkFuncAsync(ResultType.Value, AL2, AL2);

            _checkStatuses('Ir', 'Ir', 'Ir', 'Ir', 'ca', 'Ir', 'ca');

            _context29.next = 82;
            return promise1;

          case 82:
            _checkStatuses('ca', 'Ir', 'Ir', 'Ir', 'CV', 'Ir', 'ca');

            _context29.next = 85;
            return promise2;

          case 85:
            checkCallHistory(A0);

            _checkStatuses('ca', 'Ir', 'Ir', 'Ir', 'CV', 'Ir', 'CV');

            _context29.next = 89;
            return checkFuncAsync(ResultType.Value, A0);

          case 89:
            _checkStatuses('CV', 'Ir', 'Ir', 'Ir', 'IrV', 'Ir', 'IrV');

            promise1 = checkFuncAsync(ResultType.Value, AL1, AL1);

            _checkStatuses('CV', 'Ir', 'Ir', 'Ir', 'caV', 'Ir', 'IrV');

            promise2 = checkFuncAsync(ResultType.Value, AL2, AL2);

            _checkStatuses('CV', 'Ir', 'Ir', 'Ir', 'caV', 'Ir', 'caV');

            _context29.next = 96;
            return promise1;

          case 96:
            _context29.next = 98;
            return promise2;

          case 98:
            _checkStatuses('CV', 'Ir', 'Ir', 'Ir', 'CV', 'Ir', 'CV');

            checkCallHistory();

            _clearStates(); // A-AL


            _checkStatuses('Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir');

            promise1 = checkFuncAsync(ResultType.Value, AL1, AL1);

            _checkStatuses('Ir', 'Ir', 'Ir', 'Ir', 'ca', 'Ir', 'Ir');

            promise2 = checkFuncAsync(ResultType.Value, A1, A1);

            _checkStatuses('Ir', 'Ir', 'Ir', 'ca', 'ca', 'Ir', 'Ir');

            _context29.next = 108;
            return promise1;

          case 108:
            _checkStatuses('ca', 'Ir', 'Ir', 'ca', 'CV', 'Ir', 'Ir');

            _context29.next = 111;
            return promise2;

          case 111:
            checkCallHistory(A0);

            _checkStatuses('CV', 'Ir', 'Ir', 'CV', 'IrV', 'Ir', 'Ir');

            promise1 = checkFuncAsync(ResultType.Value, AL1, AL1);

            _checkStatuses('CV', 'Ir', 'Ir', 'CV', 'caV', 'Ir', 'Ir');

            _context29.next = 117;
            return promise1;

          case 117:
            _checkStatuses('CV', 'Ir', 'Ir', 'CV', 'CV', 'Ir', 'Ir');

            checkCallHistory();

            _clearStates(); // AL-SL-S-|-A-A-AL


            setAlwaysChange(A0);
            setLazyCalls(SL1);

            _checkStatuses('Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir', 'Ir');

            promise1 = checkFuncAsync(ResultType.Value, AL1, AL1);

            _checkStatuses('Ir', 'Ir', 'Ir', 'Ir', 'ca', 'Ir', 'Ir');

            _context29.next = 127;
            return promise1;

          case 127:
            checkCallHistory(A0);

            _checkStatuses('CV', 'Ir', 'Ir', 'Ir', 'CV', 'Ir', 'Ir');

            checkFuncSync(ResultType.Value, SL1, SL1);

            _checkStatuses('CV', 'Ir', 'CV', 'Ir', 'CV', 'Ir', 'Ir');

            checkFuncSync(ResultType.Value, S1, S1);

            _checkStatuses('CV', 'CV', 'CV', 'Ir', 'CV', 'Ir', 'Ir'); // ----


            setLazyCalls(SL1, AL1, AL2);

            _invalidate(A0);

            _checkStatuses('IrV', 'IV', 'IV', 'Ir', 'IV', 'Ir', 'Ir');

            promise1 = checkFuncAsync(ResultType.Value, A1, A1);

            _checkStatuses('IrV', 'IV', 'IV', 'ca', 'IV', 'Ir', 'Ir');

            promise2 = checkFuncAsync(ResultType.Value, A2, A2);

            _checkStatuses('IrV', 'IV', 'IV', 'ca', 'IV', 'ca', 'Ir');

            checkFuncSync(ResultType.Value, SL1, A0);

            _checkStatuses('caV', 'IV', 'CV', 'ca', 'IV', 'ca', 'Ir');

            promise3 = checkFuncAsync(ResultType.Value, AL2, AL2);

            _checkStatuses('caV', 'IV', 'CV', 'ca', 'IV', 'ca', 'ca');

            _context29.next = 146;
            return promise1;

          case 146:
            _context29.next = 148;
            return promise2;

          case 148:
            _context29.next = 150;
            return promise3;

          case 150:
            _context29.next = 152;
            return A0();

          case 152:
            _checkStatuses('CV', 'IrV', 'IrV', 'CV', 'IrV', 'CV', 'IrV');

            setAlwaysChange();
            checkCallHistory();

            _clearStates(); // _checkStatuses('CV', 'Ir', 'Ir',   'Ir', 'Ir',   'Ir', 'Ir', 'Ir')
            // checkFuncSync(ResultType.Value, I0, I0)
            // _checkStatuses('CV', 'CV', 'Ir',   'Ir', 'Ir',   'Ir', 'Ir', 'Ir')
            // await checkFuncAsync(ResultType.Value, A0, A0)
            // _checkStatuses('CV', 'CV', 'CV',   'Ir', 'Ir',   'Ir', 'Ir', 'Ir')
            //
            // checkFuncSync(ResultType.Value, S1, S1)
            // _checkStatuses('CV', 'CV', 'CV',   'CV', 'Ir',   'Ir', 'Ir', 'Ir')
            // checkFuncSync(ResultType.Value, I1, I1)
            // _checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'Ir', 'Ir', 'Ir')
            //
            // checkFuncSync(ResultType.Value, S2, S2)
            // _checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'Ir', 'Ir')
            // checkFuncSync(ResultType.Value, I2, I2)
            // _checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'Ir')
            // await checkFuncAsync(ResultType.Value, A2, A2)
            // _checkStatuses('CV', 'CV', 'CV',   'CV', 'CV',   'CV', 'CV', 'CV')
            // checkSubscribersAll()
            //
            // checkFuncNotChanged(allFuncs)
            // endregion


            setLazyCalls();
            setAlwaysChange();
            stopCheckCurrentState();
            return _context29.abrupt("return", {
              states: (0, _map.default)(_context27 = (0, _concat.default)(_context28 = []).call(_context28, allFuncs)).call(_context27, function (o) {
                return o.state;
              })
            });

          case 160:
          case "end":
            return _context29.stop();
        }
      }
    }, _callee7);
  }));
  return _lazyTest.apply(this, arguments);
}