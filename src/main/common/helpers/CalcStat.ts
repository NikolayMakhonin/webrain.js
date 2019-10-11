export class CalcStat {
	public count: number = 0
	public sum: number = 0
	public sumSqr: number = 0

	public add(value: number) {
		this.count++
		this.sum += value
		this.sumSqr += value * value
	}

	public get average() {
		return this.sum / this.count
	}

	public get dispersion() {
		const {count, sum} = this
		return this.sumSqr / count
			- sum * sum / (count * count)
	}

	public get standardDeviation() {
		return Math.sqrt(this.dispersion)
	}

	// value is in the: average ± range
	public get range() {
		return 2.5 * this.standardDeviation
	}

	public toString() {
		return this.count
			? `${round(this.sum)} | ${round(this.average)} ±${round(this.range)}`
			: '-'
	}
}

function round(value) {
	return +(value).toPrecision(3)
}
