/* tslint:disable:no-duplicate-string */
/* eslint-disable guard-for-in */
import {ThenableOrIteratorOrValue} from '../../../../../../../main/common/async/async'
import {ThenableSync} from '../../../../../../../main/common/async/ThenableSync'
import {delay} from '../../../../../../../main/common/helpers/helpers'
import {deepSubscribe} from '../../../../../../../main/common/rx/deep-subscribe/deep-subscribe'
import {ObservableClass} from '../../../../../../../main/common/rx/object/ObservableClass'
import {CalcObjectBuilder} from '../../../../../../../main/common/rx/object/properties/CalcObjectBuilder'
import {calcPropertyFactory} from '../../../../../../../main/common/rx/object/properties/CalcPropertyBuilder'
import {connectorFactory} from '../../../../../../../main/common/rx/object/properties/ConnectorBuilder'
import {ICalcProperty} from '../../../../../../../main/common/rx/object/properties/contracts'
import {resolvePath} from '../../../../../../../main/common/rx/object/properties/helpers'
import {Property} from '../../../../../../../main/common/rx/object/properties/Property'
import {assert} from '../../../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../../../main/common/test/Mocha'
import {createObject, TestDeepSubscribe} from '../../deep-subscribe/helpers/src/TestDeepSubscribe'

