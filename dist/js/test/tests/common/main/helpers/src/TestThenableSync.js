"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestThenableSync = exports.ITERATOR = exports.ITERABLE = exports.FUNC = exports.THEN_LIKE = exports.OBJ = void 0;

var _ThenableSync = require("../../../../../../main/common/helpers/ThenableSync");

var _Assert = require("../../../../../../main/common/test/Assert");

var _TestVariants = require("../../src/helpers/TestVariants");

/* tslint:disable:no-empty no-identical-functions no-construct use-primitive-type */
function resolveValue(opts, value) {
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
      resolvedOptions[key] = key === 'action' ? resolvedOptions[key] : resolveValue(optionsParams || resolvedOptions, resolvedOptions[key]);
    }
  }

  resolvedOptions.expected = {};

  for (const key in optionsSource.expected) {
    if (Object.prototype.hasOwnProperty.call(optionsSource.expected, key)) {
      resolvedOptions.expected[key] = resolveValue(optionsParams || resolvedOptions, optionsSource.expected[key]);
    }
  }

  return resolvedOptions;
}

function createWithExecutor() {
  let resultResolve = null;
  const thenable = new _ThenableSync.ThenableSync(resolve => {
    resultResolve = resolve;
  });

  _Assert.assert.ok(resultResolve);

  return [thenable, resultResolve];
}

const OBJ = {};
exports.OBJ = OBJ;
const THEN_LIKE = {
  then: () => {}
};
exports.THEN_LIKE = THEN_LIKE;

const FUNC = () => {};

exports.FUNC = FUNC;
const ITERABLE = new Set();
exports.ITERABLE = ITERABLE;

const ITERATOR = function* () {
  yield OBJ;
  return ITERABLE;
};

exports.ITERATOR = ITERATOR;

function createWithIterator(value, onfulfilled) {
  const iterator = function* () {
    _Assert.assert.strictEqual((yield void 0), void 0);

    _Assert.assert.strictEqual((yield null), null);

    _Assert.assert.strictEqual((yield false), false);

    _Assert.assert.strictEqual((yield 0), 0);

    _Assert.assert.strictEqual((yield ''), '');

    _Assert.assert.strictEqual((yield OBJ), OBJ);

    _Assert.assert.strictEqual((yield FUNC), FUNC);

    _Assert.assert.strictEqual((yield THEN_LIKE), THEN_LIKE);

    _Assert.assert.strictEqual((yield ITERABLE), ITERABLE);

    _Assert.assert.strictEqual((yield ITERATOR()), ITERABLE);

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(void 0))), void 0);

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(null))), null);

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(false))), false);

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(0))), 0);

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(''))), '');

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(OBJ))), OBJ);

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(FUNC))), FUNC);

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(THEN_LIKE))), THEN_LIKE);

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(ITERABLE))), ITERABLE);

    _Assert.assert.strictEqual((yield new _ThenableSync.ThenableSync(resolve => resolve(ITERATOR()))), ITERABLE);

    return value;
  }();

  return _ThenableSync.ThenableSync.resolve(iterator, onfulfilled);
}

class TestThenableSync extends _TestVariants.TestVariants {
  constructor() {
    super();
    this.baseOptionsVariants = {
      value: [void 0, null, false, 0, '', OBJ, FUNC, THEN_LIKE, ITERABLE, ITERATOR],
      valueAsThenableSync: [false, true],
      valueIsResolved: [false, true],
      createWithExecutor: [false, true],
      createWithIterator: [0, 1, 3],
      resolveImmediate: [true, false],
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

          if (value === ITERATOR) {
            value = ITERATOR();
          }

          const resolveImmediate = options.resolveImmediate && (!options.valueAsThenableSync || options.valueIsResolved);

          _Assert.assert.notStrictEqual(value && value.constructor, _ThenableSync.ThenableSync);

          _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenableSync(value), false);

          let thenable;
          let resolve;

          if (options.createWithExecutor) {
            const result = createWithExecutor();
            thenable = result[0];
            resolve = result[1];
          } else {
            thenable = new _ThenableSync.ThenableSync();
            resolve = thenable.resolve.bind(thenable);
          }

          _Assert.assert.strictEqual(thenable && thenable.constructor, _ThenableSync.ThenableSync);

          _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenableSync(thenable), true);

