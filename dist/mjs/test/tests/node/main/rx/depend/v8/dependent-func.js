/* tslint:disable:no-identical-functions no-shadowed-variable no-var-requires ordered-imports */
// @ts-ignore
import { _createDependentFunc, _getFuncCallState, createFuncCallState, getFuncCallState, getSubscriberLink, invalidate, makeDependentFunc, releaseSubscriberLink, subscribeDependency, unsubscribeDependencies, FuncCallState, semiWeakMapGet, semiWeakMapSet, getSubscriberLinkFromPool, subscriberLinkPool, _subscribe, createDependentFunc, emit, isRefType, subscriberLinkDelete, update } from '../../../../../../../main/common/rx/depend/all';
import { describe, it } from '../../../../../../../main/common/test/Mocha';
import { baseTest, createPerceptron } from '../../../../../common/main/rx/depend/src/helpers';
import { v8 } from '../../../../v8/src/helpers/common/helpers';
import { OptimizationStatus } from '../../../../v8/src/helpers/contracts';
import { assertIsOptimized, checkIsOptimized } from '../../../../v8/src/helpers/helpers';
describe('node > main > rx > depend > dependent-func', function () {
  async function v8Test(countIterations, iterate) {
    const objects = {
      // public
      getFuncCallState,
      invalidate,
      makeDependentFunc,
      createPerceptron,
      // internal
      _createDependentFunc,
      _getFuncCallState,
      createFuncCallState,
      getSubscriberLink,
      releaseSubscriberLink,
      subscribeDependency,
      unsubscribeDependencies,
      // internal deep
      FuncCallState,
      semiWeakMapGet,
      semiWeakMapSet,
      getSubscriberLinkFromPool,
      subscriberLinkPool,
      _subscribe,
      createDependentFunc,
      emit,
      isRefType,
      subscriberLinkDelete,
      update // makeDependentIterator,
      // internal single call
      // createGetFuncCallState,
      // createMakeDependentFunc,
      // createSemiWeakMap,
      // SubscriberLinkPool,

    };
    const optimizedObjectsIterations = {};
    const optimized = new Set();

    function _assertIsOptimized(obj) {
      return assertIsOptimized(obj, optimized);
    }

    function checkOptimization(iteration) {
      for (const key in objects) {
        if (Object.prototype.hasOwnProperty.call(objects, key) && !Object.prototype.hasOwnProperty.call(optimizedObjectsIterations, key) && optimized.has(objects[key])) {
          optimizedObjectsIterations[key] = iteration;
        }
      }

      if (!checkIsOptimized(objects, optimized)) {
        console.error('Iteration: ' + iteration);
        assertIsOptimized(objects, optimized);
      }
    }

    for (let i = 0; i < countIterations; i++) {
      if (i === 10) {
        // isRefType(1)
        // isRefType(2)
        for (const key in objects) {
          if (Object.prototype.hasOwnProperty.call(objects, key) && !optimized.has(objects[key])) {
            v8.OptimizeFunctionOnNextCall(objects[key]);
          }
        } // isRefType(3)

      }

      await iterate(i, checkOptimization, _assertIsOptimized);
    }

    console.log(optimizedObjectsIterations);
    const inlined = [];
    const notInlined = [];

    for (const key in objects) {
      if (Object.prototype.hasOwnProperty.call(objects, key)) {
        if ((v8.GetOptimizationStatus(objects[key]) & OptimizationStatus.MarkedForOptimization) === 0) {
          notInlined.push(key);
        } else {
          inlined.push(key);
        }
      }
    }

    console.log('Inlined: ', inlined);
    console.log('Not inlined: ', notInlined); // assert.deepStrictEqual(optimizedObjects, objects)

    assertIsOptimized(objects, optimized);
  }

  it('v8 perceptron', async function () {
    this.timeout(20000);
    await v8Test(1000, async (iteration, checkOptimization, _assertIsOptimized) => {
      const {
        input,
        output,
        getStates
      } = createPerceptron(2, 2);
      getStates().forEach(o => {
        _assertIsOptimized({
          state: o
        });
      });
      checkOptimization(iteration);

      for (let j = 0; j < 10; j++) {
        const state = getFuncCallState(input)();
        await invalidate(state);
      }

      getStates().forEach(o => {
        _assertIsOptimized({
          state: o
        });
      });
      checkOptimization(iteration);
    });
  });
  it('v8 baseTest', async function () {
    this.timeout(20000);
    await v8Test(100, async (iteration, checkOptimization, _assertIsOptimized) => {
      const {
        states
      } = await baseTest();
      states.forEach(o => {
        _assertIsOptimized({
          state: o
        });
      });
      checkOptimization(iteration);
    });
  });
});