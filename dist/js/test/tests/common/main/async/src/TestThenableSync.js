"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.TestThenableSync = exports.ITERATOR_GENERATOR = exports.ITERABLE = exports.FUNC = exports.THEN_LIKE = exports.OBJ = exports.ThenType = exports.ValueType = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/values"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _async = require("../../../../../../main/common/async/async");

var _ThenableSync = require("../../../../../../main/common/async/ThenableSync");

var _helpers = require("../../../../../../main/common/helpers/helpers");

var _Assert = require("../../../../../../main/common/test/Assert");

var _TestVariants2 = require("../../src/helpers/TestVariants");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

var ValueType;
exports.ValueType = ValueType;

(function (ValueType) {
  ValueType["Value"] = "Value";
  ValueType["ThenableResolved"] = "ThenableResolved";
  ValueType["ThenableRejected"] = "ThenableRejected";
  ValueType["ThenableThrowed"] = "ThenableThrowed";
  ValueType["ThenableResolve"] = "ThenableResolve";
  ValueType["ThenableReject"] = "ThenableReject";
  ValueType["Iterator"] = "Iterator";
  ValueType["IteratorThrow"] = "IteratorThrow";
})(ValueType || (exports.ValueType = ValueType = {}));

var ThenType;
exports.ThenType = ThenType;

(function (ThenType) {
  ThenType["Then"] = "Then";
  ThenType["ThenLast"] = "ThenLast";
})(ThenType || (exports.ThenType = ThenType = {}));

function resolveOptionValue(opts, value) {
  if (typeof value === 'function' && !(value instanceof Error)) {
    value = value(opts);
  }

  return value;
}