          if (options.valueAsThenableSync) {
            value = new _ThenableSync.ThenableSync();

            _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenableSync(value), true);

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


          let countQueued = 0;
          let countFulfilled = 0;
          const fulfillResult = new String('Fulfill Result');

          const checkResult = (result, isThenResult = false) => {
            if (!isThenResult && resolveImmediate) {
              _Assert.assert.strictEqual(result, fulfillResult);
            } else {
              _Assert.assert.strictEqual(result && result.constructor, _ThenableSync.ThenableSync);

              countQueued++;
              let fulfilled;
              const thenResult = result.thenLast(o => {
                _Assert.assert.notOk(fulfilled);

                fulfilled = true;

                _Assert.assert.strictEqual(o, fulfillResult);

                countFulfilled++;
                return fulfillResult;
              });

              if (resolveImmediate) {
                _Assert.assert.strictEqual(thenResult, fulfillResult);
              } else {
                _Assert.assert.notStrictEqual(thenResult, result);

                _Assert.assert.strictEqual(thenResult.constructor, _ThenableSync.ThenableSync);

                _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenableSync(thenResult), true);
              }
            }
          };

          for (let i = 0; i < options.createWithIterator; i++) {
            if (options.getValueWithResolve) {
              countQueued++;
              let fulfilled;
              checkResult(createWithIterator(thenable, o => {
                _Assert.assert.notOk(fulfilled);

                fulfilled = true;

                _Assert.assert.strictEqual(o, options.expected.value);

                countFulfilled++;
                return fulfillResult;
              }));
            }

            thenable = createWithIterator(thenable);
          }

          if (resolveImmediate && options.createWithIterator) {
            _Assert.assert.strictEqual(thenable, options.expected.value);
          } else {
            _Assert.assert.strictEqual(thenable && thenable.constructor, _ThenableSync.ThenableSync);

            _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenableSync(thenable), true);

            for (let i = 0; i < options.getValueWithThen; i++) {
              countQueued++;
              let fulfilled;
              const thenResult = thenable.then(o => {
                _Assert.assert.notOk(fulfilled);

                fulfilled = true;

                _Assert.assert.strictEqual(o, options.expected.value);

                countFulfilled++;
                return fulfillResult;
              });

              _Assert.assert.notStrictEqual(thenResult, thenable);

              _Assert.assert.strictEqual(thenResult.constructor, _ThenableSync.ThenableSync);

              _Assert.assert.strictEqual(_ThenableSync.ThenableSync.isThenableSync(thenResult), true);

              checkResult(thenResult, true);
            }
          }

          for (let i = 0; i < options.getValueWithResolve; i++) {
            countQueued++;
            let fulfilled;
            checkResult(_ThenableSync.ThenableSync.resolve(thenable, o => {
              _Assert.assert.notOk(fulfilled);

              fulfilled = true;

              _Assert.assert.strictEqual(o, options.expected.value);

              countFulfilled++;
              return fulfillResult;
            }));
          }

          if (!options.resolveImmediate) {
            _Assert.assert.strictEqual(countFulfilled, 0);

            resolve(value);
          }

          if (options.valueAsThenableSync && !options.valueIsResolved) {
            _Assert.assert.strictEqual(countFulfilled, 0);

            value.resolve(options.value);
          }

          _Assert.assert.strictEqual(countFulfilled, countQueued);

          _Assert.assert.throws(() => resolve(value), Error);

          _Assert.assert.throws(() => resolve(value), Error);

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
          `\n${inputOptions.action.toString()}\n${ex.stack}`);
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