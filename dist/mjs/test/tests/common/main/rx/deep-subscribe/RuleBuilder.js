import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _typeof from "@babel/runtime/helpers/typeof";

/* tslint:disable:no-shadowed-variable no-duplicate-string */

/* eslint-disable no-useless-escape,computed-property-spacing */
import { ObjectMap } from '../../../../../../main/common/lists/ObjectMap';
import { ObjectSet } from '../../../../../../main/common/lists/ObjectSet';
import { ObservableMap } from '../../../../../../main/common/lists/ObservableMap';
import { ObservableSet } from '../../../../../../main/common/lists/ObservableSet';
import { SortedList } from '../../../../../../main/common/lists/SortedList';
import { ANY, ANY_DISPLAY, COLLECTION_PREFIX } from '../../../../../../main/common/rx/deep-subscribe/contracts/constants';
import { RuleType } from '../../../../../../main/common/rx/deep-subscribe/contracts/rules';
import { RuleBuilder } from '../../../../../../main/common/rx/deep-subscribe/RuleBuilder';
import { ObservableObjectBuilder } from '../../../../../../main/common/rx/object/ObservableObjectBuilder';
import { assert } from '../../../../../../main/common/test/Assert';
describe('common > main > rx > deep-subscribe > RuleBuilder', function () {
  // noinspection JSUnusedLocalSymbols
  function checkType(builder) {
    return true;
  }

  it('constructor', function () {
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
  });
  var nonSubscribeProperty = Math.random().toString(36);

  function testSubscribe(isCollection, isMap, nonObservableObject, observableObject, subscribe, properties, subscribeProperties, add, change, remove) {
    var nonSubscribeProperties = properties.slice();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = subscribeProperties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _property6 = _step.value;
        var index = void 0; // tslint:disable-next-line:no-conditional-assignment

        while ((index = nonSubscribeProperties.indexOf(_property6)) >= 0) {
          nonSubscribeProperties.splice(index, 1);
        }
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

    function checkDebugPropertyName(value, debugPropertyName) {
      assert.ok(debugPropertyName);
      assert.ok(debugPropertyName.length);

      if (isCollection) {
        assert.strictEqual(debugPropertyName[0], COLLECTION_PREFIX);
        debugPropertyName = debugPropertyName.substring(1);
      }

      if (isMap) {
        assert.strictEqual('value_' + debugPropertyName, value);
      }
    }

    var subscribedItems = [];

    function subscribeItem(value, debugPropertyName) {
      assert.ok(value);
      assert.strictEqual(_typeof(value), 'string', value);
      value = value.trim();
      checkDebugPropertyName(value, debugPropertyName);
      subscribedItems.push('+' + value);
    } // tslint:disable-next-line:no-identical-functions


    function unsubscribeItem(value, debugPropertyName) {
      assert.ok(value);
      value = value.trim();
      checkDebugPropertyName(value, debugPropertyName);
      subscribedItems.push('-' + value);
    }

    function testNonSubscribeProperties(object) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = nonSubscribeProperties[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _property = _step2.value;
          add(object, _property);
          assert.deepStrictEqual(subscribedItems, []);

          if (change) {
            change(object, _property);
            assert.deepStrictEqual(subscribedItems, []);
          }

          remove(object, _property, true);
          assert.deepStrictEqual(subscribedItems, []);

          if (_property === nonSubscribeProperty) {
            add(object, nonSubscribeProperty);
            assert.deepStrictEqual(subscribedItems, []);
          } // if (object === observableObject) {
          // 	assert.deepStrictEqual(subscribedItems, ['+undefined'])
          // 	subscribedItems = []
          // }

        }
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
    }

    var lastError;

    for (var debugIteration = 0; debugIteration < 2; debugIteration++) {
      try {
        // region Non Observable
        if (nonObservableObject) {
          var unsubscribe = subscribe(nonObservableObject, false, subscribeItem, unsubscribeItem);
          assert.strictEqual(unsubscribe, null);
          testNonSubscribeProperties(nonObservableObject);
          unsubscribe = subscribe(nonObservableObject, true, subscribeItem, unsubscribeItem);
          assert.ok(unsubscribe);
          assert.strictEqual(_typeof(unsubscribe), 'function');
          assert.deepStrictEqual(subscribedItems, []);
          subscribedItems = [];
          testNonSubscribeProperties(nonObservableObject);
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = subscribeProperties[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _property2 = _step3.value;
              add(nonObservableObject, _property2);
              assert.deepStrictEqual(subscribedItems, []);

              if (change) {
                change(nonObservableObject, _property2);
                assert.deepStrictEqual(subscribedItems, []);
              }
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
                _iterator3.return();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }

          testNonSubscribeProperties(nonObservableObject);
          unsubscribe();
          assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(function (o) {
            return '-value_' + o;
          }).sort());
          subscribedItems = [];
          unsubscribe = subscribe(nonObservableObject, true, subscribeItem, unsubscribeItem);
          assert.ok(unsubscribe);
          assert.strictEqual(_typeof(unsubscribe), 'function');
          assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(function (o) {
            return '+value_' + o;
          }).sort());
          subscribedItems = [];
          testNonSubscribeProperties(nonObservableObject);
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = subscribeProperties[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var _property3 = _step4.value;
              remove(nonObservableObject, _property3, false);
              assert.deepStrictEqual(subscribedItems, []);
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }

          testNonSubscribeProperties(nonObservableObject);
          unsubscribe();
          assert.deepStrictEqual(subscribedItems, []);
          subscribedItems = [];
          unsubscribe = subscribe(nonObservableObject, false, subscribeItem, unsubscribeItem);
          assert.strictEqual(unsubscribe, null);
          assert.deepStrictEqual(subscribedItems, []);
        } // endregion
        // region Observable


        if (observableObject) {
          var _unsubscribe = subscribe(observableObject, false, subscribeItem, unsubscribeItem);

          assert.ok(_unsubscribe);
          assert.strictEqual(_typeof(_unsubscribe), 'function');
          testNonSubscribeProperties(observableObject);

          _unsubscribe();

          assert.deepStrictEqual(subscribedItems, []);
          subscribedItems = [];
          _unsubscribe = subscribe(observableObject, true, subscribeItem, unsubscribeItem);
          assert.ok(_unsubscribe);
          assert.strictEqual(_typeof(_unsubscribe), 'function');
          assert.deepStrictEqual(subscribedItems, []);
          subscribedItems = [];
          testNonSubscribeProperties(observableObject);
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = subscribeProperties[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var _property4 = _step5.value;
              add(observableObject, _property4);
              assert.deepStrictEqual(subscribedItems, [// '-undefined',
              '+value_' + _property4]);
              subscribedItems = [];

              if (change) {
                change(observableObject, _property4);
                assert.deepStrictEqual(subscribedItems, ['-value_' + _property4, '+value_' + _property4]);
                subscribedItems = [];
              }
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }

          testNonSubscribeProperties(observableObject);

          _unsubscribe();

          assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(function (o) {
            return '-value_' + o;
          }).sort());
          subscribedItems = [];
          _unsubscribe = subscribe(observableObject, false, subscribeItem, unsubscribeItem);
          assert.ok(_unsubscribe);
          assert.strictEqual(_typeof(_unsubscribe), 'function');

          _unsubscribe();

          assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(function (o) {
            return '-value_' + o;
          }).sort());
          subscribedItems = [];
          _unsubscribe = subscribe(observableObject, true, subscribeItem, unsubscribeItem);
          assert.ok(_unsubscribe);
          assert.strictEqual(_typeof(_unsubscribe), 'function');
          assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(function (o) {
            return '+value_' + o;
          }).sort());
          subscribedItems = [];
          testNonSubscribeProperties(observableObject);
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = subscribeProperties[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var _property5 = _step6.value;
              remove(observableObject, _property5, false);
              assert.deepStrictEqual(subscribedItems, ['-value_' + _property5]);
              subscribedItems = [];
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          testNonSubscribeProperties(observableObject);

          _unsubscribe();

          assert.deepStrictEqual(subscribedItems, []);
          subscribedItems = [];
        } // endregion

      } catch (ex) {
        if (!lastError) {
          console.log(ex);
          lastError = ex;
        }
      }
    }

    if (lastError) {
      throw lastError;
    }
  }

  function testObject(properties, subscribe) {
    var builder = new ObservableObjectBuilder();

    if (properties !== ANY) {
      builder.writable(nonSubscribeProperty, null, 'value_' + nonSubscribeProperty);
    }

    function add(object, property) {
      if (object.propertyChanged) {
        new ObservableObjectBuilder(object).writable(property, null, 'value_' + property);
      } else {
        change(object, property);
      }
    }

    function change(object, property) {
      object[property] = object[property] ? object[property] + ' ' : 'value_' + property;
    }

    function remove(object, property, isNonSubscribe) {
      if (object.propertyChanged) {
        new ObservableObjectBuilder(object).delete(property);
      } else {
        delete object[property];
      }
    }

    testSubscribe(false, true, _objectSpread({}, builder.object), builder.object, subscribe, [nonSubscribeProperty].concat(_toConsumableArray(properties === ANY ? [] : properties)), properties === ANY ? [nonSubscribeProperty, 'p1', 'p2', 'p3'] : properties, add, change, remove);
    builder.writable('p1', null, 'value_p1').writable('p2', null, 'value_p2').writable('p3', null, 'value_p3');
    testSubscribe(false, true, Object.create(_objectSpread({}, builder.object)), Object.create(builder.object), subscribe, [nonSubscribeProperty].concat(_toConsumableArray(properties === ANY ? [] : properties)), [], function (object, property) {
      Object.defineProperty(object, property, {
        configurable: true,
        writable: true,
        value: 'value_' + property
      });
    }, change, function (object, property) {
      delete object[property];
    });
  }

  function testArray(properties, subscribe) {
    if (properties === ANY || properties.indexOf('length') >= 0) {
      return;
    }

    var object = [];
    object[nonSubscribeProperty] = 'value_' + nonSubscribeProperty; // tslint:disable-next-line:no-identical-functions

    function change(object, property) {
      object[property] = object[property] ? object[property] + ' ' : 'value_' + property;
    }

    function remove(object, property) {
      delete object[property];
    }

    testSubscribe(false, true, object, null, subscribe, [nonSubscribeProperty].concat(_toConsumableArray(properties === ANY ? [] : properties)), properties === ANY ? [nonSubscribeProperty] : properties, change, change, remove);
  }

  function testMap(properties, subscribe) {
    var map = new ObjectMap();
    var observableMap = new ObservableMap(new ObjectMap());

    if (properties !== ANY) {
      map.set(nonSubscribeProperty, 'value_' + nonSubscribeProperty);
      observableMap.set(nonSubscribeProperty, 'value_' + nonSubscribeProperty);
    }

    function change(object, property) {
      object.set(property, object.get(property) ? object.get(property) + ' ' : 'value_' + property);
    }

    function remove(object, property) {
      object.delete(property);
    }

    testSubscribe(true, true, map, observableMap, subscribe, [nonSubscribeProperty].concat(_toConsumableArray(properties === ANY ? [] : properties)), properties === ANY ? [nonSubscribeProperty, 'p1', 'p2', 'p3'] : properties, change, change, remove);
  }

  function testSet(properties, subscribe) {
    var set = new ObjectSet();
    var observableSet = new ObservableSet(new ObjectSet());

    function add(object, property) {
      object.add('value_' + property);
    }

    function remove(object, property) {
      object.delete('value_' + property);
    }

    testSubscribe(true, false, set, observableSet, subscribe, [], ['p1', 'p2', 'p3'], add, null, remove);
  }

  function testIterable(properties, subscribe) {
    assert.strictEqual(subscribe({}, true, function (item) {
      assert.fail();
    }, function (item) {
      assert.fail();
    }), null);
    var array = []; // tslint:disable-next-line:no-identical-functions

    function add(object, property) {
      object.push('value_' + property);
    }

    function change(object, property) {
      for (var i = object.length - 1; i >= 0; i--) {
        if (object[i].trim() === 'value_' + property) {
          object[i] += ' ';
          return;
        }
      }
    }

    function remove(object, property) {
      for (var i = object.length - 1; i >= 0; i--) {
        if (object[i].trim() === 'value_' + property) {
          object.splice(i, 1);
          return;
        }
      }
    }

    testSubscribe(true, false, array, null, subscribe, [], ['p1', 'p2', 'p3'], add, change, remove);
  }

  function testList(properties, subscribe) {
    var list = new SortedList({
      autoSort: true,
      notAddIfExists: true
    }); // @ts-ignore

    Object.defineProperty(list, 'listChanged', {
      configurable: true,
      writable: true,
      value: null
    });
    var observableList = new SortedList({
      autoSort: true,
      notAddIfExists: true
    }); // tslint:disable-next-line:no-identical-functions

    function add(object, property) {
      object.add('value_' + property);
    }

    function change(object, property) {
      for (var i = object.size - 1; i >= 0; i--) {
        if (object.get(i).trim() === 'value_' + property) {
          object.set(i, object.get(i) + ' ');
          return;
        }
      }
    }

    function remove(object, property) {
      for (var i = object.size - 1; i >= 0; i--) {
        if (object.get(i).trim() === 'value_' + property) {
          object.removeAt(i);
          return;
        }
      }
    }

    testSubscribe(true, false, list, observableList, subscribe, [], ['p1', 'p2', 'p3'], add, change, remove);
  }

  function assertRuleParams(rule, expected) {
    rule = _objectSpread({}, rule);
    expected = _objectSpread({}, expected);

    if ('unsubscribePropertyName' in rule) {
      expected.unsubscribePropertyName = rule.unsubscribePropertyName;
    }

    delete rule.subscribe;
    delete rule.next;
    delete rule.rule;
    delete rule.rules;
    delete expected.objectTypes;
    delete expected.properties;
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

    if (rule.type === RuleType.Action) {
      assert.ok(expected.objectTypes && expected.objectTypes.length);
      assert.ok(expected.properties === ANY || expected.properties.length);
      assert.ok(rule.subscribe);
      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = expected.objectTypes[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var objectType = _step7.value;

          switch (objectType) {
            case 'object':
              testObject(expected.properties, rule.subscribe);
              break;

            case 'array':
              testArray(expected.properties, rule.subscribe);
              break;

            case 'map':
              testMap(expected.properties, rule.subscribe);
              break;

            case 'list':
              testList(expected.properties, rule.subscribe);
              break;

            case 'iterable':
              testIterable(expected.properties, rule.subscribe);
              break;

            case 'set':
              testSet(expected.properties, rule.subscribe);
              break;

            default:
              assert.fail('Unknown objectType: ' + objectType);
          }
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
            _iterator7.return();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    } else {
      assert.notOk(expected.objectTypes);
      assert.notOk(expected.properties);
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
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1'
    });
    var builder3 = builder1.path(function (o) {
      return o["prop '2'"].prop3;
    });
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
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
            description: 'length'
          }
        }
      }
    });
  });
  it('path complex', function () {
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    var builder1 = builder.path(function (o) {
      return o['prop1|prop2']['#prop3']['#prop4|prop5']['*']['#']['#*'];
    });
    var rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
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
          properties: ['prop4', 'prop5'],
          description: '#prop4|prop5',
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
                description: COLLECTION_PREFIX + ANY_DISPLAY
              }
            }
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
      return builder.propertyPredicate('string');
    }, Error);
    assert.strictEqual(builder.rule, undefined);
    var builder1 = builder.propertyRegexp(/prop1|prop2/);
    var rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/'
    });
    var builder2 = builder.propertyRegexp(/prop2|prop3/);
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.rule, rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ['prop2', 'prop3'],
        description: '/prop2|prop3/'
      }
    });
    var builder3 = builder.propertyRegexp(/prop3|prop4/);
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
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
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ANY,
      description: ANY_DISPLAY
    });
    var builder2 = builder.propertyNames(ANY);
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.rule, rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ANY,
      description: ANY_DISPLAY,
      next: {
        type: RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ANY,
        description: ANY_DISPLAY
      }
    });
    var builder3 = builder.propertyNames('prop1', ANY, 'prop2');
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
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
          description: "prop1|".concat(ANY_DISPLAY, "|prop2")
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    var rule3 = builder3.rule.next.next;
  });
  it('propertyNames', function () {
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    assert.strictEqual(builder.rule, undefined);
    var builder1 = builder.propertyNames('prop1');
    var rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1'
    });
    var builder2 = builder.propertyName('prop2');
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.rule, rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1',
      next: {
        type: RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ['prop2'],
        description: 'prop2'
      }
    });
    var builder3 = builder.propertyNames('prop3', 'prop4', 'prop5');
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
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
          description: 'prop3|prop4|prop5'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    var rule3 = builder3.rule.next.next;
  });
  it('map', function () {
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined); // @ts-ignore

    assert.throws(function () {
      return builder.mapRegexp();
    }, Error); // @ts-ignore

    assert.throws(function () {
      return builder.mapRegexp('string');
    }, Error);
    assert.throws(function () {
      return builder.mapRegexp(null);
    }, Error); // @ts-ignore

    assert.throws(function () {
      return builder.mapPredicate('string');
    }, Error);
    assert.strictEqual(builder.rule, undefined);
    var builder1 = builder.mapRegexp(/prop1|prop2/);
    var rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/'
    });
    var builder2 = builder.mapRegexp(/prop2|prop3/);
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.rule, rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: RuleType.Action,
        objectTypes: ['map'],
        properties: ['prop2', 'prop3'],
        description: '/prop2|prop3/'
      }
    });
    var builder3 = builder.mapRegexp(/prop3|prop4/);
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
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
          description: '/prop3|prop4/'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    var rule3 = builder3.rule.next.next;
  });
  it('mapAll', function () {
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    var builder1 = builder.mapAll();
    var rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ANY,
      description: COLLECTION_PREFIX
    });
    var builder2 = builder.mapKeys();
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.rule, rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ANY,
      description: COLLECTION_PREFIX,
      next: {
        type: RuleType.Action,
        objectTypes: ['map'],
        properties: ANY,
        description: COLLECTION_PREFIX
      }
    });
    var builder3 = builder.mapKeys('prop1', ANY, 'prop2');
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
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
          description: "".concat(COLLECTION_PREFIX, "prop1|").concat(ANY_DISPLAY, "|prop2")
        }
      }
    });
    var builder4 = builder.mapKeys(ANY);
    checkType(builder4);
    assert.strictEqual(builder4, builder);
    assert.strictEqual(builder4.rule, rule1);
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
          description: "".concat(COLLECTION_PREFIX, "prop1|").concat(ANY_DISPLAY, "|prop2"),
          next: {
            type: RuleType.Action,
            objectTypes: ['map'],
            properties: ANY,
            description: COLLECTION_PREFIX + ANY_DISPLAY
          }
        }
      }
    });
  });
  it('mapKeys', function () {
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    assert.strictEqual(builder.rule, undefined);
    var builder1 = builder.mapKeys('prop1');
    var rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1'],
      description: COLLECTION_PREFIX + 'prop1'
    });
    var builder2 = builder.mapKey('prop2');
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.rule, rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1'],
      description: COLLECTION_PREFIX + 'prop1',
      next: {
        type: RuleType.Action,
        objectTypes: ['map'],
        properties: ['prop2'],
        description: COLLECTION_PREFIX + 'prop2'
      }
    });
    var builder3 = builder.mapKeys('prop3', 'prop4', 'prop5');
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
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
          description: COLLECTION_PREFIX + 'prop3|prop4|prop5'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    var rule3 = builder3.rule.next.next;
  });
  it('collection', function () {
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    var builder1 = builder.collection();
    var rule1 = builder1.rule;
    assert.strictEqual(builder1, builder);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['set'],
      properties: ANY,
      description: COLLECTION_PREFIX
    });
    var builder2 = builder.collection();
    checkType(builder2);
    assert.strictEqual(builder2, builder);
    assert.strictEqual(builder2.rule, rule1);
    assertRule(rule1, {
      type: RuleType.Action,
      objectTypes: ['map', 'set', 'list', 'iterable'],
      properties: ANY,
      description: COLLECTION_PREFIX,
      next: {
        type: RuleType.Action,
        objectTypes: ['set'],
        properties: ANY,
        description: COLLECTION_PREFIX
      }
    });
    var builder3 = builder.collection();
    checkType(builder3);
    assert.strictEqual(builder3, builder);
    assert.strictEqual(builder3.rule, rule1);
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
          description: COLLECTION_PREFIX
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    var rule3 = builder3.rule.next.next;
  });
  it('repeat', function () {
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    assert.throws(function () {
      return builder.repeat(1, 1, function (b) {
        return null;
      });
    }, [Error, TypeError, ReferenceError]);
    assert.throws(function () {
      return builder.repeat(1, 1, function (b) {
        return {
          rule: null
        };
      });
    }, [Error, TypeError, ReferenceError]);
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
          description: 'prop1'
        },
        next: {
          type: RuleType.Repeat,
          countMin: 0,
          countMax: 2,
          rule: {
            type: RuleType.Action,
            objectTypes: ['object', 'array'],
            properties: ["prop '2'"],
            description: "prop '2'"
          },
          next: {
            type: RuleType.Repeat,
            countMin: 3,
            countMax: 4,
            rule: {
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4'],
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
          type: RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ['prop5'],
          description: 'prop5'
        },
        next: {
          type: RuleType.Repeat,
          countMin: 7,
          countMax: 8,
          rule: {
            type: RuleType.Action,
            objectTypes: ['object', 'array'],
            properties: ['length'],
            description: 'length'
          }
        }
      }
    });
  });
  it('any', function () {
    var builder = new RuleBuilder();
    assert.strictEqual(builder.rule, undefined);
    assert.throws(function () {
      return builder.any();
    }, [Error, TypeError, ReferenceError]);
    assert.throws(function () {
      return builder.any(null);
    }, [Error, TypeError, ReferenceError]);
    assert.throws(function () {
      return builder.any(function (b) {
        return null;
      });
    }, [Error, TypeError, ReferenceError]);
    assert.throws(function () {
      return builder.any(function (b) {
        return {
          rule: null
        };
      });
    }, [Error, TypeError, ReferenceError]);
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
        type: RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ['prop1'],
        description: 'prop1'
      }],
      next: {
        type: RuleType.Any,
        rules: [{
          type: RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ["prop '2'"],
          description: "prop '2'"
        }],
        next: {
          type: RuleType.Any,
          rules: [{
            type: RuleType.Any,
            rules: [{
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4'],
              description: 'prop4'
            }]
          }, {
            type: RuleType.Any,
            rules: [{
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4'],
              description: 'prop4'
            }, {
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4_1'],
              description: 'prop4_1'
            }]
          }, {
            type: RuleType.Any,
            rules: [{
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4'],
              description: 'prop4'
            }, {
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4_1'],
              description: 'prop4_1'
            }, {
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4_2'],
              description: 'prop4_2'
            }]
          }],
          next: {
            type: RuleType.Any,
            rules: [{
              type: RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop5'],
              description: 'prop5'
            }],
            next: {
              type: RuleType.Any,
              rules: [{
                type: RuleType.Action,
                objectTypes: ['object', 'array'],
                properties: ['length'],
                description: 'length'
              }]
            }
          }
        }
      }
    });
  });
});