"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestThenableSync = exports.ITERATOR_GENERATOR = exports.ITERABLE = exports.FUNC = exports.THEN_LIKE = exports.OBJ = exports.ThenType = exports.ValueType = void 0;

var _async = require("../../../../../../main/common/async/async");

var _ThenableSync = require("../../../../../../main/common/async/ThenableSync");

var _helpers = require("../../../../../../main/common/helpers/helpers");

var _Assert = require("../../../../../../main/common/test/Assert");

var _TestVariants = require("../../src/helpers/TestVariants");

/* tslint:disable:no-empty no-identical-functions no-construct use-primitive-type */
let ValueType;
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

let ThenType;
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
  const resolvedOptions = { ...optionsSource
  };

  for (const key in resolvedOptions) {
    if (Object.prototype.hasOwnProperty.call(resolvedOptions, key)) {
      resolvedOptions[key] = key === 'action' || key === 'value' ? resolvedOptions[key] : resolveOptionValue(optionsParams || resolvedOptions, resolvedOptions[key]);
    }
  }

  resolvedOptions.expected = {};

  for (const key in optionsSource.expected) {
    if (Object.prototype.hasOwnProperty.call(optionsSource.expected, key)) {
      resolvedOptions.expected[key] = resolveOptionValue(optionsParams || resolvedOptions, optionsSource.expected[key]);
    }
  }

  return resolvedOptions;
}

const OBJ = {};
exports.OBJ = OBJ;
const THEN_LIKE = {
  then: onfulfill => {
    onfulfill('THEN_LIKE');
  }
};
exports.THEN_LIKE = THEN_LIKE;

const FUNC = () => {};

exports.FUNC = FUNC;
const ITERABLE = new Set();
exports.ITERABLE = ITERABLE;

const ITERATOR_GENERATOR = function* () {
  yield OBJ;
  return ITERABLE;
};

exports.ITERATOR_GENERATOR = ITERATOR_GENERATOR;

function createIterator(value, isThrow) {
  const iteratorInner = function* () {
    _Assert.assert.strictEqual((yield void 0), void 0);

    _Assert.assert.strictEqual((yield null), null);

    _Assert.assert.strictEqual((yield false), false);

    _Assert.assert.strictEqual((yield 0), 0);

    _Assert.assert.strictEqual((yield ''), '');

    _Assert.assert.strictEqual((yield OBJ), OBJ);

    _Assert.assert.strictEqual((yield FUNC), FUNC); // assert.strictEqual(yield THEN_LIKE, 'THEN_LIKE')


    _Assert.assert.strictEqual((yield ITERABLE), ITERABLE);

    _Assert.assert.strictEqual((yield ITERATOR_GENERATOR()), ITERABLE);

    if (isThrow) {
      throw value;
    }

    return value;
  };

  const iterator = function* () {
    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(void 0))), void 0);

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(null))), null);

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(false))), false);

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(0))), 0);

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(''))), '');

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(OBJ))), OBJ);

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(FUNC))), FUNC); // assert.strictEqual(yield new ThenableSync(resolve => resolve(THEN_LIKE)), 'THEN_LIKE')


    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(ITERABLE))), ITERABLE);

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(ITERATOR_GENERATOR()))), ITERABLE);

    const result = yield iteratorInner();
    return result;
  }();

  return iterator;
}

