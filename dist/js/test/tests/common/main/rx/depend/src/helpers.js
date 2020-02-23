"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.__makeDependentFunc = __makeDependentFunc;
exports.createPerceptronNaked = createPerceptronNaked;
exports.__invalidate = __invalidate;
exports.__outputCall = __outputCall;
exports.createPerceptron = createPerceptron;
exports.baseTest = baseTest;

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _flatMap = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/flat-map"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _async = require("../../../../../../../main/common/async/async");

var _all = require("../../../../../../../main/common/rx/depend/all");

var _contracts = require("../../../../../../../main/common/rx/depend/contracts");

var _Assert = require("../../../../../../../main/common/test/Assert");

var _helpers = require("../../../../../../../main/common/time/helpers");

/* tslint:disable:no-identical-functions no-shadowed-variable */
// tslint:disable-next-line:no-shadowed-variable
function __makeDependentFunc(func) {
  if (typeof func === 'function') {
    return (0, _all.makeDependentFunc)(func);
  }

  return null;
} // endregion


function createPerceptronNaked(layerSize, layersCount, check) {
  if (check === void 0) {
    check = true;
  }

  var countFuncs = layersCount * layerSize + 2;

  var input = function input() {
    return 1;
  }; // first layer


  var layer = [];

  var _loop = function _loop(i) {
    layer[i] = function (a, b) {
      return i * a * b * input() * this;
    };
  };

  for (var i = 0; i < layerSize; i++) {
    _loop(i);
  }

  var layers = [layer];

  for (var _i = 0; _i < layersCount - 1; _i++) {
    var nextLayer = [];

    var _loop2 = function _loop2(j) {
      var prevLayer = layer;

      nextLayer[j] = function (a, b) {
        var sum = 0;

        for (var k = 0; k < layerSize; k++) {
          sum += prevLayer[k].call(this, a, b);
        }

        return sum;
      };
    };

    for (var j = 0; j < layerSize; j++) {
      _loop2(j);
    }

    layer = nextLayer;
    layers.push(layer);
  }

  var output;
  {
    var prevLayer = layer;

    output = function output(a, b) {
      var sum = 0;

      for (var _i2 = 0; _i2 < layerSize; _i2++) {
        sum += prevLayer[_i2].call(this, a, b);
      }

      return sum;
    };
  }

  if (check) {
    _Assert.assert.strictEqual(output.call(2, 5, 10).toPrecision(6), (100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6));
  }

  return output;
}

function __invalidate(state, status) {
  return (0, _all.invalidate)(state, status);
}

function __outputCall(output) {
  return output.call(2, 5, 10);
}

function createPerceptron(layerSize, layersCount, check, makeDependentFunc, invalidate2) {
  if (check === void 0) {
    check = true;
  }

  if (makeDependentFunc === void 0) {
    makeDependentFunc = __makeDependentFunc;
  }

  if (invalidate2 === void 0) {
    invalidate2 = __invalidate;
  }

  var countFuncs = layersCount * layerSize + 2;
  var input = makeDependentFunc(function () {
    return 1;
  }); // first layer

  var layer = [];

  var _loop3 = function _loop3(i) {
    layer[i] = makeDependentFunc(function (a, b) {
      return i * a * b * input() * this;
    });
  };

  for (var i = 0; i < layerSize; i++) {
    _loop3(i);
  }

  var layers = [layer];

  for (var _i3 = 0; _i3 < layersCount - 1; _i3++) {
    var nextLayer = [];

    var _loop4 = function _loop4(j) {
      var prevLayer = layer;
      nextLayer[j] = makeDependentFunc(function (a, b) {
        var sum = 0;

        for (var k = 0; k < layerSize; k++) {
          sum += prevLayer[k].call(this, a, b);
        }

        return sum;
      });
    };

    for (var j = 0; j < layerSize; j++) {
      _loop4(j);
    }

    layer = nextLayer;
    layers.push(layer);
  }

  var output;
  {
    var prevLayer = layer;
    output = makeDependentFunc(function (a, b) {
      var sum = 0;

      for (var _i4 = 0; _i4 < layerSize; _i4++) {
        sum += prevLayer[_i4].call(this, a, b);
      }

      return sum;
    });
  }

  var _states;

  var getStates = function getStates() {
    if (!_states) {
      var _context;

      _states = (0, _map.default)(_context = (0, _flatMap.default)(layers).call(layers, function (o) {
        return o;
      })).call(_context, function (o) {
        return (0, _all.getFuncCallState)(o)();
      });
    }

    return _states;
  };

  var inputState = (0, _all.getFuncCallState)(input)();

  if (check) {
    _Assert.assert.strictEqual(__outputCall(output).toPrecision(6), (100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6));

    (0, _all.invalidate)(inputState);

    _Assert.assert.strictEqual(__outputCall(output).toPrecision(6), (100 * ((layerSize - 1) * layerSize / 2) * Math.pow(layerSize, layersCount - 1)).toPrecision(6));
  }

  return {
    getStates: getStates,
    countFuncs: countFuncs,
    input: input,
    inputState: inputState,
    output: output
  };
} // region baseTest