describe('common > main > rx > properties > CalcObjectBuilder', function() {
	this.timeout(30000)

	class ClassSync extends ObservableClass {
		public value = 'Value'
		public valuePrototype: string
		public calc1: ICalcProperty<Date>
		public calc2: { value: ClassSync }
		public source1: any = 123
		public source2: any = 0
	}

	class ClassAsync extends ClassSync {
	
	}

	ClassSync.prototype.valuePrototype = 'Value Prototype'

	new CalcObjectBuilder(ClassSync.prototype)
		.writable('source1')
		.writable('source2')
		.calc('calc1',
			connectorFactory(c => c
				.connect('connectValue1', b => b.v('lastOrWait').p('source1').v('wait'))),
				// .connect('connectValue1', b => b.p('source1'))),
				// b.path(o => o['@lastOrWait'].source1['@wait']))),
			calcPropertyFactory({
				dependencies: d => d.invalidateOn(b => b.propertyAny()),
				calcFunc(input, property: Property<Date, number>): ThenableOrIteratorOrValue<void> {
					property.value = input.connectValue1 && new Date(input.connectValue1)
					return ThenableSync.createResolved(null)
				},
			}),
		)
		.calc('calc2',
			connectorFactory(c => c
				.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source2['@wait']))),
			calcPropertyFactory({
				dependencies: d => d.invalidateOn(b => b.propertyAny()),
				calcFunc(input, property: Property<{ value: ClassSync }>): ThenableOrIteratorOrValue<boolean> {
					property.value = { value: input.connectorSource }
					return ThenableSync.createResolved(true)
				},
			}),
		)

	new CalcObjectBuilder(ClassAsync.prototype)
		.calc('calc1',
			connectorFactory(c => c
				.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source1['@wait']))),
			calcPropertyFactory({
				dependencies: d => d.invalidateOn(b => b.propertyAny()),
				*calcFunc(input, property: Property<Date, number>): ThenableOrIteratorOrValue<void> {
					yield new Promise(r => setTimeout(r, 100))
					property.value = new Date(input.connectValue1)
				},
			}),
		)
		.calc('calc2',
			connectorFactory(c => c
				.connect('connectValue1', b => b.path(o => o['@lastOrWait'].source2['@wait']))),
			calcPropertyFactory({
				dependencies: d => d.invalidateOn(b => b.propertyAny()),
				*calcFunc(input, property: Property<{ value: ClassSync }>): ThenableOrIteratorOrValue<boolean> {
					yield new Promise(r => setTimeout(r, 100))
					property.value = { value: input.connectorSource }
					return true
				},
			}),
		)

	it('calc sync', function() {
		let result: any = new ClassSync().calc1.last
		assert.deepStrictEqual(result, new Date(123))

		result = new ClassSync().calc1.wait
		assert.deepStrictEqual(result, new Date(123))

		result = new ClassSync().calc1.lastOrWait
		assert.deepStrictEqual(result, new Date(123))
	})

	it('calc sync resolve', function() {
		let val = resolvePath(new ClassSync())(o => o.calc1)()
		assert.deepStrictEqual(val, new Date(123))
		val = resolvePath(new ClassSync())(o => o.calc1)(o => o.last, true)()
		assert.deepStrictEqual(val, new Date(123))
		val = resolvePath(new ClassSync())(o => o.calc1.wait)(o => o.last, true)()
		assert.deepStrictEqual(val, new Date(123))
		val = resolvePath(new ClassSync())(o => o.calc1)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(val, new Date(123))
		val = resolvePath(new ClassSync())(o => o.wait, true)(o => o.calc1)(o => o.wait, true)(o => o.last, true)()
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
		assert.deepStrictEqual(new ClassAsync().calc1.last, void 0)

		let object = new ClassAsync().calc1
		assert.deepStrictEqual(await object.wait, new Date(123))
		assert.deepStrictEqual(object.last, new Date(123))

		object = new ClassAsync().calc1
		assert.deepStrictEqual(await object.lastOrWait, new Date(123))
		assert.deepStrictEqual(object.last, new Date(123))
	})

	it('calc async resolve', async function() {
		let val = resolvePath(new ClassAsync())(o => o.calc1)()
		assert.deepStrictEqual(await val, new Date(123))
		val = resolvePath(new ClassAsync())(o => o.calc1)(o => o.last, true)()
		assert.deepStrictEqual(await val, new Date(123))
		val = resolvePath(new ClassAsync())(o => o.calc1.wait)(o => o.last, true)()
		assert.deepStrictEqual(await val, new Date(123))
		val = resolvePath(new ClassAsync())(o => o.calc1)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(await val, new Date(123))
		val = resolvePath(new ClassAsync())(o => o.wait, true)(o => o.calc1)(o => o.wait, true)(o => o.last, true)()
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

	it('circular calc sync', async function() {
		const object = new ClassSync()
		let value = resolvePath(object)(o => o.calc2)(o => o.value)()
		assert.strictEqual(value, object)
		value = resolvePath(object)(o => o.calc2)(o => o.value)(o => o.calc2)(o => o.value)
			(o => o.calc2)(o => o.value)(o => o.calc2)(o => o.value)()
		assert.strictEqual(value, object)
		const value2 = resolvePath(object)(o => o.calc2)(o => o.value)(o => o.calc2)(o => o.value)
			(o => o.calc2)(o => o.value)(o => o.calc1)()
		assert.deepStrictEqual(value2, new Date(123))
	})

	it('circular calc async', async function() {
		const object = new ClassSync()
		let value = resolvePath(object)(o => o.calc2)(o => o.value)()
		assert.strictEqual(await value, object)
		value = resolvePath(object)(o => o.calc2)(o => o.value)(o => o.calc2)(o => o.value)
			(o => o.calc2)(o => o.value)(o => o.calc2)(o => o.value)()
		assert.strictEqual(await value, object)
		const value2 = resolvePath(object)(o => o.calc2)(o => o.value)(o => o.calc2)(o => o.value)
			(o => o.calc2)(o => o.value)(o => o.calc1)()
		assert.deepStrictEqual(await value2, new Date(123))
	})

	it('deepSubscribe simple', async function() {
		new TestDeepSubscribe(
			{
				object: new ClassSync(),
				immediate: true,
				doNotSubscribeNonObjectValues: true,
			},
			b => b.p('value'),
		)
			.subscribe(o => ['Value'])
			.unsubscribe(['Value'])

		new TestDeepSubscribe(
			{
				object: new ClassSync(),
				immediate: true,
				doNotSubscribeNonObjectValues: true,
			},
			b => b.p('valuePrototype'),
		)
			.subscribe(o => ['Value Prototype'])
			.unsubscribe(['Value Prototype'])
	})

	it('deepSubscribe calc sync', async function() {
		new TestDeepSubscribe(
			{
				object: new ClassSync(),
				immediate: true,
				doNotSubscribeNonObjectValues: true,
			},
			b => b.p('calc1'),
		)
			.subscribe([new Date(123)])
			.change(o => o.source1 = 234, [new Date(123)], [new Date(234)])
			.unsubscribe([new Date(234)])

		new TestDeepSubscribe(
			{
				object: new ClassSync(),
				immediate: true,
				doNotSubscribeNonObjectValues: true,
			},
			b => b.p('calc1').p('getTime'),
		)
			.subscribe([Date.prototype.getTime])
			.change(o => o.source1 = 234, [Date.prototype.getTime], [Date.prototype.getTime])
			.unsubscribe([Date.prototype.getTime])
	})

	it('deepSubscribe calc async', async function() {
		const date234 = new Date(234)
		let tester = new TestDeepSubscribe(
			{
				object: new ClassAsync(),
				immediate: true,
				doNotSubscribeNonObjectValues: true,
				asyncDelay: 500,
			},
			b => b.p('calc1'),
		)

		await tester.subscribeAsync([new Date(123)])
		await tester.changeAsync(o => o.source1 = 234, [new Date(123), date234, date234], [date234, date234, new Date(234)])
		await tester.unsubscribeAsync([new Date(234)])

		tester = new TestDeepSubscribe(
			{
				object: new ClassAsync(),
				immediate: true,
				doNotSubscribeNonObjectValues: true,
				asyncDelay: 500,
			},
			b => b.p('calc1').p('getTime'),
		)

		await tester.subscribeAsync([Date.prototype.getTime])
		await tester.changeAsync(o => o.source1 = 234, [Date.prototype.getTime, Date.prototype.getTime, Date.prototype.getTime], [Date.prototype.getTime, Date.prototype.getTime, Date.prototype.getTime])
		await tester.unsubscribeAsync([Date.prototype.getTime])
	})

	it('deepSubscribe calc circular sync', async function() {
		const date234 = new Date(234)
		new TestDeepSubscribe(
			{
				object: new ClassSync(),
				immediate: true,
				doNotSubscribeNonObjectValues: true,
			},
			// b => b.p('calc2').p('value').p('calc2').p('value').p('calc1'),
			b => b.p('calc2').p('value').p('calc1'),
		)
			// .subscribe([new Date(123)])
			// .unsubscribe([new Date(123)])
			.subscribe([new Date(123)])
			.change(o => o.source1 = 234, [new Date(123)], [new Date(234)])
			.change(o => o.source2++, [date234, date234], [date234, date234])
			.change(o => o.source1 = 345, [new Date(234)], [new Date(345)])
			.unsubscribe([new Date(345)])
	})

	it('deepSubscribe calc circular async', async function() {
		const date234 = new Date(234)
		const tester = new TestDeepSubscribe(
			{
				object: new ClassSync(),
				immediate: true,
				doNotSubscribeNonObjectValues: true,
				asyncDelay: 500,
			},
			b => b.p('calc2').p('value').p('calc2').p('value').p('calc2').p('value').p('calc1'),
		)

		await tester.subscribeAsync([new Date(123)])
		await tester.unsubscribeAsync([new Date(123)])
		await tester.subscribeAsync([new Date(123)])
		await tester.changeAsync(o => o.source1 = 234, [new Date(123)], [new Date(234)])
		await tester.changeAsync(o => o.source2++, [date234, date234], [date234, date234])
		await tester.changeAsync(o => o.source1 = 345, [new Date(234)], [new Date(345)])
		await tester.unsubscribeAsync([new Date(345)])
	})
})
