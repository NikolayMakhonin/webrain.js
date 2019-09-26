export class CalcStatReport {
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
export let CalcType;

(function (CalcType) {
  CalcType[CalcType["Stat"] = 0] = "Stat";
  CalcType[CalcType["Min"] = 1] = "Min";
})(CalcType || (CalcType = {}));

export function calcMin(countTests, testFunc, ...args) {
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
export function calcStat(countTests, testFunc, ...args) {
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
export function calc(calcType, countTests, testFunc, ...args) {
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

export function calcMemAllocate(calcType, countTests, testFunc, ...testFuncArgs) {
  // tslint:disable-next-line:no-empty
  const zero = _calcMemAllocate(calcType, countTests, (...args) => {}, ...testFuncArgs);

  const value = _calcMemAllocate(calcType, countTests, testFunc, ...testFuncArgs);

  console.log(value.subtract(zero).toString());
}