var _callHistory = [];

function getCallId(funcId, _this) {
  var callId = funcId;

  for (var i = 0, len = arguments.length <= 2 ? 0 : arguments.length - 2; i < len; i++) {
    callId += (i + 2 < 2 || arguments.length <= i + 2 ? undefined : arguments[i + 2]) || 0;
  }

  callId += '(' + ((0, _isArray.default)(_this) && (0, _map.default)(_this).call(_this, function (o) {
    return o.id;
  }).join(',') || _this || 0) + ')';
  return callId;
}

function funcSync(id) {
  var result = (0, _all.makeDependentFunc)(function () {
    var _context2;

    var callId = getCallId.apply(void 0, (0, _concat.default)(_context2 = [id, this]).call(_context2, (0, _slice.default)(Array.prototype).call(arguments)));

    _callHistory.push(callId);

    var dependencies = this;

    if ((0, _isArray.default)(dependencies)) {
      for (var i = 0, len = dependencies.length; i < len * 2; i++) {
        var dependency = dependencies[i % len];
        var value = dependency();

        _Assert.assert.strictEqual(value, dependency.id);
      }
    }

    return callId;
  });
  result.id = id;
  return result;
}

function funcSyncIterator(id) {
  var nested =
  /*#__PURE__*/
  _regenerator.default.mark(function nested(dependencies) {
    var i, len, dependency, value;
    return _regenerator.default.wrap(function nested$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return 1;

          case 2:
            if (!(0, _isArray.default)(dependencies)) {
              _context3.next = 13;
              break;
            }

            i = 0, len = dependencies.length;

          case 4:
            if (!(i < len * 2)) {
              _context3.next = 13;
              break;
            }

            dependency = dependencies[i % len];
            _context3.next = 8;
            return dependency();

          case 8:
            value = _context3.sent;

            _Assert.assert.strictEqual(value, dependency.id);

          case 10:
            i++;
            _context3.next = 4;
            break;

          case 13:
            return _context3.abrupt("return", 1);

          case 14:
          case "end":
            return _context3.stop();
        }
      }
    }, nested);
  });

  var run =
  /*#__PURE__*/
  _regenerator.default.mark(function run(callId, dependencies) {
    return _regenerator.default.wrap(function run$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return 1;

          case 2:
            _context4.next = 4;
            return nested(dependencies);

          case 4:
            return _context4.abrupt("return", callId);

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    }, run);
  });

  var result = (0, _all.makeDependentFunc)(function () {
    var _context5;

    var callId = getCallId.apply(void 0, (0, _concat.default)(_context5 = [id, this]).call(_context5, (0, _slice.default)(Array.prototype).call(arguments)));

    _callHistory.push(callId);

    return run(callId, this);
  });
  result.id = id;
  return result;
}

