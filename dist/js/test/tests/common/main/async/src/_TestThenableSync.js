"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestThenableSync = exports.ITERATOR_GENERATOR = exports.ITERABLE = exports.FUNC = exports.THEN_LIKE = exports.OBJ = exports.ResolveType = void 0;

var _ThenableSync = require("../../../../../../main/common/async/ThenableSync");

var _Assert = require("../../../../../../main/common/test/Assert");

var _TestVariants = require("../../src/helpers/TestVariants");

/* tslint:disable:no-empty no-identical-functions no-construct use-primitive-type */
let ResolveType;
exports.ResolveType = ResolveType;

(function (ResolveType) {
  ResolveType[ResolveType["Value"] = 0] = "Value";
  ResolveType[ResolveType["Resolved"] = 1] = "Resolved";
  ResolveType[ResolveType["Rejected"] = 2] = "Rejected";
  ResolveType[ResolveType["Throwed"] = 3] = "Throwed";
  ResolveType[ResolveType["Resolve"] = 4] = "Resolve";
  ResolveType[ResolveType["Reject"] = 5] = "Reject";
})(ResolveType || (exports.ResolveType = ResolveType = {}));

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

function createWithExecutor() {
  let resultResolve = null;
  let resultReject = null;
  const thenable = new _ThenableSync.ThenableSync((resolve, reject) => {
    resultResolve = resolve;
    resultReject = reject;
  });

  _Assert.assert.ok(resultResolve);

  _Assert.assert.ok(resultReject);

  return [thenable, resultResolve, resultReject];
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

function createWithIterator(value, onfulfilled, onrejected) {
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

  return _ThenableSync.ThenableSync.resolve(iterator, onfulfilled, onrejected);
}

class TestThenableSync extends _TestVariants.TestVariants {
  constructor() {
    super();
    this.baseOptionsVariants = {
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
  }

  testVariant(inputOptions) {
    let error;

    for (let debugIteration = 0; debugIteration < 3; debugIteration++) {
      try {
        const options = resolveOptions(inputOptions, null);

        const action = () => {
          let value = options.value;
          const resolveImmediate = (options.type === ResolveType.Value || options.type === ResolveType.Resolved || options.type === ResolveType.Rejected || options.type === ResolveType.Throwed) && (options.valueType === ResolveType.Value || options.valueType === ResolveType.Resolved || options.valueType === ResolveType.Rejected || options.valueType === ResolveType.Throwed);
          const useReject = options.type === ResolveType.Rejected || options.type === ResolveType.Throwed || options.type === ResolveType.Reject || options.valueType === ResolveType.Rejected || options.valueType === ResolveType.Throwed || options.valueType === ResolveType.Reject;

          _Assert.assert.notStrictEqual(value && value.constructor, _ThenableSync.ThenableSync);

          _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenable(value), false);

          switch (options.valueType) {
            case ResolveType.Value:
              break;

            case ResolveType.Resolved:
              value = new _ThenableSync.ThenableSync();

              _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenable(value), true);

              value.resolve(options.value);
              break;

            case ResolveType.Rejected:
              value = new _ThenableSync.ThenableSync();

              _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenable(value), true);

              value.reject(options.value);
              break;

            case ResolveType.Throwed:
              value = new _ThenableSync.ThenableSync(() => {
                throw value;
              });

              _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenable(value), true);

              break;

            case ResolveType.Resolve:
            case ResolveType.Reject:
              value = new _ThenableSync.ThenableSync();

              _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenable(value), true);

              break;

            default:
              throw new Error(`Unknown valueType: ${options.valueType}`);
          }

          let thenable;
          let resolve;
          let reject;

          if (options.createWithExecutor) {
            const result = createWithExecutor();
            thenable = result[0];
            resolve = result[1];
            reject = result[2];
          } else {
            thenable = new _ThenableSync.ThenableSync();
            resolve = thenable.resolve.bind(thenable);
            reject = thenable.reject.bind(thenable);
          }

          _Assert.assert.strictEqual(thenable && thenable.constructor, _ThenableSync.ThenableSync);

          _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenable(thenable), true);

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
              thenable = new _ThenableSync.ThenableSync(() => {
                throw value;
              });

              _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenable(thenable), true);

              break;

            case ResolveType.Resolve:
            case ResolveType.Reject:
              break;

            default:
              throw new Error(`Unknown valueType: ${options.valueType}`);
          }

          const resolveValue = func => {
            try {
              return func();
            } catch (err) {
              if (err instanceof Error) {
                throw err;
              }

              return err;
            }
          };

          let countQueued = 0;
          let countFulfilled = 0;
          const fulfillResult = new String('Fulfill Result');

          const testThen = (then, isThenResult = false) => {
            countQueued++;
            let fulfilled = 0;

            const onResult = o => {
              _Assert.assert.ok(fulfilled <= 0);

              fulfilled++;

              _Assert.assert.strictEqual(o, options.expected.value);

              countFulfilled++;
              return fulfillResult;
            };

            if (useReject) {
              checkResult(resolveValue(() => then(null, null)), options.expected.value, isThenResult);
              checkResult(resolveValue(() => then(onResult, null)), options.expected.value, isThenResult);
              checkResult(resolveValue(() => then(null, onResult)), fulfillResult, isThenResult);
              countQueued++;
              fulfilled--;
              checkResult(resolveValue(() => then(null, o => {
                throw o;
              }).then(null, onResult)), fulfillResult, isThenResult);
              countQueued++;
              fulfilled--;
              checkResult(resolveValue(() => then(null, o => {
                throw _ThenableSync.ThenableSync.createRejected(o);
              }).then(null, onResult)), fulfillResult, isThenResult);
            } else {
              checkResult(resolveValue(() => then(null, null)), options.expected.value, isThenResult);
              checkResult(resolveValue(() => then(null, onResult)), options.expected.value, isThenResult);
              checkResult(resolveValue(() => then(onResult, null)), fulfillResult, isThenResult);
              countQueued++;
              fulfilled--;
              checkResult(resolveValue(() => then(o => {
                throw o;
              }, onResult)), fulfillResult, isThenResult);
              countQueued++;
              fulfilled--;
              checkResult(resolveValue(() => then(o => {
                throw _ThenableSync.ThenableSync.createRejected(o);
              }, onResult)), fulfillResult, isThenResult);
              countQueued++;
              fulfilled--;
              let res;
              checkResult(resolveValue(() => {
                const result = then(o => {
                  const th = new _ThenableSync.ThenableSync();

                  res = () => th.reject(o);

                  throw th;
                }, onResult);
                return result;
              }), fulfillResult, isThenResult);
              res();
            }

            countQueued++;
            fulfilled--;
            checkResult(resolveValue(() => then(onResult, onResult)), fulfillResult, isThenResult);
          };

          const checkResult = (result, expected, isThenResult = false) => {
            if (!isThenResult && resolveImmediate) {
              _Assert.assert.strictEqual(result, expected);
            } else {
              _Assert.assert.strictEqual(result && result.constructor, _ThenableSync.ThenableSync);

              countQueued++;
              let fulfilled;

              const onResult = o => {
                _Assert.assert.notOk(fulfilled);

                fulfilled = true;

                _Assert.assert.strictEqual(o, expected);

                countFulfilled++;
                return expected;
              };

              const thenResult = resolveValue(() => result.then(onResult, onResult).thenLast());

              if (resolveImmediate) {
                _Assert.assert.strictEqual(thenResult, expected);
              } else {
                _Assert.assert.notStrictEqual(thenResult, result);

                _Assert.assert.strictEqual(thenResult.constructor, _ThenableSync.ThenableSync);

                _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenable(thenResult), true);
              }
            }
          };

          for (let i = 0; i < options.createWithIterator; i++) {
            if (options.getValueWithResolve) {
              testThen((r, e) => createWithIterator(thenable, r, e));
            }

            thenable = resolveValue(() => createWithIterator(thenable));
          }

          if (resolveImmediate && options.createWithIterator || options.type === ResolveType.Value && options.valueType === ResolveType.Value) {
            _Assert.assert.strictEqual(thenable, options.expected.value);
          } else {
            _Assert.assert.strictEqual(thenable && thenable.constructor, _ThenableSync.ThenableSync);

            _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenable(thenable), true);

            for (let i = 0; i < options.getValueWithThen; i++) {
              testThen((r, e) => {
                const thenResult = thenable.then(r, e);

                if (!useReject && r || useReject && e) {
                  _Assert.assert.notStrictEqual(thenResult, thenable);
                }

                _Assert.assert.strictEqual(thenResult.constructor, _ThenableSync.ThenableSync);

                _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenable(thenResult), true);

                return thenResult;
              }, true);
            }
          }

          for (let i = 0; i < options.getValueWithResolve; i++) {
            testThen((r, e) => _ThenableSync.ThenableSync.resolve(thenable, r, e));
          }

          switch (options.type) {
            case ResolveType.Resolve:
              _Assert.assert.strictEqual(countFulfilled, 0);

              resolve(value);
              break;

            case ResolveType.Reject:
              _Assert.assert.strictEqual(countFulfilled, 0);

              reject(value);
              break;
          }

          switch (options.valueType) {
            case ResolveType.Resolve:
              _Assert.assert.strictEqual(countFulfilled, 0);

              value.resolve(options.value);
              break;

            case ResolveType.Reject:
              _Assert.assert.strictEqual(countFulfilled, 0);

              value.reject(options.value);
              break;
          }

          _Assert.assert.strictEqual(countFulfilled, countQueued);

          if (options.type !== ResolveType.Value) {
            if (options.type === ResolveType.Rejected || options.type === ResolveType.Throwed || options.type === ResolveType.Reject) {
              _Assert.assert.throws(() => resolve(value), Error);

              _Assert.assert.throws(() => reject(value), Error);
            } else {
              _Assert.assert.throws(() => reject(value), Error);

              _Assert.assert.throws(() => resolve(value), Error);
            }
          }

          _Assert.assert.strictEqual(countFulfilled, countQueued);
        };

        if (options.expected.error) {
          _Assert.assert.throws(action, options.expected.error);
        } else {
          action();
        }

        break;
      } catch (ex) {
        if (!debugIteration) {
          console.log(`Test number: ${TestThenableSync.totalTests}\r\nError in: ${inputOptions.description}\n`, inputOptions, // ${
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