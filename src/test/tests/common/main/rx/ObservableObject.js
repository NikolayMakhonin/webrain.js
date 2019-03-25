import {ObservableObject, ObservableObjectBuilder} from '../../../../../main/common/rx/ObservableObject'

describe('common > main > rx > ObservableObjectBuilder', function () {
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

	it('writable simple changed', function () {
		const builder = new ObservableObjectBuilder()
		const {object} = builder

		let hasSubscribers = []
		const hasSubscribersSubscriber = value => {
			hasSubscribers.push(value)
		}

		const results = []
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
		assert.deepStrictEqual(results, [null])
		assert.strictEqual(object['prop'], null)

		assert.strictEqual(builder.writable('prop', '1'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, ['1'])
		assert.strictEqual(object['prop'], '1')

		object['prop'] = '2'
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, ['2'])
		assert.strictEqual(object['prop'], '2')

	})
})