function funcAsync(id) {
  var nested =
  /*#__PURE__*/
  _regenerator.default.mark(function nested() {
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

  var nestedAsync =
  /*#__PURE__*/
  _regenerator.default.mark(function nestedAsync(dependencies) {
    var i, len, dependency, value;
    return _regenerator.default.wrap(function nestedAsync$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return 1;

          case 2:
            if (!dependencies) {
              _context7.next = 13;
              break;
            }

            i = 0, len = dependencies.length;

          case 4:
            if (!(i < len)) {
              _context7.next = 13;
              break;
            }

            dependency = dependencies[i];
            _context7.next = 8;
            return dependency();

          case 8:
            value = _context7.sent;

            _Assert.assert.strictEqual(value, dependency.id);

          case 10:
            i++;
            _context7.next = 4;
            break;

          case 13:
            _context7.next = 15;
            return (0, _helpers.delay)(0);

          case 15:
            return _context7.abrupt("return", 1);

          case 16:
          case "end":
            return _context7.stop();
        }
      }
    }, nestedAsync);
  });

  var run =
  /*#__PURE__*/
  _regenerator.default.mark(function run(callId, dependencies) {
    return _regenerator.default.wrap(function run$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return 1;

          case 2:
            _context8.next = 4;
            return (0, _helpers.delay)(0);

          case 4:
            _context8.next = 6;
            return nested();

          case 6:
            _context8.next = 8;
            return nestedAsync(dependencies);

          case 8:
            return _context8.abrupt("return", callId);

          case 9:
          case "end":
            return _context8.stop();
        }
      }
    }, run);
  });

  var result = (0, _all.makeDependentFunc)(function () {
    var _context9;

    var callId = getCallId.apply(void 0, (0, _concat.default)(_context9 = [id, this]).call(_context9, (0, _slice.default)(Array.prototype).call(arguments)));

    _callHistory.push(callId);

    return run(callId, this);
  });
  result.id = id;
  return result;
}

function funcCall(func, _this) {
  var _context10;

  for (var _len = arguments.length, rest = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    rest[_key - 2] = arguments[_key];
  }

  var callId = getCallId.apply(void 0, (0, _concat.default)(_context10 = [func.id, _this]).call(_context10, rest));

  var result = function result() {
    return func.apply(_this, rest);
  };

  result.id = callId;
  result.state = (0, _all.getFuncCallState)(func).apply(_this, rest);

  _Assert.assert.ok(result.state);

  _Assert.assert.strictEqual(result.state.status, _contracts.FuncCallStatus.Invalidated);

  result.state.id = callId;
  return result;
}

var ThisObj =
/*#__PURE__*/
function () {
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

function checkAsync(value) {
  _Assert.assert.ok((0, _async.isThenable)(value));

  return value;
}

function checkCallHistory(callHistory) {
  _Assert.assert.deepStrictEqual(_callHistory, (0, _map.default)(callHistory).call(callHistory, function (o) {
    return o.id;
  }));

  _callHistory.length = 0;
}

function checkFuncSync(funcCall) {
  _Assert.assert.strictEqual(funcCall(), funcCall.id);

  for (var _len2 = arguments.length, callHistory = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    callHistory[_key2 - 1] = arguments[_key2];
  }

  checkCallHistory(callHistory);
}

function checkFuncAsync(_x) {
  return _checkFuncAsync.apply(this, arguments);
}

function _checkFuncAsync() {
  _checkFuncAsync = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee(funcCall) {
    var _len4,
        callHistory,
        _key4,
        _args6 = arguments;

    return _regenerator.default.wrap(function _callee$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            checkCallHistory([]);
            _context11.t0 = _Assert.assert;
            _context11.next = 4;
            return checkAsync(funcCall());

          case 4:
            _context11.t1 = _context11.sent;
            _context11.t2 = funcCall.id;

            _context11.t0.strictEqual.call(_context11.t0, _context11.t1, _context11.t2);

            for (_len4 = _args6.length, callHistory = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
              callHistory[_key4 - 1] = _args6[_key4];
            }

            checkCallHistory(callHistory);

          case 9:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee);
  }));
  return _checkFuncAsync.apply(this, arguments);
}

function _invalidate(funcCall) {
  checkCallHistory([]);
  (0, _all.invalidate)(funcCall.state);
  checkCallHistory([]);
}

