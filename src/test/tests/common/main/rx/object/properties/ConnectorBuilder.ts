/* tslint:disable:no-duplicate-string */
/* eslint-disable guard-for-in */
import {ObservableObject} from '../../../../../../../main/common/rx/object/ObservableObject'
import {ObservableObjectBuilder} from '../../../../../../../main/common/rx/object/ObservableObjectBuilder'
import {ConnectorBuilder} from '../../../../../../../main/common/rx/object/properties/ConnectorBuilder'
import {createObject} from '../../deep-subscribe/helpers/src/TestDeepSubscribe'

declare const assert: any

describe('common > main > rx > properties > ConnectorBuilder', function() {
	it('connect', function() {
		const source = new ObservableObjectBuilder(createObject().observableObject)
			.writable<string, 'baseProp1'>('baseProp1')
			.writable<string, 'baseProp2'>('baseProp2')
			.writable<string, 'prop1'>('prop1')
			.writable<string, 'prop2'>('prop2')
			.object

		source.baseProp1 = 'baseProp1_init_source'

		class BaseClass1 extends ObservableObject {
			public readonly source = source
			public baseProp1: string
		}

		class BaseClass2 extends BaseClass1 {
			public baseProp2: string
		}

		class Class1 extends BaseClass1 {
			public prop1: string
		}

		class Class2 extends BaseClass2 {
			public prop2: string
		}

		type ValueKeys = '@value_property'

		new ConnectorBuilder<ObservableObject, BaseClass1, ValueKeys>(BaseClass1.prototype)
			.connect('baseProp1',
				b => b.path(o => o.source
					.property['@value_property']
					.observableMap['#observableList']
					['#']
					.baseProp1))

		new ConnectorBuilder<BaseClass2, BaseClass2, ValueKeys>(BaseClass2.prototype)
			.connectWritable('baseProp2',
				b => b.path(o => o['@value_property'].source
					.property['@value_property']
					.observableMap['#observableList']
					['#']
					.baseProp2),
				null,
				'baseProp2_init')

		new ConnectorBuilder<Class1, Class1, ValueKeys>(Class1.prototype)
			.connect('prop1',
				b => b.path(o => o['@value_property'].source
					.property['@value_property']
					.observableMap['#observableList']
					['#']
					.prop1),
				null,
				'prop1_init')

		new ConnectorBuilder<Class2, Class2, ValueKeys>(Class2.prototype)
			.connectWritable('prop2',
				b => b.path(o => o['@value_property'].source
					.property['@value_property']
					.observableMap['#observableList']
					['#']
					.prop2),
				null,
				'prop2_init')

		const baseObject1 = new BaseClass1()
		const baseObject2 = new BaseClass2()
		const object1 = new Class1()
		const object2 = new Class2()

		// eslint-disable-next-line prefer-const
		let baseResults1 = []
		const baseSubscriber1 = value => {
			baseResults1.push(value)
		}

		// eslint-disable-next-line prefer-const
		let baseResults2 = []
		const baseSubscriber2 = value => {
			baseResults2.push(value)
		}

		// eslint-disable-next-line prefer-const
		const results1 = []
		const subscriber1 = value => {
			results1.push(value)
		}

		// eslint-disable-next-line prefer-const
		let results2 = []
		const subscriber2 = value => {
			results2.push(value)
		}

		const baseUnsubscribe1 = []
		const baseUnsubscribe2 = []
		const unsubscribe1 = []
		const unsubscribe2 = []

		assert.strictEqual(typeof (baseUnsubscribe1[0]
			= baseObject1.propertyChanged.subscribe(baseSubscriber1)), 'function')
		assert.strictEqual(typeof (baseUnsubscribe2[0]
			= baseObject2.propertyChanged.subscribe(baseSubscriber2)), 'function')
		assert.strictEqual(typeof (unsubscribe1[0] = object1.propertyChanged.subscribe(subscriber1)), 'function')
		assert.strictEqual(typeof (unsubscribe2[0] = object2.propertyChanged.subscribe(subscriber2)), 'function')

		// assert.strictEqual(baseObject2.baseProp1, void 0)
		assert.strictEqual(baseObject1.baseProp1, 'baseProp1_init_source')

		source.baseProp1 = '1'
		assert.deepStrictEqual(baseResults1, [
			{
				name    : 'baseProp1',
				newValue: '1',
				oldValue: 'baseProp1_init_source',
			},
		])
		baseResults1 = []
		assert.deepStrictEqual(baseResults2, [])
		assert.deepStrictEqual(results1, [])
		assert.deepStrictEqual(results2, [])
		assert.deepStrictEqual(baseObject1.baseProp1, '1')
		assert.deepStrictEqual(baseObject2.baseProp1, '1')
		assert.deepStrictEqual(object1.baseProp1, '1')
		assert.deepStrictEqual(object2.baseProp1, '1')

		assert.strictEqual(baseObject2.baseProp2, 'baseProp2_init')

		baseObject2.baseProp2 = '1'
		assert.deepStrictEqual(source.baseProp2, '1')
		assert.deepStrictEqual(baseResults1, [])
		assert.deepStrictEqual(baseResults2, [
			{
				name: 'baseProp2',
				newValue: '1',
				oldValue: 'baseProp2_init',
			},
		])
		baseResults2 = []
		assert.deepStrictEqual(results1, [])
		assert.deepStrictEqual(results2, [])
		assert.deepStrictEqual((baseObject1 as any).baseProp2, undefined)
		assert.deepStrictEqual(baseObject2.baseProp2, '1')
		assert.deepStrictEqual((object1 as any).baseProp2, undefined)
		assert.deepStrictEqual(object2.baseProp2, '1')

		object2.baseProp2 = '2'
		assert.deepStrictEqual(baseResults1, [])
		assert.deepStrictEqual(baseResults2, [
			{
				name    : 'baseProp2',
				newValue: '2',
				oldValue: '1',
			},
		])
		baseResults2 = []
		assert.deepStrictEqual(results1, [])
		assert.deepStrictEqual(results2, [
			{
				name    : 'baseProp2',
				newValue: '2',
				oldValue: '1',
			},
		])
		results2 = []
		assert.deepStrictEqual((baseObject1 as any).baseProp2, undefined)
		assert.deepStrictEqual(baseObject2.baseProp2, '2')
		assert.deepStrictEqual((object1 as any).baseProp2, undefined)
		assert.deepStrictEqual(object2.baseProp2, '2')

		source.baseProp2 = '3'
		assert.deepStrictEqual(baseResults1, [])
		assert.deepStrictEqual(baseResults2, [
			{
				name    : 'baseProp2',
				newValue: '3',
				oldValue: '2',
			},
		])
		baseResults2 = []
		assert.deepStrictEqual(results1, [])
		assert.deepStrictEqual(results2, [
			{
				name    : 'baseProp2',
				newValue: '3',
				oldValue: '2',
			},
		])
		results2 = []
		assert.deepStrictEqual((baseObject1 as any).baseProp2, undefined)
		assert.deepStrictEqual(baseObject2.baseProp2, '3')
		assert.deepStrictEqual((object1 as any).baseProp2, undefined)
		assert.deepStrictEqual(object2.baseProp2, '3')

		new ConnectorBuilder(object2)
			.readable('baseProp1', null, '7')

		assert.deepStrictEqual(baseResults1, [])
		assert.deepStrictEqual(baseResults2, [])
		assert.deepStrictEqual(results1, [])
		assert.deepStrictEqual(results2, [
			{
				name    : 'baseProp1',
				newValue: '7',
				oldValue: '1',
			},
		])
		results2 = []
		assert.deepStrictEqual(baseObject1.baseProp1, '1')
		assert.deepStrictEqual(baseObject2.baseProp1, '1')
		assert.deepStrictEqual(object1.baseProp1, '1')
		assert.deepStrictEqual(object2.baseProp1, '7')
	})
})
