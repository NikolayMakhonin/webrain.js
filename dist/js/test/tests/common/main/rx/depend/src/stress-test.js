"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.stressTest = stressTest;

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _isFinite = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/is-finite"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _async = require("../../../../../../../main/common/async/async");

var _Random = require("../../../../../../../main/common/random/Random");

var _CallState = require("../../../../../../../main/common/rx/depend/core/CallState");

var _contracts = require("../../../../../../../main/common/rx/depend/core/contracts");

var _currentState = require("../../../../../../../main/common/rx/depend/core/current-state");

var _depend = require("../../../../../../../main/common/rx/depend/core/depend");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _helpers = require("../../../../../../../main/common/time/helpers");

var _helpers2 = require("./helpers");

var _marked = /*#__PURE__*/_regenerator.default.mark(runAsIterator);

// endregion
// region helpers
var Pool = /*#__PURE__*/function () {
  function Pool(rnd, createObject) {
    (0, _classCallCheck2.default)(this, Pool);
    this._length = 0;
    this._rnd = rnd;
    this._createObject = createObject;
    this._objects = [];
  }

  (0, _createClass2.default)(Pool, [{
    key: "get",
    value: function get() {
      var _length = this._length,
          _objects = this._objects;

      if (this._length === 0) {
        if (this._createObject == null) {
          throw new Error('Pool is empty');
        }

        return this._createObject();
      }

      var index = this._rnd.nextInt(_length);

      var object = _objects[index];
      var lastIndex = _length - 1;
      _objects[index] = _objects[lastIndex];
      _objects[lastIndex] = null;
      this._length = lastIndex;
      return object;
    }
  }, {
    key: "release",
    value: function release(object) {
      this._objects.push(object);

      this._length++;
    }
  }]);
  return Pool;
}();

function getCallId(funcId) {
  return function () {
    var buffer = [funcId, this];

    for (var i = 0, len = arguments.length; i < len; i++) {
      buffer.push(arguments[i]);
    }

    return buffer.join('_');
  };
}

function checkCallState(call, state, canBeNull) {
  if (state == null && canBeNull) {
    return;
  }

  _Assert.assert.ok(state);

  _Assert.assert.strictEqual(state.func, call.dependFunc.func);

  _Assert.assert.strictEqual(state._this, call._this);

  var args;
  state.callWithArgs(null, function () {
    args = (0, _from.default)(arguments);
  });

  _Assert.assert.deepStrictEqual(args, call.args);

  return state;
}

function _getOrCreateCallState() {
  return checkCallState(this, (0, _CallState.getOrCreateCallState)(this.dependFunc).apply(this._this, this.args), false);
}

function _getCallState() {
  return checkCallState(this, (0, _CallState.getCallState)(this.dependFunc).apply(this._this, this.args), true);
}

function calcSumArgs() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var sum = this;

  for (var i = 0, len = arguments.length; i < len; i++) {
    sum += arguments[i];
  }

  return sum;
}

function isCalculated(state) {
  var status = state.status;

  if ((status & _contracts.CallStatus.Flag_HasValue) === 0 || (status & _contracts.CallStatus.Flag_Calculating) !== 0 || (status & _contracts.CallStatus.Flag_Recalc) !== 0) {
    return false;
  }

  return true;
}

function checkDependenciesIsEmpty(state) {
  _Assert.assert.strictEqual(state._unsubscribersLength, 0);
}

function checkDependenciesNoDuplicates(state) {
  var _ref = state,
      _unsubscribers = _ref._unsubscribers,
      _unsubscribersLength = _ref._unsubscribersLength;

  for (var i = 0; i < _unsubscribersLength; i++) {
    for (var j = i + 1; j < _unsubscribersLength; j++) {
      if (_unsubscribers[i].state === _unsubscribers[j].state) {
        throw new Error('Found duplicate dependency');
      }
    }
  }
}

