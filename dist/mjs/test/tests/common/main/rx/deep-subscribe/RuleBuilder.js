import _typeof from "@babel/runtime/helpers/typeof";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectSpread from "@babel/runtime/helpers/objectSpread";

/* tslint:disable:no-shadowed-variable no-duplicate-string */

/* eslint-disable no-useless-escape,computed-property-spacing */
import { RuleType } from '../../../../../../main/common/rx/deep-subscribe/contracts/rules';
import { RuleBuilder } from '../../../../../../main/common/rx/deep-subscribe/RuleBuilder';
import { ANY } from "../../../../../../main/common/rx/deep-subscribe/contracts/constants";
describe('common > main > rx > deep-subscribe > RuleBuilder', function () {
  // noinspection JSUnusedLocalSymbols
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

    var object = _defineProperty({}, Math.random().toString(36), Math.random().toString(36));

    var objectChild = Object.create(object);

    if (!expected.predicate) {
      assert.strictEqual(rule.predicate, undefined);
      assert.strictEqual(rule.iterateObject, undefined);
    } else {
      var expectedPredicates = expected.predicate;

      if (expectedPredicates === ANY) {
        expectedPredicates = Object.keys(object);
      } // test predicate


      assert.strictEqual(rule.predicate(Math.random().toString(36), object), false);
      assert.strictEqual(rule.predicate(Math.random().toString(36), objectChild), false);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = expectedPredicates[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var expectedPredicate = _step.value;
          object[expectedPredicate] = 'value_' + expectedPredicate;
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

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = expectedPredicates[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _expectedPredicate = _step2.value;
          assert.strictEqual(rule.predicate(_expectedPredicate, object), true, _expectedPredicate);
          assert.strictEqual(rule.predicate(_expectedPredicate, objectChild), false, _expectedPredicate);
        } // test iterateObject

      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      assert.strictEqual(_typeof(rule.iterateObject), 'function');
      assert.deepStrictEqual(Array.from(rule.iterateObject(object)).sort(), expectedPredicates.map(function (o) {
        return 'value_' + o;
      }).sort());
      assert.deepStrictEqual(Array.from(rule.iterateObject(objectChild)), []);
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
    assert.strictEqual(builder.rule, undefined); // @ts-ignore

    assert.throws(function () {
      return builder.propertyRegexp();
    }, Error); // @ts-ignore

    assert.throws(function () {
      return builder.propertyRegexp('string');
    }, Error);
    assert.throws(function () {
      return builder.propertyRegexp(null);
    }, Error); // @ts-ignore

    assert.throws(function () {
      return builder.propertyPredicate();
    }, Error); // @ts-ignore

    assert.throws(function () {
      return builder.propertyPredicate('string');
    }, Error);
    assert.throws(function () {
      return builder.propertyPredicate(null, 'description');
    }, Error);
    assert.strictEqual(builder.rule, undefined);
    var builder1 = builder.propertyRegexp(/prop1|prop2/);
    var rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Property,
      predicate: ['prop1', 'prop2'],
      description: '/prop1|prop2/'
    });
    var builder2 = builder.propertyRegexp(/prop2|prop3/);
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.rule, rule1);
    assertRule(rule1, {
      type: RuleType.Property,
      predicate: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: RuleType.Property,
        predicate: ['prop2', 'prop3'],
        description: '/prop2|prop3/'
      }
    });
    var builder3 = builder.propertyRegexp(/prop3|prop4/);
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
    assertRule(rule1, {
      type: RuleType.Property,
      predicate: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: RuleType.Property,
        predicate: ['prop2', 'prop3'],
        description: '/prop2|prop3/',
        next: {
          type: RuleType.Property,
          predicate: ['prop3', 'prop4'],
          description: '/prop3|prop4/'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    var rule3 = builder3.rule.next.next;
  });
  it('propertyAll', function () {
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    var builder1 = builder.propertyAll();
    var rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Property,
      predicate: ANY,
      description: '*'
    });
    var builder2 = builder.propertyNames(ANY);
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.rule, rule1);
    assertRule(rule1, {
      type: RuleType.Property,
      predicate: ANY,
      description: '*',
      next: {
        type: RuleType.Property,
        predicate: ANY,
        description: '*'
      }
    });
    var builder3 = builder.propertyNames('prop1', ANY, 'prop2');
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
    assertRule(rule1, {
      type: RuleType.Property,
      predicate: ANY,
      description: '*',
      next: {
        type: RuleType.Property,
        predicate: ANY,
        description: '*',
        next: {
          type: RuleType.Property,
          predicate: ANY,
          description: '*'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    var rule3 = builder3.rule.next.next;
  });
  it('propertyNames', function () {
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    assert.throws(function () {
      return builder.propertyNames();
    }, Error);
    assert.throws(function () {
      return builder.propertyNames(true);
    }, Error);
    assert.throws(function () {
      return builder.propertyNames(true, true);
    }, Error);
    assert.throws(function () {
      return builder.propertyNames('prop1', true);
    }, Error);
    assert.strictEqual(builder.rule, undefined);
    var builder1 = builder.propertyNames('prop1');
    var rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Property,
      predicate: ['prop1'],
      description: 'prop1'
    });
    var builder2 = builder.propertyNames('prop2', 'prop3');
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.rule, rule1);
    assertRule(rule1, {
      type: RuleType.Property,
      predicate: ['prop1'],
      description: 'prop1',
      next: {
        type: RuleType.Property,
        predicate: ['prop2', 'prop3'],
        description: 'prop2|prop3'
      }
    });
    var builder3 = builder.propertyNames('prop3', 'prop4', 'prop5');
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
    assertRule(rule1, {
      type: RuleType.Property,
      predicate: ['prop1'],
      description: 'prop1',
      next: {
        type: RuleType.Property,
        predicate: ['prop2', 'prop3'],
        description: 'prop2|prop3',
        next: {
          type: RuleType.Property,
          predicate: ['prop3', 'prop4', 'prop5'],
          description: 'prop3|prop4|prop5'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

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