function createThenable(useExecutor) {
  if (useExecutor) {
    let resultResolve = null;
    let resultReject = null;
    const thenable = new _ThenableSync.ThenableSync((resolve, reject) => {
      resultResolve = resolve;
      resultReject = reject;
    });

    _Assert.assert.ok(resultResolve);

    _Assert.assert.ok(resultReject);

    return [thenable, resultResolve, resultReject];
  } else {
    const thenable = new _ThenableSync.ThenableSync();
    return [thenable, thenable.resolve.bind(thenable), thenable.reject.bind(thenable)];
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

  for (let i = 0; i < 2; i++) {
    switch (getValueType(i)) {
      case ValueType.Value:
        break;

      case ValueType.ThenableResolved:
        {
          const [thenable, resolve, reject] = createThenable(i % 2 === 0);
          resolve(value);
          value = thenable;
          break;
        }

      case ValueType.ThenableRejected:
        {
          const [thenable, resolve, reject] = createThenable(i % 2 === 0);
          reject(value);
          value = thenable;
          valueInfo.useReject = true;
          break;
        }

      case ValueType.ThenableThrowed:
        {
          const thenable = new _ThenableSync.ThenableSync(() => {
            throw value;
          });
          value = thenable;
          valueInfo.useReject = true;
          break;
        }

      case ValueType.ThenableResolve:
        {
          const [thenable, resolve, reject] = createThenable(i % 2 === 0);
          const val = value;
          addResolve(() => resolve(val));
          value = thenable;
          valueInfo.immediate = false;
          break;
        }

      case ValueType.ThenableReject:
        {
          const [thenable, resolve, reject] = createThenable(i % 2 === 0);
          const val = value;
          addResolve(() => reject(val));
          value = thenable;
          valueInfo.useReject = true;
          valueInfo.immediate = false;
          break;
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
  const createThenValue = val => {
    return createValue(val, getValueType, addResolve).value;
  };

  const calcValueInfo = valInfo => {
    return createValue(null, getValueType, () => {}, valInfo);
  };

  const thenResolveValue = (value, onfulfilled, onrejected, isRejected) => {
    const onResult = (o, e) => {
      if (e) {
        return onrejected(o);
      } else {
        return onfulfilled(o);
      }
    };

    const result = (0, _async.resolveValue)(value, onResult, onResult);

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
        throw new Error(`Unknown ResolveResult: ${result}`);
    }
  };

  let thenable = valueInfo.value;

  for (let i = 0; i < 2; i++) {
    switch (getThenType(i)) {
      case ThenType.Then:
        if ((0, _async.isThenable)(thenable)) {
          if (getThenThrow(i)) {
            if (valueInfo.useReject) {
              calcValueInfo(valueInfo);
              thenable = thenable.then(null, o => {
                throw createThenValue(o);
              });
            } else {
              valueInfo.useReject = true;
              calcValueInfo(valueInfo);
              thenable = thenable.then(o => {
                throw createThenValue(o);
              }, null);
            }
          } else {
            if (valueInfo.useReject) {
              valueInfo.useReject = false;
              calcValueInfo(valueInfo);
              thenable = thenable.then(null, o => createThenValue(o));
            } else {
              calcValueInfo(valueInfo);
              thenable = thenable.then(o => createThenValue(o), null);
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
                thenable = thenable.thenLast(null, o => {
                  throw createThenValue(o);
                });
              } else {
                valueInfo.useReject = true;
                calcValueInfo(valueInfo);
                thenable = thenable.thenLast(o => {
                  throw createThenValue(o);
                }, null);
              }
            } else {
              if (valueInfo.useReject) {
                valueInfo.useReject = false;
                calcValueInfo(valueInfo);
                thenable = thenable.thenLast(null, o => createThenValue(o));
              } else {
                calcValueInfo(valueInfo);
                thenable = thenable.thenLast(o => createThenValue(o), null);
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
        throw new Error(`Unknown ThenType: ${getThenType(i)}`);
    }
  }

  valueInfo.value = thenable;
}

class TestThenableSync extends _TestVariants.TestVariants {
  constructor() {
    super();
    this.baseOptionsVariants = {
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
  }

  testVariant(inputOptions) {
    let error;

    for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
      let valueInfo;

      try {
        const options = resolveOptions(inputOptions, null);

        const action = () => {
          const resolveList = [];
          valueInfo = createValue(options.value, index => options['createValue' + index], resolve => resolveList.push(resolve));
          createThen(valueInfo, index => options['thenValue' + index], resolve => resolveList.push(resolve), index => options['thenType' + index], index => options['thenThrow' + index]); // region Check

          let queueSize = 0;

          const onResult = o => {
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
            const checkQueueSize = queueSize;

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

        break;
      } catch (ex) {
        if (!debugIteration) {
          console.log(`Test number: ${TestThenableSync.totalTests}\r\nError in: ${inputOptions.description}\n`, `${JSON.stringify(valueInfo, null, 4)}\n`, inputOptions, // ${
          // JSON.stringify(initialOptions, null, 4)
          // }
          `\n${inputOptions.action.toString()}\n${ex && ex.stack}`);
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

  static test(testCases) {
    if (!testCases.actions) {
      // tslint:disable-next-line:no-empty
      testCases.actions = [() => {}];
    }

    TestThenableSync._instance.test(testCases);
  }

}

exports.TestThenableSync = TestThenableSync;
TestThenableSync.totalTests = 0;
TestThenableSync._instance = new TestThenableSync();