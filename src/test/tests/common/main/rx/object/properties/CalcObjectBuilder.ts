/* tslint:disable:no-duplicate-string no-empty no-statements-same-line */
/* eslint-disable guard-for-in */
import {ThenableOrIteratorOrValue} from '../../../../../../../main/common/async/async'
import {ThenableSync} from '../../../../../../../main/common/async/ThenableSync'
import {deepSubscribe} from '../../../../../../../main/common/rx/deep-subscribe/deep-subscribe'
import {ObservableClass} from '../../../../../../../main/common/rx/object/ObservableClass'
import {CalcObjectBuilder} from '../../../../../../../main/common/rx/object/properties/CalcObjectBuilder'
import {calcPropertyFactory} from '../../../../../../../main/common/rx/object/properties/CalcPropertyBuilder'
import {connectorFactory} from '../../../../../../../main/common/rx/object/properties/ConnectorBuilder'
import {resolvePath} from '../../../../../../../main/common/rx/object/properties/path/resolve'
import {IUnsubscribeOrVoid} from '../../../../../../../main/common/rx/subjects/observable'
import {assert} from '../../../../../../../main/common/test/Assert'
import {describe, it, xit} from '../../../../../../../main/common/test/Mocha'
import {TestDeepSubscribe} from '../../deep-subscribe/helpers/src/TestDeepSubscribe'