function checkDependencies(state) {
  checkDependenciesNoDuplicates(state);
  var dependencies = state.data.dependencies;
  var _ref2 = state,
      _unsubscribers = _ref2._unsubscribers,
      _unsubscribersLength = _ref2._unsubscribersLength;

  for (var i = 0, len = dependencies.length; i < len; i++) {
    var dependency = dependencies[i];
    var found = void 0;

    for (var j = 0; j < _unsubscribersLength; j++) {
      var _dependency = _unsubscribers[j].state.data.call;

      if (_dependency === dependency) {
        found = true;
        break;
      }
    }

    _Assert.assert.ok(found);
  }

  for (var _i = 0; _i < _unsubscribersLength; _i++) {
    var _dependency2 = _unsubscribers[_i].state.data.call;

    _Assert.assert.ok((0, _indexOf.default)(dependencies).call(dependencies, _dependency2) >= 0);
  }
}

function calcCheckResult(call) {
  var state = call.getCallState();

  _Assert.assert.ok(state);

  if (!isCalculated(state) || state.data.noChanges) {
    return state.value;
  }

  checkDependencies(state);
  var sumArgs = calcSumArgs.apply(call._this, call.args);
  var dependencies = state.data.dependencies;

  _Assert.assert.ok((0, _isArray.default)(dependencies));

  var sum = sumArgs;

  for (var i = 0, len = dependencies.length; i < len; i++) {
    var dependency = dependencies[i];
    var dependencyState = dependency.getCallState();

    _Assert.assert.ok(dependencyState);

    if (typeof dependencyState.value !== 'undefined') {
      sum += dependencyState.value;
    }
  }

  if (state.value !== sum) {
    _Assert.assert.strictEqual(state.value, sum);
  }

  return sum;
}

function checkCallResult(call, result, isLazy) {
  if (typeof result === 'undefined') {
    _Assert.assert.ok(isLazy);
  } else {
    _Assert.assert.ok((0, _isFinite.default)(result));
  }

  var checkResult = calcCheckResult(call);

  _Assert.assert.strictEqual(result, checkResult);
}

function checkSubscribers(state) {
  var prevLink = null;
  var link = state._subscribersFirst;

  while (link != null) {
    _Assert.assert.strictEqual(link.prev, prevLink);

    _Assert.assert.strictEqual(link.state, state);

    _Assert.assert.ok(link.value);

    _Assert.assert.notStrictEqual(link.value, state);

    prevLink = link;
    link = link.next;
  }

  _Assert.assert.strictEqual(state._subscribersLast, prevLink);

  var _unsubscribers = state._unsubscribers,
      _unsubscribersLength = state._unsubscribersLength;

  for (var i = 0; i < _unsubscribersLength; i++) {
    var _unsubscriber = _unsubscribers[i];

    _Assert.assert.ok(_unsubscriber);

    _Assert.assert.strictEqual(_unsubscriber.value, state);

    _Assert.assert.ok(_unsubscriber.state);

    _Assert.assert.notStrictEqual(_unsubscriber.state, state);
  }

  if (_unsubscribers != null) {
    for (var _i2 = _unsubscribersLength, len3 = _unsubscribers.length; _i2 < len3; _i2++) {
      _Assert.assert.strictEqual(_unsubscribers[_i2], null);
    }
  }
}

function runCall(call, isLazy) {
  var result;

  if (isLazy) {
    var state = call.getOrCreateCallState();
    result = state.getValue(true);
  } else {
    result = call();

    var _state = call.getCallState();

    if ((0, _async.isThenable)(result)) {
      _Assert.assert.strictEqual(_state.valueAsync, result);

      return result.then(function (value) {
        checkCallResult(call, call.getCallState().value, false); // checkCallResult(call, value, false)

        return value;
      }, function (error) {
        console.error(error);

        _Assert.assert.fail();
      });
    }
  }

  checkCallResult(call, result, isLazy);
  return result;
}

function runLazy(rnd, state, sumArgs, countDependencies, getNextCall) {
  var currentState = (0, _currentState.getCurrentState)();

  _Assert.assert.strictEqual(currentState, state);

  var minLevel = state.data.call.level + 1;
  var dependencies = state.data.dependencies;
  var oldDependencies = rnd.nextBoolean();

  if (oldDependencies) {
    countDependencies = dependencies.length;
  } else {
    dependencies.length = 0;
  }

  checkDependenciesIsEmpty(state);
  var sum = sumArgs;

  for (var i = 0; i < countDependencies; i++) {
    var dependency = oldDependencies ? dependencies[i] : getNextCall(minLevel, state);
    var result = runCall(dependency, true);
    currentState = (0, _currentState.getCurrentState)();

    _Assert.assert.strictEqual(currentState, state);

    if (oldDependencies) {
      checkDependenciesNoDuplicates(state);
    } else {
      dependencies.push(dependency);
      checkDependencies(state);
    }

    if (typeof result !== 'undefined') {
      sum += result;
    }
  }

  _Assert.assert.ok((0, _isFinite.default)(sum));

  checkDependencies(state);
  return sum;
}

