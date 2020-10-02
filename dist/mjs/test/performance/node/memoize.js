/* tslint:disable:no-empty no-identical-functions max-line-length no-construct use-primitive-type */
// @ts-ignore
import memoize from 'fast-memoize'; // @ts-ignore

import { calcPerformance } from 'rdtsc';
import { depend } from '../../../main/common/rx/depend/core/depend';
import { describe, it } from '../../../main/common/test/Mocha';
import { calcMemAllocate } from '../../../main/common/test/calc-mem-allocate';
import { CalcType } from '../../../main/common/test/calc';
describe('memoize', function () {
  this.timeout(300000);

  const fn = function (one, two, three) {
    for (let i = 0; i < 1000; i++) {
      Date.now();
    }

    return true;
  };

  const fastMemoize = memoize(fn);
  const dependMemoize = depend(fn);
  it('primitives', function () {
    const result = calcPerformance(10000, () => {// no operations
    }, () => {
      fastMemoize('foo', 3, 'bar');
    }, () => {
      dependMemoize('foo', 3, 'bar');
    });
    console.log(result);
  });
  it('objects', function () {
    const obj = {
      property1: {
        property2: {
          property2: {
            value: [1, 2, 3]
          }
        }
      },
      property2: {
        value: [1, 2, 3]
      }
    };
    const result = calcPerformance(10000, () => {// no operations
    }, () => {
      fastMemoize(obj);
    }, () => {
      dependMemoize(obj);
    });
    console.log(result);
  });
  it('stress', function () {
    const result = calcPerformance(10000, () => {// no operations
    }, () => {
      fastMemoize(Math.random());
    }, () => {
      dependMemoize(Math.random());
    });
    console.log(result);
  });
  it('memory', function () {
    console.log(calcMemAllocate(CalcType.Min, 100000, () => {
      fastMemoize(Math.random());
    }).toString());
    console.log(calcMemAllocate(CalcType.Min, 100000, () => {
      dependMemoize(Math.random());
    }).toString());
  });
});