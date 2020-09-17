// @ts-ignore
import { calcPerformance } from 'rdtsc';
import { ObjectPool } from '../../../main/common/lists/ObjectPool';
import { PairingHeap } from '../../../main/common/lists/PairingHeap';
import { assert } from '../../../main/common/test/Assert';
import { CalcType } from '../../../main/common/test/calc';
import { calcMemAllocate } from '../../../main/common/test/calc-mem-allocate';
import { describe, it } from '../../../main/common/test/Mocha';
describe('PairingHeap perf', function () {
  const objectPool = new ObjectPool(1000000);
  it('add / delete', function () {
    this.timeout(300000);
    const pairingHeap = new PairingHeap({
      objectPool,

      lessThanFunc(o1, o2) {
        return o1.id < o2.id;
      }

    });
    const addItems = [6, 1, 5, 3, 0, 4, 2].map(id => ({
      id
    }));
    const len = addItems.length;
    let res;
    const result = calcPerformance(10000, () => {
      // empty
      for (let i = 0; i < len; i++) {
        const item = addItems[i];
      }
    }, () => {
      // 333
      for (let i = 0; i < len; i++) {
        const item = addItems[i];
        pairingHeap.add(item);
      }
    }, () => {
      // 7
      for (let i = 0; i < len; i++) {
        const item = addItems[i];
        res = pairingHeap.getMin();
      }
    }, () => {
      // 555
      for (let i = 0; i < len; i++) {
        const item = addItems[i];
        pairingHeap.deleteMin();
      }
    });
    console.log(result);
    /*
    // without compareFunc
    absoluteDiff: [ 302, -1, 521 ],
    absoluteDiff: [ 333, -1, 548 ],
    absoluteDiff: [ 334, 4, 540 ],
    absoluteDiff: [ 322, 1, 541 ],
    absoluteDiff: [ 322, 4, 548 ],
     absoluteDiff: [ 314, 3, 544 ],
    absoluteDiff: [ 318, 0, 567 ],
    absoluteDiff: [ 333, 0, 544 ],
    absoluteDiff: [ 327, -3, 572 ],
    absoluteDiff: [ 322, -4, 560 ],
    absoluteDiff: [ 311, -38, 525 ],
     // with compareFunc
    absoluteDiff: [ 329, 0, 552 ],
    absoluteDiff: [ 322, 0, 544 ],
    absoluteDiff: [ 319, -7, 548 ],
     absoluteDiff: [ 330, 0, 560 ],
    absoluteDiff: [ 326, 0, 567 ],
    absoluteDiff: [ 323, -3, 561 ],
     // with custom comparer
    absoluteDiff: [ 357, 0, 579 ],
    absoluteDiff: [ 357, 0, 563 ],
    absoluteDiff: [ 360, 7, 552 ],
    absoluteDiff: [ 360, -4, 548 ],
    absoluteDiff: [ 349, 4, 590 ],
    absoluteDiff: [ 349, 0, 552 ],
    absoluteDiff: [ 337, -35, 540 ],
    absoluteDiff: [ 384, 46, 575 ],
    absoluteDiff: [ 395, 51, 576 ],
     // without key
    absoluteDiff: [ 357, 19, 556 ],
    absoluteDiff: [ 418, 57, 590 ],
    absoluteDiff: [ 384, 51, 602 ],
    absoluteDiff: [ 380, 51, 595 ],
    absoluteDiff: [ 372, 50, 576 ],
     absoluteDiff: [ 383, 49, 601 ],
    absoluteDiff: [ 372, 31, 594 ],
    absoluteDiff: [ 410, 65, 587 ],
    absoluteDiff: [ 369, 66, 599 ],
     absoluteDiff: [ 311, 80, 564 ],
    absoluteDiff: [ 318, 46, 556 ],
     absoluteDiff: [ 368, 53, 583 ],
    absoluteDiff: [ 375, 73, 601 ],
     absoluteDiff: [ 372, 53, 587 ],
    absoluteDiff: [ 376, 54, 609 ],
    absoluteDiff: [ 353, 50, 583 ],
     absoluteDiff: [ 376, 77, 587 ],
    absoluteDiff: [ 364, 50, 583 ],
    absoluteDiff: [ 372, 57, 594 ],
     absoluteDiff: [ 318, 50, 567 ],
    absoluteDiff: [ 337, 72, 575 ],
    absoluteDiff: [ 318, 61, 563 ],
    absoluteDiff: [ 311, 50, 552 ],
    absoluteDiff: [ 315, 35, 548 ],
     absoluteDiff: [ 375, 61, 625 ],
    absoluteDiff: [ 345, 42, 556 ],
     absoluteDiff: [ 365, 50, 587 ],
    absoluteDiff: [ 368, 30, 598 ],
    absoluteDiff: [ 395, 57, 590 ],
    absoluteDiff: [ 368, 54, 586 ],
     absoluteDiff: [ 383, 54, 625 ],
    absoluteDiff: [ 365, 47, 606 ],
    absoluteDiff: [ 372, 61, 583 ],
    absoluteDiff: [ 387, 76, 613 ],
     absoluteDiff: [ 364, 65, 575 ],
    absoluteDiff: [ 379, 54, 590 ],
    absoluteDiff: [ 395, 50, 632 ],
    absoluteDiff: [ 372, 61, 594 ],
     absoluteDiff: [ 364, 57, 908 ],
    absoluteDiff: [ 341, 65, 874 ],
    absoluteDiff: [ 368, 57, 878 ],
    absoluteDiff: [ 375, 50, 877 ],
     absoluteDiff: [ 387, 57, 885 ],
    absoluteDiff: [ 376, 42, 951 ],
    absoluteDiff: [ 383, 54, 901 ],
    absoluteDiff: [ 414, 57, 897 ],
     absoluteDiff: [ 368, 38, 874 ],
    absoluteDiff: [ 403, 57, 912 ],
    absoluteDiff: [ 368, 96, 920 ],
    absoluteDiff: [ 383, 61, 904 ],
     */
  });
  it('add / delete memory', function () {
    this.timeout(300000);
    const binaryTree = new PairingHeap({
      objectPool
    });
    const addItems = [6, 1, 5, 3, 0, 4, 2];
    const len = addItems.length;
    const result = calcMemAllocate(CalcType.Min, 2000, () => {
      for (let i = 0; i < len; i++) {
        const item = addItems[i];
        binaryTree.add(item);
      }

      for (let i = 0; i < len; i++) {
        binaryTree.getMin();
        binaryTree.deleteMin();
      }
    });
    console.log(result.toString());
    result.averageValue.forEach(o => assert.ok(o <= 0));
  });
});