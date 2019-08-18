import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/* tslint:disable:no-empty no-identical-functions no-construct use-primitive-type */
import { ThenableSync } from '../../../../../../main/common/async/ThenableSync';
import { assert } from '../../../../../../main/common/test/Assert';
import { TestVariants } from '../../src/helpers/TestVariants';
export var ResolveType;

(function (ResolveType) {
  ResolveType[ResolveType["Value"] = 0] = "Value";
  ResolveType[ResolveType["Resolved"] = 1] = "Resolved";
  ResolveType[ResolveType["Rejected"] = 2] = "Rejected";
  ResolveType[ResolveType["Throwed"] = 3] = "Throwed";
  ResolveType[ResolveType["Resolve"] = 4] = "Resolve";
  ResolveType[ResolveType["Reject"] = 5] = "Reject";
})(ResolveType || (ResolveType = {}));

function resolveOptionValue(opts, value) {
  if (typeof value === 'function' && !(value instanceof Error)) {
    value = value(opts);
  }

  return value;
}

function resolveOptions(optionsSource, optionsParams) {
  var resolvedOptions = _objectSpread({}, optionsSource);

  for (var key in resolvedOptions) {
    if (Object.prototype.hasOwnProperty.call(resolvedOptions, key)) {
      resolvedOptions[key] = key === 'action' || key === 'value' ? resolvedOptions[key] : resolveOptionValue(optionsParams || resolvedOptions, resolvedOptions[key]);
    }
  }

  resolvedOptions.expected = {};

  for (var _key in optionsSource.expected) {
    if (Object.prototype.hasOwnProperty.call(optionsSource.expected, _key)) {
      resolvedOptions.expected[_key] = resolveOptionValue(optionsParams || resolvedOptions, optionsSource.expected[_key]);
    }
  }

  return resolvedOptions;
}

function createWithExecutor() {
  var resultResolve = null;
  var resultReject = null;
  var thenable = new ThenableSync(function (resolve, reject) {
    resultResolve = resolve;
    resultReject = reject;
  });
  assert.ok(resultResolve);
  assert.ok(resultReject);
  return [thenable, resultResolve, resultReject];
}

export var OBJ = {};
export var THEN_LIKE = {
  then: function then(onfulfill) {
    onfulfill('THEN_LIKE');
  }
};
export var FUNC = function FUNC() {};
export var ITERABLE = new Set();
export var ITERATOR_GENERATOR =
/*#__PURE__*/
_regeneratorRuntime.mark(function _callee() {
  return _regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return OBJ;

        case 2:
          return _context.abrupt("return", ITERABLE);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
});

