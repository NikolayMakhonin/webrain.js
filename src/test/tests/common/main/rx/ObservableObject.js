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

	it('readable nested changed', function () {
		const builder = new ObservableObjectBuilder()
		const {object} = builder

		const builderNested = new ObservableObjectBuilder()
		const {object: objectNested} = builderNested

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

		assert.strictEqual(builder.readable('prop', objectNested), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name    : 'prop',
				newValue: objectNested,
				oldValue: undefined
			}
		])
		results = []
		assert.strictEqual(object['prop'], objectNested)

		objectNested['prop'] = '1'
		assert.strictEqual(builderNested.readable('prop', '1'), builderNested)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(objectNested['prop'], '1')
		assert.strictEqual(object['prop'], objectNested)

		assert.strictEqual(builderNested.readable('prop', '2'), builderNested)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name: 'prop',
				next: {
					name    : 'prop',
					newValue: '2',
					oldValue: '1'
				}
			}
		])
		results = []
		assert.strictEqual(objectNested['prop'], '2')
		assert.strictEqual(object['prop'], objectNested)

		assert.throws(() => (object['prop'] = new ObservableObjectBuilder().object), TypeError)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])

		assert.throws(() => (objectNested['prop'] = '3'), TypeError)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])

		assert.strictEqual(builderNested.readable('prop', '4'), builderNested)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name: 'prop',
				next: {
					name    : 'prop',
					newValue: '4',
					oldValue: '2'
				}
			}
		])
		results = []

		assert.strictEqual(builder.delete('prop'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name    : 'prop',
				oldValue: {
					prop: '4',
				}
			}
		])
		results = []
		assert.strictEqual(object['prop'], undefined)

		assert.strictEqual(builder.delete('prop'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])

		assert.strictEqual(builderNested.readable('prop', '4'), builderNested)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])

		object['prop'] = objectNested
		assert.strictEqual(object['prop'], objectNested)

		assert.strictEqual(builder.readable('prop', objectNested), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], objectNested)

		delete object['prop']
		assert.strictEqual(object['prop'], undefined)

		object['prop'] = objectNested
		assert.strictEqual(object['prop'], objectNested)

		assert.strictEqual(builder.readable('prop', objectNested), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], objectNested)

		assert.strictEqual(builderNested.readable('prop', '5'), builderNested)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name: 'prop',
				next: {
					name    : 'prop',
					newValue: '5',
					oldValue: '4'
				}
			}
		])
	})

	it('writable nested changed', function () {
		const builder = new ObservableObjectBuilder()
		const {object} = builder

		const builderNested = new ObservableObjectBuilder()
		const {object: objectNested} = builderNested

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

		assert.strictEqual(builder.writable('prop', objectNested), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name    : 'prop',
				newValue: objectNested,
				oldValue: undefined
			}
		])
		results = []
		assert.strictEqual(object['prop'], objectNested)

		objectNested['prop'] = '1'
		assert.strictEqual(builderNested.writable('prop', '1'), builderNested)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(objectNested['prop'], '1')
		assert.strictEqual(object['prop'], objectNested)

		assert.strictEqual(builderNested.writable('prop', '2'), builderNested)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name: 'prop',
				next: {
					name    : 'prop',
					newValue: '2',
					oldValue: '1'
				}
			}
		])
		results = []
		assert.strictEqual(objectNested['prop'], '2')
		assert.strictEqual(object['prop'], objectNested)

		object['prop'] = new ObservableObjectBuilder().object
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name    : 'prop',
				newValue: {},
				oldValue: {
					prop: '2'
				}
			}
		])
		results = []

		objectNested['prop'] = '3'
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])

		object['prop'] = objectNested
		assert.deepStrictEqual(results, [
			{
				name    : 'prop',
				newValue: {
					prop: '3',
				},
				oldValue: {}
			}
		])
		results = []

		objectNested['prop'] = '4'
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name: 'prop',
				next: {
					name    : 'prop',
					newValue: '4',
					oldValue: '3'
				}
			}
		])
		results = []

		assert.strictEqual(builder.delete('prop'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name    : 'prop',
				oldValue: {
					prop: '4',
				}
			}
		])
		results = []
		assert.strictEqual(object['prop'], undefined)

		assert.strictEqual(builder.delete('prop'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])

		objectNested['prop'] = '4'
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])

		object['prop'] = objectNested
		assert.strictEqual(object['prop'], objectNested)

		assert.strictEqual(builder.writable('prop', objectNested), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], objectNested)

		delete object['prop']
		assert.strictEqual(object['prop'], undefined)

		object['prop'] = objectNested
		assert.strictEqual(object['prop'], objectNested)

		assert.strictEqual(builder.writable('prop', objectNested), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], objectNested)

		objectNested['prop'] = '5'
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [
			{
				name: 'prop',
				next: {
					name    : 'prop',
					newValue: '5',
					oldValue: '4'
				}
			}
		])
	})
})