function runAsIterator(rnd, state, sumArgs, countDependencies, getNextCall, disableLazy) {
  var currentState, minLevel, dependencies, oldDependencies, sum, i, dependency, isLazy, result;
  return _regenerator.default.wrap(function runAsIterator$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          currentState = (0, _currentState.getCurrentState)();

          _Assert.assert.strictEqual(currentState, state);

          minLevel = state.data.call.level + 1;
          dependencies = state.data.dependencies;
          oldDependencies = rnd.nextBoolean();

          if (oldDependencies) {
            countDependencies = dependencies.length;
          } else {
            dependencies.length = 0;
          }

          checkDependenciesIsEmpty(state);
          sum = sumArgs;
          i = 0;

        case 9:
          if (!(i < countDependencies)) {
            _context.next = 22;
            break;
          }

          dependency = oldDependencies ? dependencies[i] : getNextCall(minLevel, state);
          isLazy = !disableLazy && rnd.nextBoolean();
          _context.next = 14;
          return runCall(dependency, isLazy);

        case 14:
          result = _context.sent;
          currentState = (0, _currentState.getCurrentState)();

          _Assert.assert.strictEqual(currentState, state);

          if (oldDependencies) {
            checkDependenciesNoDuplicates(state);
          } else {
            dependencies.push(dependency);
            checkDependencies(state);
          }

          if (typeof result !== 'undefined') {
            sum += result;
          }

        case 19:
          i++;
          _context.next = 9;
          break;

        case 22:
          _Assert.assert.ok((0, _isFinite.default)(sum));

          checkDependencies(state);
          return _context.abrupt("return", sum);

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
} //endregion


var nextObjectId = 1;

function stressTest(_x) {
  return _stressTest2.apply(this, arguments);
}

function _stressTest2() {
  _stressTest2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(_ref3) {
    var seed, testsCount, iterationsPerTest, iterationsPerCall, maxLevelsCount, maxFuncsCount, maxCallsCount, countRootCalls, disableAsync, disableDeferred, disableLazy, i, _seed, rnd, _maxLevelsCount, _maxFuncsCount, _maxCallsCount, _countRootCalls, _disableAsync, _disableDeferred, _disableLazy, _iterationsPerTest;

    return _regenerator.default.wrap(function _callee4$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            seed = _ref3.seed, testsCount = _ref3.testsCount, iterationsPerTest = _ref3.iterationsPerTest, iterationsPerCall = _ref3.iterationsPerCall, maxLevelsCount = _ref3.maxLevelsCount, maxFuncsCount = _ref3.maxFuncsCount, maxCallsCount = _ref3.maxCallsCount, countRootCalls = _ref3.countRootCalls, disableAsync = _ref3.disableAsync, disableDeferred = _ref3.disableDeferred, disableLazy = _ref3.disableLazy;
            i = 0;

          case 2:
            if (!(i < testsCount)) {
              _context5.next = 21;
              break;
            }

            console.log("test number: " + i);
            _seed = seed != null ? seed : new _Random.Random().nextInt(2 << 29);
            console.log("seed = " + _seed);
            rnd = new _Random.Random(_seed);
            _maxLevelsCount = (0, _isArray.default)(maxLevelsCount) ? rnd.nextInt(maxLevelsCount[0], maxLevelsCount[1] + 1) : maxLevelsCount;
            _maxFuncsCount = (0, _isArray.default)(maxFuncsCount) ? rnd.nextInt(maxFuncsCount[0], maxFuncsCount[1] + 1) : maxFuncsCount;
            _maxCallsCount = (0, _isArray.default)(maxCallsCount) ? rnd.nextInt(maxCallsCount[0], Math.min(_maxFuncsCount * 10, maxCallsCount[1] + 1)) : maxCallsCount;
            _countRootCalls = (0, _isArray.default)(countRootCalls) ? rnd.nextInt(countRootCalls[0], countRootCalls[1] + 1) : countRootCalls;
            _disableAsync = disableAsync == null ? rnd.nextBoolean() : disableAsync;
            _disableDeferred = disableDeferred == null ? rnd.nextBoolean() : disableDeferred;
            _disableLazy = disableLazy == null ? rnd.nextBoolean() : disableLazy;
            _iterationsPerTest = iterationsPerTest == null ? iterationsPerCall * _maxCallsCount : iterationsPerTest;
            _context5.next = 17;
            return _stressTest({
              rnd: rnd,
              iterations: _iterationsPerTest,
              maxLevelsCount: _maxLevelsCount,
              maxFuncsCount: _maxFuncsCount,
              maxCallsCount: _maxCallsCount,
              countRootCalls: _countRootCalls,
              disableAsync: _disableAsync,
              disableDeferred: _disableDeferred,
              disableLazy: _disableLazy
            });

          case 17:
            (0, _helpers2.clearCallStates)();

          case 18:
            i++;
            _context5.next = 2;
            break;

          case 21:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee4);
  }));
  return _stressTest2.apply(this, arguments);
}

