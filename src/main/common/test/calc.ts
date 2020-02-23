export class CalcStatReport {
	public averageValue: number[]
	public standardDeviation: number[]
	public count: number

	constructor(data: {
		averageValue: number[],
		standardDeviation: number[],
		count: number,
	}) {
		Object.assign(this, data)
	}

	public clone(): CalcStatReport {
		return new CalcStatReport(this)
	}

	public subtract(other: CalcStatReport): CalcStatReport {
		const result = this.clone()
		for (let j = 0, len = this.averageValue.length; j < len; j++) {
			result.averageValue[j] -= other.averageValue[j]
			result.standardDeviation[j] += other.standardDeviation[j]
		}
		return result
	}

	public scale(coef: number): CalcStatReport {
		const result = this.clone()
		for (let j = 0, len = this.averageValue.length; j < len; j++) {
			result.averageValue[j] *= coef
			result.standardDeviation[j] *= coef
		}
		return result
	}

	public toString() {
		const report = Array(this.averageValue.length)
		for (let j = 0, len = this.averageValue.length; j < len; j++) {
			report[j] = `${this.averageValue[j]} ±${2.5 * this.standardDeviation[j]} [${this.count}]`
		}
		return report.join(', ')
	}
}

export enum CalcType {
	Stat,
	Min,
}

export function calcMin(
	countTests: number,
	testFunc: (...args: any[]) => Array<number | BigInt> | null,
	...args: any[]
): CalcStatReport {
	let min
	let count = 0
	for (let i = 0; i < countTests; i++) {
		const result = testFunc(...args)
		if (result == null) {
			i--
			continue
		}

		count++
		if (min && i > 3) {
			for (let j = 0, len = result.length; j < len; j++) {
				const cycles = Number(result[j])
				if (cycles < min[j]) {
					min[j] = cycles
				}
			}
		} else {
			min = result.map(o => Number(o))
			count = 1
		}
	}

	return new CalcStatReport({
		averageValue: min,
		standardDeviation: min.map(() => 0),
		count,
	})
}

export function calcStat(
	countTests: number,
	testFunc: (...args: any[]) => Array<number | BigInt> | null,
	...args: any[]
): CalcStatReport {
	let sum
	let sumSqr
	let count = 0
	for (let i = 0; i < countTests; i++) {
		const result = testFunc(...args)
		if (result == null) {
			i--
			continue
		}

		count++
		if (sum && i > 3) {
			for (let j = 0, len = result.length; j < len; j++) {
				const cycles = Number(result[j])
				sum[j] += cycles
				sumSqr[j] += cycles * cycles
			}
		} else {
			sum = result.map(o => Number(o))
			sumSqr = sum.map(o => o * o)
			count = 1
		}
	}

	const averageValue = Array(sum.length)
	const standardDeviation = Array(sum.length)
	for (let j = 0, len = sum.length; j < len; j++) {
		standardDeviation[j] = Math.sqrt(sumSqr[j] / count
			- sum[j] * sum[j] / (count * count))
		averageValue[j] = sum[j] / count
	}

	return new CalcStatReport({
		averageValue,
		standardDeviation,
		count,
	})
}

export function calc(
	calcType: CalcType,
	countTests: number,
	testFunc: (...args: any[]) => Array<number | BigInt> | null,
	...args: any[]
) {
	switch (calcType) {
		case CalcType.Stat:
			return calcStat(countTests, testFunc, ...args)
		case CalcType.Min:
			return calcMin(countTests, testFunc, ...args)
		default:
			throw new Error('Unknown CalcType: ' + calcType)
	}
}
