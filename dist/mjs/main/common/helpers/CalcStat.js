export class CalcStat {
  constructor() {
    this.count = 0;
    this.sum = 0;
    this.sumSqr = 0;
  }

  add(value) {
    this.count++;
    this.sum += value;
    this.sumSqr += value * value;
  }

  get average() {
    return this.sum / this.count;
  }

  get dispersion() {
    const {
      count,
      sum
    } = this;
    return this.sumSqr / count - sum * sum / (count * count);
  }

  get standardDeviation() {
    return Math.sqrt(this.dispersion);
  } // value is in the: average ± range


  get range() {
    return 2.5 * this.standardDeviation;
  }

  toString() {
    return this.count ? `${round(this.sum)} | ${round(this.average)} ±${round(this.range)}` : '-';
  }

}

function round(value) {
  return +value.toPrecision(3);
}