function createWithIterator(value, onfulfilled, onrejected) {
  var iteratorInner =
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2() {
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = assert;
            _context2.next = 3;
            return void 0;

          case 3:
            _context2.t1 = _context2.sent;
            _context2.t2 = void 0;

            _context2.t0.strictEqual.call(_context2.t0, _context2.t1, _context2.t2);

            _context2.t3 = assert;
            _context2.next = 9;
            return null;

          case 9:
            _context2.t4 = _context2.sent;

            _context2.t3.strictEqual.call(_context2.t3, _context2.t4, null);

            _context2.t5 = assert;
            _context2.next = 14;
            return false;

          case 14:
            _context2.t6 = _context2.sent;

            _context2.t5.strictEqual.call(_context2.t5, _context2.t6, false);

            _context2.t7 = assert;
            _context2.next = 19;
            return 0;

          case 19:
            _context2.t8 = _context2.sent;

            _context2.t7.strictEqual.call(_context2.t7, _context2.t8, 0);

            _context2.t9 = assert;
            _context2.next = 24;
            return '';

          case 24:
            _context2.t10 = _context2.sent;

            _context2.t9.strictEqual.call(_context2.t9, _context2.t10, '');

            _context2.t11 = assert;
            _context2.next = 29;
            return OBJ;

          case 29:
            _context2.t12 = _context2.sent;
            _context2.t13 = OBJ;

            _context2.t11.strictEqual.call(_context2.t11, _context2.t12, _context2.t13);

            _context2.t14 = assert;
            _context2.next = 35;
            return FUNC;

          case 35:
            _context2.t15 = _context2.sent;
            _context2.t16 = FUNC;

            _context2.t14.strictEqual.call(_context2.t14, _context2.t15, _context2.t16);

            _context2.t17 = assert;
            _context2.next = 41;
            return ITERABLE;

          case 41:
            _context2.t18 = _context2.sent;
            _context2.t19 = ITERABLE;

            _context2.t17.strictEqual.call(_context2.t17, _context2.t18, _context2.t19);

            _context2.t20 = assert;
            _context2.next = 47;
            return ITERATOR_GENERATOR();

          case 47:
            _context2.t21 = _context2.sent;
            _context2.t22 = ITERABLE;

            _context2.t20.strictEqual.call(_context2.t20, _context2.t21, _context2.t22);

            return _context2.abrupt("return", value);

          case 51:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  });

  var iterator =
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee3() {
    var result;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = assert;
            _context3.next = 3;
            return new ThenableSync(function (resolve) {
              return resolve(void 0);
            });

          case 3:
            _context3.t1 = _context3.sent;
            _context3.t2 = void 0;

            _context3.t0.strictEqual.call(_context3.t0, _context3.t1, _context3.t2);

            _context3.t3 = assert;
            _context3.next = 9;
            return new ThenableSync(function (resolve) {
              return resolve(null);
            });

          case 9:
            _context3.t4 = _context3.sent;

            _context3.t3.strictEqual.call(_context3.t3, _context3.t4, null);

            _context3.t5 = assert;
            _context3.next = 14;
            return new ThenableSync(function (resolve) {
              return resolve(false);
            });

          case 14:
            _context3.t6 = _context3.sent;

            _context3.t5.strictEqual.call(_context3.t5, _context3.t6, false);

            _context3.t7 = assert;
            _context3.next = 19;
            return new ThenableSync(function (resolve) {
              return resolve(0);
            });

          case 19:
            _context3.t8 = _context3.sent;

            _context3.t7.strictEqual.call(_context3.t7, _context3.t8, 0);

            _context3.t9 = assert;
            _context3.next = 24;
            return new ThenableSync(function (resolve) {
              return resolve('');
            });

          case 24:
            _context3.t10 = _context3.sent;

            _context3.t9.strictEqual.call(_context3.t9, _context3.t10, '');

            _context3.t11 = assert;
            _context3.next = 29;
            return new ThenableSync(function (resolve) {
              return resolve(OBJ);
            });

          case 29:
            _context3.t12 = _context3.sent;
            _context3.t13 = OBJ;

            _context3.t11.strictEqual.call(_context3.t11, _context3.t12, _context3.t13);

            _context3.t14 = assert;
            _context3.next = 35;
            return new ThenableSync(function (resolve) {
              return resolve(FUNC);
            });

          case 35:
            _context3.t15 = _context3.sent;
            _context3.t16 = FUNC;

            _context3.t14.strictEqual.call(_context3.t14, _context3.t15, _context3.t16);

            _context3.t17 = assert;
            _context3.next = 41;
            return new ThenableSync(function (resolve) {
              return resolve(ITERABLE);
            });

          case 41:
            _context3.t18 = _context3.sent;
            _context3.t19 = ITERABLE;

            _context3.t17.strictEqual.call(_context3.t17, _context3.t18, _context3.t19);

            _context3.t20 = assert;
            _context3.next = 47;
            return new ThenableSync(function (resolve) {
              return resolve(ITERATOR_GENERATOR());
            });

          case 47:
            _context3.t21 = _context3.sent;
            _context3.t22 = ITERABLE;

            _context3.t20.strictEqual.call(_context3.t20, _context3.t21, _context3.t22);

            _context3.next = 52;
            return iteratorInner();

          case 52:
            result = _context3.sent;
            return _context3.abrupt("return", result);

          case 54:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })();

  return ThenableSync.resolve(iterator, onfulfilled, onrejected);
}

