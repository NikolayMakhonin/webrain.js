/* eslint-disable guard-for-in */
import {IPropertyChangedEvent} from '../../../../../../main/common/rx/object/IPropertyChanged'
import {ObservableObject} from '../../../../../../main/common/rx/object/ObservableObject'
import {ObservableObjectBuilder} from '../../../../../../main/common/rx/object/ObservableObjectBuilder'

declare const assert: any

describe('common > main > rx > observable-object-builder', function() {
	function assertEvents(events: IPropertyChangedEvent[], check: IPropertyChangedEvent[]) {
		events = events && events.map(o => {
			const result: any = {}
			if ('name' in o) {
				result.name = o.name
			}
			if ('oldValue' in o) {
				result.oldValue = o.oldValue
			}
			if ('newValue' in o) {
				result.newValue = o.newValue
			}

			return result
		})

		assert.deepStrictEqual(events, check)
	}

	it('enumerate properties', function() {
		const {object} = new ObservableObjectBuilder()
			.writable('writable')
			.readable('readable', null, '1')

		assert.deepStrictEqual(Object.keys(object), ['writable', 'readable'])

		// tslint:disable-next-line:forin
		for (const key in object) {
			assert.ok(key === 'writable' || key === 'readable', `key = ${key}`)
		}

		assert.ok(object.propertyChanged)

		assert.throws(() => ((object.propertyChanged as any) = '1'), TypeError)

		Object.defineProperty(object, 'propertyChanged', {
			value: '2',
		})

		assert.strictEqual(object.propertyChanged, '2')
	})

	it('propertyChanged property', function() {
		const {object} = new ObservableObjectBuilder()
		assert.ok(object.propertyChanged)

		assert.throws(() => (object.propertyChanged = '1'), TypeError)

		Object.defineProperty(object, 'propertyChanged', {
			value: '2',
		})

		assert.strictEqual(object.propertyChanged, '2')
	})

	it('onPropertyChanged', function() {
		const {object} = new ObservableObjectBuilder()

		let results = []
		const subscriber = value => {
			results.push(value)
		}

		assert.ok(object.propertyChanged)
		assert.notOk(object.propertyChangedIfCanEmit)

		assert.strictEqual(object.propertyChanged.onPropertyChanged(), object.propertyChanged)
		assert.strictEqual(object.propertyChanged.onPropertyChanged('prop'), object.propertyChanged)

		const unsubscribe = []
		assert.strictEqual(typeof (unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function')
		assertEvents(results, [])
		assert.ok(object.propertyChangedIfCanEmit)

		assert.strictEqual(object.propertyChangedIfCanEmit.onPropertyChanged(), object.propertyChangedIfCanEmit)
		assertEvents(results, [])

		assert.strictEqual(object.propertyChangedIfCanEmit.onPropertyChanged(null), object.propertyChangedIfCanEmit)
		assertEvents(results, [{}])
		results = []

		assert.strictEqual(object.propertyChangedIfCanEmit.onPropertyChanged(''), object.propertyChangedIfCanEmit)
		assertEvents(results, [
			{
				name    : '',
				newValue: undefined,
				oldValue: undefined,
			},
		])
		results = []

		// assert.strictEqual(object.propertyChangedIfCanEmit
		// 	.onPropertyChanged('', '', '', '', ''), object.propertyChangedIfCanEmit)
		// assertEvents(results, [
		// 	{
		// 		name    : '',
		// 		newValue: undefined,
		// 		oldValue: undefined
		// 	}
		// ])
		// results = []

		object[4] = null
		object[1] = 11
		object.z = 'zz'

		assert.strictEqual(object.propertyChangedIfCanEmit
			.onPropertyChanged(2, 'z', 'a', '1', 4), object.propertyChangedIfCanEmit)
		assertEvents(results, [
			{
				name    : 2,
				newValue: undefined,
				oldValue: undefined,
			},
			{
				name    : 'z',
				newValue: 'zz',
				oldValue: 'zz',
			},
			{
				name    : 'a',
				newValue: undefined,
				oldValue: undefined,
			},
			{
				name    : '1',
				newValue: 11,
				oldValue: 11,
			},
			{
				name    : 4,
				newValue: null,
				oldValue: null,
			},
		])
		results = []
	})

	it('readable simple', function() {
		const {object} = new ObservableObjectBuilder()
		assert.ok(object instanceof ObservableObject)

		const builder = new ObservableObjectBuilder(object)
		assert.strictEqual(builder.object, object)

		assert.strictEqual(builder.readable('prop'), builder)
		assert.strictEqual(builder.object.prop, undefined)

		assert.strictEqual(builder.readable('prop', null, '1'), builder)
		assert.strictEqual(builder.object.prop, '1')

		assert.strictEqual(builder.readable('prop'), builder)
		assert.strictEqual(builder.object.prop, '1')

		assert.strictEqual(builder.readable('prop', null, undefined), builder)
		assert.strictEqual(builder.object.prop, '1')

		assert.strictEqual(builder.readable('prop', null, null), builder)
		assert.strictEqual(builder.object.prop, null)

		assert.throws(() => (builder.object.prop = '2'), TypeError)
		assert.strictEqual(builder.object.prop, null)

		assert.strictEqual(builder.object, object)
	})

	it('readable factory', function() {
		const {object} = new ObservableObjectBuilder()
		assert.ok(object instanceof ObservableObject)

		const builder = new ObservableObjectBuilder(object)
		assert.strictEqual(builder.object, object)

		assert.strictEqual(builder.readable('prop'), builder)
		assert.strictEqual(builder.object.prop, undefined)

		let valueCreated = false
		assert.strictEqual(builder.readable('prop', {
			factory() {
				valueCreated = true
				return '2'
			},
		}), builder)

		assert.strictEqual(valueCreated, false)
		assert.strictEqual(builder.object.prop, '2')
		assert.strictEqual(valueCreated, true)
	})

	it('writable simple', function() {
		const {object} = new ObservableObjectBuilder()
		assert.ok(object instanceof ObservableObject)

		const builder = new ObservableObjectBuilder(object)
		assert.strictEqual(builder.object, object)

		assert.strictEqual(builder.writable('prop'), builder)
		assert.strictEqual(builder.object.prop, undefined)

		assert.strictEqual(builder.writable('prop', null, '1'), builder)
		assert.strictEqual(builder.object.prop, '1')

		assert.strictEqual(builder.readable('prop'), builder)
		assert.strictEqual(builder.object.prop, '1')

		assert.strictEqual(builder.writable('prop', null, undefined), builder)
		assert.strictEqual(builder.object.prop, '1')

		assert.strictEqual(builder.writable('prop', null, null), builder)
		assert.strictEqual(builder.object.prop, null)

		builder.object.prop = '2'
		assert.strictEqual(builder.object.prop, '2')

		assert.strictEqual(builder.object, object)
	})

	it('readable simple changed', function() {
		const builder = new ObservableObjectBuilder<any>()
		const {object} = builder

		let hasSubscribers = []
		const hasSubscribersSubscriber = value => {
			hasSubscribers.push(value)
		}

		let results = []
		const subscriber = value => {
			results.push(value)
		}

		const hasSubscribersUnsubscribe = []
		assert.strictEqual(typeof (hasSubscribersUnsubscribe[0]
			= object.propertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function')
		assert.deepStrictEqual(hasSubscribers, [false])
		hasSubscribers = []

		const unsubscribe = []
		assert.strictEqual(typeof (unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function')
		assertEvents(results, [])
		assert.deepStrictEqual(hasSubscribers, [true])
		hasSubscribers = []

		assert.strictEqual(builder.readable('prop'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [])
		assert.strictEqual(object.prop, undefined)

		assert.strictEqual(builder.readable('prop', null, undefined), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [])
		assert.strictEqual(object.prop, undefined)

		assert.strictEqual(builder.readable('prop', null, null), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [
			{
				name    : 'prop',
				newValue: null,
				oldValue: undefined,
			},
		])
		results = []
		assert.strictEqual(object.prop, null)

		assert.strictEqual(builder.readable('prop', null, '1'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [
			{
				name    : 'prop',
				newValue: '1',
				oldValue: null,
			},
		])
		results = []
		assert.strictEqual(object.prop, '1')

		let valueCreated = false
		assert.strictEqual(builder.readable('prop', {factory() {
			assert.strictEqual(this, builder.object)
			valueCreated = true
			return '1'
		}}), builder)
		assert.strictEqual(valueCreated, false)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [
			{
				name    : 'prop',
				newValue: '1',
				oldValue: '1',
			},
		])
		results = []
		assert.strictEqual(valueCreated, true)
		assert.strictEqual(object.prop, '1')

		assert.strictEqual(builder.readable('prop', null, 1), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [
			{
				name    : 'prop',
				newValue: 1,
				oldValue: '1',
			},
		])
		results = []
		assert.strictEqual(object.prop, 1)

		assert.throws(() => (builder.object.prop = '2'), TypeError)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [])
		results = []
		assert.strictEqual(object.prop, 1)

		assert.throws(() => (builder.object.prop = 2), TypeError)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [])
		results = []
		assert.strictEqual(object.prop, 1)
	})

	it('writable simple changed', function() {
		const builder = new ObservableObjectBuilder<any>()
		const {object} = builder

		let hasSubscribers = []
		const hasSubscribersSubscriber = value => {
			hasSubscribers.push(value)
		}

		let results = []
		const subscriber = value => {
			results.push(value)
		}

		const hasSubscribersUnsubscribe = []
		assert.strictEqual(typeof (hasSubscribersUnsubscribe[0]
			= object.propertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function')
		assert.deepStrictEqual(hasSubscribers, [false])
		hasSubscribers = []

		const unsubscribe = []
		assert.strictEqual(typeof (unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function')
		assertEvents(results, [])
		assert.deepStrictEqual(hasSubscribers, [true])
		hasSubscribers = []

		assert.strictEqual(builder.writable('prop'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [])
		assert.strictEqual(object.prop, undefined)

		assert.strictEqual(builder.writable('prop', null, undefined), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [])
		assert.strictEqual(object.prop, undefined)

		assert.strictEqual(builder.writable('prop', null, null), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [
			{
				name    : 'prop',
				newValue: null,
				oldValue: undefined,
			},
		])
		results = []
		assert.strictEqual(object.prop, null)

		assert.strictEqual(builder.writable('prop', null, '1'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [
			{
				name    : 'prop',
				newValue: '1',
				oldValue: null,
			},
		])
		results = []
		assert.strictEqual(object.prop, '1')

		assert.strictEqual(builder.writable('prop', null, '1'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [])
		assert.strictEqual(object.prop, '1')

		assert.strictEqual(builder.writable('prop', null, 1), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [
			{
				name    : 'prop',
				newValue: 1,
				oldValue: '1',
			},
		])
		results = []
		assert.strictEqual(object.prop, 1)

		object.prop = '2'
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [
			{
				name    : 'prop',
				newValue: '2',
				oldValue: 1,
			},
		])
		results = []
		assert.strictEqual(object.prop, '2')

		object.prop = '2'
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [])
		assert.strictEqual(object.prop, '2')

		object.prop = 2
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [
			{
				name    : 'prop',
				newValue: 2,
				oldValue: '2',
			},
		])
		results = []
		assert.strictEqual(object.prop, 2)
	})

	it('updatable simple changed', function() {
		const builder = new ObservableObjectBuilder<any>()
		const {object} = builder

		let hasSubscribers = []
		const hasSubscribersSubscriber = value => {
			hasSubscribers.push(value)
		}

		let results = []
		const subscriber = value => {
			results.push(value)
		}

		const hasSubscribersUnsubscribe = []
		assert.strictEqual(typeof (hasSubscribersUnsubscribe[0]
			= object.propertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function')
		assert.deepStrictEqual(hasSubscribers, [false])
		hasSubscribers = []

		const unsubscribe = []
		assert.strictEqual(typeof (unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function')
		assertEvents(results, [])
		assert.deepStrictEqual(hasSubscribers, [true])
		hasSubscribers = []

		assert.strictEqual(builder.updatable('prop', {update: v => v}), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [])
		assert.strictEqual(object.prop, undefined)

		assert.strictEqual(builder.updatable('prop', {update: v => v}, undefined), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [])
		assert.strictEqual(object.prop, undefined)

		assert.strictEqual(builder.updatable('prop', {update: v => v}, null), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [
			{
				name    : 'prop',
				newValue: null,
				oldValue: undefined,
			},
		])
		results = []
		assert.strictEqual(object.prop, null)

		unsubscribe[0]()
		assert.strictEqual(builder.updatable('prop', {update: v => v, factory: () => '1'}, '2'), builder)
		assert.strictEqual(typeof (unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function')
		assertEvents(results, [])
		assert.deepStrictEqual(hasSubscribers, [false, true])
		hasSubscribers = []

		object.prop = '3'
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [])
		results = []
		assert.strictEqual(object.prop, '3')

		assert.strictEqual(builder.updatable('prop', {update: v => v}, '3'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [])
		assert.strictEqual(object.prop, '3')

		assert.strictEqual(builder.updatable('prop', {update: v => v, factory: () => 3}), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [
			{
				name    : 'prop',
				newValue: 3,
				oldValue: '3',
			},
		])
		results = []
		assert.strictEqual(object.prop, 3)

		object.prop = '2'
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [
			{
				name    : 'prop',
				newValue: '2',
				oldValue: 3,
			},
		])
		results = []
		assert.strictEqual(object.prop, '2')

		object.prop = '2'
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [])
		assert.strictEqual(object.prop, '2')

		object.prop = 2
		assert.deepStrictEqual(hasSubscribers, [])
		assertEvents(results, [
			{
				name    : 'prop',
				newValue: 2,
				oldValue: '2',
			},
		])
		results = []
		assert.strictEqual(object.prop, 2)
	})
})
