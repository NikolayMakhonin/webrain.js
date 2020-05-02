/* tslint:disable:no-shadowed-variable no-duplicate-string no-empty */
/* eslint-disable no-useless-escape,computed-property-spacing */
import {VALUE_PROPERTY_DEFAULT} from '../../../../../../../../../main/common/helpers/value-property'
import {ObservableObjectBuilder} from '../../../../../../../../../main/common/rx/object/ObservableObjectBuilder'
import {ValueKeyType} from '../../../../../../../../../main/common/rx/object/properties/path/builder/contracts/common'
import {ANY, ANY_DISPLAY, COLLECTION_PREFIX} from '../../../../../../../../../main/common/rx/object/properties/path/builder/contracts/constants'
import {
	IRuleSubscribe,
	ISubscribeObject,
} from '../../../../../../../../../main/common/rx/object/properties/path/builder/contracts/rule-subscribe'
import {IRule, RuleType} from '../../../../../../../../../main/common/rx/object/properties/path/builder/contracts/rules'
import {RuleBuilder} from '../../../../../../../../../main/common/rx/object/properties/path/builder/RuleBuilder'
import {SubscribeObjectType} from '../../../../../../../../../main/common/rx/object/properties/path/builder/rules-subscribe'
import {assert} from '../../../../../../../../../main/common/test/Assert'
import {describe, it} from '../../../../../../../../../main/common/test/Mocha'

