/* tslint:disable:no-duplicate-string */
/* eslint-disable guard-for-in */
import {ThenableOrIteratorOrValue} from '../../../../../../../main/common/async/async'
import {ThenableSync} from '../../../../../../../main/common/async/ThenableSync'
import {ObservableObject} from '../../../../../../../main/common/rx/object/ObservableObject'
import {CalcObjectBuilder} from '../../../../../../../main/common/rx/object/properties/CalcObjectBuilder'
import {ICalcProperty} from '../../../../../../../main/common/rx/object/properties/CalcProperty'
import {calcPropertyFactory} from '../../../../../../../main/common/rx/object/properties/CalcPropertyBuilder'
import {connectorFactory} from '../../../../../../../main/common/rx/object/properties/ConnectorBuilder'
import {resolvePath} from '../../../../../../../main/common/rx/object/properties/helpers'
import {Property} from '../../../../../../../main/common/rx/object/properties/property'

declare const assert: any

describe('common > main > rx > properties > CalcObjectBuilder', function() {
	class ClassSync extends ObservableObject {
		public prop1: ICalcProperty<Date>
		public source: {
			value: string,
		}
	}

	class ClassAsync extends ClassSync {
	
	}

	new CalcObjectBuilder(ClassSync.prototype)
		.calc('prop1',
			connectorFactory(c => c
				.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source['@wait']))),
			calcPropertyFactory((input, valueProperty: Property<Date, number>): ThenableOrIteratorOrValue<void> => {
				valueProperty.value = new Date(123)
				return ThenableSync.createResolved(null)
			}),
		)

	new CalcObjectBuilder(ClassAsync.prototype)
		.calc('prop1',
			connectorFactory(c => c
				.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source['@wait']))),
			calcPropertyFactory(function *(input, valueProperty: Property<Date, number>): ThenableOrIteratorOrValue<void> {
				yield new Promise(r => setTimeout(r, 100))
				valueProperty.value = new Date(123)
			}),
		)

	it('calc sync', function() {
		let result: any = new ClassSync().prop1.last
		assert.deepStrictEqual(result, new Date(123))

		result = new ClassSync().prop1.wait
		assert.deepStrictEqual(result, new Date(123))

		result = new ClassSync().prop1.lastOrWait
		assert.deepStrictEqual(result, new Date(123))
	})

	it('calc sync resolve', function() {
		let val = resolvePath(new ClassSync())(o => o.prop1)()
		assert.deepStrictEqual(val, new Date(123))
		val = resolvePath(new ClassSync())(o => o.prop1)(o => o.last, true)()
		assert.deepStrictEqual(val, new Date(123))
		val = resolvePath(new ClassSync())(o => o.prop1.wait)(o => o.last, true)()
		assert.deepStrictEqual(val, new Date(123))
		val = resolvePath(new ClassSync())(o => o.prop1)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(val, new Date(123))
		val = resolvePath(new ClassSync())(o => o.wait, true)(o => o.prop1)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(val, new Date(123))

		let object = new ClassSync()
		let obj = resolvePath(object)()
		assert.deepStrictEqual(obj, object)

		object = new ClassSync()
		obj = resolvePath(object)(o => o.wait, true)()
		assert.deepStrictEqual(obj, object)

		object = new ClassSync()
		obj = resolvePath(object)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(obj, object)
	})

	it('calc async', async function() {
		assert.deepStrictEqual(new ClassAsync().prop1.last, void 0)

		let object = new ClassAsync().prop1
		assert.deepStrictEqual(await object.wait, new Date(123))
		assert.deepStrictEqual(object.last, new Date(123))

		object = new ClassAsync().prop1
		assert.deepStrictEqual(await object.lastOrWait, new Date(123))
		assert.deepStrictEqual(object.last, new Date(123))
	})

	it('calc async resolve', async function() {
		let val = resolvePath(new ClassAsync())(o => o.prop1)()
		assert.deepStrictEqual(await val, new Date(123))
		val = resolvePath(new ClassAsync())(o => o.prop1)(o => o.last, true)()
		assert.deepStrictEqual(await val, new Date(123))
		val = resolvePath(new ClassAsync())(o => o.prop1.wait)(o => o.last, true)()
		assert.deepStrictEqual(await val, new Date(123))
		val = resolvePath(new ClassAsync())(o => o.prop1)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(await val, new Date(123))
		val = resolvePath(new ClassAsync())(o => o.wait, true)(o => o.prop1)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(await val, new Date(123))

		let object = new ClassAsync()
		let obj = resolvePath(object)()
		assert.deepStrictEqual(await obj, object)

		object = new ClassAsync()
		obj = resolvePath(object)(o => o.wait, true)()
		assert.deepStrictEqual(await obj, object)

		object = new ClassAsync()
		obj = resolvePath(object)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(await obj, object)
	})
})
