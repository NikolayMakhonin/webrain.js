/* tslint:disable:no-identical-functions no-shadowed-variable no-var-requires ordered-imports */
import * as ObjectPool from '../../../../../../../main/common/lists/ObjectPool';
import * as PairingHeap from '../../../../../../../main/common/lists/PairingHeap';
import * as CallState from '../../../../../../../main/common/rx/depend/core/CallState';
import { getOrCreateCallState } from '../../../../../../../main/common/rx/depend/core/CallState';
import * as depend from '../../../../../../../main/common/rx/depend/core/depend';
import * as facade from '../../../../../../../main/common/rx/depend/core/facade';
import * as helpers from '../../../../../../../main/common/rx/depend/core/helpers';
import { describe, it } from '../../../../../../../main/common/test/Mocha';
import { baseTest } from '../../../../../common/main/rx/depend/src/base-tests';
import { v8 } from '../../../../v8/src/helpers/common/helpers';
import { OptimizationStatus } from '../../../../v8/src/helpers/contracts';
import { assertIsOptimized, checkIsOptimized } from '../../../../v8/src/helpers/helpers';
import { clearCallStates } from '../../../../../common/main/rx/depend/src/helpers';
import { createPerceptron } from '../../../../../common/main/rx/depend/src/perceptron';
describe('node > main > rx > depend > v8', function () {
  async function v8Test(countIterations, iterate) {
    const objects = {
      ObjectPool,
      PairingHeap,
      CallState: { ...CallState,
        reduceCallStates: null
      },
      depend,
      facade,
      helpers
    };
    v8.DeoptimizeNow();
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
    clearCallStates();
  }

  it('v8 perceptron', async function () {
    this.timeout(120000);
    await v8Test(10, async (iteration, checkOptimization, _assertIsOptimized) => {
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
        const state = getOrCreateCallState(input)();
        await state.invalidate();
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
    this.timeout(120000);
    await v8Test(10, async (iteration, checkOptimization, _assertIsOptimized) => {
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