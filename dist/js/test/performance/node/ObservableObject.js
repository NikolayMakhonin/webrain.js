"use strict";

var _rdtsc = require("rdtsc");

var _deepSubscribe = require("../../../main/common/rx/deep-subscribe/deep-subscribe");

var _ObservableObject = require("../../../main/common/rx/object/ObservableObject");

var _ObservableObjectBuilder = require("../../../main/common/rx/object/ObservableObjectBuilder");

/* tslint:disable:no-empty no-identical-functions */
describe('ObservableObject', function () {
  this.timeout(300000);

  function createObject(init) {
    class Class extends _ObservableObject.ObservableObject {}

    new _ObservableObjectBuilder.ObservableObjectBuilder(_ObservableObject.ObservableObject.prototype).writable('prop') // , o => o.prop, (o, v) => o.prop = v)
    .writable('prop2'); // , o => o.prop2, (o, v) => o.prop2 = v)

    const observableObject1 = new Class();
    const observableObject2 = new Class();

    if (init) {
      init(observableObject1);
      init(observableObject2);
    }

    const object1 = {
      prop: void 0,
      prop2: void 0
    };
    const object2 = {
      prop: void 0,
      prop2: void 0
    };
    let value = 1;
    object1.prop = value++;
    object1.prop2 = value++;
    object2.prop = value++;
    object2.prop2 = value++;
    observableObject1.prop = value++;
    observableObject1.prop2 = value++;
    observableObject2.prop = value++;
    observableObject2.prop2 = value++;
    return {
      object1,
      object2,
      observableObject1,
      observableObject2
    };
  }

  function testPerformance({
    object1,
    object2,
    observableObject1,
    observableObject2
  }) {
    const testFunc = Function('o1', 'o2', 'v', `{
			o1.prop = v
			o1.prop2 = v
			o2.prop = v
			o2.prop2 = v
			return o1.prop + o1.prop2 + o2.prop + o2.prop2
		} // ${Math.random()}`).bind(null, observableObject1, observableObject2);
    let value = -2000000000; // calcStat(1000, 10, time => {

    const result = (0, _rdtsc.calcPerformance)(20000, // () => {
    // 	// no operations
    // 	value++
    // },
    // () => { // 12
    // 	object1.prop = value++
    // 	object1.prop2 = value++
    // 	object2.prop = value++
    // 	object2.prop2 = value++
    // },
    // () => { // 4
    // 	return object1.prop && object1.prop2 && object2.prop && object2.prop2
    // },
    () => testFunc(value++ % 2 === 0 ? {
      value
    } : value) // () => { // 0
    // 	return observableObject1.prop && observableObject1.prop2 && observableObject1.prop && observableObject2.prop2
    // },
    );
    console.log(result); // return result.cycles
    // })
  }

  class CalcStatReport {
    constructor(data) {
      Object.assign(this, data);
    }

    clone() {
      return new CalcStatReport(this);
    }

    subtract(other) {
      const result = this.clone();

      for (let j = 0, len = this.averageValue.length; j < len; j++) {
        result.averageValue[j] -= other.averageValue[j];
        result.standardDeviation[j] += other.standardDeviation[j];
      }

      return result;
    }

    toString() {
      const report = Array(this.averageValue.length);

      for (let j = 0, len = this.averageValue.length; j < len; j++) {
        report[j] = `${this.averageValue[j]} ±${2.5 * this.standardDeviation[j]} [${this.count}]`;
      }

      return report.join(', ');
    }

  }

  let CalcType;

  (function (CalcType) {
    CalcType[CalcType["Stat"] = 0] = "Stat";
    CalcType[CalcType["Min"] = 1] = "Min";
  })(CalcType || (CalcType = {}));

  function calcMin(countTests, testFunc, ...args) {
    let min;
    let count = 0;

    for (let i = 0; i < countTests; i++) {
      const result = testFunc(...args);

      if (result == null) {
        i--;
        continue;
      }

      count++;

      if (min && i > 3) {
        for (let j = 0, len = result.length; j < len; j++) {
          const cycles = Number(result[j]);

          if (cycles < min[j]) {
            min[j] = cycles;
          }
        }
      } else {
        min = result.map(o => Number(o));
        count = 1;
      }
    }

    return new CalcStatReport({
      averageValue: min,
      standardDeviation: min.map(() => 0),
      count
    });
  }

  function calcStat(countTests, testFunc, ...args) {
    let sum;
    let sumSqr;
    let count = 0;

    for (let i = 0; i < countTests; i++) {
      const result = testFunc(...args);

      if (result == null) {
        i--;
        continue;
      }

      count++;

      if (sum && i > 3) {
        for (let j = 0, len = result.length; j < len; j++) {
          const cycles = Number(result[j]);
          sum[j] += cycles;
          sumSqr[j] += cycles * cycles;
        }
      } else {
        sum = result.map(o => Number(o));
        sumSqr = sum.map(o => o * o);
        count = 1;
      }
    }

    const averageValue = Array(sum.length);
    const standardDeviation = Array(sum.length);

    for (let j = 0, len = sum.length; j < len; j++) {
      standardDeviation[j] = Math.sqrt(sumSqr[j] / count - sum[j] * sum[j] / (count * count));
      averageValue[j] = sum[j] / count;
    }

    return new CalcStatReport({
      averageValue,
      standardDeviation,
      count
    });
  }

  function calc(calcType, countTests, testFunc, ...args) {
    switch (calcType) {
      case CalcType.Stat:
        return calcStat(countTests, testFunc, ...args);

      case CalcType.Min:
        return calcMin(countTests, testFunc, ...args);

      default:
        throw new Error('Unknown CalcType: ' + calcType);
    }
  }

  function _calcMemAllocate(calcType, countTests, testFunc, ...testFuncArgs) {
    return calc(calcType, countTests, (...args) => {
      let heapUsed = process.memoryUsage().heapUsed;
      testFunc(...args);
      heapUsed = process.memoryUsage().heapUsed - heapUsed;
      return heapUsed < 0 ? null : [heapUsed];
    }, ...testFuncArgs);
  }

  function calcMemAllocate(calcType, countTests, testFunc, ...testFuncArgs) {
    const zero = _calcMemAllocate(calcType, countTests, (...args) => {}, ...testFuncArgs);

    const value = _calcMemAllocate(calcType, countTests, testFunc, ...testFuncArgs);

    console.log(value.subtract(zero).toString());
  }

  it('simple', function () {
    testPerformance(createObject());
  });
  it('propertyChanged', function () {
    testPerformance(createObject(observableObject => {
      observableObject.propertyChanged.subscribe(v => {});
    }));
  });
  it('deepSubscribe', function () {
    let i = 0;
    testPerformance(createObject(observableObject => {
      (0, _deepSubscribe.deepSubscribe)(observableObject, v => typeof v === 'object' && i++ % 3 === 0 ? () => {} : null, true, b => b.path(o => o.prop));
    }));
  });
  it('propertyChanged memory', function () {
    const object = createObject(observableObject => {
      observableObject.propertyChanged.subscribe(v => {});
    }).observableObject1;
    object.prop = 1;
    calcMemAllocate(CalcType.Min, 10000, () => {
      // 48 bytes for create event
      object.prop++;
    });
  });
  it('deepSubscribe memory', function () {
    const object = createObject(observableObject => {
      (0, _deepSubscribe.deepSubscribe)(observableObject, // v => v != null && typeof v === 'object'
      // 	? () => {}
      // 	: null,
      v => null, true, b => b.path(o => o.prop));
    }).observableObject1;
    const value1 = {};
    const value2 = {};
    object.prop = 1;
    calcMemAllocate(CalcType.Min, 10000, () => {
      // 48 bytes for create event
      // 56 bytes for create unsubscribe function
      object.prop = object.prop === value1 ? value2 : value1;
    });
  });
  it('test memory', function () {
    calcMemAllocate(CalcType.Min, 10000, () => {
      let value;

      function calcValue() {
        value = 3;
      }

      calcValue();
      return value;
    });
  });
});