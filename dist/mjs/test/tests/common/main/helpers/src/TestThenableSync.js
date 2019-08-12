import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _objectSpread from "@babel/runtime/helpers/objectSpread";

/* tslint:disable:no-empty no-identical-functions no-construct use-primitive-type */
import { ThenableSync } from '../../../../../../main/common/helpers/ThenableSync';
import { assert } from '../../../../../../main/common/test/Assert';
import { TestVariants } from '../../src/helpers/TestVariants';

function resolveValue(opts, value) {
  if (typeof value === 'function' && !(value instanceof Error)) {
    value = value(opts);
  }

  return value;
}

function resolveOptions(optionsSource, optionsParams) {
  var resolvedOptions = _objectSpread({}, optionsSource);

  for (var key in resolvedOptions) {
    if (Object.prototype.hasOwnProperty.call(resolvedOptions, key)) {
      resolvedOptions[key] = key === 'action' ? resolvedOptions[key] : resolveValue(optionsParams || resolvedOptions, resolvedOptions[key]);
    }
  }

  resolvedOptions.expected = {};

  for (var _key in optionsSource.expected) {
    if (Object.prototype.hasOwnProperty.call(optionsSource.expected, _key)) {
      resolvedOptions.expected[_key] = resolveValue(optionsParams || resolvedOptions, optionsSource.expected[_key]);
    }
  }

  return resolvedOptions;
}

function createWithExecutor() {
  var resultResolve = null;
  var thenable = new ThenableSync(function (resolve) {
    resultResolve = resolve;
  });
  assert.ok(resultResolve);
  return [thenable, resultResolve];
}

export var OBJ = {};
export var THEN_LIKE = {
  then: function then() {}
};
export var FUNC = function FUNC() {};
export var ITERABLE = new Set();
export var ITERATOR =
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

