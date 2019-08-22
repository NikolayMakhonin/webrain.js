import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/* tslint:disable:no-empty no-identical-functions no-construct use-primitive-type */
import { isThenable, ResolveResult, resolveValue } from '../../../../../../main/common/async/async';
import { ThenableSync } from '../../../../../../main/common/async/ThenableSync';
import { isIterator } from '../../../../../../main/common/helpers/helpers';
import { assert } from '../../../../../../main/common/test/Assert';
import { TestVariants } from '../../src/helpers/TestVariants';
export var ValueType;

(function (ValueType) {
  ValueType["Value"] = "Value";
  ValueType["ThenableResolved"] = "ThenableResolved";
  ValueType["ThenableRejected"] = "ThenableRejected";
  ValueType["ThenableThrowed"] = "ThenableThrowed";
  ValueType["ThenableResolve"] = "ThenableResolve";
  ValueType["ThenableReject"] = "ThenableReject";
  ValueType["Iterator"] = "Iterator";
  ValueType["IteratorThrow"] = "IteratorThrow";
})(ValueType || (ValueType = {}));

export var ThenType;

(function (ThenType) {
  ThenType["Then"] = "Then";
  ThenType["ThenLast"] = "ThenLast";
})(ThenType || (ThenType = {}));

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

function createIterator(value, isThrow) {
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

            if (!isThrow) {
              _context2.next = 52;
              break;
            }

            throw value;

          case 52:
            return _context2.abrupt("return", value);

          case 53:
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

  return iterator;
}

function createThenable(useExecutor) {
  if (useExecutor) {
    var resultResolve = null;
    var resultReject = null;
    var thenable = new ThenableSync(function (resolve, reject) {
      resultResolve = resolve;
      resultReject = reject;
    });
    assert.ok(resultResolve);
    assert.ok(resultReject);
    return [thenable, resultResolve, resultReject];
  } else {
    var _thenable = new ThenableSync();

    return [_thenable, _thenable.resolve.bind(_thenable), _thenable.reject.bind(_thenable)];
  }
}

function createValue(value, getValueType, addResolve, valueInfo) {
  if (!valueInfo) {
    valueInfo = {
      origValue: value,
      immediate: true,
      useReject: false
    };
  }

  for (var i = 0; i < 2; i++) {
    switch (getValueType(i)) {
      case ValueType.Value:
        break;

      case ValueType.ThenableResolved:
        {
          var _createThenable = createThenable(i % 2 === 0),
              _createThenable2 = _slicedToArray(_createThenable, 3),
              thenable = _createThenable2[0],
              _resolve = _createThenable2[1],
              reject = _createThenable2[2];

          _resolve(value);

          value = thenable;
          break;
        }

      case ValueType.ThenableRejected:
        {
          var _createThenable3 = createThenable(i % 2 === 0),
              _createThenable4 = _slicedToArray(_createThenable3, 3),
              _thenable2 = _createThenable4[0],
              _resolve2 = _createThenable4[1],
              _reject = _createThenable4[2];

          _reject(value);

          value = _thenable2;
          valueInfo.useReject = true;
          break;
        }

      case ValueType.ThenableThrowed:
        {
          var _thenable3 = new ThenableSync(function () {
            throw value;
          });

          value = _thenable3;
          valueInfo.useReject = true;
          break;
        }

      case ValueType.ThenableResolve:
        {
          var _ret = function () {
            var _createThenable5 = createThenable(i % 2 === 0),
                _createThenable6 = _slicedToArray(_createThenable5, 3),
                thenable = _createThenable6[0],
                resolve = _createThenable6[1],
                reject = _createThenable6[2];

            var val = value;
            addResolve(function () {
              return resolve(val);
            });
            value = thenable;
            valueInfo.immediate = false;
            return "break";
          }();

          if (_ret === "break") break;
        }

      case ValueType.ThenableReject:
        {
          var _ret2 = function () {
            var _createThenable7 = createThenable(i % 2 === 0),
                _createThenable8 = _slicedToArray(_createThenable7, 3),
                thenable = _createThenable8[0],
                resolve = _createThenable8[1],
                reject = _createThenable8[2];

            var val = value;
            addResolve(function () {
              return reject(val);
            });
            value = thenable;
            valueInfo.useReject = true;
            valueInfo.immediate = false;
            return "break";
          }();

          if (_ret2 === "break") break;
        }

      case ValueType.Iterator:
        {
          value = createIterator(value, false);
          break;
        }

      case ValueType.IteratorThrow:
        {
          valueInfo["throw"] = true;
          valueInfo.useReject = true;
          value = createIterator(value, true);
          break;
        }
    }
  }

  valueInfo.value = value;
  return valueInfo;
}

