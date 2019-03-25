import {ObservableObject, ObservableObjectBuilder} from '../../../../../main/common/rx/ObservableObject'

describe('common > main > rx > ObservableObjectBuilder', function () {
	it('enumerate properties', function () {
		const {object} = new ObservableObjectBuilder()
			.writable('writable')
			.readable('readable', '1')

		assert.deepStrictEqual(Object.keys(object), ['writable', 'readable'])

		for (const key in object) {
			assert.ok(key === 'writable' || key === 'readable')
		}

		const {propertyChanged} = object
		assert.ok(object.propertyChanged)

		assert.throws(() => (object.propertyChanged = '1'), TypeError)

		Object.defineProperty(object, 'propertyChanged', {
			value: '2'
		})

		assert.strictEqual(object.propertyChanged, '2')
	})

	it('propertyChanged property', function () {
		const {object} = new ObservableObjectBuilder()
		const {propertyChanged} = object
		assert.ok(object.propertyChanged)

		assert.throws(() => (object.propertyChanged = '1'), TypeError)

		Object.defineProperty(object, 'propertyChanged', {
			value: '2'
		})

		assert.strictEqual(object.propertyChanged, '2')
	})

	it('readable simple', function () {
		const {object} = new ObservableObjectBuilder()
		assert.ok(object instanceof ObservableObject)

		const builder = new ObservableObjectBuilder(object)
		assert.strictEqual(builder.object, object)

		assert.strictEqual(builder.readable('prop'), builder)
		assert.strictEqual(builder.object['prop'], undefined)

		assert.strictEqual(builder.readable('prop', '1'), builder)
		assert.strictEqual(builder.object['prop'], '1')

		assert.strictEqual(builder.readable('prop'), builder)
		assert.strictEqual(builder.object['prop'], '1')

		assert.strictEqual(builder.readable('prop', undefined), builder)
		assert.strictEqual(builder.object['prop'], '1')

		assert.strictEqual(builder.readable('prop', null), builder)
		assert.strictEqual(builder.object['prop'], null)

		assert.throws(() => (builder.object['prop'] = '2'), TypeError)
		assert.strictEqual(builder.object['prop'], null)

		assert.strictEqual(builder.object, object)
	})

	it('writable simple', function () {
		const {object} = new ObservableObjectBuilder()
		assert.ok(object instanceof ObservableObject)

		const builder = new ObservableObjectBuilder(object)
		assert.strictEqual(builder.object, object)

		assert.strictEqual(builder.writable('prop'), builder)
		assert.strictEqual(builder.object['prop'], undefined)

		assert.strictEqual(builder.writable('prop', '1'), builder)
		assert.strictEqual(builder.object['prop'], '1')

		assert.strictEqual(builder.readable('prop'), builder)
		assert.strictEqual(builder.object['prop'], '1')

		assert.strictEqual(builder.writable('prop', undefined), builder)
		assert.strictEqual(builder.object['prop'], '1')

		assert.strictEqual(builder.writable('prop', null), builder)
		assert.strictEqual(builder.object['prop'], null)

		builder.object['prop'] = '2'
		assert.strictEqual(builder.object['prop'], '2')

		assert.strictEqual(builder.object, object)
	})

	it('readable simple changed', function () {
		const builder = new ObservableObjectBuilder()
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
		assert.strictEqual(typeof (hasSubscribersUnsubscribe[0] = object.propertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function')
		assert.deepStrictEqual(hasSubscribers, [false])
		hasSubscribers = []

		const unsubscribe = []
		assert.strictEqual(typeof (unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function')
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(hasSubscribers, [true])
		hasSubscribers = []

		assert.strictEqual(builder.readable('prop'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], undefined)

		assert.strictEqual(builder.readable('prop', undefined), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], undefined)

		assert.strictEqual(builder.readable('prop', null), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name    : 'prop',
				newValue: null,
				oldValue: undefined
			}
		])
		results = []
		assert.strictEqual(object['prop'], null)

		assert.strictEqual(builder.readable('prop', '1'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name    : 'prop',
				newValue: '1',
				oldValue: null
			}
		])
		results = []
		assert.strictEqual(object['prop'], '1')

		assert.strictEqual(builder.readable('prop', '1'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], '1')

		assert.strictEqual(builder.readable('prop', 1), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name    : 'prop',
				newValue: 1,
				oldValue: '1'
			}
		])
		results = []
		assert.strictEqual(object['prop'], 1)

		assert.throws(() => (builder.object['prop'] = '2'), TypeError)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		results = []
		assert.strictEqual(object['prop'], 1)

		assert.throws(() => (builder.object['prop'] = 2), TypeError)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		results = []
		assert.strictEqual(object['prop'], 1)
	})

	it('writable simple changed', function () {
		const builder = new ObservableObjectBuilder()
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
		assert.strictEqual(typeof (hasSubscribersUnsubscribe[0] = object.propertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function')
		assert.deepStrictEqual(hasSubscribers, [false])
		hasSubscribers = []

		const unsubscribe = []
		assert.strictEqual(typeof (unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function')
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(hasSubscribers, [true])
		hasSubscribers = []

		assert.strictEqual(builder.writable('prop'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], undefined)

		assert.strictEqual(builder.writable('prop', undefined), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], undefined)

		assert.strictEqual(builder.writable('prop', null), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name    : 'prop',
				newValue: null,
				oldValue: undefined
			}
		])
		results = []
		assert.strictEqual(object['prop'], null)

		assert.strictEqual(builder.writable('prop', '1'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name    : 'prop',
				newValue: '1',
				oldValue: null
			}
		])
		results = []
		assert.strictEqual(object['prop'], '1')

		assert.strictEqual(builder.writable('prop', '1'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], '1')

		assert.strictEqual(builder.writable('prop', 1), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name    : 'prop',
				newValue: 1,
				oldValue: '1'
			}
		])
		results = []
		assert.strictEqual(object['prop'], 1)

		object['prop'] = '2'
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name    : 'prop',
				newValue: '2',
				oldValue: 1
			}
		])
		results = []
		assert.strictEqual(object['prop'], '2')

		object['prop'] = '2'
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], '2')

		object['prop'] = 2
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name    : 'prop',
				newValue: 2,
				oldValue: '2'
			}
		])
		results = []
		assert.strictEqual(object['prop'], 2)
	})
})