function resolveOptions(optionsSource, optionsParams) {
  var resolvedOptions = (0, _extends2.default)({}, optionsSource);

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

var OBJ = {};
exports.OBJ = OBJ;
var THEN_LIKE = {
  then: function then(onfulfill) {
    onfulfill('THEN_LIKE');
  }
};
exports.THEN_LIKE = THEN_LIKE;

var FUNC = function FUNC() {};

exports.FUNC = FUNC;
var ITERABLE = new _set.default();
exports.ITERABLE = ITERABLE;

var ITERATOR_GENERATOR = /*#__PURE__*/_regenerator.default.mark(function ITERATOR_GENERATOR() {
  return _regenerator.default.wrap(function ITERATOR_GENERATOR$(_context) {
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
  }, ITERATOR_GENERATOR);
});

exports.ITERATOR_GENERATOR = ITERATOR_GENERATOR;

function createIterator(value, isThrow) {
  var iteratorInner = /*#__PURE__*/_regenerator.default.mark(function iteratorInner() {
    return _regenerator.default.wrap(function iteratorInner$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.t0 = _Assert.assert;
            _context2.next = 3;
            return void 0;

          case 3:
            _context2.t1 = _context2.sent;
            _context2.t2 = void 0;

            _context2.t0.strictEqual.call(_context2.t0, _context2.t1, _context2.t2);

            _context2.t3 = _Assert.assert;
            _context2.next = 9;
            return null;

          case 9:
            _context2.t4 = _context2.sent;

            _context2.t3.strictEqual.call(_context2.t3, _context2.t4, null);

            _context2.t5 = _Assert.assert;
            _context2.next = 14;
            return false;

          case 14:
            _context2.t6 = _context2.sent;

            _context2.t5.strictEqual.call(_context2.t5, _context2.t6, false);

            _context2.t7 = _Assert.assert;
            _context2.next = 19;
            return 0;

          case 19:
            _context2.t8 = _context2.sent;

            _context2.t7.strictEqual.call(_context2.t7, _context2.t8, 0);

            _context2.t9 = _Assert.assert;
            _context2.next = 24;
            return '';

          case 24:
            _context2.t10 = _context2.sent;

            _context2.t9.strictEqual.call(_context2.t9, _context2.t10, '');

            _context2.t11 = _Assert.assert;
            _context2.next = 29;
            return OBJ;

          case 29:
            _context2.t12 = _context2.sent;
            _context2.t13 = OBJ;

            _context2.t11.strictEqual.call(_context2.t11, _context2.t12, _context2.t13);

            _context2.t14 = _Assert.assert;
            _context2.next = 35;
            return FUNC;

          case 35:
            _context2.t15 = _context2.sent;
            _context2.t16 = FUNC;

            _context2.t14.strictEqual.call(_context2.t14, _context2.t15, _context2.t16);

            _context2.t17 = _Assert.assert;
            _context2.next = 41;
            return ITERABLE;

          case 41:
            _context2.t18 = _context2.sent;
            _context2.t19 = ITERABLE;

            _context2.t17.strictEqual.call(_context2.t17, _context2.t18, _context2.t19);

            _context2.t20 = _Assert.assert;
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
    }, iteratorInner);
  });

  var iterator = /*#__PURE__*/_regenerator.default.mark(function _callee() {
    var result;
    return _regenerator.default.wrap(function _callee$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = _Assert.assert;
            _context3.next = 3;
            return new _ThenableSync.ThenableSync(function (resolve) {
              return resolve(void 0);
            });

          case 3:
            _context3.t1 = _context3.sent;
            _context3.t2 = void 0;

            _context3.t0.strictEqual.call(_context3.t0, _context3.t1, _context3.t2);

            _context3.t3 = _Assert.assert;
            _context3.next = 9;
            return new _ThenableSync.ThenableSync(function (resolve) {
              return resolve(null);
            });

          case 9:
            _context3.t4 = _context3.sent;

            _context3.t3.strictEqual.call(_context3.t3, _context3.t4, null);

            _context3.t5 = _Assert.assert;
            _context3.next = 14;
            return new _ThenableSync.ThenableSync(function (resolve) {
              return resolve(false);
            });

          case 14:
            _context3.t6 = _context3.sent;

            _context3.t5.strictEqual.call(_context3.t5, _context3.t6, false);

            _context3.t7 = _Assert.assert;
            _context3.next = 19;
            return new _ThenableSync.ThenableSync(function (resolve) {
              return resolve(0);
            });

          case 19:
            _context3.t8 = _context3.sent;

            _context3.t7.strictEqual.call(_context3.t7, _context3.t8, 0);

            _context3.t9 = _Assert.assert;
            _context3.next = 24;
            return new _ThenableSync.ThenableSync(function (resolve) {
              return resolve('');
            });

          case 24:
            _context3.t10 = _context3.sent;

            _context3.t9.strictEqual.call(_context3.t9, _context3.t10, '');

            _context3.t11 = _Assert.assert;
            _context3.next = 29;
            return new _ThenableSync.ThenableSync(function (resolve) {
              return resolve(OBJ);
            });

          case 29:
            _context3.t12 = _context3.sent;
            _context3.t13 = OBJ;

            _context3.t11.strictEqual.call(_context3.t11, _context3.t12, _context3.t13);

            _context3.t14 = _Assert.assert;
            _context3.next = 35;
            return new _ThenableSync.ThenableSync(function (resolve) {
              return resolve(FUNC);
            });

          case 35:
            _context3.t15 = _context3.sent;
            _context3.t16 = FUNC;

            _context3.t14.strictEqual.call(_context3.t14, _context3.t15, _context3.t16);

            _context3.t17 = _Assert.assert;
            _context3.next = 41;
            return new _ThenableSync.ThenableSync(function (resolve) {
              return resolve(ITERABLE);
            });

          case 41:
            _context3.t18 = _context3.sent;
            _context3.t19 = ITERABLE;

            _context3.t17.strictEqual.call(_context3.t17, _context3.t18, _context3.t19);

            _context3.t20 = _Assert.assert;
            _context3.next = 47;
            return new _ThenableSync.ThenableSync(function (resolve) {
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
    }, _callee);
  })();

  return iterator;
}

function createThenable(useExecutor) {
  if (useExecutor) {
    var resultResolve = null;
    var resultReject = null;
    var thenable = new _ThenableSync.ThenableSync(function (resolve, reject) {
      resultResolve = resolve;
      resultReject = reject;
    });

    _Assert.assert.ok(resultResolve);

    _Assert.assert.ok(resultReject);

    return [thenable, resultResolve, resultReject];
  } else {
    var _context4, _context5;

    var _thenable = new _ThenableSync.ThenableSync();

    return [_thenable, (0, _bind.default)(_context4 = _thenable.resolve).call(_context4, _thenable), (0, _bind.default)(_context5 = _thenable.reject).call(_context5, _thenable)];
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
              thenable = _createThenable[0],
              _resolve = _createThenable[1],
              reject = _createThenable[2];

          _resolve(value);

          value = thenable;
          break;
        }

      case ValueType.ThenableRejected:
        {
          var _createThenable2 = createThenable(i % 2 === 0),
              _thenable2 = _createThenable2[0],
              _resolve2 = _createThenable2[1],
              _reject = _createThenable2[2];

          _reject(value);

          value = _thenable2;
          valueInfo.useReject = true;
          break;
        }

      case ValueType.ThenableThrowed:
        {
          var _thenable3 = new _ThenableSync.ThenableSync(function () {
            throw value;
          });

          value = _thenable3;
          valueInfo.useReject = true;
          break;
        }

      case ValueType.ThenableResolve:
        {
          var _ret = function () {
            var _createThenable3 = createThenable(i % 2 === 0),
                thenable = _createThenable3[0],
                resolve = _createThenable3[1],
                reject = _createThenable3[2];

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
            var _createThenable4 = createThenable(i % 2 === 0),
                thenable = _createThenable4[0],
                resolve = _createThenable4[1],
                reject = _createThenable4[2];

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
          valueInfo.throw = true;
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

    var result = (0, _async.resolveValue)(value, onResult, onResult);

    switch (result) {
      case _async.ResolveResult.Immediate:
        _Assert.assert.strictEqual(isRejected, false);

        break;

      case _async.ResolveResult.ImmediateError:
        _Assert.assert.strictEqual(isRejected, true);

        break;

      case _async.ResolveResult.Deferred:
        break;

      case _async.ResolveResult.DeferredError:
        _Assert.assert.strictEqual(isRejected, true);

        break;

      default:
        throw new Error("Unknown ResolveResult: " + result);
    }
  };

  var thenable = valueInfo.value;

  for (var i = 0; i < 2; i++) {
    switch (getThenType(i)) {
      case ThenType.Then:
        if ((0, _async.isThenable)(thenable)) {
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
          if ((0, _async.isThenable)(thenable)) {
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

          _Assert.assert.strictEqual(valueInfo.immediate, true);

          _Assert.assert.strictEqual(valueInfo.useReject, true);

          _Assert.assert.strictEqual((0, _async.isThenable)(err), false);

          _Assert.assert.strictEqual((0, _helpers.isIterator)(err), false);

          valueInfo.throw = false;
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
        throw new Error("Unknown ThenType: " + getThenType(i));
    }
  }

  valueInfo.value = thenable;
}

var TestThenableSync = /*#__PURE__*/function (_TestVariants) {
  (0, _inherits2.default)(TestThenableSync, _TestVariants);

  var _super = _createSuper(TestThenableSync);

  function TestThenableSync() {
    var _this;

    (0, _classCallCheck2.default)(this, TestThenableSync);
    _this = _super.call(this);
    _this.baseOptionsVariants = {
      value: ['v'],
      // , void 0, ITERABLE, ITERATOR_GENERATOR],
      createValue0: (0, _values.default)(ValueType),
      thenValue0: (0, _values.default)(ValueType),
      thenThrow0: [false, true],
      thenType0: (0, _values.default)(ThenType),
      createValue1: (0, _values.default)(ValueType),
      thenValue1: (0, _values.default)(ValueType),
      thenThrow1: [false, true],
      thenType1: (0, _values.default)(ThenType) // createValue2: Object.values(ValueType),
      // thenValue2: Object.values(ValueType),
      // thenThrow2: [false, true],
      // thenType2: Object.values(ThenType),

    };
    return _this;
  }

  (0, _createClass2.default)(TestThenableSync, [{
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
              _Assert.assert.ok(queueSize > 0);

              queueSize--;

              _Assert.assert.strictEqual(o, valueInfo.origValue);
            };

            if (valueInfo.useReject) {
              queueSize++;

              _ThenableSync.ThenableSync.resolve(valueInfo.value, null, onResult, true);
            } else {
              queueSize++;

              _ThenableSync.ThenableSync.resolve(valueInfo.value, onResult, null, true);
            }

            if (!(0, _helpers.isIterator)(valueInfo.value)) {
              if (valueInfo.useReject) {
                queueSize++;

                _ThenableSync.ThenableSync.resolve(_ThenableSync.ThenableSync.resolve(valueInfo.value, onResult, null, true), null, onResult, true);
              } else {
                queueSize++;

                _ThenableSync.ThenableSync.resolve(_ThenableSync.ThenableSync.resolve(valueInfo.value, null, onResult, true), onResult, null, true);
              }

              queueSize++;

              _ThenableSync.ThenableSync.resolve(_ThenableSync.ThenableSync.resolve(valueInfo.value, null, null, true), onResult, onResult, true);
            }

            if ((0, _async.isThenable)(valueInfo.value)) {
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
              _Assert.assert.strictEqual(queueSize, 0);
            } else {
              var checkQueueSize = queueSize;

              while (resolveList.length) {
                _Assert.assert.strictEqual(queueSize, checkQueueSize);

                resolveList.shift()();
              }

              _Assert.assert.strictEqual(queueSize, 0);
            } // endregion

          };

          if (options.expected.error) {
            _Assert.assert.throws(action, options.expected.error);
          } else {
            action();
          }

          _Assert.assert.assertNotHandledErrors();

          return "break";
        } catch (ex) {
          if (!debugIteration) {
            console.log("Test number: " + TestThenableSync.totalTests + "\r\nError in: " + inputOptions.description + "\n", (0, _stringify.default)(valueInfo, null, 4) + "\n", inputOptions, // ${
            // JSON.stringify(initialOptions, null, 4)
            // }
            "\n" + inputOptions.action.toString() + "\n" + (ex && ex.stack));
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
}(_TestVariants2.TestVariants);

exports.TestThenableSync = TestThenableSync;
TestThenableSync.totalTests = 0;
TestThenableSync._instance = new TestThenableSync();