function createWithIterator(value, onfulfilled) {
  var iterator =
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
            return THEN_LIKE;

          case 41:
            _context2.t18 = _context2.sent;
            _context2.t19 = THEN_LIKE;

            _context2.t17.strictEqual.call(_context2.t17, _context2.t18, _context2.t19);

            _context2.t20 = assert;
            _context2.next = 47;
            return ITERABLE;

          case 47:
            _context2.t21 = _context2.sent;
            _context2.t22 = ITERABLE;

            _context2.t20.strictEqual.call(_context2.t20, _context2.t21, _context2.t22);

            _context2.t23 = assert;
            _context2.next = 53;
            return ITERATOR();

          case 53:
            _context2.t24 = _context2.sent;
            _context2.t25 = ITERABLE;

            _context2.t23.strictEqual.call(_context2.t23, _context2.t24, _context2.t25);

            _context2.t26 = assert;
            _context2.next = 59;
            return new ThenableSync(function (resolve) {
              return resolve(void 0);
            });

          case 59:
            _context2.t27 = _context2.sent;
            _context2.t28 = void 0;

            _context2.t26.strictEqual.call(_context2.t26, _context2.t27, _context2.t28);

            _context2.t29 = assert;
            _context2.next = 65;
            return new ThenableSync(function (resolve) {
              return resolve(null);
            });

          case 65:
            _context2.t30 = _context2.sent;

            _context2.t29.strictEqual.call(_context2.t29, _context2.t30, null);

            _context2.t31 = assert;
            _context2.next = 70;
            return new ThenableSync(function (resolve) {
              return resolve(false);
            });

          case 70:
            _context2.t32 = _context2.sent;

            _context2.t31.strictEqual.call(_context2.t31, _context2.t32, false);

            _context2.t33 = assert;
            _context2.next = 75;
            return new ThenableSync(function (resolve) {
              return resolve(0);
            });

          case 75:
            _context2.t34 = _context2.sent;

            _context2.t33.strictEqual.call(_context2.t33, _context2.t34, 0);

            _context2.t35 = assert;
            _context2.next = 80;
            return new ThenableSync(function (resolve) {
              return resolve('');
            });

          case 80:
            _context2.t36 = _context2.sent;

            _context2.t35.strictEqual.call(_context2.t35, _context2.t36, '');

            _context2.t37 = assert;
            _context2.next = 85;
            return new ThenableSync(function (resolve) {
              return resolve(OBJ);
            });

          case 85:
            _context2.t38 = _context2.sent;
            _context2.t39 = OBJ;

            _context2.t37.strictEqual.call(_context2.t37, _context2.t38, _context2.t39);

            _context2.t40 = assert;
            _context2.next = 91;
            return new ThenableSync(function (resolve) {
              return resolve(FUNC);
            });

          case 91:
            _context2.t41 = _context2.sent;
            _context2.t42 = FUNC;

            _context2.t40.strictEqual.call(_context2.t40, _context2.t41, _context2.t42);

            _context2.t43 = assert;
            _context2.next = 97;
            return new ThenableSync(function (resolve) {
              return resolve(THEN_LIKE);
            });

          case 97:
            _context2.t44 = _context2.sent;
            _context2.t45 = THEN_LIKE;

            _context2.t43.strictEqual.call(_context2.t43, _context2.t44, _context2.t45);

            _context2.t46 = assert;
            _context2.next = 103;
            return new ThenableSync(function (resolve) {
              return resolve(ITERABLE);
            });

          case 103:
            _context2.t47 = _context2.sent;
            _context2.t48 = ITERABLE;

            _context2.t46.strictEqual.call(_context2.t46, _context2.t47, _context2.t48);

            _context2.t49 = assert;
            _context2.next = 109;
            return new ThenableSync(function (resolve) {
              return resolve(ITERATOR());
            });

          case 109:
            _context2.t50 = _context2.sent;
            _context2.t51 = ITERABLE;

            _context2.t49.strictEqual.call(_context2.t49, _context2.t50, _context2.t51);

            return _context2.abrupt("return", value);

          case 113:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })();

  return ThenableSync.resolve(iterator, onfulfilled);
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
      value: [void 0, null, false, 0, '', OBJ, FUNC, THEN_LIKE, ITERABLE, ITERATOR],
      valueAsThenableSync: [false, true],
      valueIsResolved: [false, true],
      createWithExecutor: [false, true],
      createWithIterator: [0, 1, 3],
      resolveImmediate: [true, false],
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

              if (value === ITERATOR) {
                value = ITERATOR();
              }

              var resolveImmediate = options.resolveImmediate && (!options.valueAsThenableSync || options.valueIsResolved);
              assert.notStrictEqual(value && value.constructor, ThenableSync);
              assert.strictEqual(ThenableSync.isThenableSync(value), false);
              var thenable;
              var resolve;

              if (options.createWithExecutor) {
                var result = createWithExecutor();
                thenable = result[0];
                resolve = result[1];
              } else {
                thenable = new ThenableSync();
                resolve = thenable.resolve.bind(thenable);
              }

              assert.strictEqual(thenable && thenable.constructor, ThenableSync);
              assert.strictEqual(ThenableSync.isThenableSync(thenable), true);

              if (options.valueAsThenableSync) {
                value = new ThenableSync();
                assert.strictEqual(ThenableSync.isThenableSync(value), true);

                if (options.valueIsResolved) {
                  value.resolve(options.value);
                }
              }

              if (options.resolveImmediate) {
                resolve(value);
              } // if (options.createWithResolver) {
              // 	const oldValue = value
              // 	value = ThenableSync.resolve(value)
              // 	assert.strictEqual(value,
              // 		options.valueAsThenableSync && options.valueIsResolved
              // 			? options.value
              // 			: oldValue)
              // 	thenable = ThenableSync.resolve(thenable)
              // }
              // if (options.createWithIterator) {
              // 	if (!value || !(isIterable(value)))
              // 	{
              // 		const oldValue = value
              // 		value = ThenableSync.resolve(value)
              // 		assert.strictEqual(value,
              // 			options.valueAsThenableSync && options.valueIsResolved
              // 				? options.value
              // 				: oldValue)
              // 	}
              //
              // 	if (!thenable || !(isIterable(thenable))) {
              // 		thenable = ThenableSync.resolve(thenable)
              // 	}
              // }


              var countQueued = 0;
              var countFulfilled = 0;
              var fulfillResult = new String('Fulfill Result');

              var checkResult = function checkResult(result) {
                var isThenResult = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                if (!isThenResult && resolveImmediate) {
                  assert.strictEqual(result, fulfillResult);
                } else {
                  assert.strictEqual(result && result.constructor, ThenableSync);
                  countQueued++;
                  var fulfilled;
                  var thenResult = result.thenLast(function (o) {
                    assert.notOk(fulfilled);
                    fulfilled = true;
                    assert.strictEqual(o, fulfillResult);
                    countFulfilled++;
                    return fulfillResult;
                  });

                  if (resolveImmediate) {
                    assert.strictEqual(thenResult, fulfillResult);
                  } else {
                    assert.notStrictEqual(thenResult, result);
                    assert.strictEqual(thenResult.constructor, ThenableSync);
                    assert.strictEqual(ThenableSync.isThenableSync(thenResult), true);
                  }
                }
              };

              for (var i = 0; i < options.createWithIterator; i++) {
                if (options.getValueWithResolve) {
                  (function () {
                    countQueued++;
                    var fulfilled = void 0;
                    checkResult(createWithIterator(thenable, function (o) {
                      assert.notOk(fulfilled);
                      fulfilled = true;
                      assert.strictEqual(o, options.expected.value);
                      countFulfilled++;
                      return fulfillResult;
                    }));
                  })();
                }

                thenable = createWithIterator(thenable);
              }

              if (resolveImmediate && options.createWithIterator) {
                assert.strictEqual(thenable, options.expected.value);
              } else {
                assert.strictEqual(thenable && thenable.constructor, ThenableSync);
                assert.strictEqual(ThenableSync.isThenableSync(thenable), true);

                var _loop = function _loop(_i) {
                  countQueued++;
                  var fulfilled = void 0;
                  var thenResult = thenable.then(function (o) {
                    assert.notOk(fulfilled);
                    fulfilled = true;
                    assert.strictEqual(o, options.expected.value);
                    countFulfilled++;
                    return fulfillResult;
                  });
                  assert.notStrictEqual(thenResult, thenable);
                  assert.strictEqual(thenResult.constructor, ThenableSync);
                  assert.strictEqual(ThenableSync.isThenableSync(thenResult), true);
                  checkResult(thenResult, true);
                };

                for (var _i = 0; _i < options.getValueWithThen; _i++) {
                  _loop(_i);
                }
              }

              var _loop2 = function _loop2(_i2) {
                countQueued++;
                var fulfilled = void 0;
                checkResult(ThenableSync.resolve(thenable, function (o) {
                  assert.notOk(fulfilled);
                  fulfilled = true;
                  assert.strictEqual(o, options.expected.value);
                  countFulfilled++;
                  return fulfillResult;
                }));
              };

              for (var _i2 = 0; _i2 < options.getValueWithResolve; _i2++) {
                _loop2(_i2);
              }

              if (!options.resolveImmediate) {
                assert.strictEqual(countFulfilled, 0);
                resolve(value);
              }

              if (options.valueAsThenableSync && !options.valueIsResolved) {
                assert.strictEqual(countFulfilled, 0);
                value.resolve(options.value);
              }

              assert.strictEqual(countFulfilled, countQueued);
              assert.throws(function () {
                return resolve(value);
              }, Error);
              assert.throws(function () {
                return resolve(value);
              }, Error);
              assert.strictEqual(countFulfilled, countQueued);
            };

            if (options.expected.error) {
              assert.throws(action, options.expected.error);
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
            "\n".concat(inputOptions.action.toString(), "\n").concat(ex.stack));
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