export var TestThenableSync =
/*#__PURE__*/
function (_TestVariants) {
  _inherits(TestThenableSync, _TestVariants);

  function TestThenableSync() {
    var _this;

    _classCallCheck(this, TestThenableSync);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TestThenableSync).call(this));
    _this.baseOptionsVariants = {
      value: [void 0, null, false, 0, '', OBJ, FUNC, ITERABLE, ITERATOR_GENERATOR],
      valueType: [ResolveType.Value, ResolveType.Resolved, ResolveType.Rejected, ResolveType.Throwed, ResolveType.Resolve, ResolveType.Reject],
      type: [ResolveType.Value, ResolveType.Resolved, ResolveType.Rejected, // ResolveType.Throwed,
      ResolveType.Resolve, ResolveType.Reject],
      createWithExecutor: [false, true],
      createWithIterator: [0, 1, 3],
      // resolveImmediate: [true, false],
      getValueWithResolve: [0, 1, 3],
      getValueWithThen: [0, 1, 3]
    };
    return _this;
  }

  _createClass(TestThenableSync, [{
    key: "testVariant",
    value: function testVariant(inputOptions) {
      var error;

      for (var debugIteration = 0; debugIteration < 3; debugIteration++) {
        try {
          var _ret = function () {
            var options = resolveOptions(inputOptions, null);

            var action = function action() {
              var value = options.value;
              var resolveImmediate = (options.type === ResolveType.Value || options.type === ResolveType.Resolved || options.type === ResolveType.Rejected || options.type === ResolveType.Throwed) && (options.valueType === ResolveType.Value || options.valueType === ResolveType.Resolved || options.valueType === ResolveType.Rejected || options.valueType === ResolveType.Throwed);
              var useReject = options.type === ResolveType.Rejected || options.type === ResolveType.Throwed || options.type === ResolveType.Reject || options.valueType === ResolveType.Rejected || options.valueType === ResolveType.Throwed || options.valueType === ResolveType.Reject;
              assert.notStrictEqual(value && value.constructor, ThenableSync);
              assert.strictEqual(ThenableSync.isThenable(value), false);

              switch (options.valueType) {
                case ResolveType.Value:
                  break;

                case ResolveType.Resolved:
                  value = new ThenableSync();
                  assert.strictEqual(ThenableSync.isThenable(value), true);
                  value.resolve(options.value);
                  break;

                case ResolveType.Rejected:
                  value = new ThenableSync();
                  assert.strictEqual(ThenableSync.isThenable(value), true);
                  value.reject(options.value);
                  break;

                case ResolveType.Throwed:
                  value = new ThenableSync(function () {
                    throw value;
                  });
                  assert.strictEqual(ThenableSync.isThenable(value), true);
                  break;

                case ResolveType.Resolve:
                case ResolveType.Reject:
                  value = new ThenableSync();
                  assert.strictEqual(ThenableSync.isThenable(value), true);
                  break;

                default:
                  throw new Error("Unknown valueType: ".concat(options.valueType));
              }

              var thenable;
              var resolve;
              var reject;

              if (options.createWithExecutor) {
                var result = createWithExecutor();
                thenable = result[0];
                resolve = result[1];
                reject = result[2];
              } else {
                thenable = new ThenableSync();
                resolve = thenable.resolve.bind(thenable);
                reject = thenable.reject.bind(thenable);
              }

              assert.strictEqual(thenable && thenable.constructor, ThenableSync);
              assert.strictEqual(ThenableSync.isThenable(thenable), true);

              switch (options.type) {
                case ResolveType.Value:
                  thenable = value;
                  break;

                case ResolveType.Resolved:
                  resolve(value);
                  break;

                case ResolveType.Rejected:
                  reject(value);
                  break;

                case ResolveType.Throwed:
                  thenable = new ThenableSync(function () {
                    throw value;
                  });
                  assert.strictEqual(ThenableSync.isThenable(thenable), true);
                  break;

                case ResolveType.Resolve:
                case ResolveType.Reject:
                  break;

                default:
                  throw new Error("Unknown valueType: ".concat(options.valueType));
              }

              var resolveValue = function resolveValue(func) {
                try {
                  return func();
                } catch (err) {
                  if (err instanceof Error) {
                    throw err;
                  }

                  return err;
                }
              };

              var countQueued = 0;
              var countFulfilled = 0;
              var fulfillResult = new String('Fulfill Result');

              var testThen = function testThen(then) {
                var isThenResult = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
                countQueued++;
                var fulfilled = 0;

                var onResult = function onResult(o) {
                  assert.ok(fulfilled <= 0);
                  fulfilled++;
                  assert.strictEqual(o, options.expected.value);
                  countFulfilled++;
                  return fulfillResult;
                };

                if (useReject) {
                  checkResult(resolveValue(function () {
                    return then(null, null);
                  }), options.expected.value, isThenResult);
                  checkResult(resolveValue(function () {
                    return then(onResult, null);
                  }), options.expected.value, isThenResult);
                  checkResult(resolveValue(function () {
                    return then(null, onResult);
                  }), fulfillResult, isThenResult);
                  countQueued++;
                  fulfilled--;
                  checkResult(resolveValue(function () {
                    return then(null, function (o) {
                      throw o;
                    }).then(null, onResult);
                  }), fulfillResult, isThenResult);
                  countQueued++;
                  fulfilled--;
                  checkResult(resolveValue(function () {
                    return then(null, function (o) {
                      throw ThenableSync.createRejected(o);
                    }).then(null, onResult);
                  }), fulfillResult, isThenResult);
                } else {
                  checkResult(resolveValue(function () {
                    return then(null, null);
                  }), options.expected.value, isThenResult);
                  checkResult(resolveValue(function () {
                    return then(null, onResult);
                  }), options.expected.value, isThenResult);
                  checkResult(resolveValue(function () {
                    return then(onResult, null);
                  }), fulfillResult, isThenResult);
                  countQueued++;
                  fulfilled--;
                  checkResult(resolveValue(function () {
                    return then(function (o) {
                      throw o;
                    }, onResult);
                  }), fulfillResult, isThenResult);
                  countQueued++;
                  fulfilled--;
                  checkResult(resolveValue(function () {
                    return then(function (o) {
                      throw ThenableSync.createRejected(o);
                    }, onResult);
                  }), fulfillResult, isThenResult);
                  countQueued++;
                  fulfilled--;
                  var res;
                  checkResult(resolveValue(function () {
                    var result = then(function (o) {
                      var th = new ThenableSync();

                      res = function res() {
                        return th.reject(o);
                      };

                      throw th;
                    }, onResult);
                    return result;
                  }), fulfillResult, isThenResult);
                  res();
                }

                countQueued++;
                fulfilled--;
                checkResult(resolveValue(function () {
                  return then(onResult, onResult);
                }), fulfillResult, isThenResult);
              };

              var checkResult = function checkResult(result, expected) {
                var isThenResult = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

                if (!isThenResult && resolveImmediate) {
                  assert.strictEqual(result, expected);
                } else {
                  assert.strictEqual(result && result.constructor, ThenableSync);
                  countQueued++;
                  var fulfilled;

                  var onResult = function onResult(o) {
                    assert.notOk(fulfilled);
                    fulfilled = true;
                    assert.strictEqual(o, expected);
                    countFulfilled++;
                    return expected;
                  };

                  var thenResult = resolveValue(function () {
                    return result.then(onResult, onResult).thenLast();
                  });

                  if (resolveImmediate) {
                    assert.strictEqual(thenResult, expected);
                  } else {
                    assert.notStrictEqual(thenResult, result);
                    assert.strictEqual(thenResult.constructor, ThenableSync);
                    assert.strictEqual(ThenableSync.isThenable(thenResult), true);
                  }
                }
              };

              for (var i = 0; i < options.createWithIterator; i++) {
                if (options.getValueWithResolve) {
                  testThen(function (r, e) {
                    return createWithIterator(thenable, r, e);
                  });
                }

                thenable = resolveValue(function () {
                  return createWithIterator(thenable);
                });
              }

              if (resolveImmediate && options.createWithIterator || options.type === ResolveType.Value && options.valueType === ResolveType.Value) {
                assert.strictEqual(thenable, options.expected.value);
              } else {
                assert.strictEqual(thenable && thenable.constructor, ThenableSync);
                assert.strictEqual(ThenableSync.isThenable(thenable), true);

                for (var _i = 0; _i < options.getValueWithThen; _i++) {
                  testThen(function (r, e) {
                    var thenResult = thenable.then(r, e);

                    if (!useReject && r || useReject && e) {
                      assert.notStrictEqual(thenResult, thenable);
                    }

                    assert.strictEqual(thenResult.constructor, ThenableSync);
                    assert.strictEqual(ThenableSync.isThenable(thenResult), true);
                    return thenResult;
                  }, true);
                }
              }

              for (var _i2 = 0; _i2 < options.getValueWithResolve; _i2++) {
                testThen(function (r, e) {
                  return ThenableSync.resolve(thenable, r, e);
                });
              }

              switch (options.type) {
                case ResolveType.Resolve:
                  assert.strictEqual(countFulfilled, 0);
                  resolve(value);
                  break;

                case ResolveType.Reject:
                  assert.strictEqual(countFulfilled, 0);
                  reject(value);
                  break;
              }

              switch (options.valueType) {
                case ResolveType.Resolve:
                  assert.strictEqual(countFulfilled, 0);
                  value.resolve(options.value);
                  break;

                case ResolveType.Reject:
                  assert.strictEqual(countFulfilled, 0);
                  value.reject(options.value);
                  break;
              }

              assert.strictEqual(countFulfilled, countQueued);

              if (options.type !== ResolveType.Value) {
                if (options.type === ResolveType.Rejected || options.type === ResolveType.Throwed || options.type === ResolveType.Reject) {
                  assert["throws"](function () {
                    return resolve(value);
                  }, Error);
                  assert["throws"](function () {
                    return reject(value);
                  }, Error);
                } else {
                  assert["throws"](function () {
                    return reject(value);
                  }, Error);
                  assert["throws"](function () {
                    return resolve(value);
                  }, Error);
                }
              }

              assert.strictEqual(countFulfilled, countQueued);
            };

            if (options.expected.error) {
              assert["throws"](action, options.expected.error);
            } else {
              action();
            }

            return "break";
          }();

          if (_ret === "break") break;
        } catch (ex) {
          if (!debugIteration) {
            console.log("Test number: ".concat(TestThenableSync.totalTests, "\r\nError in: ").concat(inputOptions.description, "\n"), inputOptions, // ${
            // JSON.stringify(initialOptions, null, 4)
            // }
            "\n".concat(inputOptions.action.toString(), "\n").concat(ex && ex.stack));
            error = ex;
          }
        } finally {
          TestThenableSync.totalTests++;
        }
      }

      if (error) {
        throw error;
      }
    }
  }], [{
    key: "test",
    value: function test(testCases) {
      if (!testCases.actions) {
        // tslint:disable-next-line:no-empty
        testCases.actions = [function () {}];
      }

      TestThenableSync._instance.test(testCases);
    }
  }]);

  return TestThenableSync;
}(TestVariants);
TestThenableSync.totalTests = 0;
TestThenableSync._instance = new TestThenableSync();