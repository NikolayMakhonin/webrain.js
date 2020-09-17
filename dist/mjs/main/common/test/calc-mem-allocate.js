// @ts-ignore
import { runInRealtimePriority } from 'rdtsc';
import { calc } from './calc';

function _calcMemAllocate(calcType, countTests, testFunc, ...testFuncArgs) {
  return calc(calcType, countTests, (...args) => {
    let heapUsed = process.memoryUsage().heapUsed;
    testFunc(...args);
    heapUsed = process.memoryUsage().heapUsed - heapUsed;
    return heapUsed < 0 ? null : [heapUsed];
  }, ...testFuncArgs);
}

export function calcMemAllocate(calcType, countTests, testFunc, ...testFuncArgs) {
  return runInRealtimePriority(() => {
    // tslint:disable-next-line:no-empty
    const zero = _calcMemAllocate(calcType, countTests, (...args) => {}, ...testFuncArgs);

    const value = _calcMemAllocate(calcType, countTests, testFunc, ...testFuncArgs);

    return value.subtract(zero);
  });
}