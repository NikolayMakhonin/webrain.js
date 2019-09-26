/* tslint:disable:no-empty no-identical-functions */
// @ts-ignore
import {calcPerformance} from 'rdtsc'
import {deepSubscribe} from '../../../main/common/rx/deep-subscribe/deep-subscribe'
import {ObservableObject} from '../../../main/common/rx/object/ObservableObject'
import {ObservableObjectBuilder} from '../../../main/common/rx/object/ObservableObjectBuilder'
import {calcMemAllocate, CalcType} from '../../../main/common/test/Calc'

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


	it('simple', function() { // 173n | 184n
		testPerformance(createObject())
	})

	it('propertyChanged', function() { // 721n | 682n
		testPerformance(createObject(observableObject => {
			observableObject.propertyChanged.subscribe(v => { })
		}))
	})

	it('deepSubscribe', function() { // 2162n | 1890n
		let i = 0
		testPerformance(createObject(observableObject => {
			deepSubscribe({
				object: observableObject,
				lastValue: v => typeof v === 'object' && i++ % 3 === 0 ? () => {} : null,
				ruleBuilder: b => b.path(o => o.prop),
			})
		}))
	})

	it('propertyChanged memory', function() { // 48 | 0
		const object = createObject(observableObject => {
			observableObject.propertyChanged.subscribe(v => { })
		}).observableObject1
		object.prop = 1
		calcMemAllocate(CalcType.Min, 10000, () => {
			// 48 bytes for create event
			object.prop++
		})
	})

	it('deepSubscribe memory', function() { // 48 | 0
		const object = createObject(observableObject => {
			deepSubscribe({
				object: observableObject,
				// v => v != null && typeof v === 'object'
				// 	? () => {}
				// 	: null,
				lastValue: v => null,
				ruleBuilder: b => b.path(o => o.prop),
			})
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

	it('test event as object or arguments', function() {
		let value1
		let value2

		let i = 0

		function fakeThrow() {
			if (i < 0) {
				throw new Error(i + '')
			}
		}

		const subscribers1 = [
			(name, newValue, oldValue) => { value1 = newValue },
			(name, newValue, oldValue) => { value2 = newValue },
		]

		const subscribers2 = [
			({name, newValue, oldValue}) => { value1 = newValue },
			({name, newValue, oldValue}) => { value2 = newValue },
		]

		function change1(name, newValue, oldValue) {
			for (let j = 0, len = subscribers1.length; j < len; j++) {
				const subscriber = subscribers1[j]
				subscriber(name, newValue, oldValue)
			}
		}
		function change2(event) {
			for (let j = 0, len = subscribers1.length; j < len; j++) {
				const subscriber = subscribers2[j]
				subscriber(event)
			}
		}

		let heapUsed = process.memoryUsage().heapUsed
		const result = calcPerformance(
			20000,
			() => change1('prop', i++, i++),
			() => change2({name: 'prop', newValue: i++, oldValue: i++}),
		)
		heapUsed = process.memoryUsage().heapUsed - heapUsed

		calcMemAllocate(CalcType.Min, 10000, () => {
			change1('prop', i++, i++)
		})

		calcMemAllocate(CalcType.Min, 10000, () => {
			change2({name: 'prop', newValue: i++, oldValue: i++})
		})

		console.log('value1: ', value1)
		console.log('value2: ', value2)
		console.log('Memory used: ', heapUsed)
		console.log(result)
	})
})
