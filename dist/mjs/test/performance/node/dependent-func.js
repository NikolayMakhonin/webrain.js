// @ts-ignore
import { calcPerformance } from 'rdtsc';
import { getObjectUniqueId } from '../../../main/common/helpers/object-unique-id';
import { assert } from '../../../main/common/test/Assert';
import { CalcType } from '../../../main/common/test/calc';
import { calcMemAllocate } from '../../../main/common/test/calc-mem-allocate';
import { describe, it, xit } from '../../../main/common/test/Mocha';
import { createPerceptron, createPerceptronNaked } from '../../tests/common/main/rx/depend/src/perceptron';
describe('dependent-func perf', function () {
  it('perceptron recalc', function () {
    this.timeout(300000);
    const {
      countFuncs,
      input,
      inputState,
      output,
      outputState
    } = createPerceptron(2, 2);
    const naked = createPerceptronNaked(2, 2);
    const map1 = new Map();
    const map2 = new Map();
    map2.set(2, 3);
    map1.set(1, map2);
    const result = calcPerformance(10000, () => {
      naked.call(2, 5, 10);
    }, () => {
      inputState.invalidate();
    }, () => {
      output.call(2, 5, 10);
    }, () => {
      return map1.get(1).get(2);
    });
    console.log(result);
    const cyclesPerSecond = result.calcInfo.iterationCycles * result.calcInfo.iterations / result.calcInfo.testTime * 1000;
    console.log('cyclesPerSecond: ' + cyclesPerSecond);
    console.log('countFuncs: ' + countFuncs);
    console.log(`absoluteDiff per func: [${result.absoluteDiff.map(o => o / countFuncs).join(', ')}]`);
    console.log(`funcs per second: [${result.absoluteDiff.map(o => countFuncs * cyclesPerSecond / o).join(', ')}]`);
    console.log(`funcs per frame: [${result.absoluteDiff.map(o => countFuncs * cyclesPerSecond / o / 60).join(', ')}]`);
    console.log(`chrome funcs per second: [${result.absoluteDiff.map(o => countFuncs * cyclesPerSecond / o / 210).join(', ')}]`);
    console.log(`chrome funcs per frame: [${result.absoluteDiff.map(o => countFuncs * cyclesPerSecond / o / 60 / 210).join(', ')}]`);
    console.log(`smallint overflow after: ${(1 << 30) / outputState._callId * result.calcInfo.testTime / 1000 * 210 / 3600} hours`);
    const chromeFuncsPerFrame = countFuncs * cyclesPerSecond / result.absoluteDiff[1] / 60 / 210;
    assert.ok(chromeFuncsPerFrame >= 150, chromeFuncsPerFrame + '');
  });
  xit('set memory', function () {
    this.timeout(300000);
    const set = new Set();
    const setArray = {};
    const objects = [];

    for (let i = 0; i < 10; i++) {
      objects[i] = {};
      getObjectUniqueId(objects[i]);
    }

    console.log(calcMemAllocate(CalcType.Min, 50000, () => {
      for (let i = 0; i < 10; i++) {
        set.add(i * i * 10000000);
      }

      for (let i = 0; i < 10; i++) {
        set.delete(i * i * 10000000);
      }
    }).toString());
  });
  it('perceptron memory create', function () {
    this.timeout(300000);
    let countFuncs;
    const result = calcMemAllocate(CalcType.Min, 50000, () => {
      countFuncs = createPerceptron(10, 5, false).countFuncs;
    }).scale(1 / countFuncs);
    console.log(result.toString());
    result.averageValue.forEach(o => assert.ok(o <= 750));
  });
  it('perceptron create', function () {
    this.timeout(300000);
    const {
      countFuncs,
      input,
      inputState,
      output
    } = createPerceptron(2, 2);
    const naked = createPerceptronNaked(2, 2);
    const map1 = new Map();
    const map2 = new Map();
    map2.set(2, 3);
    map1.set(1, map2);
    let perceptron;
    const result = calcPerformance(10000, () => {
      perceptron = createPerceptronNaked(2, 2);
    }, () => {
      perceptron = createPerceptron(2, 2, false);
    }, () => {
      perceptron.output.call(2, 5, 10);
    }, () => {
      perceptron.inputState.invalidate();
      perceptron.output.call(2, 5, 10);
    });
    console.log(result);
    assert.ok(result.absoluteDiff[0] < 15000, result.absoluteDiff[1] + '');
  });
  it('perceptron memory recalc', function () {
    this.timeout(300000);
    const {
      countFuncs,
      input,
      inputState,
      output
    } = createPerceptron(10, 5); // const subscriberLinkPoolSize = subscriberLinkPool.size
    // const subscriberLinkPoolAllocatedSize = subscriberLinkPool.allocatedSize
    // const subscriberLinkPoolUsedSize = subscriberLinkPool.usedSize
    // console.log('subscriberLinkPool.size = ' + subscriberLinkPoolSize)
    // console.log('subscriberLinkPool.allocatedSize = ' + subscriberLinkPoolAllocatedSize)
    // console.log('subscriberLinkPool.usedSize = ' + subscriberLinkPoolUsedSize)
    // assert.strictEqual(subscriberLinkPool.size + subscriberLinkPool.usedSize, subscriberLinkPool.allocatedSize)

    const result = calcMemAllocate(CalcType.Min, 2000, () => {
      inputState.invalidate();
      output.call(2, 5, 10);
    }).scale(1 / countFuncs);
    console.log(result.toString());
    result.averageValue.forEach(o => assert.ok(o <= 0)); // assert.strictEqual(subscriberLinkPool.size + subscriberLinkPool.usedSize, subscriberLinkPool.allocatedSize)
    // assert.strictEqual(subscriberLinkPool.size, subscriberLinkPoolSize)
    // assert.strictEqual(subscriberLinkPool.allocatedSize, subscriberLinkPoolAllocatedSize)
    // assert.strictEqual(subscriberLinkPool.usedSize, subscriberLinkPoolUsedSize)
  });
});