/* tslint:disable:no-shadowed-variable no-duplicate-string */
/* eslint-disable no-useless-escape,computed-property-spacing */
import {ObjectMap} from '../../../../../../main/common/lists/ObjectMap'
import {ObjectSet} from '../../../../../../main/common/lists/ObjectSet'
import {ObservableMap} from '../../../../../../main/common/lists/ObservableMap'
import {ObservableSet} from '../../../../../../main/common/lists/ObservableSet'
import {SortedList} from '../../../../../../main/common/lists/SortedList'
import {ANY, ANY_DISPLAY, COLLECTION_PREFIX} from '../../../../../../main/common/rx/deep-subscribe/contracts/constants'
import {
	IRuleSubscribe,
	ISubscribeObject,
} from '../../../../../../main/common/rx/deep-subscribe/contracts/rule-subscribe'
import {IRule, RuleType} from '../../../../../../main/common/rx/deep-subscribe/contracts/rules'
import {RuleBuilder} from '../../../../../../main/common/rx/deep-subscribe/RuleBuilder'
import {ObservableObjectBuilder} from '../../../../../../main/common/rx/object/ObservableObjectBuilder'
import {assert, AssertionError} from '../../../../../../main/common/test/Assert'

describe('common > main > rx > deep-subscribe > RuleBuilder', function() {
	interface IObject {
		prop1: {
			"prop '2'": {
				prop3: string,
				prop4: {
					prop5: string,
				},
				prop4_1: {
					prop5: string,
				},
				prop4_2: {
					prop5: string,
				},
			},
		},
		prop2: number,
	}

	// noinspection JSUnusedLocalSymbols
	function checkType<T>(builder: RuleBuilder<T>) {
		return true
	}

	it('constructor', function() {
		const builder = new RuleBuilder()

		assert.strictEqual(builder.result, undefined)
	})

	const nonSubscribeProperty = Math.random().toString(36)

	function testSubscribe<TObject>(
		isCollection: boolean,
		isMap: boolean,
		nonObservableObject: TObject,
		observableObject: TObject,
		subscribe: ISubscribeObject<TObject, string>,
		properties: string[],
		subscribeProperties: string[],
		add: (object, property) => void,
		change: (object, property) => void,
		remove: (object, property, isNonSubscribe) => void,
	) {
		const nonSubscribeProperties = properties.slice()
		for (const property of subscribeProperties) {
			let index
			// tslint:disable-next-line:no-conditional-assignment
			while ((index = nonSubscribeProperties.indexOf(property)) >= 0) {
				nonSubscribeProperties.splice(index, 1)
			}
		}

		function checkDebugPropertyName(value: string, debugPropertyName: string) {
			assert.ok(debugPropertyName)
			assert.ok(debugPropertyName.length)

			if (isCollection) {
				assert.strictEqual(debugPropertyName[0], COLLECTION_PREFIX)
				debugPropertyName = debugPropertyName.substring(1)
			}

			if (isMap) {
				assert.strictEqual('value_' + debugPropertyName, value)
			}
		}

		let subscribedItems = []

		function subscribeItem(value: string, debugPropertyName: string) {
			assert.ok(value)
			assert.strictEqual(typeof value, 'string', value)
			value = value.trim()
			checkDebugPropertyName(value, debugPropertyName)
			subscribedItems.push('+' + value)
		}

		// tslint:disable-next-line:no-identical-functions
		function unsubscribeItem(value: string, debugPropertyName: string) {
			assert.ok(value)
			value = value.trim()
			checkDebugPropertyName(value, debugPropertyName)
			subscribedItems.push('-' + value)
		}

		function testNonSubscribeProperties(object) {
			for (const property of nonSubscribeProperties) {
				add(object, property)
				assert.deepStrictEqual(subscribedItems, [])

				if (change) {
					change(object, property)
					assert.deepStrictEqual(subscribedItems, [])
				}

				remove(object, property, true)
				assert.deepStrictEqual(subscribedItems, [])

				if (property === nonSubscribeProperty) {
					add(object, nonSubscribeProperty)
					assert.deepStrictEqual(subscribedItems, [])
				}

				// if (object === observableObject) {
				// 	assert.deepStrictEqual(subscribedItems, ['+undefined'])
				// 	subscribedItems = []
				// }
			}
		}

		let lastError

		for (let debugIteration = 0; debugIteration < 2; debugIteration++) {
			try {
				// region Non Observable

				if (nonObservableObject) {
					let unsubscribe = subscribe(nonObservableObject, false, subscribeItem, unsubscribeItem)
					assert.strictEqual(unsubscribe, null)
					testNonSubscribeProperties(nonObservableObject)

					unsubscribe = subscribe(nonObservableObject, true, subscribeItem, unsubscribeItem)
					assert.ok(unsubscribe)
					assert.strictEqual(typeof unsubscribe, 'function')
					assert.deepStrictEqual(subscribedItems, [])
					subscribedItems = []
					testNonSubscribeProperties(nonObservableObject)
					for (const property of subscribeProperties) {
						add(nonObservableObject, property)
						assert.deepStrictEqual(subscribedItems, [])

						if (change) {
							change(nonObservableObject, property)
							assert.deepStrictEqual(subscribedItems, [])
						}
					}
					testNonSubscribeProperties(nonObservableObject)
					unsubscribe()
					assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '-value_' + o).sort())
					subscribedItems = []

					unsubscribe = subscribe(nonObservableObject, true, subscribeItem, unsubscribeItem)
					assert.ok(unsubscribe)
					assert.strictEqual(typeof unsubscribe, 'function')
					assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '+value_' + o).sort())
					subscribedItems = []
					testNonSubscribeProperties(nonObservableObject)
					for (const property of subscribeProperties) {
						remove(nonObservableObject, property, false)
						assert.deepStrictEqual(subscribedItems, [])
					}
					testNonSubscribeProperties(nonObservableObject)
					unsubscribe()
					assert.deepStrictEqual(subscribedItems, [])
					subscribedItems = []

					unsubscribe = subscribe(nonObservableObject, false, subscribeItem, unsubscribeItem)
					assert.strictEqual(unsubscribe, null)
					assert.deepStrictEqual(subscribedItems, [])
				}

				// endregion

				// region Observable

				if (observableObject) {
					let unsubscribe = subscribe(observableObject, false, subscribeItem, unsubscribeItem)
					assert.ok(unsubscribe)
					assert.strictEqual(typeof unsubscribe, 'function')
					testNonSubscribeProperties(observableObject)
					unsubscribe()
					assert.deepStrictEqual(subscribedItems, [])
					subscribedItems = []

					unsubscribe = subscribe(observableObject, true, subscribeItem, unsubscribeItem)
					assert.ok(unsubscribe)
					assert.strictEqual(typeof unsubscribe, 'function')
					assert.deepStrictEqual(subscribedItems, [])
					subscribedItems = []
					testNonSubscribeProperties(observableObject)
					for (const property of subscribeProperties) {
						add(observableObject, property)
						assert.deepStrictEqual(subscribedItems, [
							// '-undefined',
							'+value_' + property,
						])
						subscribedItems = []

						if (change) {
							change(observableObject, property)
							assert.deepStrictEqual(subscribedItems, [
								'-value_' + property,
								'+value_' + property,
							])
							subscribedItems = []
						}
					}
					testNonSubscribeProperties(observableObject)
					unsubscribe()
					assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '-value_' + o).sort())
					subscribedItems = []

					unsubscribe = subscribe(observableObject, false, subscribeItem, unsubscribeItem)
					assert.ok(unsubscribe)
					assert.strictEqual(typeof unsubscribe, 'function')
					unsubscribe()
					assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '-value_' + o).sort())
					subscribedItems = []

					unsubscribe = subscribe(observableObject, true, subscribeItem, unsubscribeItem)
					assert.ok(unsubscribe)
					assert.strictEqual(typeof unsubscribe, 'function')
					assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '+value_' + o).sort())
					subscribedItems = []
					testNonSubscribeProperties(observableObject)
					for (const property of subscribeProperties) {
						remove(observableObject, property, false)
						assert.deepStrictEqual(subscribedItems, [
							'-value_' + property,
							// '+undefined',
						])
						subscribedItems = []
					}
					testNonSubscribeProperties(observableObject)
					unsubscribe()
					assert.deepStrictEqual(subscribedItems, [])
					subscribedItems = []
				}

				// endregion
			} catch (ex) {
				if (!lastError) {
					console.log(ex)
					lastError = ex
				}
			}
		}

		if (lastError) {
			throw lastError
		}
	}

	function testObject(properties: string | string[], subscribe: ISubscribeObject<any, string>) {
		const builder = new ObservableObjectBuilder()

		if (properties !== ANY) {
			builder.writable(nonSubscribeProperty, null, 'value_' + nonSubscribeProperty)
		}

		function add(object, property) {
			if (object.propertyChanged) {
				new ObservableObjectBuilder(object)
					.writable(property, null, 'value_' + property)
			} else {
				change(object, property)
			}
		}

		function change(object, property) {
			object[property] = object[property]
				? object[property] + ' '
				: 'value_' + property
		}

		function remove(object, property, isNonSubscribe) {
			if (object.propertyChanged) {
				new ObservableObjectBuilder(object)
					.delete(property)
			} else {
				delete object[property]
			}
		}

		testSubscribe(
			false, true,
			{...builder.object},
			builder.object,
			subscribe,
			[nonSubscribeProperty, ...(properties === ANY ? [] : properties)],
			properties === ANY
				? [nonSubscribeProperty, 'p1', 'p2', 'p3']
				: properties as string[],
			add,
			change,
			remove,
		)

		builder
			.writable('p1', null, 'value_p1')
			.writable('p2', null, 'value_p2')
			.writable('p3', null, 'value_p3')

		testSubscribe(
			false, true,
			Object.create({...builder.object}),
			Object.create(builder.object),
			subscribe,
			[nonSubscribeProperty, ...(properties === ANY ? [] : properties)],
			[],
			(object, property) => {
				Object.defineProperty(object, property, {
					configurable: true,
					writable: true,
					value: 'value_' + property,
				})
			},
			change,
			(object, property) => {
				delete object[property]
			},
		)
	}

	function testArray(properties: string | string[], subscribe: ISubscribeObject<any, string>) {
		if (properties === ANY || properties.indexOf('length') >= 0) {
			return
		}

		const object = []
		object[nonSubscribeProperty] = 'value_' + nonSubscribeProperty

		// tslint:disable-next-line:no-identical-functions
		function change(object, property) {
			object[property] = object[property]
				? object[property] + ' '
				: 'value_' + property
		}

		function remove(object, property) {
			delete object[property]
		}

		testSubscribe(
			false, true,
			object,
			null,
			subscribe,
			[nonSubscribeProperty, ...(properties === ANY ? [] : properties)],
			properties === ANY
				? [nonSubscribeProperty]
				: properties as string[],
			change,
			change,
			remove,
		)
	}

	function testMap(properties: string | string[], subscribe: ISubscribeObject<any, string>) {
		const map = new ObjectMap<string>()
		const observableMap = new ObservableMap(new ObjectMap<string>())

		if (properties !== ANY) {
			map.set(nonSubscribeProperty, 'value_' + nonSubscribeProperty)
			observableMap.set(nonSubscribeProperty, 'value_' + nonSubscribeProperty)
		}

		function change(object, property) {
			object.set(property, object.get(property)
				? object.get(property) + ' '
				: 'value_' + property)
		}

		function remove(object, property) {
			object.delete(property)
		}

		testSubscribe(
			true, true,
			map,
			observableMap,
			subscribe,
			[nonSubscribeProperty, ...(properties === ANY ? [] : properties)],
			properties === ANY
				? [nonSubscribeProperty, 'p1', 'p2', 'p3']
				: properties as string[],
			change,
			change,
			remove,
		)
	}

	function testSet(properties: string | string[], subscribe: ISubscribeObject<any, string>) {
		const set = new ObjectSet()
		const observableSet = new ObservableSet(new ObjectSet())

		function add(object, property) {
			object.add('value_' + property)
		}

		function remove(object, property) {
			object.delete('value_' + property)
		}

		testSubscribe(
			true, false,
			set,
			observableSet,
			subscribe,
			[],
			['p1', 'p2', 'p3'],
			add,
			null,
			remove,
		)
	}

	function testIterable(properties: string | string[], subscribe: ISubscribeObject<any, string>) {
		assert.strictEqual(
			subscribe({}, true, item => { assert.fail() }, item => { assert.fail() }),
			null,
		)

		const array = []

		// tslint:disable-next-line:no-identical-functions
		function add(object, property) {
			object.push('value_' + property)
		}

		function change(object, property) {
			for (let i = object.length - 1; i >= 0; i--) {
				if (object[i].trim() === 'value_' + property) {
					object[i] += ' '
					return
				}
			}
		}

		function remove(object, property) {
			for (let i = object.length - 1; i >= 0; i--) {
				if (object[i].trim() === 'value_' + property) {
					object.splice(i, 1)
					return
				}
			}
		}

		testSubscribe(
			true, false,
			array,
			null,
			subscribe,
			[],
			['p1', 'p2', 'p3'],
			add,
			change,
			remove,
		)
	}

	function testList(properties: string | string[], subscribe: ISubscribeObject<any, string>) {
		const list = new SortedList({
			autoSort: true,
			notAddIfExists: true,
		})
		// @ts-ignore
		Object.defineProperty(list, 'listChanged', {
			configurable: true,
			writable: true,
			value: null,
		})

		const observableList = new SortedList({
			autoSort: true,
			notAddIfExists: true,
		})

		// tslint:disable-next-line:no-identical-functions
		function add(object, property) {
			object.add('value_' + property)
		}

		function change(object, property) {
			for (let i = object.size - 1; i >= 0; i--) {
				if (object.get(i).trim() === 'value_' + property) {
					object.set(i, object.get(i) + ' ')
					return
				}
			}
		}

		function remove(object, property) {
			for (let i = object.size - 1; i >= 0; i--) {
				if (object.get(i).trim() === 'value_' + property) {
					object.removeAt(i)
					return
				}
			}
		}

		testSubscribe(
			true, false,
			list,
			observableList,
			subscribe,
			[],
			['p1', 'p2', 'p3'],
			add,
			change,
			remove,
		)
	}

	function assertRuleParams(rule: IRule | any, expected: any) {
		rule = {...rule}
		expected = {...expected}
		if ('unsubscribers' in rule) {
			expected.unsubscribers = rule.unsubscribers
		}

		delete rule.subscribe
		delete rule.next
		delete rule.rule
		delete rule.rules
		delete expected.objectTypes
		delete expected.properties
		delete expected.next
		delete expected.rule
		delete expected.rules

		assert.deepStrictEqual(rule, expected)
	}

	function _assertRule(rule: IRule | any, expected: any) {
		if (!expected) {
			assert.strictEqual(rule, expected)
			return
		}

		assertRuleParams(rule, expected)

		if (rule.type === RuleType.Action) {
			assert.ok(expected.objectTypes && expected.objectTypes.length)
			assert.ok(expected.properties === ANY || expected.properties.length)
			assert.ok(rule.subscribe)

			for (const objectType of expected.objectTypes) {
				switch (objectType) {
					case 'object':
						testObject(expected.properties, rule.subscribe)
						break
					case 'array':
						testArray(expected.properties, rule.subscribe)
						break
					case 'map':
						testMap(expected.properties, rule.subscribe)
						break
					case 'list':
						testList(expected.properties, rule.subscribe)
						break
					case 'iterable':
						testIterable(expected.properties, rule.subscribe)
						break
					case 'set':
						testSet(expected.properties, rule.subscribe)
						break
					default:
						assert.fail('Unknown objectType: ' + objectType)
				}
			}
		} else {
			assert.notOk(expected.objectTypes)
			assert.notOk(expected.properties)
		}

		_assertRule(rule.next, expected.next)
		_assertRule(rule.rule, expected.rule)

		if (!expected.rules) {
			assert.strictEqual(rule.rules, undefined)
		} else {
			assert.ok(rule.rules)
			assert.strictEqual(rule.rules.length, expected.rules.length)
			for (let i = 0; i < expected.rules.length; i++) {
				_assertRule(rule.rules[i], expected.rules[i])
			}
		}
	}

	function assertRule(rule: IRule | any, expected: any) {
		try {
			_assertRule(rule, expected)
		} catch (ex) {
			console.log('Actual:\n', rule, '\n')
			console.log('Expected:\n', expected, '\n')
			throw ex
		}
	}

	it('path', function() {
		const builder = new RuleBuilder<IObject>()
		assert.strictEqual(builder.result, undefined)

		const builder1 = builder.path(o => o.prop1)
		const rule1 = builder1.result
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['object', 'array'],
			properties: ['prop1'],
			description: 'prop1',
		})

		const builder3 = builder1.path(o => o["prop '2'"].prop3)
		checkType<string>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['object', 'array'],
			properties: ['prop1'],
			description: 'prop1',
			next: {
				type: RuleType.Action,
				objectTypes: ['object', 'array'],
				properties: ["prop '2'"],
				description: "prop '2'",
				next: {
					type: RuleType.Action,
					objectTypes: ['object', 'array'],
					properties: ['prop3'],
					description: 'prop3',
				},
			},
		})

		const builder4 = builder3.path(o => o.length)
		checkType<number>(builder4)
		assert.strictEqual(builder4 as any, builder)
		assert.strictEqual(builder4.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['object', 'array'],
			properties: ['prop1'],
			description: 'prop1',
			next: {
				type: RuleType.Action,
				objectTypes: ['object', 'array'],
				properties: ["prop '2'"],
				description: "prop '2'",
				next: {
					type: RuleType.Action,
					objectTypes: ['object', 'array'],
					properties: ['prop3'],
					description: 'prop3',
					next: {
						type: RuleType.Action,
						objectTypes: ['object', 'array'],
						properties: ['length'],
						description: 'length',
					},
				},
			},
		})
	})

	it('path complex', function() {
		const builder = new RuleBuilder<IObject>()
		assert.strictEqual(builder.result, undefined)

		const builder1 = builder.path(o => o['prop1|prop2']['#prop3']['#prop4||prop5']['*']['#']['#*'])
		const rule1 = builder1.result
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['object', 'array'],
			properties: ['prop1', 'prop2'],
			description: 'prop1|prop2',
			next: {
				type: RuleType.Action,
				objectTypes: ['map'],
				properties: ['prop3'],
				description: '#prop3',
				next: {
					type: RuleType.Action,
					objectTypes: ['map'],
					properties: ['prop4', '', 'prop5'],
					description: '#prop4||prop5',
					next: {
						type: RuleType.Action,
						objectTypes: ['object', 'array'],
						properties: ANY,
						description: ANY_DISPLAY,
						next: {
							type: RuleType.Action,
							objectTypes: ['map', 'set', 'list', 'iterable'],
							properties: ANY,
							description: COLLECTION_PREFIX,
							next: {
								type: RuleType.Action,
								objectTypes: ['map'],
								properties: ANY,
								description: COLLECTION_PREFIX + ANY_DISPLAY,
							},
						},
					},
				},
			},
		})
	})

	it('property', function() {
		const builder = new RuleBuilder<IObject>()
		assert.strictEqual(builder.result, undefined)

		// @ts-ignore
		assert.throws(() => builder.propertyRegexp(), Error)
		// @ts-ignore
		assert.throws(() => builder.propertyRegexp('string'), Error)
		assert.throws(() => builder.propertyRegexp(null), Error)

		// @ts-ignore
		assert.throws(() => builder.propertyPredicate('string'), Error)

		assert.strictEqual(builder.result, undefined)

		const builder1 = builder.propertyRegexp(/prop1|prop2/)
		const rule1 = builder1.result as IRuleSubscribe
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['object', 'array'],
			properties: ['prop1', 'prop2'],
			description: '/prop1|prop2/',
		})

		const builder2 = builder.propertyRegexp<string>(/prop2|prop3/)
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['object', 'array'],
			properties: ['prop1', 'prop2'],
			description: '/prop1|prop2/',
			next: {
				type: RuleType.Action,
				objectTypes: ['object', 'array'],
				properties: ['prop2', 'prop3'],
				description: '/prop2|prop3/',
			},
		})

		const builder3 = builder.propertyRegexp<boolean>(/prop3|prop4/)
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['object', 'array'],
			properties: ['prop1', 'prop2'],
			description: '/prop1|prop2/',
			next: {
				type: RuleType.Action,
				objectTypes: ['object', 'array'],
				properties: ['prop2', 'prop3'],
				description: '/prop2|prop3/',
				next: {
					type: RuleType.Action,
					objectTypes: ['object', 'array'],
					properties: ['prop3', 'prop4'],
					description: '/prop3|prop4/',
				},
			},
		})

		// noinspection JSUnusedLocalSymbols
		const rule3 = builder3.result.next.next as IRuleSubscribe
	})

	it('propertyAll', function() {
		const builder = new RuleBuilder<IObject>()
		assert.strictEqual(builder.result, undefined)

		const builder1 = builder.propertyAll()
		const rule1 = builder1.result as IRuleSubscribe
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['object', 'array'],
			properties: ANY,
			description: ANY_DISPLAY,
		})

		const builder2 = builder.propertyNames<string>(ANY)
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['object', 'array'],
			properties: ANY,
			description: ANY_DISPLAY,
			next: {
				type: RuleType.Action,
				objectTypes: ['object', 'array'],
				properties: ANY,
				description: ANY_DISPLAY,
			},
		})

		const builder3 = builder.propertyNames<boolean>('prop1', ANY, 'prop2')
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['object', 'array'],
			properties: ANY,
			description: ANY_DISPLAY,
			next: {
				type: RuleType.Action,
				objectTypes: ['object', 'array'],
				properties: ANY,
				description: ANY_DISPLAY,
				next: {
					type: RuleType.Action,
					objectTypes: ['object', 'array'],
					properties: ANY,
					description: `prop1|${ANY_DISPLAY}|prop2`,
				},
			},
		})

		// noinspection JSUnusedLocalSymbols
		const rule3 = builder3.result.next.next as IRuleSubscribe
	})

	it('propertyNames', function() {
		const builder = new RuleBuilder<IObject>()
		assert.strictEqual(builder.result, undefined)

		assert.strictEqual(builder.result, undefined)

		const builder1 = builder.propertyNames('prop1')
		const rule1 = builder1.result as IRuleSubscribe
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['object', 'array'],
			properties: ['prop1'],
			description: 'prop1',
		})

		const builder2 = builder.propertyName<string>('prop2')
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['object', 'array'],
			properties: ['prop1'],
			description: 'prop1',
			next: {
				type: RuleType.Action,
				objectTypes: ['object', 'array'],
				properties: ['prop2'],
				description: 'prop2',
			},
		})

		const builder3 = builder.propertyNames<boolean>('prop3', 'prop4', 'prop5')
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['object', 'array'],
			properties: ['prop1'],
			description: 'prop1',
			next: {
				type: RuleType.Action,
				objectTypes: ['object', 'array'],
				properties: ['prop2'],
				description: 'prop2',
				next: {
					type: RuleType.Action,
					objectTypes: ['object', 'array'],
					properties: ['prop3', 'prop4', 'prop5'],
					description: 'prop3|prop4|prop5',
				},
			},
		})

		// noinspection JSUnusedLocalSymbols
		const rule3 = builder3.result.next.next as IRuleSubscribe
	})

	it('map', function() {
		const builder = new RuleBuilder<IObject>()
		assert.strictEqual(builder.result, undefined)

		// @ts-ignore
		assert.throws(() => builder.mapRegexp(), Error)
		// @ts-ignore
		assert.throws(() => builder.mapRegexp('string'), Error)
		assert.throws(() => builder.mapRegexp(null), Error)

		// @ts-ignore
		assert.throws(() => builder.mapPredicate('string'), Error)

		assert.strictEqual(builder.result, undefined)

		const builder1 = builder.mapRegexp(/prop1|prop2/)
		const rule1 = builder1.result as IRuleSubscribe
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['map'],
			properties: ['prop1', 'prop2'],
			description: '/prop1|prop2/',
		})

		const builder2 = builder.mapRegexp<string>(/prop2|prop3/)
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['map'],
			properties: ['prop1', 'prop2'],
			description: '/prop1|prop2/',
			next: {
				type: RuleType.Action,
				objectTypes: ['map'],
				properties: ['prop2', 'prop3'],
				description: '/prop2|prop3/',
			},
		})

		const builder3 = builder.mapRegexp<boolean>(/prop3|prop4/)
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['map'],
			properties: ['prop1', 'prop2'],
			description: '/prop1|prop2/',
			next: {
				type: RuleType.Action,
				objectTypes: ['map'],
				properties: ['prop2', 'prop3'],
				description: '/prop2|prop3/',
				next: {
					type: RuleType.Action,
					objectTypes: ['map'],
					properties: ['prop3', 'prop4'],
					description: '/prop3|prop4/',
				},
			},
		})

		// noinspection JSUnusedLocalSymbols
		const rule3 = builder3.result.next.next as IRuleSubscribe
	})

	it('mapAll', function() {
		const builder = new RuleBuilder<IObject>()
		assert.strictEqual(builder.result, undefined)

		const builder1 = builder.mapAll()
		const rule1 = builder1.result as IRuleSubscribe
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['map'],
			properties: ANY,
			description: COLLECTION_PREFIX,
		})

		const builder2 = builder.mapKeys<string, string>()
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['map'],
			properties: ANY,
			description: COLLECTION_PREFIX,
			next: {
				type: RuleType.Action,
				objectTypes: ['map'],
				properties: ANY,
				description: COLLECTION_PREFIX,
			},
		})

		const builder3 = builder.mapKeys<string, boolean>('prop1', ANY, 'prop2')
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['map'],
			properties: ANY,
			description: COLLECTION_PREFIX,
			next: {
				type: RuleType.Action,
				objectTypes: ['map'],
				properties: ANY,
				description: COLLECTION_PREFIX,
				next: {
					type: RuleType.Action,
					objectTypes: ['map'],
					properties: ANY,
					description: `${COLLECTION_PREFIX}prop1|${ANY_DISPLAY}|prop2`,
				},
			},
		})

		const builder4 = builder.mapKeys<string, boolean[]>(ANY)
		checkType<boolean[]>(builder4)
		assert.strictEqual(builder4 as any, builder)
		assert.strictEqual(builder4.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['map'],
			properties: ANY,
			description: COLLECTION_PREFIX,
			next: {
				type: RuleType.Action,
				objectTypes: ['map'],
				properties: ANY,
				description: COLLECTION_PREFIX,
				next: {
					type: RuleType.Action,
					objectTypes: ['map'],
					properties: ANY,
					description: `${COLLECTION_PREFIX}prop1|${ANY_DISPLAY}|prop2`,
					next: {
						type: RuleType.Action,
						objectTypes: ['map'],
						properties: ANY,
						description: COLLECTION_PREFIX + ANY_DISPLAY,
					},
				},
			},
		})
	})

	it('mapKeys', function() {
		const builder = new RuleBuilder<IObject>()
		assert.strictEqual(builder.result, undefined)

		assert.strictEqual(builder.result, undefined)

		const builder1 = builder.mapKeys('prop1')
		const rule1 = builder1.result as IRuleSubscribe
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['map'],
			properties: ['prop1'],
			description: COLLECTION_PREFIX + 'prop1',
		})

		const builder2 = builder.mapKey<string, string>('prop2')
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['map'],
			properties: ['prop1'],
			description: COLLECTION_PREFIX + 'prop1',
			next: {
				type: RuleType.Action,
				objectTypes: ['map'],
				properties: ['prop2'],
				description: COLLECTION_PREFIX + 'prop2',
			},
		})

		const builder3 = builder.mapKeys<string, boolean>('prop3', 'prop4', 'prop5')
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['map'],
			properties: ['prop1'],
			description: COLLECTION_PREFIX + 'prop1',
			next: {
				type: RuleType.Action,
				objectTypes: ['map'],
				properties: ['prop2'],
				description: COLLECTION_PREFIX + 'prop2',
				next: {
					type: RuleType.Action,
					objectTypes: ['map'],
					properties: ['prop3', 'prop4', 'prop5'],
					description: COLLECTION_PREFIX + 'prop3|prop4|prop5',
				},
			},
		})

		// noinspection JSUnusedLocalSymbols
		const rule3 = builder3.result.next.next as IRuleSubscribe
	})

	it('collection', function() {
		const builder = new RuleBuilder<IObject>()
		assert.strictEqual(builder.result, undefined)

		const builder1 = builder.collection()
		const rule1 = builder1.result as IRuleSubscribe
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['set'],
			properties: ANY,
			description: COLLECTION_PREFIX,
		})

		const builder2 = builder.collection<string>()
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['map', 'set', 'list', 'iterable'],
			properties: ANY,
			description: COLLECTION_PREFIX,
			next: {
				type: RuleType.Action,
				objectTypes: ['set'],
				properties: ANY,
				description: COLLECTION_PREFIX,
			},
		})

		const builder3 = builder.collection<boolean>()
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result, rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			objectTypes: ['set'],
			properties: ANY,
			description: COLLECTION_PREFIX,
			next: {
				type: RuleType.Action,
				objectTypes: ['set'],
				properties: ANY,
				description: COLLECTION_PREFIX,
				next: {
					type: RuleType.Action,
					objectTypes: ['set'],
					properties: ANY,
					description: COLLECTION_PREFIX,
				},
			},
		})

		// noinspection JSUnusedLocalSymbols
		const rule3 = builder3.result.next.next as IRuleSubscribe
	})

	it('repeat', function() {
		const builder = new RuleBuilder<IObject>()
		assert.strictEqual(builder.result, undefined)

		assert.throws(() => builder.repeat(1, 1, b => null), [Error, TypeError, ReferenceError])
		assert.throws(() => builder.repeat(1, 1, b => ({rule: null} as any)), [Error, TypeError, ReferenceError])

		const builder1 = builder
			.repeat(
				null, null,
				b => b
					.repeat(1, null, b => b.path(o => o.prop1))
					.repeat(null, 2, b => b.path(o => o["prop '2'"]))
					.repeat(3, 4, b => b.path(o => o.prop4)),
			)
			.repeat(5, 6, b => b.path(o => o.prop5))
			.repeat(7, 8, b => b.path(o => o.length))

		checkType<number>(builder1)

		assert.strictEqual(builder1 as any, builder)

		assertRule(builder1.result, {
			type: RuleType.Repeat,
			countMin: 0,
			countMax: Number.MAX_SAFE_INTEGER,
			rule: {
				type: RuleType.Repeat,
				countMin: 1,
				countMax: Number.MAX_SAFE_INTEGER,
				rule: {
					type: RuleType.Action,
					objectTypes: ['object', 'array'],
					properties: ['prop1'],
					description: 'prop1',
				},
				next: {
					type: RuleType.Repeat,
					countMin: 0,
					countMax: 2,
					rule: {
						type: RuleType.Action,
						objectTypes: ['object', 'array'],
						properties: ["prop '2'"],
						description: "prop '2'",
					},
					next: {
						type: RuleType.Repeat,
						countMin: 3,
						countMax: 4,
						rule: {
							type: RuleType.Action,
							objectTypes: ['object', 'array'],
							properties: ['prop4'],
							description: 'prop4',
						},
					},
				},
			},
			next: {
				type: RuleType.Repeat,
				countMin: 5,
				countMax: 6,
				rule: {
					type: RuleType.Action,
					objectTypes: ['object', 'array'],
					properties: ['prop5'],
					description: 'prop5',
				},
				next: {
					type: RuleType.Repeat,
					countMin: 7,
					countMax: 8,
					rule: {
						type: RuleType.Action,
						objectTypes: ['object', 'array'],
						properties: ['length'],
						description: 'length',
					},
				},
			},
		})
	})

	it('any', function() {
		const builder = new RuleBuilder<IObject>()
		assert.strictEqual(builder.result, undefined)

		assert.throws(() => builder.any(), [Error, TypeError, ReferenceError])
		assert.throws(() => builder.any(null), [Error, TypeError, ReferenceError])
		assert.throws(() => builder.any(b => null), [Error, TypeError, ReferenceError])
		assert.throws(() => builder.any(b => ({rule: null} as any)), [Error, TypeError, ReferenceError])

		const builder1 = builder
			.any(b => b.path(o => o.prop1))
			.any(b => b.path(o => o["prop '2'"]))
			.any(
				b => b.any(
					b => b.path(o => o.prop4),
				),
				b => b.any(
					b => b.path(o => o.prop4),
					b => b.path(o => o.prop4_1),
				),
				b => b.any(
					b => b.path(o => o.prop4),
					b => b.path(o => o.prop4_1),
					b => b.path(o => o.prop4_2),
				),
			)
			.any(b => b.path(o => o.prop5))
			.any(b => b.path(o => o.length))

		checkType<number>(builder1)

		assert.strictEqual(builder1 as any, builder)

		assertRule(builder1.result, {
			type: RuleType.Any,
			rules: [{
				type: RuleType.Action,
				objectTypes: ['object', 'array'],
				properties: ['prop1'],
				description: 'prop1',
			}],
			next: {
				type: RuleType.Any,
				rules: [{
					type: RuleType.Action,
					objectTypes: ['object', 'array'],
					properties: ["prop '2'"],
					description: "prop '2'",
				}],
				next: {
					type: RuleType.Any,
					rules: [{
						type: RuleType.Any,
						rules: [{
							type: RuleType.Action,
							objectTypes: ['object', 'array'],
							properties: ['prop4'],
							description: 'prop4',
						}],
					}, {
						type: RuleType.Any,
						rules: [{
							type: RuleType.Action,
							objectTypes: ['object', 'array'],
							properties: ['prop4'],
							description: 'prop4',
						}, {
							type: RuleType.Action,
							objectTypes: ['object', 'array'],
							properties: ['prop4_1'],
							description: 'prop4_1',
						}],
					}, {
						type: RuleType.Any,
						rules: [{
							type: RuleType.Action,
							objectTypes: ['object', 'array'],
							properties: ['prop4'],
							description: 'prop4',
						}, {
							type: RuleType.Action,
							objectTypes: ['object', 'array'],
							properties: ['prop4_1'],
							description: 'prop4_1',
						}, {
							type: RuleType.Action,
							objectTypes: ['object', 'array'],
							properties: ['prop4_2'],
							description: 'prop4_2',
						}],
					}],
					next: {
						type: RuleType.Any,
						rules: [{
							type: RuleType.Action,
							objectTypes: ['object', 'array'],
							properties: ['prop5'],
							description: 'prop5',
						}],
						next: {
							type: RuleType.Any,
							rules: [{
								type: RuleType.Action,
								objectTypes: ['object', 'array'],
								properties: ['length'],
								description: 'length',
							}],
						},
					},
				},
			},
		})
	})
})
