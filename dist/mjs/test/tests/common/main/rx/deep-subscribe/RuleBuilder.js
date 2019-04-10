import _objectSpread from "@babel/runtime/helpers/objectSpread";

/* tslint:disable:no-shadowed-variable */

/* eslint-disable no-useless-escape,computed-property-spacing */
import { RuleType } from '../../../../../../main/common/rx/deep-subscribe/contracts/rules';
import { RuleBuilder } from '../../../../../../main/common/rx/deep-subscribe/RuleBuilder';
describe('common > main > rx > deep-subscribe > RuleBuilder', function () {
  function checkType(builder) {
    return true;
  }

  it('constructor', function () {
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
  });

  function assertRuleParams(rule, expected) {
    rule = _objectSpread({}, rule);
    expected = _objectSpread({}, expected);
    delete rule.predicate;
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

    if (!expected.predicate) {
      assert.strictEqual(rule.predicate, undefined);
    } else {
      assert.strictEqual(rule.predicate(Math.random().toString(36), null), false);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = expected.predicate[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var expectedPredicate = _step.value;
          assert.strictEqual(rule.predicate(expectedPredicate, null), true, expectedPredicate);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    _assertRule(rule.next, expected.next);

    _assertRule(rule.rule, expected.rule);

    if (!expected.rules) {
      assert.strictEqual(rule.rules, undefined);
    } else {
      assert.ok(rule.rules);
      assert.strictEqual(rule.rules.length, expected.rules.length);

      for (var i = 0; i < expected.rules.length; i++) {
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
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    var builder1 = builder.path(function (o) {
      return o.prop1;
    });
    var rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Property,
      predicate: ['prop1'],
      description: 'prop1'
    });
    var builder3 = builder1.path(function (o) {
      return o["prop '2'"].prop3;
    });
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
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
          description: 'prop3'
        }
      }
    });
    var builder4 = builder3.path(function (o) {
      return o.length;
    });
    checkType(builder4);
    assert.strictEqual(builder4, builder);
    assert.strictEqual(builder4.rule, rule1);
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
            description: 'length'
          }
        }
      }
    });
  });
  it('property', function () {
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    var builder1 = builder.property(function (name) {
      return /prop1|prop2/.test(name);
    });
    var rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Property,
      predicate: ['prop1', 'prop2']
    });
    var builder2 = builder.property(function (name) {
      return /prop2|prop3/.test(name);
    });
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.rule, rule1);
    assertRule(rule1, {
      type: RuleType.Property,
      predicate: ['prop1', 'prop2'],
      next: {
        type: RuleType.Property,
        predicate: ['prop2', 'prop3']
      }
    });
    var builder3 = builder.property(function (name) {
      return /prop3|prop4/.test(name);
    });
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
    assertRule(rule1, {
      type: RuleType.Property,
      predicate: ['prop1', 'prop2'],
      next: {
        type: RuleType.Property,
        predicate: ['prop2', 'prop3'],
        next: {
          type: RuleType.Property,
          predicate: ['prop3', 'prop4']
        }
      }
    });
    var rule3 = builder3.rule.next.next;
  });
  it('repeat', function () {
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    var builder1 = builder.repeat(null, null, function (b) {
      return b.repeat(1, null, function (b) {
        return b.path(function (o) {
          return o.prop1;
        });
      }).repeat(null, 2, function (b) {
        return b.path(function (o) {
          return o["prop '2'"];
        });
      }).repeat(3, 4, function (b) {
        return b.path(function (o) {
          return o.prop4;
        });
      });
    }).repeat(5, 6, function (b) {
      return b.path(function (o) {
        return o.prop5;
      });
    }).repeat(7, 8, function (b) {
      return b.path(function (o) {
        return o.length;
      });
    });
    checkType(builder1);
    assert.strictEqual(builder1, builder);
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
          description: 'prop1'
        },
        next: {
          type: RuleType.Repeat,
          countMin: null,
          countMax: 2,
          rule: {
            type: RuleType.Property,
            predicate: ["prop '2'"],
            description: "prop '2'"
          },
          next: {
            type: RuleType.Repeat,
            countMin: 3,
            countMax: 4,
            rule: {
              type: RuleType.Property,
              predicate: ['prop4'],
              description: 'prop4'
            }
          }
        }
      },
      next: {
        type: RuleType.Repeat,
        countMin: 5,
        countMax: 6,
        rule: {
          type: RuleType.Property,
          predicate: ['prop5'],
          description: 'prop5'
        },
        next: {
          type: RuleType.Repeat,
          countMin: 7,
          countMax: 8,
          rule: {
            type: RuleType.Property,
            predicate: ['length'],
            description: 'length'
          }
        }
      }
    });
  });
  it('any', function () {
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    var builder1 = builder.any(function (b) {
      return b.path(function (o) {
        return o.prop1;
      });
    }).any(function (b) {
      return b.path(function (o) {
        return o["prop '2'"];
      });
    }).any(function (b) {
      return b.any(function (b) {
        return b.path(function (o) {
          return o.prop4;
        });
      });
    }, function (b) {
      return b.any(function (b) {
        return b.path(function (o) {
          return o.prop4;
        });
      }, function (b) {
        return b.path(function (o) {
          return o.prop4_1;
        });
      });
    }, function (b) {
      return b.any(function (b) {
        return b.path(function (o) {
          return o.prop4;
        });
      }, function (b) {
        return b.path(function (o) {
          return o.prop4_1;
        });
      }, function (b) {
        return b.path(function (o) {
          return o.prop4_2;
        });
      });
    }).any(function (b) {
      return b.path(function (o) {
        return o.prop5;
      });
    }).any(function (b) {
      return b.path(function (o) {
        return o.length;
      });
    });
    checkType(builder1);
    assert.strictEqual(builder1, builder);
    assertRule(builder1.rule, {
      type: RuleType.Any,
      rules: [{
        type: RuleType.Property,
        predicate: ['prop1'],
        description: 'prop1'
      }],
      next: {
        type: RuleType.Any,
        rules: [{
          type: RuleType.Property,
          predicate: ["prop '2'"],
          description: "prop '2'"
        }],
        next: {
          type: RuleType.Any,
          rules: [{
            type: RuleType.Any,
            rules: [{
              type: RuleType.Property,
              predicate: ['prop4'],
              description: 'prop4'
            }]
          }, {
            type: RuleType.Any,
            rules: [{
              type: RuleType.Property,
              predicate: ['prop4'],
              description: 'prop4'
            }, {
              type: RuleType.Property,
              predicate: ['prop4_1'],
              description: 'prop4_1'
            }]
          }, {
            type: RuleType.Any,
            rules: [{
              type: RuleType.Property,
              predicate: ['prop4'],
              description: 'prop4'
            }, {
              type: RuleType.Property,
              predicate: ['prop4_1'],
              description: 'prop4_1'
            }, {
              type: RuleType.Property,
              predicate: ['prop4_2'],
              description: 'prop4_2'
            }]
          }],
          next: {
            type: RuleType.Any,
            rules: [{
              type: RuleType.Property,
              predicate: ['prop5'],
              description: 'prop5'
            }],
            next: {
              type: RuleType.Any,
              rules: [{
                type: RuleType.Property,
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