describe('common > main > rx > properties > builder > RuleBuilder', function() {
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
		const builder = new RuleBuilder({
			autoInsertValuePropertyDefault: false,
		})

		assert.strictEqual(builder.result(), undefined)
	})

	const nonSubscribeProperty = Math.random().toString(36)

	function testSubscribe<TObject>(
		isCollection: boolean,
		isMap: boolean,
		isValueObject: boolean,
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

		function checkDebugPropertyName(value: string, key: string, keyType: ValueKeyType) {
			if (isMap) {
				assert.ok(typeof key, 'string')
				assert.strictEqual('value_' + key, value)
				assert.strictEqual(keyType, ValueKeyType.MapKey)
			} else if (isCollection) {
				assert.strictEqual(key, null)
				assert.strictEqual(keyType, ValueKeyType.CollectionAny)
			} else {
				assert.ok(typeof key, 'string')
				assert.ok(key)
				assert.ok(key.length)
				assert.strictEqual(keyType, isValueObject
					? ValueKeyType.ValueProperty
					: ValueKeyType.Property)
			}
		}

		let subscribedItems = []

		function changeItem(
			value: string,
			parent: any,
			key: any,
			keyType: ValueKeyType,
		) {
			assert.ok(value)
			assert.strictEqual(typeof value, 'string', value)
			value = value.trim()
			checkDebugPropertyName(value, key, keyType)
			subscribedItems.push('+' + value)
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
				// region Observable

				const testObservableObject = object => {
					for (const property of subscribeProperties) {
						add(object, property)

						if (change) {
							change(object, property)
						}
					}
					subscribedItems = []

					subscribe(object, changeItem)
					if (isValueObject) {
						assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties
							.filter(o => o !== VALUE_PROPERTY_DEFAULT)
							.filter((o, i) => i === 0)
							.map(o => '+value_' + o).sort())
					} else {
						assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '+value_' + o).sort())
					}
					subscribedItems = []
					for (const property of subscribeProperties) {
						remove(object, property, false)
					}
					subscribedItems = []
				}

				// endregion

				if (observableObject) {
					testObservableObject(observableObject)
				}
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

	function testObject(properties: string | string[], subscribe: ISubscribeObject<any, string>, isValueObject: boolean) {
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
			false, false, isValueObject,
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

		// builder
		// 	.writable('p1', null, 'value_p1')
		// 	.writable('p2', null, 'value_p2')
		// 	.writable('p3', null, 'value_p3')

		testSubscribe(
			false, true, isValueObject,
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

	function testArray(properties: string | string[], subscribe: ISubscribeObject<any, string>, isValueObject: boolean) {
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
			false, true, isValueObject,
			null, // object,
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
		const map = new Map()

		if (properties !== ANY) {
			map.set(nonSubscribeProperty, 'value_' + nonSubscribeProperty)
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
			true, true, false,
			map,
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
		const set = new Set()

		function add(object, property) {
			object.add('value_' + property)
		}

		function remove(object, property) {
			object.delete('value_' + property)
		}

		testSubscribe(
			true, false, false,
			set,
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
			subscribe({}, item => { assert.fail() }),
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
			true, false, false,
			null, // array,
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
			expected.unsubscribersCount = rule.unsubscribersCount
		}

		delete rule.subscribe
		delete rule.next
		delete rule.rule
		delete rule.rules
		delete rule.toString
		delete expected.objectTypes
		delete expected.properties
		delete expected.next
		delete expected.rule
		delete expected.rules

		assert.deepStrictEqual(rule, expected, null, {
			customIsPrimitive(o) {
				if (typeof o === 'function') {
					return false
				}
				return null
			},
			customEqual(o1, o2) {
				if (typeof o1 === 'function') {
					return typeof o2 === 'function'
				} else if (typeof o2 === 'function') {
					return typeof o1 === 'function'
				}

				return null
			},
		})
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
						testObject(expected.properties, rule.subscribe, rule.subType === SubscribeObjectType.ValueProperty)
						break
					case 'array':
						testArray(expected.properties, rule.subscribe, rule.subType === SubscribeObjectType.ValueProperty)
						break
					case 'map':
						testMap(expected.properties, rule.subscribe)
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

	it('property', function() {
		const builder = new RuleBuilder<IObject>({
			autoInsertValuePropertyDefault: false,
		})
		assert.strictEqual(builder.result(), undefined)

		// @ts-ignore
		assert.throws(() => builder.propertyRegexp(), Error)
		// @ts-ignore
		assert.throws(() => builder.propertyRegexp('string'), Error)
		assert.throws(() => builder.propertyRegexp(null), Error)

		// @ts-ignore
		assert.throws(() => builder.propertyPredicate('string'), Error)

		assert.strictEqual(builder.result(), undefined)

		const builder1 = builder.propertyRegexp(/prop1|prop2/)
		const rule1 = builder1.result() as IRuleSubscribe
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['object', 'array'],
			properties: ['prop1', 'prop2'],
			description: '/prop1|prop2/',
		})

		const builder2 = builder.propertyRegexp<string>(/prop2|prop3/)
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.result(), rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['object', 'array'],
			properties: ['prop1', 'prop2'],
			description: '/prop1|prop2/',
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['object', 'array'],
				properties: ['prop2', 'prop3'],
				description: '/prop2|prop3/',
			},
		})

		const builder3 = builder.propertyRegexp<boolean>(/prop3|prop4/)
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result(), rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['object', 'array'],
			properties: ['prop1', 'prop2'],
			description: '/prop1|prop2/',
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['object', 'array'],
				properties: ['prop2', 'prop3'],
				description: '/prop2|prop3/',
				next: {
					type: RuleType.Action,
					subType: SubscribeObjectType.Property,
					objectTypes: ['object', 'array'],
					properties: ['prop3', 'prop4'],
					description: '/prop3|prop4/',
				},
			},
		})

		// noinspection JSUnusedLocalSymbols
		const rule3 = builder3.result().next.next as IRuleSubscribe
	})

	it('value property', function() {
		const builder = new RuleBuilder<IObject>({
			autoInsertValuePropertyDefault: false,
		})
		assert.strictEqual(builder.result(), undefined)

		const builder1 = builder.valuePropertyNames<string>('prop1', 'prop2')
		const rule1 = builder1.result() as IRuleSubscribe
		assert.strictEqual(builder1 as any, builder)

		function toSimpleRule(rule) {
			if (rule == null) {
				return rule
			}
			const innerRule = (rule.conditionRules[1][1]).clone()
			innerRule.next = toSimpleRule(rule.next)
			return innerRule
		}

		let simpleRule1 = toSimpleRule(rule1)

		assertRule(simpleRule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.ValueProperty,
			objectTypes: ['object', 'array'],
			properties: [VALUE_PROPERTY_DEFAULT, 'prop1', 'prop2'],
			description: '@prop1|prop2',
		})

		const builder2 = builder.valuePropertyNames<string>('prop2', 'prop3')
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.result(), rule1)

		simpleRule1 = toSimpleRule(rule1)

		assertRule(simpleRule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.ValueProperty,
			objectTypes: ['object', 'array'],
			properties: [VALUE_PROPERTY_DEFAULT, 'prop1', 'prop2'],
			description: '@prop1|prop2',
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.ValueProperty,
				objectTypes: ['object', 'array'],
				properties: [VALUE_PROPERTY_DEFAULT, 'prop2', 'prop3'],
				description: '@prop2|prop3',
			},
		})

		const builder3 = builder.valuePropertyNames<boolean>('prop3', 'prop4')
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result(), rule1)

		simpleRule1 = toSimpleRule(rule1)

		assertRule(simpleRule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.ValueProperty,
			objectTypes: ['object', 'array'],
			properties: [VALUE_PROPERTY_DEFAULT, 'prop1', 'prop2'],
			description: '@prop1|prop2',
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.ValueProperty,
				objectTypes: ['object', 'array'],
				properties: [VALUE_PROPERTY_DEFAULT, 'prop2', 'prop3'],
				description: '@prop2|prop3',
				next: {
					type: RuleType.Action,
					subType: SubscribeObjectType.ValueProperty,
					objectTypes: ['object', 'array'],
					properties: [VALUE_PROPERTY_DEFAULT, 'prop3', 'prop4'],
					description: '@prop3|prop4',
				},
			},
		})

		// noinspection JSUnusedLocalSymbols
		const rule3 = builder3.result().next.next as IRuleSubscribe
	})

	it('propertyAny', function() {
		const builder = new RuleBuilder<IObject>({
			autoInsertValuePropertyDefault: false,
		})
		assert.strictEqual(builder.result(), undefined)

		const builder1 = builder.propertyAny()
		const rule1 = builder1.result() as IRuleSubscribe
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['object', 'array'],
			properties: ANY,
			description: ANY_DISPLAY,
		})

		const builder2 = builder.propertyNames<ANY, string>(ANY)
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.result(), rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['object', 'array'],
			properties: ANY,
			description: ANY_DISPLAY,
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['object', 'array'],
				properties: ANY,
				description: ANY_DISPLAY,
			},
		})

		const builder3 = builder.propertyNames<'prop1' | ANY | 'prop2', boolean>('prop1', ANY, 'prop2')
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result(), rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['object', 'array'],
			properties: ANY,
			description: ANY_DISPLAY,
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['object', 'array'],
				properties: ANY,
				description: ANY_DISPLAY,
				next: {
					type: RuleType.Action,
					subType: SubscribeObjectType.Property,
					objectTypes: ['object', 'array'],
					properties: ANY,
					description: `prop1|${ANY_DISPLAY}|prop2`,
				},
			},
		})

		// noinspection JSUnusedLocalSymbols
		const rule3 = builder3.result().next.next as IRuleSubscribe
	})

	it('propertyNames', function() {
		const builder = new RuleBuilder<IObject>({
			autoInsertValuePropertyDefault: false,
		})
		assert.strictEqual(builder.result(), undefined)

		assert.strictEqual(builder.result(), undefined)

		const builder1 = builder.propertyNames('prop1')
		const rule1 = builder1.result() as IRuleSubscribe
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['object', 'array'],
			properties: ['prop1'],
			description: 'prop1',
		})

		const builder2 = builder.propertyName<'prop2', string>('prop2')
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.result(), rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['object', 'array'],
			properties: ['prop1'],
			description: 'prop1',
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['object', 'array'],
				properties: ['prop2'],
				description: 'prop2',
			},
		})

		const builder3 = builder.propertyNames<any, boolean>('prop3', 'prop4', 'prop5')
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result(), rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['object', 'array'],
			properties: ['prop1'],
			description: 'prop1',
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['object', 'array'],
				properties: ['prop2'],
				description: 'prop2',
				next: {
					type: RuleType.Action,
					subType: SubscribeObjectType.Property,
					objectTypes: ['object', 'array'],
					properties: ['prop3', 'prop4', 'prop5'],
					description: 'prop3|prop4|prop5',
				},
			},
		})

		// noinspection JSUnusedLocalSymbols
		const rule3 = builder3.result().next.next as IRuleSubscribe
	})

	it('map', function() {
		const builder = new RuleBuilder<IObject>({
			autoInsertValuePropertyDefault: false,
		})
		assert.strictEqual(builder.result(), undefined)

		// @ts-ignore
		assert.throws(() => builder.mapRegexp(), Error)
		// @ts-ignore
		assert.throws(() => builder.mapRegexp('string'), Error)
		assert.throws(() => builder.mapRegexp(null), Error)

		// @ts-ignore
		assert.throws(() => builder.mapPredicate('string'), Error)

		assert.strictEqual(builder.result(), undefined)

		const builder1 = builder.mapRegexp(/prop1|prop2/)
		const rule1 = builder1.result() as IRuleSubscribe
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['map'],
			properties: ['prop1', 'prop2'],
			description: '/prop1|prop2/',
		})

		const builder2 = builder.mapRegexp<string>(/prop2|prop3/)
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.result(), rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['map'],
			properties: ['prop1', 'prop2'],
			description: '/prop1|prop2/',
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['map'],
				properties: ['prop2', 'prop3'],
				description: '/prop2|prop3/',
			},
		})

		const builder3 = builder.mapRegexp<boolean>(/prop3|prop4/)
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result(), rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['map'],
			properties: ['prop1', 'prop2'],
			description: '/prop1|prop2/',
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['map'],
				properties: ['prop2', 'prop3'],
				description: '/prop2|prop3/',
				next: {
					type: RuleType.Action,
					subType: SubscribeObjectType.Property,
					objectTypes: ['map'],
					properties: ['prop3', 'prop4'],
					description: '/prop3|prop4/',
				},
			},
		})

		// noinspection JSUnusedLocalSymbols
		const rule3 = builder3.result().next.next as IRuleSubscribe
	})

	it('mapAny', function() {
		const builder = new RuleBuilder<IObject>({
			autoInsertValuePropertyDefault: false,
		})
		assert.strictEqual(builder.result(), undefined)

		const builder1 = builder.mapAny()
		const rule1 = builder1.result() as IRuleSubscribe
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['map'],
			properties: ANY,
			description: COLLECTION_PREFIX,
		})

		const builder2 = builder.mapKeys<string, string>()
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.result(), rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['map'],
			properties: ANY,
			description: COLLECTION_PREFIX,
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['map'],
				properties: ANY,
				description: COLLECTION_PREFIX,
			},
		})

		const builder3 = builder.mapKeys<string, boolean>('prop1', ANY, 'prop2')
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result(), rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['map'],
			properties: ANY,
			description: COLLECTION_PREFIX,
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['map'],
				properties: ANY,
				description: COLLECTION_PREFIX,
				next: {
					type: RuleType.Action,
					subType: SubscribeObjectType.Property,
					objectTypes: ['map'],
					properties: ANY,
					description: `${COLLECTION_PREFIX}prop1|${ANY_DISPLAY}|prop2`,
				},
			},
		})

		const builder4 = builder.mapKeys<string, boolean[]>(ANY)
		checkType<boolean[]>(builder4)
		assert.strictEqual(builder4 as any, builder)
		assert.strictEqual(builder4.result(), rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['map'],
			properties: ANY,
			description: COLLECTION_PREFIX,
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['map'],
				properties: ANY,
				description: COLLECTION_PREFIX,
				next: {
					type: RuleType.Action,
					subType: SubscribeObjectType.Property,
					objectTypes: ['map'],
					properties: ANY,
					description: `${COLLECTION_PREFIX}prop1|${ANY_DISPLAY}|prop2`,
					next: {
						type: RuleType.Action,
						subType: SubscribeObjectType.Property,
						objectTypes: ['map'],
						properties: ANY,
						description: COLLECTION_PREFIX + ANY_DISPLAY,
					},
				},
			},
		})
	})

	it('mapKeys', function() {
		const builder = new RuleBuilder<IObject>({
			autoInsertValuePropertyDefault: false,
		})
		assert.strictEqual(builder.result(), undefined)

		assert.strictEqual(builder.result(), undefined)

		const builder1 = builder.mapKeys('prop1')
		const rule1 = builder1.result() as IRuleSubscribe
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['map'],
			properties: ['prop1'],
			description: COLLECTION_PREFIX + 'prop1',
		})

		const builder2 = builder.mapKey<string, string>('prop2')
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.result(), rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['map'],
			properties: ['prop1'],
			description: COLLECTION_PREFIX + 'prop1',
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['map'],
				properties: ['prop2'],
				description: COLLECTION_PREFIX + 'prop2',
			},
		})

		const builder3 = builder.mapKeys<string, boolean>('prop3', 'prop4', 'prop5')
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result(), rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['map'],
			properties: ['prop1'],
			description: COLLECTION_PREFIX + 'prop1',
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['map'],
				properties: ['prop2'],
				description: COLLECTION_PREFIX + 'prop2',
				next: {
					type: RuleType.Action,
					subType: SubscribeObjectType.Property,
					objectTypes: ['map'],
					properties: ['prop3', 'prop4', 'prop5'],
					description: COLLECTION_PREFIX + 'prop3|prop4|prop5',
				},
			},
		})

		// noinspection JSUnusedLocalSymbols
		const rule3 = builder3.result().next.next as IRuleSubscribe
	})

	it('collection', function() {
		const builder = new RuleBuilder<IObject>({
			autoInsertValuePropertyDefault: false,
		})
		assert.strictEqual(builder.result(), undefined)

		const builder1 = builder.collection()
		const rule1 = builder1.result() as IRuleSubscribe
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['set'],
			properties: ANY,
			description: COLLECTION_PREFIX,
		})

		const builder2 = builder.collection<string>()
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.result(), rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['map', 'set', 'iterable'],
			properties: ANY,
			description: COLLECTION_PREFIX,
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['set'],
				properties: ANY,
				description: COLLECTION_PREFIX,
			},
		})

		const builder3 = builder.collection<boolean>()
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.result(), rule1)

		assertRule(rule1, {
			type: RuleType.Action,
			subType: SubscribeObjectType.Property,
			objectTypes: ['set'],
			properties: ANY,
			description: COLLECTION_PREFIX,
			next: {
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['set'],
				properties: ANY,
				description: COLLECTION_PREFIX,
				next: {
					type: RuleType.Action,
					subType: SubscribeObjectType.Property,
					objectTypes: ['set'],
					properties: ANY,
					description: COLLECTION_PREFIX,
				},
			},
		})

		// noinspection JSUnusedLocalSymbols
		const rule3 = builder3.result().next.next as IRuleSubscribe
	})

	it('repeat', function() {
		const builder = new RuleBuilder<IObject>({
			autoInsertValuePropertyDefault: false,
		})
		assert.strictEqual(builder.result(), undefined)

		assert.throws(() => builder.repeat(1, 1, null, b => null), [Error, TypeError, ReferenceError])
		assert.throws(() => builder.repeat(1, 1, null, b => ({rule: null} as any)), [Error, TypeError, ReferenceError])

		const builder1 = builder
			.repeat(
				null, null, null,
				b => b
					.repeat(1, null, null, b => b.p('prop1'))
					.repeat(null, 2, null, b => b.p("prop '2'"))
					.repeat(3, 4, null, b => b.p('prop4')),
			)
			.repeat(5, 6, null, b => b.p('prop5'))
			.repeat(7, 8, null, b => b.p('length'))

		checkType<number>(builder1)

		assert.strictEqual(builder1 as any, builder)

		assertRule(builder1.result(), {
			type: RuleType.Repeat,
			countMin: 0,
			countMax: Number.MAX_SAFE_INTEGER,
			condition: null,
			description: '<repeat>',
			rule: {
				type: RuleType.Repeat,
				countMin: 1,
				countMax: Number.MAX_SAFE_INTEGER,
				condition: null,
				description: '<repeat>',
				rule: {
					type: RuleType.Action,
					subType: SubscribeObjectType.Property,
					objectTypes: ['object', 'array'],
					properties: ['prop1'],
					description: 'prop1',
				},
				next: {
					type: RuleType.Repeat,
					countMin: 0,
					countMax: 2,
					condition: null,
					description: '<repeat>',
					rule: {
						type: RuleType.Action,
						subType: SubscribeObjectType.Property,
						objectTypes: ['object', 'array'],
						properties: ["prop '2'"],
						description: "prop '2'",
					},
					next: {
						type: RuleType.Repeat,
						countMin: 3,
						countMax: 4,
						condition: null,
						description: '<repeat>',
						rule: {
							type: RuleType.Action,
							subType: SubscribeObjectType.Property,
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
				condition: null,
				description: '<repeat>',
				rule: {
					type: RuleType.Action,
					subType: SubscribeObjectType.Property,
					objectTypes: ['object', 'array'],
					properties: ['prop5'],
					description: 'prop5',
				},
				next: {
					type: RuleType.Repeat,
					countMin: 7,
					countMax: 8,
					condition: null,
					description: '<repeat>',
					rule: {
						type: RuleType.Action,
						subType: SubscribeObjectType.Property,
						objectTypes: ['object', 'array'],
						properties: ['length'],
						description: 'length',
					},
				},
			},
		})
	})

	it('any', function() {
		const builder = new RuleBuilder<IObject>({
			autoInsertValuePropertyDefault: false,
		})
		assert.strictEqual(builder.result(), undefined)

		assert.throws(() => builder.any(), [Error, TypeError, ReferenceError])
		assert.throws(() => builder.any(null), [Error, TypeError, ReferenceError])
		assert.throws(() => builder.any(b => null), [Error, TypeError, ReferenceError])
		assert.throws(() => builder.any(b => ({rule: null} as any)), [Error, TypeError, ReferenceError])

		const builder1 = builder
			.any(b => b.p('prop1'))
			.any(b => b.p("prop '2'"))
			.any(
				b => b.any(
					b => b.p('prop4'),
				),
				b => b.any(
					b => b.p('prop4'),
					b => b.p('prop4_1'),
				),
				b => b.any(
					b => b.p('prop4'),
					b => b.p('prop4_1'),
					b => b.p('prop4_2'),
				),
			)
			.any(b => b.p('prop5'))
			.any(b => b.p('length'))

		checkType<number>(builder1)

		assert.strictEqual(builder1 as any, builder)

		assertRule(builder1.result(), {
			type: RuleType.Any,
			description: '<any>',
			rules: [{
				type: RuleType.Action,
				subType: SubscribeObjectType.Property,
				objectTypes: ['object', 'array'],
				properties: ['prop1'],
				description: 'prop1',
			}],
			next: {
				type: RuleType.Any,
				description: '<any>',
				rules: [{
					type: RuleType.Action,
					subType: SubscribeObjectType.Property,
					objectTypes: ['object', 'array'],
					properties: ["prop '2'"],
					description: "prop '2'",
				}],
				next: {
					type: RuleType.Any,
					description: '<any>',
					rules: [{
						type: RuleType.Any,
						description: '<any>',
						rules: [{
							type: RuleType.Action,
							subType: SubscribeObjectType.Property,
							objectTypes: ['object', 'array'],
							properties: ['prop4'],
							description: 'prop4',
						}],
					}, {
						type: RuleType.Any,
						description: '<any>',
						rules: [{
							type: RuleType.Action,
							subType: SubscribeObjectType.Property,
							objectTypes: ['object', 'array'],
							properties: ['prop4'],
							description: 'prop4',
						}, {
							type: RuleType.Action,
							subType: SubscribeObjectType.Property,
							objectTypes: ['object', 'array'],
							properties: ['prop4_1'],
							description: 'prop4_1',
						}],
					}, {
						type: RuleType.Any,
						description: '<any>',
						rules: [{
							type: RuleType.Action,
							subType: SubscribeObjectType.Property,
							objectTypes: ['object', 'array'],
							properties: ['prop4'],
							description: 'prop4',
						}, {
							type: RuleType.Action,
							subType: SubscribeObjectType.Property,
							objectTypes: ['object', 'array'],
							properties: ['prop4_1'],
							description: 'prop4_1',
						}, {
							type: RuleType.Action,
							subType: SubscribeObjectType.Property,
							objectTypes: ['object', 'array'],
							properties: ['prop4_2'],
							description: 'prop4_2',
						}],
					}],
					next: {
						type: RuleType.Any,
						description: '<any>',
						rules: [{
							type: RuleType.Action,
							subType: SubscribeObjectType.Property,
							objectTypes: ['object', 'array'],
							properties: ['prop5'],
							description: 'prop5',
						}],
						next: {
							type: RuleType.Any,
							description: '<any>',
							rules: [{
								type: RuleType.Action,
								subType: SubscribeObjectType.Property,
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
