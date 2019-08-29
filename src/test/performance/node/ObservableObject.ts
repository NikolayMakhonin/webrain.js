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

		const result = calcPerformance(
			20000,
			() => {
				// no operations
				value++
			},
			() => { // 12
				object1.prop = value++
				object1.prop2 = value++
				object2.prop = value++
				object2.prop2 = value++
			},
			() => { // 4
				return object1.prop && object1.prop2 && object2.prop && object2.prop2
			},
			() => { // 8
				observableObject1.prop = value++
				observableObject1.prop2 = value++
				observableObject2.prop = value++
				observableObject2.prop2 = value++
			},
			() => { // 0
				return observableObject1.prop && observableObject1.prop2 && observableObject1.prop && observableObject2.prop2
			},
		)

		console.log(result)
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
		test(object => {
			deepSubscribe(object, v => null, true, b => b.path(o => o.prop))
		})
	})
})
