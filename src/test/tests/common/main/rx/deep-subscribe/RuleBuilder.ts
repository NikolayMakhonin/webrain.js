/* tslint:disable:no-shadowed-variable */
/* eslint-disable no-useless-escape,computed-property-spacing */
import {
	IRule, IRuleAny,
	IRuleProperty,
	IRuleRepeat,
	RuleType,
} from '../../../../../../main/common/rx/deep-subscribe/contracts/rules'
import {RuleBuilder} from '../../../../../../main/common/rx/deep-subscribe/RuleBuilder'

declare const assert

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

	function checkType<T>(builder: RuleBuilder<T>) {
		return true
	}

	it('constructor', function() {
		const builder = new RuleBuilder()

		assert.strictEqual(builder.rule, undefined)
	})

	function assertRuleParams(rule: IRule | any, expected: any) {
		rule = {...rule}
		expected = {...expected}

		delete rule.predicate
		delete rule.next
		delete rule.rule
		delete rule.rules
		delete expected.predicate
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

		if (!expected.predicate) {
			assert.strictEqual(rule.predicate, undefined)
		} else {
			assert.strictEqual(rule.predicate(Math.random().toString(36), null), false)
			for (const expectedPredicate of expected.predicate) {
				assert.strictEqual(rule.predicate(expectedPredicate, null), true, expectedPredicate)
			}
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
		assert.strictEqual(builder.rule, undefined)

		const builder1 = builder.path(o => o.prop1)
		const rule1 = builder1.rule
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Property,
			predicate: ['prop1'],
			description: 'prop1',
		})

		const builder3 = builder1.path(o => o["prop '2'"].prop3)
		checkType<string>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.rule, rule1)

		assertRule(rule1, {
			type: RuleType.Property,
			predicate: ['prop1'],
			description: 'prop1',
			next: {
				type: RuleType.Property,
				predicate: ["prop '2'"],
				description: "prop '2'",
				next: {
					type: RuleType.Property,
					predicate: ['prop3'],
					description: 'prop3',
				},
			},
		})

		const builder4 = builder3.path(o => o.length)
		checkType<number>(builder4)
		assert.strictEqual(builder4 as any, builder)
		assert.strictEqual(builder4.rule, rule1)

		assertRule(rule1, {
			type: RuleType.Property,
			predicate: ['prop1'],
			description: 'prop1',
			next: {
				type: RuleType.Property,
				predicate: ["prop '2'"],
				description: "prop '2'",
				next: {
					type: RuleType.Property,
					predicate: ['prop3'],
					description: 'prop3',
					next: {
						type: RuleType.Property,
						predicate: ['length'],
						description: 'length',
					},
				},
			},
		})
	})

	it('property', function() {
		const builder = new RuleBuilder<IObject>()
		assert.strictEqual(builder.rule, undefined)

		const builder1 = builder.property(name => /prop1|prop2/.test(name))
		const rule1 = builder1.rule as IRuleProperty
		assert.strictEqual(builder1 as any, builder)

		assertRule(rule1, {
			type: RuleType.Property,
			predicate: ['prop1', 'prop2'],
		})

		const builder2 = builder.property<string>(name => /prop2|prop3/.test(name))
		checkType<string>(builder2)
		assert.strictEqual(builder2 as any, builder)
		assert.strictEqual(builder2.rule, rule1)

		assertRule(rule1, {
			type: RuleType.Property,
			predicate: ['prop1', 'prop2'],
			next: {
				type: RuleType.Property,
				predicate: ['prop2', 'prop3'],
			},
		})

		const builder3 = builder.property<boolean>(name => /prop3|prop4/.test(name))
		checkType<boolean>(builder3)
		assert.strictEqual(builder3 as any, builder)
		assert.strictEqual(builder3.rule, rule1)

		assertRule(rule1, {
			type: RuleType.Property,
			predicate: ['prop1', 'prop2'],
			next: {
				type: RuleType.Property,
				predicate: ['prop2', 'prop3'],
				next: {
					type: RuleType.Property,
					predicate: ['prop3', 'prop4'],
				},
			},
		})

		const rule3 = builder3.rule.next.next as IRuleProperty
	})

	it('repeat', function() {
		const builder = new RuleBuilder<IObject>()
		assert.strictEqual(builder.rule, undefined)

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

		assertRule(builder1.rule, {
			type: RuleType.Repeat,
			countMin: null,
			countMax: null,
			rule: {
				type: RuleType.Repeat,
				countMin: 1,
				countMax: null,
				rule: {
					type: RuleType.Property,
					predicate: ['prop1'],
					description: 'prop1',
				},
				next: {
					type: RuleType.Repeat,
					countMin: null,
					countMax: 2,
					rule: {
						type: RuleType.Property,
						predicate: ["prop '2'"],
						description: "prop '2'",
					},
					next: {
						type: RuleType.Repeat,
						countMin: 3,
						countMax: 4,
						rule: {
							type: RuleType.Property,
							predicate: ['prop4'],
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
					type: RuleType.Property,
					predicate: ['prop5'],
					description: 'prop5',
				},
				next: {
					type: RuleType.Repeat,
					countMin: 7,
					countMax: 8,
					rule: {
						type: RuleType.Property,
						predicate: ['length'],
						description: 'length',
					},
				},
			},
		})
	})

	it('any', function() {
		const builder = new RuleBuilder<IObject>()
		assert.strictEqual(builder.rule, undefined)

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

		assertRule(builder1.rule, {
			type: RuleType.Any,
			rules: [{
				type: RuleType.Property,
				predicate: ['prop1'],
				description: 'prop1',
			}],
			next: {
				type: RuleType.Any,
				rules: [{
					type: RuleType.Property,
					predicate: ["prop '2'"],
					description: "prop '2'",
				}],
				next: {
					type: RuleType.Any,
					rules: [{
						type: RuleType.Any,
						rules: [{
							type: RuleType.Property,
							predicate: ['prop4'],
							description: 'prop4',
						}],
					}, {
						type: RuleType.Any,
						rules: [{
							type: RuleType.Property,
							predicate: ['prop4'],
							description: 'prop4',
						}, {
							type: RuleType.Property,
							predicate: ['prop4_1'],
							description: 'prop4_1',
						}],
					}, {
						type: RuleType.Any,
						rules: [{
							type: RuleType.Property,
							predicate: ['prop4'],
							description: 'prop4',
						}, {
							type: RuleType.Property,
							predicate: ['prop4_1'],
							description: 'prop4_1',
						}, {
							type: RuleType.Property,
							predicate: ['prop4_2'],
							description: 'prop4_2',
						}],
					}],
					next: {
						type: RuleType.Any,
						rules: [{
							type: RuleType.Property,
							predicate: ['prop5'],
							description: 'prop5',
						}],
						next: {
							type: RuleType.Any,
							rules: [{
								type: RuleType.Property,
								predicate: ['length'],
								description: 'length',
							}],
						},
					},
				},
			},
		})
	})
})