function _stressTest(_ref4) {
  var rnd = _ref4.rnd,
      iterations = _ref4.iterations,
      maxLevelsCount = _ref4.maxLevelsCount,
      maxFuncsCount = _ref4.maxFuncsCount,
      maxCallsCount = _ref4.maxCallsCount,
      countRootCalls = _ref4.countRootCalls,
      disableAsync = _ref4.disableAsync,
      disableDeferred = _ref4.disableDeferred,
      disableLazy = _ref4.disableLazy;
  var funcs = [];
  var calls = [];
  var callsMap = new _map.default();

  function getRandomCall(minLevel, parent) {
    if (parent != null) {
      var dependency = null;
      var dependencyState = parent;
      var variant = rnd.next();

      if (variant < 0.14) {
        if (dependencyState == null || dependencyState.data.dependencies.length === 0) {
          dependency = null;
        } else {
          dependency = rnd.nextArrayItem(dependencyState.data.dependencies);

          if (variant < 0.12) {
            dependencyState = dependency.getCallState();

            if (dependencyState == null || dependencyState.data.dependencies.length === 0) {
              dependency = null;
            } else {
              dependency = rnd.nextArrayItem(dependencyState.data.dependencies);

              if (variant < 0.08) {
                dependencyState = dependency.getCallState();

                if (dependencyState == null || dependencyState.data.dependencies.length === 0) {
                  dependency = null;
                } else {
                  dependency = rnd.nextArrayItem(dependencyState.data.dependencies);
                }
              }
            }
          }
        }
      }

      if (dependency != null) {
        return dependency;
      }
    }

    var countLevels = calls.length;
    var countAvailable = 0;

    for (var i = 0; i < countLevels; i++) {
      var count = calls[i].length;

      if (i >= minLevel) {
        countAvailable += count;
      }
    }

    if (countAvailable > 0) {
      var index = rnd.nextInt(countAvailable);

      for (var _i3 = minLevel; _i3 < countLevels; _i3++) {
        var _count = calls[_i3].length;

        if (index < _count) {
          return calls[_i3][index];
        }

        index -= _count;
      }

      throw new Error('Call not found');
    }

    throw new Error('countAvailable == 0');
  }

  function initCallState(state) {
    var callId = state.callWithArgs(state._this, getCallId(state.func.id));
    var call = callsMap.get(callId);

    _Assert.assert.ok(call);

    state.data.call = call;
    state.data.dependencies = [];
    state.data.noChanges = false;
  }

  function createDependFunc() {
    var isDependX = rnd.nextBoolean();

    var func = function func() {
      var state = isDependX ? this : (0, _CallState.getCallState)(func).apply(this, arguments);

      var _this = isDependX ? this._this : this;

      checkDependenciesIsEmpty(state);
      var sumArgs = _this;

      for (var i = 0, len = arguments.length; i < len; i++) {
        sumArgs += arguments[i];
      }

      _Assert.assert.ok(state.data.call.level < maxLevelsCount);

      var countDependencies = rnd.nextBoolean() ? rnd.nextInt(maxLevelsCount - state.data.call.level - 1) : 0;
      var isLazyAll = !disableLazy && rnd.nextBoolean();

      function calc() {
        var currentState = (0, _currentState.getCurrentState)();

        _Assert.assert.strictEqual(currentState, state);

        checkDependenciesIsEmpty(state);
        var noChanges = rnd.nextBoolean();

        if (noChanges && (state.status & _contracts.CallStatus.Flag_HasValue) !== 0) {
          state.data.dependencies.length = 0;
          state.data.noChanges = true;
          return state.value;
        }

        state.data.noChanges = false;
        return isLazyAll ? runLazy(rnd, state, sumArgs, countDependencies, getNextCall) : runAsIterator(rnd, state, sumArgs, countDependencies, getNextCall, disableLazy);
      }

      if (!disableAsync && rnd.nextBoolean(0.1)) {
        return /*#__PURE__*/_regenerator.default.mark(function _callee() {
          var currentState, result;
          return _regenerator.default.wrap(function _callee$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  currentState = (0, _currentState.getCurrentState)();

                  _Assert.assert.strictEqual(currentState, state);

                  if (!rnd.nextBoolean()) {
                    _context2.next = 5;
                    break;
                  }

                  _context2.next = 5;
                  return (0, _helpers.delay)(0);

                case 5:
                  currentState = (0, _currentState.getCurrentState)();

                  _Assert.assert.strictEqual(currentState, state);

                  _context2.next = 9;
                  return calc();

                case 9:
                  result = _context2.sent;
                  currentState = (0, _currentState.getCurrentState)();

                  _Assert.assert.strictEqual(currentState, state);

                  if (!rnd.nextBoolean()) {
                    _context2.next = 15;
                    break;
                  }

                  _context2.next = 15;
                  return (0, _helpers.delay)(0);

                case 15:
                  currentState = (0, _currentState.getCurrentState)();

                  _Assert.assert.strictEqual(currentState, state);

                  return _context2.abrupt("return", result);

                case 18:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee);
        })();
      }

      return calc();
    };

    func.id = nextObjectId++;
    var isDeferred = !disableDeferred && rnd.nextBoolean();
    var deferredOptions = isDeferred ? {
      delayBeforeCalc: rnd.nextBoolean(0.3) ? rnd.nextBoolean() ? 0 : rnd.nextInt(1, 100) : void 0,
      minTimeBetweenCalc: rnd.nextBoolean() ? rnd.nextBoolean() ? 0 : rnd.nextInt(1, 100) : void 0,
      autoInvalidateInterval: rnd.nextBoolean(0.2) ? rnd.nextBoolean() ? 0 : rnd.nextInt(1, 100) : void 0
    } : null;
    var dependFunc = isDependX ? (0, _depend.dependX)(func, deferredOptions, initCallState) : (0, _depend.depend)(func, deferredOptions, initCallState);
    dependFunc.func = func;
    return dependFunc;
  }

  function getNextDependFunc() {
    if (funcs.length !== 0 && rnd.nextBoolean(funcs.length / maxFuncsCount)) {
      return rnd.nextArrayItem(funcs);
    }

    var dependFunc = createDependFunc();
    funcs.push(dependFunc);
    return dependFunc;
  }

  function createCall(level) {
    for (var i = 0; i < 100; i++) {
      var call = _createCall(level);

      if (call != null) {
        return call;
      }
    }

    throw new Error('Cannot create call');
  }

  function _createCall(level) {
    var dependFunc = getNextDependFunc();
    var countArgs = rnd.nextBoolean() ? rnd.nextInt(3) : 0;

    var _this = rnd.nextInt(1, 4);

    var args = [];

    for (var i = 0; i < countArgs; i++) {
      args[i] = rnd.nextInt(1, 4);
    }

    var callId = getCallId(dependFunc.func.id).apply(_this, args);

    if (callsMap.has(callId)) {
      return null;
    }

    var call = function call() {
      return dependFunc.apply(_this, args);
    };

    call.id = callId;
    call.level = level;
    call.dependFunc = dependFunc;
    call._this = _this;
    call.args = args;
    call.getCallState = _getCallState;
    call.getOrCreateCallState = _getOrCreateCallState;

    while (level >= calls.length) {
      calls.push([]);
    }

    calls[level].push(call);
    callsMap.set(callId, call);
    return call;
  }

  function getNextCall(minLevel, parent) {
    if (minLevel < calls.length && rnd.nextBoolean(callsMap.size / maxCallsCount)) {
      return getRandomCall(minLevel, parent);
    }

    var call = createCall(minLevel);
    return call;
  }

  for (var i = 0; i < countRootCalls; i++) {
    var call = getNextCall(0);
  }

  function checkSubscribersAll() {
    for (var _i4 = 0, len = calls.length; _i4 < len; _i4++) {
      var level = calls[_i4];

      for (var j = 0, len2 = level.length; j < len2; j++) {
        var _call = level[j];

        var state = _call.getCallState();

        if (state != null) {
          checkSubscribers(state);
        }
      }
    }
  }

  function waitAll() {
    return _waitAll.apply(this, arguments);
  }

  function _waitAll() {
    _waitAll = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
      var thenables, _i5, len, level, j, len2, _call2, value;

      return _regenerator.default.wrap(function _callee2$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              thenables = [];
              _context3.next = 3;
              return (0, _helpers.delay)(150);

            case 3:
              for (_i5 = 0, len = calls.length; _i5 < len; _i5++) {
                level = calls[_i5];

                for (j = 0, len2 = level.length; j < len2; j++) {
                  _call2 = level[j];
                  value = _call2();

                  if ((0, _async.isThenable)(value)) {
                    thenables.push(value);
                  }
                }
              }

              _context3.next = 6;
              return _promise.default.all(thenables);

            case 6:
              _context3.next = 8;
              return (0, _helpers.delay)(50);

            case 8:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee2);
    }));
    return _waitAll.apply(this, arguments);
  }

  function test() {
    return _test.apply(this, arguments);
  }

  function _test() {
    _test = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
      var time, thenables, calc, invalidate, _i6, now, currentState, func, step, index, thenable;

      return _regenerator.default.wrap(function _callee3$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              invalidate = function _invalidate() {
                var call = getRandomCall(0);
                (0, _CallState.invalidateCallState)((0, _CallState.getCallState)(call.dependFunc).apply(call._this, call.args));
              };

              calc = function _calc() {
                var call = getRandomCall(0);
                var isLazy = !disableLazy && rnd.nextBoolean();
                var result = runCall(call, isLazy);
                var state = call.getCallState();

                _Assert.assert.ok(state);

                if ((0, _async.isThenable)(result)) {
                  _Assert.assert.ok(!disableDeferred || !disableAsync);

                  thenables.push(result);
                } else {
                  _Assert.assert.strictEqual(state.value, result);
                }
              };

              time = (0, _now.default)();
              thenables = [];
              _i6 = 0;

            case 5:
              if (!(_i6 < iterations)) {
                _context4.next = 31;
                break;
              }

              now = (0, _now.default)();

              if (now >= time + 10 * 1000) {
                time = now;
                console.log(_i6);
              }

              currentState = (0, _currentState.getCurrentState)();

              _Assert.assert.strictEqual(currentState, null);

              func = void 0;
              step = rnd.next();

              if (!(step < thenables.length / 100)) {
                _context4.next = 17;
                break;
              }

              _context4.next = 15;
              return _promise.default.all(thenables);

            case 15:
              _context4.next = 28;
              break;

            case 17:
              if (!(step < thenables.length / 20)) {
                _context4.next = 26;
                break;
              }

              index = rnd.nextInt(thenables.length);
              thenable = thenables[index];
              thenables[index] = thenables[thenables.length - 1];
              thenables.length--;
              _context4.next = 24;
              return thenable;

            case 24:
              _context4.next = 28;
              break;

            case 26:
              if (step < _i6 % 100 / 100) {
                func = calc;
              } else {
                func = invalidate;
              }

              if (rnd.nextBoolean()) {
                func();
              } else {
                (0, _setTimeout2.default)(func, rnd.nextBoolean() ? 0 : rnd.nextInt(100));
              }

            case 28:
              _i6++;
              _context4.next = 5;
              break;

            case 31:
              _context4.next = 33;
              return _promise.default.all(thenables);

            case 33:
              _context4.next = 35;
              return waitAll();

            case 35:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee3);
    }));
    return _test.apply(this, arguments);
  }

  return test();
}