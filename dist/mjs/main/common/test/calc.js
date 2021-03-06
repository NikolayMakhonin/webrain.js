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

  scale(coef) {
    const result = this.clone();

    for (let j = 0, len = this.averageValue.length; j < len; j++) {
      result.averageValue[j] *= coef;
      result.standardDeviation[j] *= coef;
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

export function calcMin(countTests, // eslint-disable-next-line @typescript-eslint/no-shadow
testFunc, ...args) {
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
export function calcStat(countTests, // eslint-disable-next-line @typescript-eslint/no-shadow
testFunc, ...args) {
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
export function calc(calcType, countTests, // eslint-disable-next-line @typescript-eslint/no-shadow
testFunc, ...args) {
  switch (calcType) {
    case CalcType.Stat:
      return calcStat(countTests, testFunc, ...args);

    case CalcType.Min:
      return calcMin(countTests, testFunc, ...args);

    default:
      throw new Error('Unknown CalcType: ' + calcType);
  }
}