function _checkFuncNotChanged() {
  for (var i = 0, len = arguments.length; i < len; i++) {
    checkFuncSync(i < 0 || arguments.length <= i ? undefined : arguments[i]);
  }
}

function checkFuncNotChanged(allFuncCalls) {
  for (var _len3 = arguments.length, changedFuncCalls = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    changedFuncCalls[_key3 - 1] = arguments[_key3];
  }

  _checkFuncNotChanged.apply(void 0, (0, _filter.default)(allFuncCalls).call(allFuncCalls, function (o) {
    return (0, _indexOf.default)(changedFuncCalls).call(changedFuncCalls, o) < 0;
  }));
}

function isInvalidated(funcCall) {
  return funcCall.state.status === _contracts.FuncCallStatus.Invalidating || funcCall.state.status === _contracts.FuncCallStatus.Invalidated;
}

function baseTest() {
  return _baseTest.apply(this, arguments);
} // endregion


function _baseTest() {
  _baseTest = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var _context12;

    var S, I, A, S0, I0, A0, S1, I1, S2, I2, A2, allFuncs;
    return _regenerator.default.wrap(function _callee2$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            // region init
            S = funcSync('S');
            I = funcSyncIterator('I');
            A = funcAsync('A');
            S0 = funcCall(S);
            I0 = funcCall(I, null);
            A0 = funcCall(A, new ThisObj('_'));
            S1 = funcCall(S, [S0, I0], 1);
            I1 = funcCall(I, [I0, A0], 1);
            S2 = funcCall(S, [S1], 2, void 0);
            I2 = funcCall(I, [S1, I1], 2, null);
            A2 = funcCall(A, [I1], 2, 2); // endregion
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


            checkFuncSync(S0, S0);
            checkFuncSync(I0, I0);
            _context13.next = 23;
            return checkFuncAsync(A0, A0);

          case 23:
            checkFuncSync(S1, S1);
            checkFuncSync(I1, I1);
            checkFuncSync(S2, S2);
            checkFuncSync(I2, I2);
            _context13.next = 29;
            return checkFuncAsync(A2, A2);

          case 29:
            // endregion
            // region invalidate
            allFuncs = [S0, I0, A0, S1, I1, S2, I2, A2];
            checkFuncNotChanged(allFuncs); // level 2

            _invalidate(S2);

            checkFuncSync(S2, S2);
            checkFuncNotChanged(allFuncs);

            _invalidate(I2);

            checkFuncSync(I2, I2);
            checkFuncNotChanged(allFuncs);

            _invalidate(A2);

            _context13.next = 40;
            return checkFuncAsync(A2, A2);

          case 40:
            checkFuncNotChanged(allFuncs); // level 1

            _invalidate(S1);

            checkFuncSync(S2, S2, S1);
            checkFuncSync(I2, I2);
            checkFuncNotChanged(allFuncs);

            _invalidate(I1);

            checkFuncSync(I2, I2, I1);
            _context13.next = 49;
            return checkFuncAsync(A2, A2);

          case 49:
            checkFuncNotChanged(allFuncs); // level 0

            _invalidate(S0); // console.log(allFuncs.filter(isInvalidated).map(o => o.id))


            checkFuncSync(S2, S2, S1, S0);
            checkFuncSync(I2, I2);
            checkFuncNotChanged(allFuncs);

            _invalidate(I0);

            checkFuncSync(S2, S2, S1, I0);
            checkFuncSync(I2, I2, I1);
            _context13.next = 59;
            return checkFuncAsync(A2, A2);

          case 59:
            checkFuncNotChanged(allFuncs);

            _invalidate(A0);

            _context13.next = 63;
            return checkFuncAsync(I2, I2, I1, A0);

          case 63:
            _context13.next = 65;
            return checkFuncAsync(A2, A2);

          case 65:
            checkFuncNotChanged(allFuncs); // endregion

            return _context13.abrupt("return", {
              states: (0, _map.default)(_context12 = [S0, I0, A0, S1, I1, S2, I2, A2]).call(_context12, function (o) {
                return o.state;
              })
            });

          case 67:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee2);
  }));
  return _baseTest.apply(this, arguments);
}