describe('common > main > rx > properties > CalcObjectBuilder', function() {
	this.timeout(30000)

	class ValueObject extends ObservableClass {
		public value: number
		constructor(value: number) {
			super()
			this.value = value
		}
	}
	new CalcObjectBuilder(ValueObject.prototype)
		.writable('value')

	class ClassSync extends ObservableClass {
		constructor({
			subscribed = true,
			addCalcCount = false,
		}: {
			subscribed?: boolean,
			addCalcCount?: boolean,
		} = {}) {
			super()
			this.addCalcCount = addCalcCount
			this.subscribed = subscribed
		}

		public addCalcCount: boolean
		public value = 'Value'
		public valuePrototype: string
		public calc1: Date
		public calc2: { value: ClassSync }
		public calcWithAnyRule: Date
		public source1 = new ValueObject(100)
		public source2 = new ValueObject(0)
		public source1_: ValueObject
		public source2_: ValueObject

		private _unsubscribe: IUnsubscribeOrVoid
		public get subscribed(): boolean {
			return !!this._unsubscribe
		}
		public set subscribed(value: boolean) {
			const {_unsubscribe} = this
			if (value) {
				if (!_unsubscribe) {
					this._unsubscribe = deepSubscribe({
						object: this,
						changeValue: () => {},
						ruleBuilder: b => b.propertyAny(),
					})
				}
			} else {
				if (_unsubscribe) {
					this._unsubscribe = null
					_unsubscribe()
				}
			}
		}
	}

	class ClassAsync extends ClassSync {
		constructor({
			subscribed = true,
			addCalcCount = false,
		}: {
			subscribed?: boolean,
			addCalcCount?: boolean,
		} = {}) {
			super({subscribed, addCalcCount})
		}
	}

	ClassSync.prototype.valuePrototype = 'Value Prototype'

	let calcCount = 0

	new CalcObjectBuilder(ClassSync.prototype)
		.writable('source1')
		.writable('source2')
		.writable('source1_')
		.writable('source2_')
		.calc('calc1',
			connectorFactory({
				buildRule: c => c
					.connect('connectValue1', b => b.v('lastOrWait').p('source1', 'source1_').v('wait'))
					.connect('addCalcCount', b => b.p('addCalcCount')),
			}),
				// .connect('connectValue1', b => b.p('source1'))),
				// b.path(o => o['@lastOrWait'].source1['@wait']))),
			calcPropertyFactory({
				dependencies: d => d.invalidateOn(b => b.p('connectValue1').p('value')),
				calcFunc(state): ThenableOrIteratorOrValue<void> {
					let connectValue1 = state.input.connectValue1 && state.input.connectValue1.value
					if (connectValue1 && state.input.addCalcCount) {
						calcCount++
						connectValue1 += calcCount
					}

					state.value = connectValue1 && new Date(connectValue1)
					return ThenableSync.createResolved(null)
				},
			}),
		)
		.calc('calc2',
			connectorFactory({
				buildRule: c => c
					.connect('connectValue1', b => b.path(o => o['@lastOrWait']['source2|source2_']['@wait']))
					.connect('addCalcCount', b => b.p('addCalcCount')),
			}),
			calcPropertyFactory({
				dependencies: d => d.invalidateOn(b => b.p('connectValue1').p('value')),
				calcFunc(state): ThenableOrIteratorOrValue<boolean> {
					state.value = { value: state.input.connectorState.source }
					return ThenableSync.createResolved(true)
				},
			}),
		)
		.calc('calcWithAnyRule',
			connectorFactory({
				buildRule: c => c,
			}),
			calcPropertyFactory({
				dependencies: d => d.invalidateOn(b => b
					.any(
						b2 => b2.p('prop1'),
						b2 => b2.p('prop2'),
					),
				),
				calcFunc(state): ThenableOrIteratorOrValue<void> {
					state.value = new Date(1)
				},
			}),
		)

	new CalcObjectBuilder(ClassAsync.prototype)
		.calc('calc1',
			connectorFactory({
				buildRule: c => c
					.connect('connectValue1', b => b.path(o => o['@lastOrWait']['source1|source1_']['@wait']))
					.connect('addCalcCount', b => b.p('addCalcCount')),
			}),
			calcPropertyFactory({
				dependencies: d => d.invalidateOn(b => b.p('connectValue1').p('value')),
				*calcFunc(state): ThenableOrIteratorOrValue<void> {
					yield new Promise(r => setTimeout(r, 10))

					let connectValue1 = state.input.connectValue1 && state.input.connectValue1.value
					if (connectValue1 && state.input.addCalcCount) {
						calcCount++
						connectValue1 += calcCount
					}

					state.value = connectValue1 && new Date(connectValue1)
				},
			}),
		)
		.calc('calc2',
			connectorFactory({
				buildRule: c => c
					.connect('connectValue1', b => b.path(o => o['@lastOrWait']['source2|source2_']['@wait']))
					.connect('addCalcCount', b => b.p('addCalcCount')),
			}),
			calcPropertyFactory({
				dependencies: d => d.invalidateOn(b => b.p('connectValue1').p('value')),
				*calcFunc(state): ThenableOrIteratorOrValue<boolean> {
					yield new Promise(r => setTimeout(r, 10))
					state.value = { value: state.input.connectorState.source }
					return true
				},
			}),
		)

	it('calc sync', function() {
		let result: any = (new ClassSync().calc1 as any).last
		assert.deepStrictEqual(result, new Date(100))

		result = (new ClassSync().calc1 as any).wait
		assert.deepStrictEqual(result, new Date(100))

		result = (new ClassSync().calc1 as any).lastOrWait
		assert.deepStrictEqual(result, new Date(100))
	})

	it('calc sync resolve', function() {
		let val = resolvePath(new ClassSync())(o => o.calc1)()
		assert.deepStrictEqual(val, new Date(100))
		val = resolvePath(new ClassSync())(o => o.calc1)(o => o.last, true)()
		assert.deepStrictEqual(val, new Date(100))
		val = resolvePath(new ClassSync())(o => (o.calc1 as any).wait)(o => o.last, true)()
		assert.deepStrictEqual(val, new Date(100))
		val = resolvePath(new ClassSync())(o => o.calc1)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(val, new Date(100))
		val = resolvePath(new ClassSync())(o => o.wait, true)(o => o.calc1)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(val, new Date(100))

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
		assert.deepStrictEqual((new ClassAsync().calc1 as any).last, void 0)

		let object = new ClassAsync().calc1
		assert.deepStrictEqual(await (object as any).wait, new Date(100))
		assert.deepStrictEqual((object as any).last, new Date(100))

		object = new ClassAsync().calc1
		assert.deepStrictEqual(await (object as any).lastOrWait, new Date(100))
		assert.deepStrictEqual((object as any).last, new Date(100))
	})

	it('calc async resolve', async function() {
		let val = resolvePath(new ClassAsync())(o => o.calc1)()
		assert.deepStrictEqual(await val, new Date(100))
		val = resolvePath(new ClassAsync())(o => o.calc1)(o => o.last, true)()
		assert.deepStrictEqual(await val, new Date(100))
		val = resolvePath(new ClassAsync())(o => (o.calc1 as any).wait)(o => o.last, true)()
		assert.deepStrictEqual(await val, new Date(100))
		val = resolvePath(new ClassAsync())(o => o.calc1)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(await val, new Date(100))
		val = resolvePath(new ClassAsync())(o => o.wait, true)(o => o.calc1)(o => o.wait, true)(o => o.last, true)()
		assert.deepStrictEqual(await val, new Date(100))

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

	it('circular calc sync', function() {
		const object = new ClassSync()
		let value = resolvePath(object)(o => o.calc2)(o => o.value)()
		assert.strictEqual(value, object)
		value = resolvePath(object)(o => o.calc2)(o => o.value)(o => o.calc2)(o => o.value)
			(o => o.calc2)(o => o.value)(o => o.calc2)(o => o.value)()
		assert.strictEqual(value, object)
		const value2 = resolvePath(object)(o => o.calc2)(o => o.value)(o => o.calc2)(o => o.value)
			(o => o.calc2)(o => o.value)(o => o.calc1)()
		assert.deepStrictEqual(value2, new Date(100))
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
		assert.deepStrictEqual(await value2, new Date(100))
	})

	it('deepSubscribe simple', function() {
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

	it('deepSubscribe calcWithAnyRule sync', function() {
		calcCount = 0
		new TestDeepSubscribe(
			{
				object: new ClassSync({subscribed: false}),
				immediate: true,
				doNotSubscribeNonObjectValues: true,
			},
			b => b.p('calcWithAnyRule'),
		)
			.subscribe([new Date(1)])
			.unsubscribe([new Date(1)])
			.subscribe([new Date(1)])
			.unsubscribe([new Date(1)])
	})

	it('deepSubscribe calc sync', function() {
		for (let subscribed = 1; subscribed >= 0; subscribed--) {
			console.log('subscribed: ' + !!subscribed)
			calcCount = 0
			new TestDeepSubscribe(
				{
					object: new ClassSync({subscribed: !!subscribed, addCalcCount: true}),
					immediate: true,
					doNotSubscribeNonObjectValues: true,
				},
				b => b.p('calc1'),
			)
				.subscribe([new Date(101)])
				.unsubscribe([new Date(101)])
				.subscribe([new Date(101)])

				.unsubscribe([new Date(101)])
				.change(o => calcCount -= subscribed ? 2 : 3, [], [])
				.change(o => o.source1 = new ValueObject(100), [], [])
				.subscribe([new Date(101)])

				.unsubscribe([new Date(101)])
				// .change(o => calcCount -= subscribed, [], [])
				.change(o => { o.source1_ = o.source1; o.source1 = void 0 }, [], [])
				.subscribe([new Date(101)])

				.change(o => o.source1_.value = 200, [new Date(101)], [new Date(202)])
				.unsubscribe([new Date(202)])

			new TestDeepSubscribe(
				{
					object: new ClassSync({subscribed: !!subscribed, addCalcCount: true}),
					immediate: true,
					doNotSubscribeNonObjectValues: true,
				},
				b => b.p('calc1').p('getTime'),
			)
				.subscribe([Date.prototype.getTime])
				.change(o => o.source1.value = 200, [Date.prototype.getTime], [Date.prototype.getTime])
				.unsubscribe([Date.prototype.getTime])
		}
	})

	xit('deepSubscribe calc async', async function() {
		const date200 = new Date(200)
		for (let subscribed = 1; subscribed >= 0; subscribed--) {
			console.log('subscribed: ' + !!subscribed)
			calcCount = 0
			let tester = new TestDeepSubscribe(
				{
					object: new ClassAsync({subscribed: !!subscribed, addCalcCount: true}),
					immediate: true,
					doNotSubscribeNonObjectValues: true,
					asyncDelay: 500,
				},
				b => b.p('calc1'),
			)

			await tester.subscribeAsync([new Date(101)])
			await tester.unsubscribeAsync([new Date(101)])
			await tester.subscribeAsync([new Date(101)])

			await tester.unsubscribeAsync([new Date(101)])
			await tester.changeAsync(o => calcCount -= subscribed ? 2 : 1, [], [])
			await tester.changeAsync(o => o.source1 = new ValueObject(100), [], [])
			await tester.subscribeAsync([new Date(101)])

			await tester.unsubscribeAsync([new Date(101)])
			// await tester.changeAsync(o => calcCount -= subscribed, [], [])
			await tester.changeAsync(o => { o.source1_ = o.source1; o.source1 = void 0 }, [], [])
			await tester.subscribeAsync([new Date(101)])

			await tester.changeAsync(o => o.source1_.value = 200, [new Date(101)], [new Date(202)])
			await tester.unsubscribeAsync([new Date(202)])

			tester = new TestDeepSubscribe(
				{
					object: new ClassAsync({subscribed: !!subscribed, addCalcCount: true}),
					immediate: true,
					doNotSubscribeNonObjectValues: true,
					asyncDelay: 200,
				},
				b => b.p('calc1').p('getTime'),
			)

			await tester.subscribeAsync([Date.prototype.getTime as any])
			await tester.changeAsync(o => o.source1.value = 200,
				[Date.prototype.getTime as any], [Date.prototype.getTime as any])
			await tester.unsubscribeAsync([Date.prototype.getTime as any])
		}
	})

	it('deepSubscribe calc circular sync', function() {
		const date200 = new Date(200)
		for (let subscribed = 1; subscribed >= 0; subscribed--) {
			console.log('subscribed: ' + !!subscribed)
			calcCount = 0
			new TestDeepSubscribe(
				{
					object: new ClassSync({subscribed: !!subscribed, addCalcCount: true}),
					immediate: true,
					doNotSubscribeNonObjectValues: true,
				},
				// b => b.p('calc2').p('value').p('calc2').p('value').p('calc1'),
				b => b.p('calc2').p('value').p('calc1'),
			)
			// .subscribe([new Date(100)])
			// .unsubscribe([new Date(100)])
				.subscribe([new Date(101)])
				.unsubscribe([new Date(101)])
				.subscribe([new Date(101)])

				.unsubscribe([new Date(101)])
				.change(o => calcCount -= subscribed ? 2 : 3, [], [])
				.change(o => o.source1 = new ValueObject(100), [], [])
				.subscribe([new Date(101)])

				.unsubscribe([new Date(101)])
				// .change(o => calcCount -= subscribed, [], [])
				.change(o => { o.source1_ = o.source1; o.source1 = void 0 }, [], [])
				.subscribe([new Date(101)])

				.change(o => o.source1_.value = 200, [new Date(101)], [new Date(202)])
				.change(o => o.source2.value += 10, [new Date(202)], [new Date(202)])
				.change(o => o.source1_.value = 300, [new Date(202)], [new Date(303)])
				.unsubscribe([new Date(303)])
		}
	})

	it('deepSubscribe calc circular async', async function() {
		const date200 = new Date(200)
		for (let subscribed = 1; subscribed >= 0; subscribed--) {
			console.log('subscribed: ' + !!subscribed)
			calcCount = 0
			const tester = new TestDeepSubscribe(
				{
					object: new ClassSync({subscribed: !!subscribed, addCalcCount: true}), // TODO replace to ClassAsync
					immediate: true,
					doNotSubscribeNonObjectValues: true,
					asyncDelay: 200,
				},
				b => b.p('calc2').p('value').p('calc2').p('value').p('calc2').p('value').p('calc1'),
			)

			await tester.subscribeAsync([new Date(101)])
			await tester.unsubscribeAsync([new Date(101)])
			await tester.subscribeAsync([new Date(101)])

			await tester.unsubscribeAsync([new Date(101)])
			await tester.changeAsync(o => calcCount -= subscribed ? 2 : 3, [], [])
			await tester.changeAsync(o => o.source1 = new ValueObject(100), [], [])
			await tester.subscribeAsync([new Date(101)])

			await tester.unsubscribeAsync([new Date(101)])
			// await tester.changeAsync(o => calcCount -= subscribed, [], [])
			await tester.changeAsync(o => { o.source1_ = o.source1; o.source1 = void 0 }, [], [])
			await tester.subscribeAsync([new Date(101)])

			await tester.changeAsync(o => o.source1_.value = 200, [new Date(101)], [new Date(202)])
			await tester.changeAsync(o => o.source2.value += 10, [new Date(202)], [new Date(202)])
			await tester.changeAsync(o => o.source1_.value = 300, [new Date(202)], [new Date(303)])
			await tester.unsubscribeAsync([new Date(303)])
		}
	})
})
