/* eslint-disable guard-for-in */
import {ObservableObject} from '../../../../../../main/common/rx/object/ObservableObject'
import {ObservableObjectBuilder} from '../../../../../../main/common/rx/object/ObservableObjectBuilder'

describe('common > main > rx > observable-object-builder', function () {
	it('enumerate properties', function () {
		const {object} = new ObservableObjectBuilder()
			.writable('writable')
			.readable('readable', null, '1')

		assert.deepStrictEqual(Object.keys(object), ['writable', 'readable'])

		for (const key in object) {
			assert.ok(key === 'writable' || key === 'readable', `key = ${key}`)
		}

		const {deepPropertyChanged} = object
		assert.ok(object.deepPropertyChanged)

		assert.throws(() => (object.deepPropertyChanged = '1'), TypeError)

		Object.defineProperty(object, 'deepPropertyChanged', {
			value: '2'
		})

		assert.strictEqual(object.deepPropertyChanged, '2')
	})

	it('deepPropertyChanged property', function () {
		const {object} = new ObservableObjectBuilder()
		assert.ok(object.deepPropertyChanged)

		assert.throws(() => (object.deepPropertyChanged = '1'), TypeError)

		Object.defineProperty(object, 'deepPropertyChanged', {
			value: '2'
		})

		assert.strictEqual(object.deepPropertyChanged, '2')
	})

	it('onDeepPropertyChanged property', function () {
		const {object} = new ObservableObjectBuilder()
		assert.ok(object.onDeepPropertyChanged)

		object.onDeepPropertyChanged = '2'

		assert.strictEqual(object.onDeepPropertyChanged, '2')
	})

	it('onDeepPropertyChanged', function () {
		const {object} = new ObservableObjectBuilder()

		let results = []
		const subscriber = value => {
			results.push(value)
		}

		let resultsDeep = []
		const subscriberDeep = value => {
			resultsDeep.push(value)
		}

		assert.strictEqual(object.onDeepPropertyChanged(), object)
		assert.strictEqual(object.onDeepPropertyChanged([]), object)
		assert.strictEqual(object.onDeepPropertyChanged(['prop']), object)

		const unsubscribe = []
		assert.strictEqual(typeof (unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function')
		assert.strictEqual(typeof (unsubscribe[1] = object.deepPropertyChanged.subscribe(subscriberDeep)), 'function')
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [])

		assert.strictEqual(object.onDeepPropertyChanged(), object)
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [{}])
		resultsDeep = []

		assert.strictEqual(object.onDeepPropertyChanged([]), object)
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [])

		assert.strictEqual(object.onDeepPropertyChanged(null), object)
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [])

		assert.strictEqual(object.onDeepPropertyChanged([null]), object)
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [])

		assert.strictEqual(object.onDeepPropertyChanged(''), object)
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [
			{
				name    : '',
				newValue: undefined,
				oldValue: undefined
			}
		])
		resultsDeep = []

		assert.strictEqual(object.onDeepPropertyChanged('', '', ['', '', ['']]), object)
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [
			{
				name    : '',
				newValue: undefined,
				oldValue: undefined
			}
		])
		resultsDeep = []

		object[4] = null
		object[1] = 11
		object['z'] = 'zz'

		assert.strictEqual(object.onDeepPropertyChanged([[2, 'z', ['a', '1', [4]]]]), object)
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [
			{
				name    : 2,
				newValue: undefined,
				oldValue: undefined
			},
			{
				name    : 'z',
				newValue: 'zz',
				oldValue: 'zz'
			},
			{
				name    : 'a',
				newValue: undefined,
				oldValue: undefined
			},
			{
				name    : '1',
				newValue: 11,
				oldValue: 11
			},
			{
				name    : 4,
				newValue: null,
				oldValue: null
			}
		])
		resultsDeep = []
	})

	it('propertyChanged property', function () {
		const {object} = new ObservableObjectBuilder()
		assert.ok(object.propertyChanged)

		assert.throws(() => (object.propertyChanged = '1'), TypeError)

		Object.defineProperty(object, 'propertyChanged', {
			value: '2'
		})

		assert.strictEqual(object.propertyChanged, '2')
	})

	it('onPropertyChanged property', function () {
		const {object} = new ObservableObjectBuilder()
		assert.ok(object.onPropertyChanged)

		object.onPropertyChanged = '2'

		assert.strictEqual(object.onPropertyChanged, '2')
	})

	it('onPropertyChanged', function () {
		const {object} = new ObservableObjectBuilder()

		let results = []
		const subscriber = value => {
			results.push(value)
		}

		let resultsDeep = []
		const subscriberDeep = value => {
			resultsDeep.push(value)
		}

		assert.strictEqual(object.onPropertyChanged(), object)
		assert.strictEqual(object.onPropertyChanged([]), object)
		assert.strictEqual(object.onPropertyChanged(['prop']), object)

		const unsubscribe = []
		assert.strictEqual(typeof (unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function')
		assert.strictEqual(typeof (unsubscribe[1] = object.deepPropertyChanged.subscribe(subscriberDeep)), 'function')
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [])

		assert.strictEqual(object.onPropertyChanged(), object)
		assert.deepStrictEqual(resultsDeep, [{}])
		assert.deepStrictEqual(results, resultsDeep)
		results = []
		resultsDeep = []

		assert.strictEqual(object.onPropertyChanged([]), object)
		assert.deepStrictEqual(resultsDeep, [])
		assert.deepStrictEqual(results, resultsDeep)

		assert.strictEqual(object.onPropertyChanged(null), object)
		assert.deepStrictEqual(resultsDeep, [])
		assert.deepStrictEqual(results, resultsDeep)

		assert.strictEqual(object.onPropertyChanged([null]), object)
		assert.deepStrictEqual(resultsDeep, [])
		assert.deepStrictEqual(results, resultsDeep)

		assert.strictEqual(object.onPropertyChanged(''), object)
		assert.deepStrictEqual(resultsDeep, [
			{
				name    : '',
				newValue: undefined,
				oldValue: undefined
			}
		])
		assert.deepStrictEqual(results, resultsDeep)
		results = []
		resultsDeep = []

		assert.strictEqual(object.onPropertyChanged('', '', ['', '', ['']]), object)
		assert.deepStrictEqual(resultsDeep, [
			{
				name    : '',
				newValue: undefined,
				oldValue: undefined
			}
		])
		assert.deepStrictEqual(results, resultsDeep)
		results = []
		resultsDeep = []

		object[4] = null
		object[1] = 11
		object['z'] = 'zz'

		assert.strictEqual(object.onPropertyChanged([[2, 'z', ['a', '1', [4]]]]), object)
		assert.deepStrictEqual(resultsDeep, [
			{
				name    : 2,
				newValue: undefined,
				oldValue: undefined
			},
			{
				name    : 'z',
				newValue: 'zz',
				oldValue: 'zz'
			},
			{
				name    : 'a',
				newValue: undefined,
				oldValue: undefined
			},
			{
				name    : '1',
				newValue: 11,
				oldValue: 11
			},
			{
				name    : 4,
				newValue: null,
				oldValue: null
			}
		])
		assert.deepStrictEqual(results, resultsDeep)
		results = []
		resultsDeep = []
	})

	it('readable simple', function () {
		const {object} = new ObservableObjectBuilder()
		assert.ok(object instanceof ObservableObject)

		const builder = new ObservableObjectBuilder(object)
		assert.strictEqual(builder.object, object)

		assert.strictEqual(builder.readable('prop'), builder)
		assert.strictEqual(builder.object['prop'], undefined)

		assert.strictEqual(builder.readable('prop', null, '1'), builder)
		assert.strictEqual(builder.object['prop'], '1')

		assert.strictEqual(builder.readable('prop'), builder)
		assert.strictEqual(builder.object['prop'], '1')

		assert.strictEqual(builder.readable('prop', null, undefined), builder)
		assert.strictEqual(builder.object['prop'], '1')

		assert.strictEqual(builder.readable('prop', null, null), builder)
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

		assert.strictEqual(builder.writable('prop', null, '1'), builder)
		assert.strictEqual(builder.object['prop'], '1')

		assert.strictEqual(builder.readable('prop'), builder)
		assert.strictEqual(builder.object['prop'], '1')

		assert.strictEqual(builder.writable('prop', null, undefined), builder)
		assert.strictEqual(builder.object['prop'], '1')

		assert.strictEqual(builder.writable('prop', null, null), builder)
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
		assert.strictEqual(typeof (hasSubscribersUnsubscribe[0] = object.deepPropertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function')
		assert.deepStrictEqual(hasSubscribers, [false])
		hasSubscribers = []

		const unsubscribe = []
		assert.strictEqual(typeof (unsubscribe[0] = object.deepPropertyChanged.subscribe(subscriber)), 'function')
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(hasSubscribers, [true])
		hasSubscribers = []

		assert.strictEqual(builder.readable('prop'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], undefined)

		assert.strictEqual(builder.readable('prop', null, undefined), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], undefined)

		assert.strictEqual(builder.readable('prop', null, null), builder)
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

		assert.strictEqual(builder.readable('prop', null, '1'), builder)
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

		assert.strictEqual(builder.readable('prop', null, '1'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], '1')

		assert.strictEqual(builder.readable('prop', null, 1), builder)
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
		assert.strictEqual(typeof (hasSubscribersUnsubscribe[0] = object.deepPropertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function')
		assert.deepStrictEqual(hasSubscribers, [false])
		hasSubscribers = []

		const unsubscribe = []
		assert.strictEqual(typeof (unsubscribe[0] = object.deepPropertyChanged.subscribe(subscriber)), 'function')
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(hasSubscribers, [true])
		hasSubscribers = []

		assert.strictEqual(builder.writable('prop'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], undefined)

		assert.strictEqual(builder.writable('prop', null, undefined), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], undefined)

		assert.strictEqual(builder.writable('prop', null, null), builder)
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

		assert.strictEqual(builder.writable('prop', null, '1'), builder)
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

		assert.strictEqual(builder.writable('prop', null, '1'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], '1')

		assert.strictEqual(builder.writable('prop', null, 1), builder)
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
		assert.strictEqual(typeof (hasSubscribersUnsubscribe[0] = object.deepPropertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function')
		assert.deepStrictEqual(hasSubscribers, [false])
		hasSubscribers = []

		const unsubscribe = []
		assert.strictEqual(typeof (unsubscribe[0] = object.deepPropertyChanged.subscribe(subscriber)), 'function')
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(hasSubscribers, [true])
		hasSubscribers = []

		assert.strictEqual(builder.readable('prop', null, objectNested), builder)
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
		assert.strictEqual(builderNested.readable('prop', null, '1'), builderNested)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(objectNested['prop'], '1')
		assert.strictEqual(object['prop'], objectNested)

		assert.strictEqual(builderNested.readable('prop', null, '2'), builderNested)
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

		assert.strictEqual(builderNested.readable('prop', null, '4'), builderNested)
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

		assert.strictEqual(builderNested.readable('prop', null, '4'), builderNested)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])

		object['prop'] = objectNested
		assert.strictEqual(object['prop'], objectNested)

		assert.strictEqual(builder.readable('prop', null, objectNested), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], objectNested)

		delete object['prop']
		assert.strictEqual(object['prop'], undefined)

		object['prop'] = objectNested
		assert.strictEqual(object['prop'], objectNested)

		assert.strictEqual(builder.readable('prop', null, objectNested), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.strictEqual(object['prop'], objectNested)

		assert.strictEqual(builderNested.readable('prop', null, '5'), builderNested)
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

		let resultsDeep = []
		const subscriberDeep = value => {
			resultsDeep.push(value)
		}

		const hasSubscribersUnsubscribe = []
		assert.strictEqual(typeof (hasSubscribersUnsubscribe[0] = object.deepPropertyChanged.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function')
		assert.deepStrictEqual(hasSubscribers, [false])
		hasSubscribers = []

		const unsubscribe = []
		assert.strictEqual(typeof (unsubscribe[0] = object.propertyChanged.subscribe(subscriber)), 'function')
		assert.strictEqual(typeof (unsubscribe[1] = object.deepPropertyChanged.subscribe(subscriberDeep)), 'function')
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [])
		assert.deepStrictEqual(hasSubscribers, [true])
		hasSubscribers = []

		assert.strictEqual(builder.writable('prop', null, objectNested), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(resultsDeep, [
			{
				name    : 'prop',
				newValue: objectNested,
				oldValue: undefined
			}
		])
		assert.deepStrictEqual(results, resultsDeep)
		results = []
		resultsDeep = []
		assert.strictEqual(object['prop'], objectNested)

		objectNested['prop'] = '1'
		assert.strictEqual(builderNested.writable('prop', null, '1'), builderNested)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [])
		assert.strictEqual(objectNested['prop'], '1')
		assert.strictEqual(object['prop'], objectNested)

		assert.strictEqual(builderNested.writable('prop', null, '2'), builderNested)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(resultsDeep, [
			{
				name: 'prop',
				next: {
					name    : 'prop',
					newValue: '2',
					oldValue: '1'
				}
			}
		])
		assert.deepStrictEqual(results, [])
		resultsDeep = []
		assert.strictEqual(objectNested['prop'], '2')
		assert.strictEqual(object['prop'], objectNested)

		object['prop'] = new ObservableObjectBuilder().object
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(resultsDeep, [
			{
				name    : 'prop',
				newValue: {},
				oldValue: {
					prop: '2'
				}
			}
		])
		assert.deepStrictEqual(results, resultsDeep)
		results = []
		resultsDeep = []

		objectNested['prop'] = '3'
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [])

		object['prop'] = objectNested
		assert.deepStrictEqual(resultsDeep, [
			{
				name    : 'prop',
				newValue: {
					prop: '3',
				},
				oldValue: {}
			}
		])
		assert.deepStrictEqual(results, resultsDeep)
		results = []
		resultsDeep = []

		objectNested['prop'] = '4'
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(resultsDeep, [
			{
				name: 'prop',
				next: {
					name    : 'prop',
					newValue: '4',
					oldValue: '3'
				}
			}
		])
		assert.deepStrictEqual(results, [])
		resultsDeep = []

		assert.strictEqual(builder.delete('prop'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(resultsDeep, [
			{
				name    : 'prop',
				oldValue: {
					prop: '4',
				}
			}
		])
		assert.deepStrictEqual(results, resultsDeep)
		results = []
		resultsDeep = []
		assert.strictEqual(object['prop'], undefined)

		assert.strictEqual(builder.delete('prop'), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [])

		objectNested['prop'] = '4'
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [])

		object['prop'] = objectNested
		assert.strictEqual(object['prop'], objectNested)

		assert.strictEqual(builder.writable('prop', null, objectNested), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [])
		assert.strictEqual(object['prop'], objectNested)

		delete object['prop']
		assert.strictEqual(object['prop'], undefined)

		object['prop'] = objectNested
		assert.strictEqual(object['prop'], objectNested)

		assert.strictEqual(builder.writable('prop', null, objectNested), builder)
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(results, [])
		assert.deepStrictEqual(resultsDeep, [])
		assert.strictEqual(object['prop'], objectNested)

		objectNested['prop'] = '5'
		assert.deepStrictEqual(hasSubscribers, [])
		assert.deepStrictEqual(resultsDeep, [
			{
				name: 'prop',
				next: {
					name    : 'prop',
					newValue: '5',
					oldValue: '4'
				}
			}
		])
		assert.deepStrictEqual(results, [])
		resultsDeep = []
	})
})
