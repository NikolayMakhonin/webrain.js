/* tslint:disable:no-empty no-identical-functions */
import {calcPerformance} from 'rdtsc'
import {deepSubscribe} from '../../../main/common/rx/deep-subscribe/deep-subscribe'
import {ObservableObject} from '../../../main/common/rx/object/ObservableObject'
import {ObservableObjectBuilder} from '../../../main/common/rx/object/ObservableObjectBuilder'

describe('ObservableObject', function() {
	this.timeout(300000)

	interface IClass {
		prop: any
		prop2: any
	}

	interface IObservableClass extends IClass, ObservableObject {
	}

	interface IObject {
		object1: IClass,
		object2: IClass,
		observableObject1: IObservableClass,
		observableObject2: IObservableClass,
	}

	function createObject(init?: (observableObject: IObservableClass) => void): IObject {
		class Class extends ObservableObject implements IObservableClass {
			public prop
			public prop2
		}

		new ObservableObjectBuilder(ObservableObject.prototype)
			.writable('prop') // , o => o.prop, (o, v) => o.prop = v)
			.writable('prop2') // , o => o.prop2, (o, v) => o.prop2 = v)

		const observableObject1 = new Class()
		const observableObject2 = new Class()
		if (init) {
			init(observableObject1)
			init(observableObject2)
		}

		const object1: IClass = {prop: void 0, prop2: void 0}
		const object2: IClass = {prop: void 0, prop2: void 0}

		let value = 1
		object1.prop = value++
		object1.prop2 = value++
		object2.prop = value++
		object2.prop2 = value++
		observableObject1.prop = value++
		observableObject1.prop2 = value++
		observableObject2.prop = value++
		observableObject2.prop2 = value++

		return {
			object1,
			object2,
			observableObject1,
			observableObject2,
		}
	}

	function testPerformance({
		object1,
		object2,
		observableObject1,
		observableObject2,
	}: IObject) {
		const testFunc = Function('o1', 'o2', 'v', `{
			o1.prop = v
			o1.prop2 = v
			o2.prop = v
			o2.prop2 = v
			return o1.prop + o1.prop2 + o2.prop + o2.prop2
		} // ${Math.random()}`).bind(null, observableObject1, observableObject2)

		let value = -2000000000

		// calcStat(1000, 10, time => {
		const result = calcPerformance(
			20000,
			// () => {
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
			() => testFunc(value++ % 2 === 0 ? { value } : value),
			// () => { // 0
			// 	return observableObject1.prop && observableObject1.prop2 && observableObject1.prop && observableObject2.prop2
			// },
		)

		console.log(result)
		// return result.cycles
		// })
	}

	class CalcStatReport {
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

		public toString() {
			const report = Array(this.averageValue.length)
			for (let j = 0, len = this.averageValue.length; j < len; j++) {
				report[j] = `${this.averageValue[j]} ±${2.5 * this.standardDeviation[j]} [${this.count}]`
			}
			return report.join(', ')
		}
	}

	enum CalcType {
		Stat,
		Min,
	}

	function calcMin(
		countTests: number,
		testFunc: (...args: any[]) => Array<number|BigInt> | null,
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

	function calcStat(
		countTests: number,
		testFunc: (...args: any[]) => Array<number|BigInt> | null,
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

	function calc(
		calcType: CalcType,
		countTests: number,
		testFunc: (...args: any[]) => Array<number|BigInt> | null,
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

	function _calcMemAllocate(
		calcType: CalcType,
		countTests: number,
		testFunc: (...args: any[]) => void,
		...testFuncArgs: any[]
	): CalcStatReport {
		return calc(calcType, countTests, (...args) => {
			let heapUsed = process.memoryUsage().heapUsed
			testFunc(...args)
			heapUsed = process.memoryUsage().heapUsed - heapUsed
			return heapUsed < 0 ? null : [heapUsed]
		}, ...testFuncArgs)
	}

	function calcMemAllocate(
		calcType: CalcType,
		countTests: number,
		testFunc: (...args: any[]) => void,
		...testFuncArgs: any[]
	): void {
		const zero = _calcMemAllocate(calcType, countTests, (...args) => { }, ...testFuncArgs)
		const value = _calcMemAllocate(calcType, countTests, testFunc, ...testFuncArgs)

		console.log(value.subtract(zero).toString())
	}

	it('simple', function() {
		testPerformance(createObject())
	})

	it('propertyChanged', function() {
		testPerformance(createObject(observableObject => {
			observableObject.propertyChanged.subscribe(v => { })
		}))
	})

	it('deepSubscribe', function() {
		let i = 0
		testPerformance(createObject(observableObject => {
			deepSubscribe(observableObject,
				v => typeof v === 'object' && i++ % 3 === 0 ? () => {} : null,
				true,
				b => b.path(o => o.prop),
			)
		}))
	})

	it('propertyChanged memory', function() {
		const object = createObject(observableObject => {
			observableObject.propertyChanged.subscribe(v => { })
		}).observableObject1
		object.prop = 1
		calcMemAllocate(CalcType.Min, 10000, () => {
			// 48 bytes for create event
			object.prop++
		})
	})

	it('deepSubscribe memory', function() {
		const object = createObject(observableObject => {
			deepSubscribe(observableObject,
				// v => v != null && typeof v === 'object'
				// 	? () => {}
				// 	: null,
				v => null,
				true,
				b => b.path(o => o.prop),
			)
		}).observableObject1
		const value1 = {}
		const value2 = {}
		object.prop = 1
		calcMemAllocate(CalcType.Min, 10000, () => {
			// 48 bytes for create event
			// 56 bytes for create unsubscribe function
			object.prop = object.prop === value1 ? value2 : value1
		})
	})

	it('test memory', function() {
		calcMemAllocate(CalcType.Min, 10000, () => {
			let value
			function calcValue() {
				value = 3
			}
			calcValue()
			return value
		})
	})
})
