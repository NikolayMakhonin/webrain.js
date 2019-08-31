"use strict";

var _ObjectMap = require("../../../../../../main/common/lists/ObjectMap");

var _ObjectSet = require("../../../../../../main/common/lists/ObjectSet");

var _ObservableMap = require("../../../../../../main/common/lists/ObservableMap");

var _ObservableSet = require("../../../../../../main/common/lists/ObservableSet");

var _SortedList = require("../../../../../../main/common/lists/SortedList");

var _constants = require("../../../../../../main/common/rx/deep-subscribe/contracts/constants");

var _rules = require("../../../../../../main/common/rx/deep-subscribe/contracts/rules");

var _RuleBuilder = require("../../../../../../main/common/rx/deep-subscribe/RuleBuilder");

var _ObservableObjectBuilder = require("../../../../../../main/common/rx/object/ObservableObjectBuilder");

var _Assert = require("../../../../../../main/common/test/Assert");

/* tslint:disable:no-shadowed-variable no-duplicate-string */

/* eslint-disable no-useless-escape,computed-property-spacing */
describe('common > main > rx > deep-subscribe > RuleBuilder', function () {
  // noinspection JSUnusedLocalSymbols
  function checkType(builder) {
    return true;
  }

  it('constructor', function () {
    const builder = new _RuleBuilder.RuleBuilder();

    _Assert.assert.strictEqual(builder.result, undefined);
  });
  const nonSubscribeProperty = Math.random().toString(36);

  function testSubscribe(isCollection, isMap, nonObservableObject, observableObject, subscribe, properties, subscribeProperties, add, change, remove) {
    const nonSubscribeProperties = properties.slice();

    for (const property of subscribeProperties) {
      let index; // tslint:disable-next-line:no-conditional-assignment

      while ((index = nonSubscribeProperties.indexOf(property)) >= 0) {
        nonSubscribeProperties.splice(index, 1);
      }
    }

    function checkDebugPropertyName(value, debugPropertyName) {
      _Assert.assert.ok(debugPropertyName);

      _Assert.assert.ok(debugPropertyName.length);

      if (isCollection) {
        _Assert.assert.strictEqual(debugPropertyName[0], _constants.COLLECTION_PREFIX);

        debugPropertyName = debugPropertyName.substring(1);
      }

      if (isMap) {
        _Assert.assert.strictEqual('value_' + debugPropertyName, value);
      }
    }

    let subscribedItems = [];

    function subscribeItem(value, debugPropertyName) {
      _Assert.assert.ok(value);

      _Assert.assert.strictEqual(typeof value, 'string', value);

      value = value.trim();
      checkDebugPropertyName(value, debugPropertyName);
      subscribedItems.push('+' + value);
    } // tslint:disable-next-line:no-identical-functions


    function unsubscribeItem(value, debugPropertyName) {
      _Assert.assert.ok(value);

      value = value.trim();
      checkDebugPropertyName(value, debugPropertyName);
      subscribedItems.push('-' + value);
    }

    function testNonSubscribeProperties(object) {
      for (const property of nonSubscribeProperties) {
        add(object, property);

        _Assert.assert.deepStrictEqual(subscribedItems, []);

        if (change) {
          change(object, property);

          _Assert.assert.deepStrictEqual(subscribedItems, []);
        }

        remove(object, property, true);

        _Assert.assert.deepStrictEqual(subscribedItems, []);

        if (property === nonSubscribeProperty) {
          add(object, nonSubscribeProperty);

          _Assert.assert.deepStrictEqual(subscribedItems, []);
        } // if (object === observableObject) {
        // 	assert.deepStrictEqual(subscribedItems, ['+undefined'])
        // 	subscribedItems = []
        // }

      }
    }

    let lastError;

    for (let debugIteration = 0; debugIteration < 2; debugIteration++) {
      try {
        // region Non Observable
        const testNonObservableObject = object => {
          let unsubscribe = subscribe(object, false, subscribeItem, unsubscribeItem);

          _Assert.assert.strictEqual(unsubscribe, null);

          testNonSubscribeProperties(object);
          unsubscribe = subscribe(object, true, subscribeItem, unsubscribeItem);

          _Assert.assert.ok(unsubscribe);

          _Assert.assert.strictEqual(typeof unsubscribe, 'function');

          _Assert.assert.deepStrictEqual(subscribedItems, []);

          subscribedItems = [];
          testNonSubscribeProperties(object);

          for (const property of subscribeProperties) {
            add(object, property);

            _Assert.assert.deepStrictEqual(subscribedItems, []);

            if (change) {
              change(object, property);

              _Assert.assert.deepStrictEqual(subscribedItems, []);
            }
          }

          testNonSubscribeProperties(object);
          unsubscribe();

          _Assert.assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '-value_' + o).sort());

          subscribedItems = [];
          unsubscribe = subscribe(object, true, subscribeItem, unsubscribeItem);

          _Assert.assert.ok(unsubscribe);

          _Assert.assert.strictEqual(typeof unsubscribe, 'function');

          _Assert.assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '+value_' + o).sort());

          subscribedItems = [];
          testNonSubscribeProperties(object);

          for (const property of subscribeProperties) {
            remove(object, property, false);

            _Assert.assert.deepStrictEqual(subscribedItems, []);
          }

          testNonSubscribeProperties(object);
          unsubscribe();

          _Assert.assert.deepStrictEqual(subscribedItems, []);

          subscribedItems = [];
          unsubscribe = subscribe(object, false, subscribeItem, unsubscribeItem);

          _Assert.assert.strictEqual(unsubscribe, null);

          _Assert.assert.deepStrictEqual(subscribedItems, []);
        }; // endregion
        // region Observable


        const testObservableObject = object => {
          let unsubscribe = subscribe(object, false, subscribeItem, unsubscribeItem);

          _Assert.assert.ok(unsubscribe);

          _Assert.assert.strictEqual(typeof unsubscribe, 'function');

          testNonSubscribeProperties(object);
          unsubscribe();

          _Assert.assert.deepStrictEqual(subscribedItems, []);

          subscribedItems = [];
          unsubscribe = subscribe(object, true, subscribeItem, unsubscribeItem);

          _Assert.assert.ok(unsubscribe);

          _Assert.assert.strictEqual(typeof unsubscribe, 'function');

          _Assert.assert.deepStrictEqual(subscribedItems, []);

          subscribedItems = [];
          testNonSubscribeProperties(object);

          for (const property of subscribeProperties) {
            add(object, property);

            _Assert.assert.deepStrictEqual(subscribedItems, [// '-undefined',
            '+value_' + property]);

            subscribedItems = [];

            if (change) {
              change(object, property);

              _Assert.assert.deepStrictEqual(subscribedItems, ['-value_' + property, '+value_' + property]);

              subscribedItems = [];
            }
          }

          testNonSubscribeProperties(object);
          unsubscribe();

          _Assert.assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '-value_' + o).sort());

          subscribedItems = [];
          unsubscribe = subscribe(object, false, subscribeItem, unsubscribeItem);

          _Assert.assert.ok(unsubscribe);

          _Assert.assert.strictEqual(typeof unsubscribe, 'function');

          unsubscribe();

          _Assert.assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '-value_' + o).sort());

          subscribedItems = [];
          unsubscribe = subscribe(object, true, subscribeItem, unsubscribeItem);

          _Assert.assert.ok(unsubscribe);

          _Assert.assert.strictEqual(typeof unsubscribe, 'function');

          _Assert.assert.deepStrictEqual(subscribedItems.sort(), subscribeProperties.map(o => '+value_' + o).sort());

          subscribedItems = [];
          testNonSubscribeProperties(object);

          for (const property of subscribeProperties) {
            remove(object, property, false);

            _Assert.assert.deepStrictEqual(subscribedItems, ['-value_' + property]);

            subscribedItems = [];
          }

          testNonSubscribeProperties(object);
          unsubscribe();

          _Assert.assert.deepStrictEqual(subscribedItems, []);

          subscribedItems = [];
        }; // endregion


        if (observableObject) {
          testObservableObject(observableObject);
        }

        if (nonObservableObject) {// Obsolete
          // testNonObservableObject(nonObservableObject)
          // testObservableObject(nonObservableObject)
        }
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
    const builder = new _ObservableObjectBuilder.ObservableObjectBuilder();

    if (properties !== _constants.ANY) {
      builder.writable(nonSubscribeProperty, null, 'value_' + nonSubscribeProperty);
    }

    function add(object, property) {
      if (object.propertyChanged) {
        new _ObservableObjectBuilder.ObservableObjectBuilder(object).writable(property, null, 'value_' + property);
      } else {
        change(object, property);
      }
    }

    function change(object, property) {
      object[property] = object[property] ? object[property] + ' ' : 'value_' + property;
    }

    function remove(object, property, isNonSubscribe) {
      if (object.propertyChanged) {
        new _ObservableObjectBuilder.ObservableObjectBuilder(object).delete(property);
      } else {
        delete object[property];
      }
    }

    testSubscribe(false, true, { ...builder.object
    }, builder.object, subscribe, [nonSubscribeProperty, ...(properties === _constants.ANY ? [] : properties)], properties === _constants.ANY ? [nonSubscribeProperty, 'p1', 'p2', 'p3'] : properties, add, change, remove); // builder
    // 	.writable('p1', null, 'value_p1')
    // 	.writable('p2', null, 'value_p2')
    // 	.writable('p3', null, 'value_p3')

    testSubscribe(false, true, Object.create({ ...builder.object
    }), Object.create(builder.object), subscribe, [nonSubscribeProperty, ...(properties === _constants.ANY ? [] : properties)], [], (object, property) => {
      Object.defineProperty(object, property, {
        configurable: true,
        writable: true,
        value: 'value_' + property
      });
    }, change, (object, property) => {
      delete object[property];
    });
  }

  function testArray(properties, subscribe) {
    if (properties === _constants.ANY || properties.indexOf('length') >= 0) {
      return;
    }

    const object = [];
    object[nonSubscribeProperty] = 'value_' + nonSubscribeProperty; // tslint:disable-next-line:no-identical-functions

    function change(object, property) {
      object[property] = object[property] ? object[property] + ' ' : 'value_' + property;
    }

    function remove(object, property) {
      delete object[property];
    }

    testSubscribe(false, true, object, null, subscribe, [nonSubscribeProperty, ...(properties === _constants.ANY ? [] : properties)], properties === _constants.ANY ? [nonSubscribeProperty] : properties, change, change, remove);
  }

  function testMap(properties, subscribe) {
    const map = new _ObjectMap.ObjectMap();
    const observableMap = new _ObservableMap.ObservableMap(new _ObjectMap.ObjectMap());

    if (properties !== _constants.ANY) {
      map.set(nonSubscribeProperty, 'value_' + nonSubscribeProperty);
      observableMap.set(nonSubscribeProperty, 'value_' + nonSubscribeProperty);
    }

    function change(object, property) {
      object.set(property, object.get(property) ? object.get(property) + ' ' : 'value_' + property);
    }

    function remove(object, property) {
      object.delete(property);
    }

    testSubscribe(true, true, map, observableMap, subscribe, [nonSubscribeProperty, ...(properties === _constants.ANY ? [] : properties)], properties === _constants.ANY ? [nonSubscribeProperty, 'p1', 'p2', 'p3'] : properties, change, change, remove);
  }

  function testSet(properties, subscribe) {
    const set = new _ObjectSet.ObjectSet();
    const observableSet = new _ObservableSet.ObservableSet(new _ObjectSet.ObjectSet());

    function add(object, property) {
      object.add('value_' + property);
    }

    function remove(object, property) {
      object.delete('value_' + property);
    }

    testSubscribe(true, false, set, observableSet, subscribe, [], ['p1', 'p2', 'p3'], add, null, remove);
  }

  function testIterable(properties, subscribe) {
    _Assert.assert.strictEqual(subscribe({}, true, item => {
      _Assert.assert.fail();
    }, item => {
      _Assert.assert.fail();
    }), null);

    const array = []; // tslint:disable-next-line:no-identical-functions

    function add(object, property) {
      object.push('value_' + property);
    }

    function change(object, property) {
      for (let i = object.length - 1; i >= 0; i--) {
        if (object[i].trim() === 'value_' + property) {
          object[i] += ' ';
          return;
        }
      }
    }

    function remove(object, property) {
      for (let i = object.length - 1; i >= 0; i--) {
        if (object[i].trim() === 'value_' + property) {
          object.splice(i, 1);
          return;
        }
      }
    }

    testSubscribe(true, false, array, null, subscribe, [], ['p1', 'p2', 'p3'], add, change, remove);
  }

  function testList(properties, subscribe) {
    const list = new _SortedList.SortedList({
      autoSort: true,
      notAddIfExists: true
    }); // @ts-ignore

    Object.defineProperty(list, 'listChanged', {
      configurable: true,
      writable: true,
      value: null
    });
    const observableList = new _SortedList.SortedList({
      autoSort: true,
      notAddIfExists: true
    }); // tslint:disable-next-line:no-identical-functions

    function add(object, property) {
      object.add('value_' + property);
    }

    function change(object, property) {
      for (let i = object.size - 1; i >= 0; i--) {
        if (object.get(i).trim() === 'value_' + property) {
          object.set(i, object.get(i) + ' ');
          return;
        }
      }
    }

    function remove(object, property) {
      for (let i = object.size - 1; i >= 0; i--) {
        if (object.get(i).trim() === 'value_' + property) {
          object.removeAt(i);
          return;
        }
      }
    }

    testSubscribe(true, false, list, observableList, subscribe, [], ['p1', 'p2', 'p3'], add, change, remove);
  }

  function assertRuleParams(rule, expected) {
    rule = { ...rule
    };
    expected = { ...expected
    };

    if ('unsubscribers' in rule) {
      expected.unsubscribers = rule.unsubscribers;
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

    _Assert.assert.deepStrictEqual(rule, expected);
  }

  function _assertRule(rule, expected) {
    if (!expected) {
      _Assert.assert.strictEqual(rule, expected);

      return;
    }

    assertRuleParams(rule, expected);

    if (rule.type === _rules.RuleType.Action) {
      _Assert.assert.ok(expected.objectTypes && expected.objectTypes.length);

      _Assert.assert.ok(expected.properties === _constants.ANY || expected.properties.length);

      _Assert.assert.ok(rule.subscribe);

      for (const objectType of expected.objectTypes) {
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
            _Assert.assert.fail('Unknown objectType: ' + objectType);

        }
      }
    } else {
      _Assert.assert.notOk(expected.objectTypes);

      _Assert.assert.notOk(expected.properties);
    }

    _assertRule(rule.next, expected.next);

    _assertRule(rule.rule, expected.rule);

    if (!expected.rules) {
      _Assert.assert.strictEqual(rule.rules, undefined);
    } else {
      _Assert.assert.ok(rule.rules);

      _Assert.assert.strictEqual(rule.rules.length, expected.rules.length);

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

    _Assert.assert.strictEqual(builder.result, undefined);

    const builder1 = builder.path(o => o.prop1);
    const rule1 = builder1.result;

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1'
    });
    const builder3 = builder1.path(o => o["prop '2'"].prop3);
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1',
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ["prop '2'"],
        description: "prop '2'",
        next: {
          type: _rules.RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ['prop3'],
          description: 'prop3'
        }
      }
    });
    const builder4 = builder3.path(o => o.length);
    checkType(builder4);

    _Assert.assert.strictEqual(builder4, builder);

    _Assert.assert.strictEqual(builder4.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1',
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ["prop '2'"],
        description: "prop '2'",
        next: {
          type: _rules.RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ['prop3'],
          description: 'prop3',
          next: {
            type: _rules.RuleType.Action,
            objectTypes: ['object', 'array'],
            properties: ['length'],
            description: 'length'
          }
        }
      }
    });
  });
  it('path complex', function () {
    const builder = new _RuleBuilder.RuleBuilder();

    _Assert.assert.strictEqual(builder.result, undefined);

    const builder1 = builder.path(o => o['prop1|prop2']['#prop3']['#prop4||prop5']['*']['#']['#*']);
    const rule1 = builder1.result;

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1', 'prop2'],
      description: 'prop1|prop2',
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['map'],
        properties: ['prop3'],
        description: '#prop3',
        next: {
          type: _rules.RuleType.Action,
          objectTypes: ['map'],
          properties: ['prop4', '', 'prop5'],
          description: '#prop4||prop5',
          next: {
            type: _rules.RuleType.Action,
            objectTypes: ['object', 'array'],
            properties: _constants.ANY,
            description: _constants.ANY_DISPLAY,
            next: {
              type: _rules.RuleType.Action,
              objectTypes: ['map', 'set', 'list', 'iterable'],
              properties: _constants.ANY,
              description: _constants.COLLECTION_PREFIX,
              next: {
                type: _rules.RuleType.Action,
                objectTypes: ['map'],
                properties: _constants.ANY,
                description: _constants.COLLECTION_PREFIX + _constants.ANY_DISPLAY
              }
            }
          }
        }
      }
    });
  });
  it('property', function () {
    const builder = new _RuleBuilder.RuleBuilder();

    _Assert.assert.strictEqual(builder.result, undefined); // @ts-ignore


    _Assert.assert.throws(() => builder.propertyRegexp(), Error); // @ts-ignore


    _Assert.assert.throws(() => builder.propertyRegexp('string'), Error);

    _Assert.assert.throws(() => builder.propertyRegexp(null), Error); // @ts-ignore


    _Assert.assert.throws(() => builder.propertyPredicate('string'), Error);

    _Assert.assert.strictEqual(builder.result, undefined);

    const builder1 = builder.propertyRegexp(/prop1|prop2/);
    const rule1 = builder1.result;

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/'
    });
    const builder2 = builder.propertyRegexp(/prop2|prop3/);
    checkType(builder2);

    _Assert.assert.strictEqual(builder2, builder);

    _Assert.assert.strictEqual(builder2.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ['prop2', 'prop3'],
        description: '/prop2|prop3/'
      }
    });
    const builder3 = builder.propertyRegexp(/prop3|prop4/);
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ['prop2', 'prop3'],
        description: '/prop2|prop3/',
        next: {
          type: _rules.RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ['prop3', 'prop4'],
          description: '/prop3|prop4/'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    const rule3 = builder3.result.next.next;
  });
  it('propertyAll', function () {
    const builder = new _RuleBuilder.RuleBuilder();

    _Assert.assert.strictEqual(builder.result, undefined);

    const builder1 = builder.propertyAll();
    const rule1 = builder1.result;

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: _constants.ANY,
      description: _constants.ANY_DISPLAY
    });
    const builder2 = builder.propertyNames(_constants.ANY);
    checkType(builder2);

    _Assert.assert.strictEqual(builder2, builder);

    _Assert.assert.strictEqual(builder2.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: _constants.ANY,
      description: _constants.ANY_DISPLAY,
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: _constants.ANY,
        description: _constants.ANY_DISPLAY
      }
    });
    const builder3 = builder.propertyNames('prop1', _constants.ANY, 'prop2');
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: _constants.ANY,
      description: _constants.ANY_DISPLAY,
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: _constants.ANY,
        description: _constants.ANY_DISPLAY,
        next: {
          type: _rules.RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: _constants.ANY,
          description: `prop1|${_constants.ANY_DISPLAY}|prop2`
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    const rule3 = builder3.result.next.next;
  });
  it('propertyNames', function () {
    const builder = new _RuleBuilder.RuleBuilder();

    _Assert.assert.strictEqual(builder.result, undefined);

    _Assert.assert.strictEqual(builder.result, undefined);

    const builder1 = builder.propertyNames('prop1');
    const rule1 = builder1.result;

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1'
    });
    const builder2 = builder.propertyName('prop2');
    checkType(builder2);

    _Assert.assert.strictEqual(builder2, builder);

    _Assert.assert.strictEqual(builder2.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1',
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ['prop2'],
        description: 'prop2'
      }
    });
    const builder3 = builder.propertyNames('prop3', 'prop4', 'prop5');
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1',
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ['prop2'],
        description: 'prop2',
        next: {
          type: _rules.RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ['prop3', 'prop4', 'prop5'],
          description: 'prop3|prop4|prop5'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    const rule3 = builder3.result.next.next;
  });
  it('map', function () {
    const builder = new _RuleBuilder.RuleBuilder();

    _Assert.assert.strictEqual(builder.result, undefined); // @ts-ignore


    _Assert.assert.throws(() => builder.mapRegexp(), Error); // @ts-ignore


    _Assert.assert.throws(() => builder.mapRegexp('string'), Error);

    _Assert.assert.throws(() => builder.mapRegexp(null), Error); // @ts-ignore


    _Assert.assert.throws(() => builder.mapPredicate('string'), Error);

    _Assert.assert.strictEqual(builder.result, undefined);

    const builder1 = builder.mapRegexp(/prop1|prop2/);
    const rule1 = builder1.result;

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/'
    });
    const builder2 = builder.mapRegexp(/prop2|prop3/);
    checkType(builder2);

    _Assert.assert.strictEqual(builder2, builder);

    _Assert.assert.strictEqual(builder2.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['map'],
        properties: ['prop2', 'prop3'],
        description: '/prop2|prop3/'
      }
    });
    const builder3 = builder.mapRegexp(/prop3|prop4/);
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['map'],
        properties: ['prop2', 'prop3'],
        description: '/prop2|prop3/',
        next: {
          type: _rules.RuleType.Action,
          objectTypes: ['map'],
          properties: ['prop3', 'prop4'],
          description: '/prop3|prop4/'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    const rule3 = builder3.result.next.next;
  });
  it('mapAll', function () {
    const builder = new _RuleBuilder.RuleBuilder();

    _Assert.assert.strictEqual(builder.result, undefined);

    const builder1 = builder.mapAll();
    const rule1 = builder1.result;

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['map'],
      properties: _constants.ANY,
      description: _constants.COLLECTION_PREFIX
    });
    const builder2 = builder.mapKeys();
    checkType(builder2);

    _Assert.assert.strictEqual(builder2, builder);

    _Assert.assert.strictEqual(builder2.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['map'],
      properties: _constants.ANY,
      description: _constants.COLLECTION_PREFIX,
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['map'],
        properties: _constants.ANY,
        description: _constants.COLLECTION_PREFIX
      }
    });
    const builder3 = builder.mapKeys('prop1', _constants.ANY, 'prop2');
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['map'],
      properties: _constants.ANY,
      description: _constants.COLLECTION_PREFIX,
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['map'],
        properties: _constants.ANY,
        description: _constants.COLLECTION_PREFIX,
        next: {
          type: _rules.RuleType.Action,
          objectTypes: ['map'],
          properties: _constants.ANY,
          description: `${_constants.COLLECTION_PREFIX}prop1|${_constants.ANY_DISPLAY}|prop2`
        }
      }
    });
    const builder4 = builder.mapKeys(_constants.ANY);
    checkType(builder4);

    _Assert.assert.strictEqual(builder4, builder);

    _Assert.assert.strictEqual(builder4.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['map'],
      properties: _constants.ANY,
      description: _constants.COLLECTION_PREFIX,
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['map'],
        properties: _constants.ANY,
        description: _constants.COLLECTION_PREFIX,
        next: {
          type: _rules.RuleType.Action,
          objectTypes: ['map'],
          properties: _constants.ANY,
          description: `${_constants.COLLECTION_PREFIX}prop1|${_constants.ANY_DISPLAY}|prop2`,
          next: {
            type: _rules.RuleType.Action,
            objectTypes: ['map'],
            properties: _constants.ANY,
            description: _constants.COLLECTION_PREFIX + _constants.ANY_DISPLAY
          }
        }
      }
    });
  });
  it('mapKeys', function () {
    const builder = new _RuleBuilder.RuleBuilder();

    _Assert.assert.strictEqual(builder.result, undefined);

    _Assert.assert.strictEqual(builder.result, undefined);

    const builder1 = builder.mapKeys('prop1');
    const rule1 = builder1.result;

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1'],
      description: _constants.COLLECTION_PREFIX + 'prop1'
    });
    const builder2 = builder.mapKey('prop2');
    checkType(builder2);

    _Assert.assert.strictEqual(builder2, builder);

    _Assert.assert.strictEqual(builder2.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1'],
      description: _constants.COLLECTION_PREFIX + 'prop1',
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['map'],
        properties: ['prop2'],
        description: _constants.COLLECTION_PREFIX + 'prop2'
      }
    });
    const builder3 = builder.mapKeys('prop3', 'prop4', 'prop5');
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1'],
      description: _constants.COLLECTION_PREFIX + 'prop1',
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['map'],
        properties: ['prop2'],
        description: _constants.COLLECTION_PREFIX + 'prop2',
        next: {
          type: _rules.RuleType.Action,
          objectTypes: ['map'],
          properties: ['prop3', 'prop4', 'prop5'],
          description: _constants.COLLECTION_PREFIX + 'prop3|prop4|prop5'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    const rule3 = builder3.result.next.next;
  });
  it('collection', function () {
    const builder = new _RuleBuilder.RuleBuilder();

    _Assert.assert.strictEqual(builder.result, undefined);

    const builder1 = builder.collection();
    const rule1 = builder1.result;

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['set'],
      properties: _constants.ANY,
      description: _constants.COLLECTION_PREFIX
    });
    const builder2 = builder.collection();
    checkType(builder2);

    _Assert.assert.strictEqual(builder2, builder);

    _Assert.assert.strictEqual(builder2.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['map', 'set', 'list', 'iterable'],
      properties: _constants.ANY,
      description: _constants.COLLECTION_PREFIX,
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['set'],
        properties: _constants.ANY,
        description: _constants.COLLECTION_PREFIX
      }
    });
    const builder3 = builder.collection();
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result, rule1);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['set'],
      properties: _constants.ANY,
      description: _constants.COLLECTION_PREFIX,
      next: {
        type: _rules.RuleType.Action,
        objectTypes: ['set'],
        properties: _constants.ANY,
        description: _constants.COLLECTION_PREFIX,
        next: {
          type: _rules.RuleType.Action,
          objectTypes: ['set'],
          properties: _constants.ANY,
          description: _constants.COLLECTION_PREFIX
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    const rule3 = builder3.result.next.next;
  });
  it('repeat', function () {
    const builder = new _RuleBuilder.RuleBuilder();

    _Assert.assert.strictEqual(builder.result, undefined);

    _Assert.assert.throws(() => builder.repeat(1, 1, b => null), [Error, TypeError, ReferenceError]);

    _Assert.assert.throws(() => builder.repeat(1, 1, b => ({
      rule: null
    })), [Error, TypeError, ReferenceError]);

    const builder1 = builder.repeat(null, null, b => b.repeat(1, null, b => b.path(o => o.prop1)).repeat(null, 2, b => b.path(o => o["prop '2'"])).repeat(3, 4, b => b.path(o => o.prop4))).repeat(5, 6, b => b.path(o => o.prop5)).repeat(7, 8, b => b.path(o => o.length));
    checkType(builder1);

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(builder1.result, {
      type: _rules.RuleType.Repeat,
      countMin: 0,
      countMax: Number.MAX_SAFE_INTEGER,
      rule: {
        type: _rules.RuleType.Repeat,
        countMin: 1,
        countMax: Number.MAX_SAFE_INTEGER,
        rule: {
          type: _rules.RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ['prop1'],
          description: 'prop1'
        },
        next: {
          type: _rules.RuleType.Repeat,
          countMin: 0,
          countMax: 2,
          rule: {
            type: _rules.RuleType.Action,
            objectTypes: ['object', 'array'],
            properties: ["prop '2'"],
            description: "prop '2'"
          },
          next: {
            type: _rules.RuleType.Repeat,
            countMin: 3,
            countMax: 4,
            rule: {
              type: _rules.RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4'],
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
          type: _rules.RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ['prop5'],
          description: 'prop5'
        },
        next: {
          type: _rules.RuleType.Repeat,
          countMin: 7,
          countMax: 8,
          rule: {
            type: _rules.RuleType.Action,
            objectTypes: ['object', 'array'],
            properties: ['length'],
            description: 'length'
          }
        }
      }
    });
  });
  it('any', function () {
    const builder = new _RuleBuilder.RuleBuilder();

    _Assert.assert.strictEqual(builder.result, undefined);

    _Assert.assert.throws(() => builder.any(), [Error, TypeError, ReferenceError]);

    _Assert.assert.throws(() => builder.any(null), [Error, TypeError, ReferenceError]);

    _Assert.assert.throws(() => builder.any(b => null), [Error, TypeError, ReferenceError]);

    _Assert.assert.throws(() => builder.any(b => ({
      rule: null
    })), [Error, TypeError, ReferenceError]);

    const builder1 = builder.any(b => b.path(o => o.prop1)).any(b => b.path(o => o["prop '2'"])).any(b => b.any(b => b.path(o => o.prop4)), b => b.any(b => b.path(o => o.prop4), b => b.path(o => o.prop4_1)), b => b.any(b => b.path(o => o.prop4), b => b.path(o => o.prop4_1), b => b.path(o => o.prop4_2))).any(b => b.path(o => o.prop5)).any(b => b.path(o => o.length));
    checkType(builder1);

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(builder1.result, {
      type: _rules.RuleType.Any,
      rules: [{
        type: _rules.RuleType.Action,
        objectTypes: ['object', 'array'],
        properties: ['prop1'],
        description: 'prop1'
      }],
      next: {
        type: _rules.RuleType.Any,
        rules: [{
          type: _rules.RuleType.Action,
          objectTypes: ['object', 'array'],
          properties: ["prop '2'"],
          description: "prop '2'"
        }],
        next: {
          type: _rules.RuleType.Any,
          rules: [{
            type: _rules.RuleType.Any,
            rules: [{
              type: _rules.RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4'],
              description: 'prop4'
            }]
          }, {
            type: _rules.RuleType.Any,
            rules: [{
              type: _rules.RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4'],
              description: 'prop4'
            }, {
              type: _rules.RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4_1'],
              description: 'prop4_1'
            }]
          }, {
            type: _rules.RuleType.Any,
            rules: [{
              type: _rules.RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4'],
              description: 'prop4'
            }, {
              type: _rules.RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4_1'],
              description: 'prop4_1'
            }, {
              type: _rules.RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop4_2'],
              description: 'prop4_2'
            }]
          }],
          next: {
            type: _rules.RuleType.Any,
            rules: [{
              type: _rules.RuleType.Action,
              objectTypes: ['object', 'array'],
              properties: ['prop5'],
              description: 'prop5'
            }],
            next: {
              type: _rules.RuleType.Any,
              rules: [{
                type: _rules.RuleType.Action,
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