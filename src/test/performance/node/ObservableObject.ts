/* tslint:disable:no-empty */
import {calcPerformance} from 'rdtsc'
import {deepSubscribe} from '../../../main/common/rx/deep-subscribe/deep-subscribe'
import {ObservableObject} from '../../../main/common/rx/object/ObservableObject'
import {ObservableObjectBuilder} from '../../../main/common/rx/object/ObservableObjectBuilder'

describe('ObservableObject', function() {
	this.timeout(300000)

	interface IClass extends ObservableObject {
		prop: any
		prop2: any
	}

	function calcStat(
		countTests: number,
		firstTime: number,
		time: number,
		testFunc: (time: number) => Array<number|BigInt>,
	) {
		let sum
		let sumSqr
		let count = 0
		for (let i = 0; i < countTests; i++) {
			const result = testFunc(time)
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

			const report = Array(result.length)
			for (let j = 0, len = result.length; j < len; j++) {
				const standardDeviation = Math.sqrt(sumSqr[j] / count
					- sum * sum / (count * count))
				report[j] = `${i}: ${Number(result[j])} => ${sum / count} ±${2.5 * standardDeviation}`
			}

			console.log(report.join(', '))
		}
	}

	function test(init?: (object: IClass) => void)  {
		class Class extends ObservableObject implements IClass {
			public prop: any
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

		const object1 = {prop: void 0, prop2: void 0}
		const object2 = {prop: void 0, prop2: void 0}

		let value = -2000000000
		object1.prop = value++
		object1.prop2 = value++
		object2.prop = value++
		object2.prop2 = value++
		observableObject1.prop = value++
		observableObject1.prop2 = value++
		observableObject2.prop = value++
		observableObject2.prop2 = value++

		const testFunc = Function('o1', 'o2', 'v', `{
			o1.prop = v
			o1.prop2 = v
			o2.prop = v
			o2.prop2 = v
			return o1.prop + o1.prop2 + o2.prop + o2.prop2
		} // ${Math.random()}`).bind(null, observableObject1, observableObject2)

		calcStat(1000, 1000, 10, time => {
			const result = calcPerformance(
				time,
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

			return result.cycles
		})
	}

	it('simple', function() {
		test()
	})

	it('propertyChanged', function() {
		test(object => {
			object.propertyChanged.subscribe(v => { })
		})
	})

	it('deepSubscribe', function() {
		let i = 0
		test(object => {
			deepSubscribe(object, v => typeof v === 'object' && i++ % 3 === 0 ? () => {} : null, true, b => b.path(o => o.prop))
		})
	})
})