function createThen(valueInfo, getValueType, addResolve, getThenType, getThenThrow) {
  var createThenValue = function createThenValue(val) {
    return createValue(val, getValueType, addResolve).value;
  };

  var calcValueInfo = function calcValueInfo(valInfo) {
    return createValue(null, getValueType, function () {}, valInfo);
  };

  var thenResolveValue = function thenResolveValue(value, onfulfilled, onrejected, isRejected) {
    var onResult = function onResult(o, e) {
      if (e) {
        return onrejected(o);
      } else {
        return onfulfilled(o);
      }
    };

    var result = resolveValue(value, onResult, onResult);

    switch (result) {
      case ResolveResult.Immediate:
        assert.strictEqual(isRejected, false);
        break;

      case ResolveResult.ImmediateError:
        assert.strictEqual(isRejected, true);
        break;

      case ResolveResult.Deferred:
        break;

      case ResolveResult.DeferredError:
        assert.strictEqual(isRejected, true);
        break;

      default:
        throw new Error("Unknown ResolveResult: ".concat(result));
    }
  };

  var thenable = valueInfo.value;

  for (var i = 0; i < 2; i++) {
    switch (getThenType(i)) {
      case ThenType.Then:
        if (isThenable(thenable)) {
          if (getThenThrow(i)) {
            if (valueInfo.useReject) {
              calcValueInfo(valueInfo);
              thenable = thenable.then(null, function (o) {
                throw createThenValue(o);
              });
            } else {
              valueInfo.useReject = true;
              calcValueInfo(valueInfo);
              thenable = thenable.then(function (o) {
                throw createThenValue(o);
              }, null);
            }
          } else {
            if (valueInfo.useReject) {
              valueInfo.useReject = false;
              calcValueInfo(valueInfo);
              thenable = thenable.then(null, function (o) {
                return createThenValue(o);
              });
            } else {
              calcValueInfo(valueInfo);
              thenable = thenable.then(function (o) {
                return createThenValue(o);
              }, null);
            }
          }
        }

        break;

      case ThenType.ThenLast:
        try {
          if (isThenable(thenable)) {
            if (getThenThrow(i)) {
              if (valueInfo.useReject) {
                calcValueInfo(valueInfo);
                thenable = thenable.thenLast(null, function (o) {
                  throw createThenValue(o);
                });
              } else {
                valueInfo.useReject = true;
                calcValueInfo(valueInfo);
                thenable = thenable.thenLast(function (o) {
                  throw createThenValue(o);
                }, null);
              }
            } else {
              if (valueInfo.useReject) {
                valueInfo.useReject = false;
                calcValueInfo(valueInfo);
                thenable = thenable.thenLast(null, function (o) {
                  return createThenValue(o);
                });
              } else {
                calcValueInfo(valueInfo);
                thenable = thenable.thenLast(function (o) {
                  return createThenValue(o);
                }, null);
              }
            }
          }
        } catch (err) {
          if (err instanceof Error) {
            throw err;
          }

          assert.strictEqual(valueInfo.immediate, true);
          assert.strictEqual(valueInfo.useReject, true);
          assert.strictEqual(isThenable(err), false);
          assert.strictEqual(isIterator(err), false);
          valueInfo["throw"] = false;
          valueInfo.useReject = false;
          thenable = err;
        }

        break;
      // case ThenType.ResolveValue:
      // 	try {
      // 		if (calcValueInfo(null).throw && (!valueInfo.immediate || !calcValueInfo(null).immediate)) {
      // 			break
      // 		}
      // 		const [newThenable, resolve, reject] = createThenable(i % 2 === 0)
      // 		if (getThenThrow(i)) {
      // 			if (valueInfo.useReject) {
      // 				if (!valueInfo.immediate || !calcValueInfo(null).immediate) {
      // 					break
      // 				}
      // 				calcValueInfo(valueInfo)
      // 				thenResolveValue(thenable, null, o => { throw createThenValue(o) }, true)
      // 			} else {
      // 				valueInfo.useReject = true
      // 				calcValueInfo(valueInfo)
      // 				thenResolveValue(thenable, o => { throw createThenValue(o) }, reject, true)
      // 			}
      // 		} else {
      // 			if (valueInfo.useReject) {
      // 				// valueInfo.useReject = false
      // 				calcValueInfo(valueInfo)
      // 				thenResolveValue(thenable, null, o => { reject(createThenValue(o)) }, true)
      // 			} else {
      // 				calcValueInfo(valueInfo)
      // 				thenResolveValue(thenable, o => { resolve(createThenValue(o)) }, null, false)
      // 			}
      // 		}
      // 		thenable = newThenable
      // 	} catch (err) {
      // 		if (err instanceof Error) {
      // 			throw err
      // 		}
      // 		assert.strictEqual(valueInfo.useReject, true)
      // 		if (!valueInfo.throw) {
      // 			assert.strictEqual(valueInfo.immediate, true)
      // 			assert.strictEqual(isThenable(err), false)
      // 			assert.strictEqual(isIterator(err), false)
      // 		}
      // 		if (isThenable(err) || isIterator(err)) {
      // 			thenable = ThenableSync.createRejected(err)
      // 		} else {
      // 			valueInfo.throw = false
      // 			valueInfo.useReject = false
      // 			thenable = err
      // 		}
      // 	}
      // 	break
      // case ThenType.ResolveAsync:
      // 	break

      default:
        throw new Error("Unknown ThenType: ".concat(getThenType(i)));
    }
  }

  valueInfo.value = thenable;
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
      value: ['v'],
      // , void 0, ITERABLE, ITERATOR_GENERATOR],
      createValue0: Object.values(ValueType),
      thenValue0: Object.values(ValueType),
      thenThrow0: [false, true],
      thenType0: Object.values(ThenType),
      createValue1: Object.values(ValueType),
      thenValue1: Object.values(ValueType),
      thenThrow1: [false, true],
      thenType1: Object.values(ThenType) // createValue2: Object.values(ValueType),
      // thenValue2: Object.values(ValueType),
      // thenThrow2: [false, true],
      // thenType2: Object.values(ThenType),

    };
    return _this;
  }

  _createClass(TestThenableSync, [{
    key: "testVariant",
    value: function testVariant(inputOptions) {
      var error;

      var _loop = function _loop(debugIteration) {
        var valueInfo = void 0;

        try {
          var options = resolveOptions(inputOptions, null);

          var action = function action() {
            var resolveList = [];
            valueInfo = createValue(options.value, function (index) {
              return options['createValue' + index];
            }, function (resolve) {
              return resolveList.push(resolve);
            });
            createThen(valueInfo, function (index) {
              return options['thenValue' + index];
            }, function (resolve) {
              return resolveList.push(resolve);
            }, function (index) {
              return options['thenType' + index];
            }, function (index) {
              return options['thenThrow' + index];
            }); // region Check

            var queueSize = 0;

            var onResult = function onResult(o) {
              assert.ok(queueSize > 0);
              queueSize--;
              assert.strictEqual(o, valueInfo.origValue);
            };

            if (valueInfo.useReject) {
              queueSize++;
              ThenableSync.resolve(valueInfo.value, null, onResult, true);
            } else {
              queueSize++;
              ThenableSync.resolve(valueInfo.value, onResult, null, true);
            }

            if (!isIterator(valueInfo.value)) {
              if (valueInfo.useReject) {
                queueSize++;
                ThenableSync.resolve(ThenableSync.resolve(valueInfo.value, onResult, null, true), null, onResult, true);
              } else {
                queueSize++;
                ThenableSync.resolve(ThenableSync.resolve(valueInfo.value, null, onResult, true), onResult, null, true);
              }

              queueSize++;
              ThenableSync.resolve(ThenableSync.resolve(valueInfo.value, null, null, true), onResult, onResult, true);
            }

            if (isThenable(valueInfo.value)) {
              if (valueInfo.useReject) {
                queueSize++;
                valueInfo.value.then(onResult, null).then(null, onResult);
              } else {
                queueSize++;
                valueInfo.value.then(null, onResult).then(onResult, null);
              }

              queueSize++;
              valueInfo.value.then(null, null).then(onResult, onResult);
            }

            if (valueInfo.immediate) {
              assert.strictEqual(queueSize, 0);
            } else {
              var checkQueueSize = queueSize;

              while (resolveList.length) {
                assert.strictEqual(queueSize, checkQueueSize);
                resolveList.shift()();
              }

              assert.strictEqual(queueSize, 0);
            } // endregion

          };

          if (options.expected.error) {
            assert["throws"](action, options.expected.error);
          } else {
            action();
          }

          return "break";
        } catch (ex) {
          if (!debugIteration) {
            console.log("Test number: ".concat(TestThenableSync.totalTests, "\r\nError in: ").concat(inputOptions.description, "\n"), "".concat(JSON.stringify(valueInfo, null, 4), "\n"), inputOptions, // ${
            // JSON.stringify(initialOptions, null, 4)
            // }
            "\n".concat(inputOptions.action.toString(), "\n").concat(ex && ex.stack));
            error = ex;
          }
        } finally {
          TestThenableSync.totalTests++;
        }
      };

      for (var debugIteration = 0; debugIteration < 3; debugIteration++) {
        var _ret3 = _loop(debugIteration);

        if (_ret3 === "break") break;
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