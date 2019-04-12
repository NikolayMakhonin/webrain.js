"use strict";

var _rules = require("../../../../../../main/common/rx/deep-subscribe/contracts/rules");

var _RuleBuilder = require("../../../../../../main/common/rx/deep-subscribe/RuleBuilder");

var _constants = require("../../../../../../main/common/rx/deep-subscribe/contracts/constants");

/* tslint:disable:no-shadowed-variable no-duplicate-string */

/* eslint-disable no-useless-escape,computed-property-spacing */
describe('common > main > rx > deep-subscribe > RuleBuilder', function () {
  // noinspection JSUnusedLocalSymbols
  function checkType(builder) {
    return true;
  }

  it('constructor', function () {
    const builder = new _RuleBuilder.RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
  });

  function assertRuleParams(rule, expected) {
    rule = { ...rule
    };
    expected = { ...expected
    };
    delete rule.predicate;
    delete rule.iterateObject;
    delete rule.next;
    delete rule.rule;
    delete rule.rules;
    delete expected.predicate;
    delete expected.next;
    delete expected.rule;
    delete expected.rules;
    assert.deepStrictEqual(rule, expected);
  }

  function _assertRule(rule, expected) {
    if (!expected) {
      assert.strictEqual(rule, expected);
      return;
    }

    assertRuleParams(rule, expected);
    const object = {
      [Math.random().toString(36)]: Math.random().toString(36)
    };
    const objectChild = Object.create(object);

    if (!expected.predicate) {
      assert.strictEqual(rule.predicate, undefined);
      assert.strictEqual(rule.iterateObject, undefined);
    } else {
      let expectedPredicates = expected.predicate;

      if (expectedPredicates === _constants.ANY) {
        expectedPredicates = Object.keys(object);
      } // test predicate


      assert.strictEqual(rule.predicate(Math.random().toString(36), object), false);
      assert.strictEqual(rule.predicate(Math.random().toString(36), objectChild), false);

      for (const expectedPredicate of expectedPredicates) {
        object[expectedPredicate] = 'value_' + expectedPredicate;
      }

      for (const expectedPredicate of expectedPredicates) {
        assert.strictEqual(rule.predicate(expectedPredicate, object), true, expectedPredicate);
        assert.strictEqual(rule.predicate(expectedPredicate, objectChild), false, expectedPredicate);
      } // test iterateObject


      assert.strictEqual(typeof rule.iterateObject, 'function');
      assert.deepStrictEqual(Array.from(rule.iterateObject(object)).sort(), expectedPredicates.map(o => 'value_' + o).sort());
      assert.deepStrictEqual(Array.from(rule.iterateObject(objectChild)), []);
    }

    _assertRule(rule.next, expected.next);

    _assertRule(rule.rule, expected.rule);

    if (!expected.rules) {
      assert.strictEqual(rule.rules, undefined);
    } else {
      assert.ok(rule.rules);
      assert.strictEqual(rule.rules.length, expected.rules.length);

      for (let i = 0; i < expected.rules.length; i++) {
        _assertRule(rule.rules[i], expected.rules[i]);
      }
    }
  }

  function assertRule(rule, expected) {
    try {
      _assertRule(rule, expected);
    } catch (ex) {
      console.log('Actual:\n', rule, '\n');
      console.log('Expected:\n', expected, '\n');
      throw ex;
    }
  }

  it('path', function () {
    const builder = new _RuleBuilder.RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    const builder1 = builder.path(o => o.prop1);
    const rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: _rules.RuleType.Property,
      predicate: ['prop1'],
      description: 'prop1'
    });
    const builder3 = builder1.path(o => o["prop '2'"].prop3);
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
    assertRule(rule1, {
      type: _rules.RuleType.Property,
      predicate: ['prop1'],
      description: 'prop1',
      next: {
        type: _rules.RuleType.Property,
        predicate: ["prop '2'"],
        description: "prop '2'",
        next: {
          type: _rules.RuleType.Property,
          predicate: ['prop3'],
          description: 'prop3'
        }
      }
    });
    const builder4 = builder3.path(o => o.length);
    checkType(builder4);
    assert.strictEqual(builder4, builder);
    assert.strictEqual(builder4.rule, rule1);
    assertRule(rule1, {
      type: _rules.RuleType.Property,
      predicate: ['prop1'],
      description: 'prop1',
      next: {
        type: _rules.RuleType.Property,
        predicate: ["prop '2'"],
        description: "prop '2'",
        next: {
          type: _rules.RuleType.Property,
          predicate: ['prop3'],
          description: 'prop3',
          next: {
            type: _rules.RuleType.Property,
            predicate: ['length'],
            description: 'length'
          }
        }
      }
    });
  });
  it('property', function () {
    const builder = new _RuleBuilder.RuleBuilder();
    assert.strictEqual(builder.rule, undefined); // @ts-ignore

    assert.throws(() => builder.propertyRegexp(), Error); // @ts-ignore

    assert.throws(() => builder.propertyRegexp('string'), Error);
    assert.throws(() => builder.propertyRegexp(null), Error); // @ts-ignore

    assert.throws(() => builder.propertyPredicate(), Error); // @ts-ignore

    assert.throws(() => builder.propertyPredicate('string'), Error);
    assert.throws(() => builder.propertyPredicate(null, 'description'), Error);
    assert.strictEqual(builder.rule, undefined);
    const builder1 = builder.propertyRegexp(/prop1|prop2/);
    const rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: _rules.RuleType.Property,
      predicate: ['prop1', 'prop2'],
      description: '/prop1|prop2/'
    });
    const builder2 = builder.propertyRegexp(/prop2|prop3/);
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.rule, rule1);
    assertRule(rule1, {
      type: _rules.RuleType.Property,
      predicate: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: _rules.RuleType.Property,
        predicate: ['prop2', 'prop3'],
        description: '/prop2|prop3/'
      }
    });
    const builder3 = builder.propertyRegexp(/prop3|prop4/);
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
    assertRule(rule1, {
      type: _rules.RuleType.Property,
      predicate: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: _rules.RuleType.Property,
        predicate: ['prop2', 'prop3'],
        description: '/prop2|prop3/',
        next: {
          type: _rules.RuleType.Property,
          predicate: ['prop3', 'prop4'],
          description: '/prop3|prop4/'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    const rule3 = builder3.rule.next.next;
  });
  it('propertyAll', function () {
    const builder = new _RuleBuilder.RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    const builder1 = builder.propertyAll();
    const rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: _rules.RuleType.Property,
      predicate: _constants.ANY,
      description: '*'
    });
    const builder2 = builder.propertyNames(_constants.ANY);
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.rule, rule1);
    assertRule(rule1, {
      type: _rules.RuleType.Property,
      predicate: _constants.ANY,
      description: '*',
      next: {
        type: _rules.RuleType.Property,
        predicate: _constants.ANY,
        description: '*'
      }
    });
    const builder3 = builder.propertyNames('prop1', _constants.ANY, 'prop2');
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
    assertRule(rule1, {
      type: _rules.RuleType.Property,
      predicate: _constants.ANY,
      description: '*',
      next: {
        type: _rules.RuleType.Property,
        predicate: _constants.ANY,
        description: '*',
        next: {
          type: _rules.RuleType.Property,
          predicate: _constants.ANY,
          description: '*'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    const rule3 = builder3.rule.next.next;
  });
  it('propertyNames', function () {
    const builder = new _RuleBuilder.RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    assert.throws(() => builder.propertyNames(), Error);
    assert.throws(() => builder.propertyNames(true), Error);
    assert.throws(() => builder.propertyNames(true, true), Error);
    assert.throws(() => builder.propertyNames('prop1', true), Error);
    assert.strictEqual(builder.rule, undefined);
    const builder1 = builder.propertyNames('prop1');
    const rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: _rules.RuleType.Property,
      predicate: ['prop1'],
      description: 'prop1'
    });
    const builder2 = builder.propertyNames('prop2', 'prop3');
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.rule, rule1);
    assertRule(rule1, {
      type: _rules.RuleType.Property,
      predicate: ['prop1'],
      description: 'prop1',
      next: {
        type: _rules.RuleType.Property,
        predicate: ['prop2', 'prop3'],
        description: 'prop2|prop3'
      }
    });
    const builder3 = builder.propertyNames('prop3', 'prop4', 'prop5');
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
    assertRule(rule1, {
      type: _rules.RuleType.Property,
      predicate: ['prop1'],
      description: 'prop1',
      next: {
        type: _rules.RuleType.Property,
        predicate: ['prop2', 'prop3'],
        description: 'prop2|prop3',
        next: {
          type: _rules.RuleType.Property,
          predicate: ['prop3', 'prop4', 'prop5'],
          description: 'prop3|prop4|prop5'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    const rule3 = builder3.rule.next.next;
  });
  it('repeat', function () {
    const builder = new _RuleBuilder.RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    const builder1 = builder.repeat(null, null, b => b.repeat(1, null, b => b.path(o => o.prop1)).repeat(null, 2, b => b.path(o => o["prop '2'"])).repeat(3, 4, b => b.path(o => o.prop4))).repeat(5, 6, b => b.path(o => o.prop5)).repeat(7, 8, b => b.path(o => o.length));
    checkType(builder1);
    assert.strictEqual(builder1, builder);
    assertRule(builder1.rule, {
      type: _rules.RuleType.Repeat,
      countMin: null,
      countMax: null,
      rule: {
        type: _rules.RuleType.Repeat,
        countMin: 1,
        countMax: null,
        rule: {
          type: _rules.RuleType.Property,
          predicate: ['prop1'],
          description: 'prop1'
        },
        next: {
          type: _rules.RuleType.Repeat,
          countMin: null,
          countMax: 2,
          rule: {
            type: _rules.RuleType.Property,
            predicate: ["prop '2'"],
            description: "prop '2'"
          },
          next: {
            type: _rules.RuleType.Repeat,
            countMin: 3,
            countMax: 4,
            rule: {
              type: _rules.RuleType.Property,
              predicate: ['prop4'],
              description: 'prop4'
            }
          }
        }
      },
      next: {
        type: _rules.RuleType.Repeat,
        countMin: 5,
        countMax: 6,
        rule: {
          type: _rules.RuleType.Property,
          predicate: ['prop5'],
          description: 'prop5'
        },
        next: {
          type: _rules.RuleType.Repeat,
          countMin: 7,
          countMax: 8,
          rule: {
            type: _rules.RuleType.Property,
            predicate: ['length'],
            description: 'length'
          }
        }
      }
    });
  });
  it('any', function () {
    const builder = new _RuleBuilder.RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    const builder1 = builder.any(b => b.path(o => o.prop1)).any(b => b.path(o => o["prop '2'"])).any(b => b.any(b => b.path(o => o.prop4)), b => b.any(b => b.path(o => o.prop4), b => b.path(o => o.prop4_1)), b => b.any(b => b.path(o => o.prop4), b => b.path(o => o.prop4_1), b => b.path(o => o.prop4_2))).any(b => b.path(o => o.prop5)).any(b => b.path(o => o.length));
    checkType(builder1);
    assert.strictEqual(builder1, builder);
    assertRule(builder1.rule, {
      type: _rules.RuleType.Any,
      rules: [{
        type: _rules.RuleType.Property,
        predicate: ['prop1'],
        description: 'prop1'
      }],
      next: {
        type: _rules.RuleType.Any,
        rules: [{
          type: _rules.RuleType.Property,
          predicate: ["prop '2'"],
          description: "prop '2'"
        }],
        next: {
          type: _rules.RuleType.Any,
          rules: [{
            type: _rules.RuleType.Any,
            rules: [{
              type: _rules.RuleType.Property,
              predicate: ['prop4'],
              description: 'prop4'
            }]
          }, {
            type: _rules.RuleType.Any,
            rules: [{
              type: _rules.RuleType.Property,
              predicate: ['prop4'],
              description: 'prop4'
            }, {
              type: _rules.RuleType.Property,
              predicate: ['prop4_1'],
              description: 'prop4_1'
            }]
          }, {
            type: _rules.RuleType.Any,
            rules: [{
              type: _rules.RuleType.Property,
              predicate: ['prop4'],
              description: 'prop4'
            }, {
              type: _rules.RuleType.Property,
              predicate: ['prop4_1'],
              description: 'prop4_1'
            }, {
              type: _rules.RuleType.Property,
              predicate: ['prop4_2'],
              description: 'prop4_2'
            }]
          }],
          next: {
            type: _rules.RuleType.Any,
            rules: [{
              type: _rules.RuleType.Property,
              predicate: ['prop5'],
              description: 'prop5'
            }],
            next: {
              type: _rules.RuleType.Any,
              rules: [{
                type: _rules.RuleType.Property,
                predicate: ['length'],
                description: 'length'
              }]
            }
          }
        }
      }
    });
  });
});