/* tslint:disable:no-empty no-identical-functions no-construct use-primitive-type */
import { isThenable, ResolveResult, resolveValue } from '../../../../../../main/common/async/async';
import { ThenableSync } from '../../../../../../main/common/async/ThenableSync';
import { isIterator } from '../../../../../../main/common/helpers/helpers';
import { assert } from '../../../../../../main/common/test/Assert';
import { TestVariants } from '../../src/helpers/TestVariants';
export let ValueType;

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

export let ThenType;

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

export const OBJ = {};
export const THEN_LIKE = {
  then: onfulfill => {
    onfulfill('THEN_LIKE');
  }
};
export const FUNC = () => {};
export const ITERABLE = new Set();
export const ITERATOR_GENERATOR = function* () {
  yield OBJ;
  return ITERABLE;
};

function createIterator(value, isThrow) {
  const iteratorInner = function* () {
    assert.strictEqual((yield void 0), void 0);
    assert.strictEqual((yield null), null);
    assert.strictEqual((yield false), false);
    assert.strictEqual((yield 0), 0);
    assert.strictEqual((yield ''), '');
    assert.strictEqual((yield OBJ), OBJ);
    assert.strictEqual((yield FUNC), FUNC); // assert.strictEqual(yield THEN_LIKE, 'THEN_LIKE')

    assert.strictEqual((yield ITERABLE), ITERABLE);
    assert.strictEqual((yield ITERATOR_GENERATOR()), ITERABLE);

    if (isThrow) {
      throw value;
    }

    return value;
  };

  const iterator = function* () {
    assert.strictEqual((yield new ThenableSync(resolve => resolve(void 0))), void 0);
    assert.strictEqual((yield new ThenableSync(resolve => resolve(null))), null);
    assert.strictEqual((yield new ThenableSync(resolve => resolve(false))), false);
    assert.strictEqual((yield new ThenableSync(resolve => resolve(0))), 0);
    assert.strictEqual((yield new ThenableSync(resolve => resolve(''))), '');
    assert.strictEqual((yield new ThenableSync(resolve => resolve(OBJ))), OBJ);
    assert.strictEqual((yield new ThenableSync(resolve => resolve(FUNC))), FUNC); // assert.strictEqual(yield new ThenableSync(resolve => resolve(THEN_LIKE)), 'THEN_LIKE')

    assert.strictEqual((yield new ThenableSync(resolve => resolve(ITERABLE))), ITERABLE);
    assert.strictEqual((yield new ThenableSync(resolve => resolve(ITERATOR_GENERATOR()))), ITERABLE);
    const result = yield iteratorInner();
    return result;
  }();

  return iterator;
}

function createThenable(useExecutor) {
  if (useExecutor) {
    let resultResolve = null;
    let resultReject = null;
    const thenable = new ThenableSync((resolve, reject) => {
      resultResolve = resolve;
      resultReject = reject;
    });
    assert.ok(resultResolve);
    assert.ok(resultReject);
    return [thenable, resultResolve, resultReject];
  } else {
    const thenable = new ThenableSync();
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
          const thenable = new ThenableSync(() => {
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

    const result = resolveValue(value, onResult, onResult);

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
        throw new Error(`Unknown ResolveResult: ${result}`);
    }
  };

  let thenable = valueInfo.value;

  for (let i = 0; i < 2; i++) {
    switch (getThenType(i)) {
      case ThenType.Then:
        if (isThenable(thenable)) {
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
          if (isThenable(thenable)) {
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

          assert.strictEqual(valueInfo.immediate, true);
          assert.strictEqual(valueInfo.useReject, true);
          assert.strictEqual(isThenable(err), false);
          assert.strictEqual(isIterator(err), false);
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

export class TestThenableSync extends TestVariants {
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
            const checkQueueSize = queueSize;

            while (resolveList.length) {
              assert.strictEqual(queueSize, checkQueueSize);
              resolveList.shift()();
            }

            assert.strictEqual(queueSize, 0);
          } // endregion

        };

        if (options.expected.error) {
          assert.throws(action, options.expected.error);
        } else {
          action();
        }

        assert.assertNotHandledErrors();
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
TestThenableSync.totalTests = 0;
TestThenableSync._instance = new TestThenableSync();