"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _maxSafeInteger = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/max-safe-integer"));

var _repeat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/repeat"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _create = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/create"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray8 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _trim = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/trim"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

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
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined);
  });
  var nonSubscribeProperty = Math.random().toString(36);

  function testSubscribe(isCollection, isMap, nonObservableObject, observableObject, subscribe, properties, subscribeProperties, add, change, remove) {
    var nonSubscribeProperties = (0, _slice.default)(properties).call(properties);

    for (var _iterator = subscribeProperties, _isArray = (0, _isArray8.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _property6 = _ref;
      var index = void 0; // tslint:disable-next-line:no-conditional-assignment

      while ((index = (0, _indexOf.default)(nonSubscribeProperties).call(nonSubscribeProperties, _property6)) >= 0) {
        (0, _splice.default)(nonSubscribeProperties).call(nonSubscribeProperties, index, 1);
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

    var subscribedItems = [];

    function subscribeItem(value, debugPropertyName) {
      if (typeof value === 'undefined') {
        return;
      }

      _Assert.assert.ok(value);

      _Assert.assert.strictEqual(typeof value, 'string', value);

      value = (0, _trim.default)(value).call(value);
      checkDebugPropertyName(value, debugPropertyName);
      subscribedItems.push('+' + value);
    } // tslint:disable-next-line:no-identical-functions


    function unsubscribeItem(value, debugPropertyName) {
      if (typeof value === 'undefined') {
        return;
      }

      _Assert.assert.ok(value);

      value = (0, _trim.default)(value).call(value);
      checkDebugPropertyName(value, debugPropertyName);
      subscribedItems.push('-' + value);
    }

    function testNonSubscribeProperties(object) {
      for (var _iterator2 = nonSubscribeProperties, _isArray2 = (0, _isArray8.default)(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator2.default)(_iterator2);;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var _property = _ref2;
        add(object, _property);

        _Assert.assert.deepStrictEqual(subscribedItems, []);

        if (change) {
          change(object, _property);

          _Assert.assert.deepStrictEqual(subscribedItems, []);
        }

        remove(object, _property, true);

        _Assert.assert.deepStrictEqual(subscribedItems, []);

        if (_property === nonSubscribeProperty) {
          add(object, nonSubscribeProperty);

          _Assert.assert.deepStrictEqual(subscribedItems, []);
        } // if (object === observableObject) {
        // 	assert.deepStrictEqual(subscribedItems, ['+undefined'])
        // 	subscribedItems = []
        // }

      }
    }

    var lastError;

    for (var debugIteration = 0; debugIteration < 2; debugIteration++) {
      try {
        // region Non Observable
        var testNonObservableObject = function testNonObservableObject(object) {
          var _context, _context2;

          var unsubscribe = subscribe(object, false, subscribeItem, unsubscribeItem);

          _Assert.assert.strictEqual(unsubscribe, null);

          testNonSubscribeProperties(object);
          unsubscribe = subscribe(object, true, subscribeItem, unsubscribeItem);

          _Assert.assert.ok(unsubscribe);

          _Assert.assert.strictEqual(typeof unsubscribe, 'function');

          _Assert.assert.deepStrictEqual(subscribedItems, []);

          subscribedItems = [];
          testNonSubscribeProperties(object);

          for (var _iterator3 = subscribeProperties, _isArray3 = (0, _isArray8.default)(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator2.default)(_iterator3);;) {
            var _ref3;

            if (_isArray3) {
              if (_i3 >= _iterator3.length) break;
              _ref3 = _iterator3[_i3++];
            } else {
              _i3 = _iterator3.next();
              if (_i3.done) break;
              _ref3 = _i3.value;
            }

            var _property2 = _ref3;
            add(object, _property2);

            _Assert.assert.deepStrictEqual(subscribedItems, []);

            if (change) {
              change(object, _property2);

              _Assert.assert.deepStrictEqual(subscribedItems, []);
            }
          }

          testNonSubscribeProperties(object);
          unsubscribe();

          _Assert.assert.deepStrictEqual((0, _sort.default)(subscribedItems).call(subscribedItems), (0, _sort.default)(_context = (0, _map.default)(subscribeProperties).call(subscribeProperties, function (o) {
            return '-value_' + o;
          })).call(_context));

          subscribedItems = [];
          unsubscribe = subscribe(object, true, subscribeItem, unsubscribeItem);

          _Assert.assert.ok(unsubscribe);

          _Assert.assert.strictEqual(typeof unsubscribe, 'function');

          _Assert.assert.deepStrictEqual((0, _sort.default)(subscribedItems).call(subscribedItems), (0, _sort.default)(_context2 = (0, _map.default)(subscribeProperties).call(subscribeProperties, function (o) {
            return '+value_' + o;
          })).call(_context2));

          subscribedItems = [];
          testNonSubscribeProperties(object);

          for (var _iterator4 = subscribeProperties, _isArray4 = (0, _isArray8.default)(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : (0, _getIterator2.default)(_iterator4);;) {
            var _ref4;

            if (_isArray4) {
              if (_i4 >= _iterator4.length) break;
              _ref4 = _iterator4[_i4++];
            } else {
              _i4 = _iterator4.next();
              if (_i4.done) break;
              _ref4 = _i4.value;
            }

            var _property3 = _ref4;
            remove(object, _property3, false);

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


        var testObservableObject = function testObservableObject(object) {
          var _context3, _context4, _context5;

          var unsubscribe = subscribe(object, false, subscribeItem, unsubscribeItem);

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

          for (var _iterator5 = subscribeProperties, _isArray5 = (0, _isArray8.default)(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : (0, _getIterator2.default)(_iterator5);;) {
            var _ref5;

            if (_isArray5) {
              if (_i5 >= _iterator5.length) break;
              _ref5 = _iterator5[_i5++];
            } else {
              _i5 = _iterator5.next();
              if (_i5.done) break;
              _ref5 = _i5.value;
            }

            var _property4 = _ref5;
            add(object, _property4);

            _Assert.assert.deepStrictEqual(subscribedItems, [// '-undefined',
            '+value_' + _property4]);

            subscribedItems = [];

            if (change) {
              change(object, _property4);

              _Assert.assert.deepStrictEqual(subscribedItems, ['-value_' + _property4, '+value_' + _property4]);

              subscribedItems = [];
            }
          }

          testNonSubscribeProperties(object);
          unsubscribe();

          _Assert.assert.deepStrictEqual((0, _sort.default)(subscribedItems).call(subscribedItems), (0, _sort.default)(_context3 = (0, _map.default)(subscribeProperties).call(subscribeProperties, function (o) {
            return '-value_' + o;
          })).call(_context3));

          subscribedItems = [];
          unsubscribe = subscribe(object, false, subscribeItem, unsubscribeItem);

          _Assert.assert.ok(unsubscribe);

          _Assert.assert.strictEqual(typeof unsubscribe, 'function');

          unsubscribe();

          _Assert.assert.deepStrictEqual((0, _sort.default)(subscribedItems).call(subscribedItems), (0, _sort.default)(_context4 = (0, _map.default)(subscribeProperties).call(subscribeProperties, function (o) {
            return '-value_' + o;
          })).call(_context4));

          subscribedItems = [];
          unsubscribe = subscribe(object, true, subscribeItem, unsubscribeItem);

          _Assert.assert.ok(unsubscribe);

          _Assert.assert.strictEqual(typeof unsubscribe, 'function');

          _Assert.assert.deepStrictEqual((0, _sort.default)(subscribedItems).call(subscribedItems), (0, _sort.default)(_context5 = (0, _map.default)(subscribeProperties).call(subscribeProperties, function (o) {
            return '+value_' + o;
          })).call(_context5));

          subscribedItems = [];
          testNonSubscribeProperties(object);

          for (var _iterator6 = subscribeProperties, _isArray6 = (0, _isArray8.default)(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : (0, _getIterator2.default)(_iterator6);;) {
            var _ref6;

            if (_isArray6) {
              if (_i6 >= _iterator6.length) break;
              _ref6 = _iterator6[_i6++];
            } else {
              _i6 = _iterator6.next();
              if (_i6.done) break;
              _ref6 = _i6.value;
            }

            var _property5 = _ref6;
            remove(object, _property5, false);

            _Assert.assert.deepStrictEqual(subscribedItems, ['-value_' + _property5 // '+undefined',
            ]);

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
    var _context6, _context7;

    var builder = new _ObservableObjectBuilder.ObservableObjectBuilder();

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

    testSubscribe(false, true, (0, _extends2.default)({}, builder.object), builder.object, subscribe, (0, _concat.default)(_context6 = [nonSubscribeProperty]).call(_context6, properties === _constants.ANY ? [] : properties), properties === _constants.ANY ? [nonSubscribeProperty, 'p1', 'p2', 'p3'] : properties, add, change, remove); // builder
    // 	.writable('p1', null, 'value_p1')
    // 	.writable('p2', null, 'value_p2')
    // 	.writable('p3', null, 'value_p3')

    testSubscribe(false, true, (0, _create.default)((0, _extends2.default)({}, builder.object)), (0, _create.default)(builder.object), subscribe, (0, _concat.default)(_context7 = [nonSubscribeProperty]).call(_context7, properties === _constants.ANY ? [] : properties), [], function (object, property) {
      (0, _defineProperty.default)(object, property, {
        configurable: true,
        writable: true,
        value: 'value_' + property
      });
    }, change, function (object, property) {
      delete object[property];
    });
  }

  function testArray(properties, subscribe) {
    var _context8;

    if (properties === _constants.ANY || (0, _indexOf.default)(properties).call(properties, 'length') >= 0) {
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

    testSubscribe(false, true, object, null, subscribe, (0, _concat.default)(_context8 = [nonSubscribeProperty]).call(_context8, properties === _constants.ANY ? [] : properties), properties === _constants.ANY ? [nonSubscribeProperty] : properties, change, change, remove);
  }

  function testMap(properties, subscribe) {
    var _context9;

    var map = new _ObjectMap.ObjectMap();
    var observableMap = new _ObservableMap.ObservableMap(new _ObjectMap.ObjectMap());

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

    testSubscribe(true, true, map, observableMap, subscribe, (0, _concat.default)(_context9 = [nonSubscribeProperty]).call(_context9, properties === _constants.ANY ? [] : properties), properties === _constants.ANY ? [nonSubscribeProperty, 'p1', 'p2', 'p3'] : properties, change, change, remove);
  }

  function testSet(properties, subscribe) {
    var set = new _ObjectSet.ObjectSet();
    var observableSet = new _ObservableSet.ObservableSet(new _ObjectSet.ObjectSet());

    function add(object, property) {
      object.add('value_' + property);
    }

    function remove(object, property) {
      object.delete('value_' + property);
    }

    testSubscribe(true, false, set, observableSet, subscribe, [], ['p1', 'p2', 'p3'], add, null, remove);
  }

  function testIterable(properties, subscribe) {
    _Assert.assert.strictEqual(subscribe({}, true, function (item) {
      _Assert.assert.fail();
    }, function (item) {
      _Assert.assert.fail();
    }), null);

    var array = []; // tslint:disable-next-line:no-identical-functions

    function add(object, property) {
      object.push('value_' + property);
    }

    function change(object, property) {
      for (var i = object.length - 1; i >= 0; i--) {
        var _context10;

        if ((0, _trim.default)(_context10 = object[i]).call(_context10) === 'value_' + property) {
          object[i] += ' ';
          return;
        }
      }
    }

    function remove(object, property) {
      for (var i = object.length - 1; i >= 0; i--) {
        var _context11;

        if ((0, _trim.default)(_context11 = object[i]).call(_context11) === 'value_' + property) {
          (0, _splice.default)(object).call(object, i, 1);
          return;
        }
      }
    }

    testSubscribe(true, false, array, null, subscribe, [], ['p1', 'p2', 'p3'], add, change, remove);
  }

  function testList(properties, subscribe) {
    var list = new _SortedList.SortedList({
      autoSort: true,
      notAddIfExists: true
    }); // @ts-ignore

    (0, _defineProperty.default)(list, 'listChanged', {
      configurable: true,
      writable: true,
      value: null
    });
    var observableList = new _SortedList.SortedList({
      autoSort: true,
      notAddIfExists: true
    }); // tslint:disable-next-line:no-identical-functions

    function add(object, property) {
      object.add('value_' + property);
    }

    function change(object, property) {
      for (var i = object.size - 1; i >= 0; i--) {
        var _context12;

        if ((0, _trim.default)(_context12 = object.get(i)).call(_context12) === 'value_' + property) {
          object.set(i, object.get(i) + ' ');
          return;
        }
      }
    }

    function remove(object, property) {
      for (var i = object.size - 1; i >= 0; i--) {
        var _context13;

        if ((0, _trim.default)(_context13 = object.get(i)).call(_context13) === 'value_' + property) {
          object.removeAt(i);
          return;
        }
      }
    }

    testSubscribe(true, false, list, observableList, subscribe, [], ['p1', 'p2', 'p3'], add, change, remove);
  }

  function assertRuleParams(rule, expected) {
    rule = (0, _extends2.default)({}, rule);
    expected = (0, _extends2.default)({}, expected);

    if ('unsubscribers' in rule) {
      expected.unsubscribers = rule.unsubscribers;
      expected.unsubscribersCount = rule.unsubscribersCount;
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

      for (var _iterator7 = expected.objectTypes, _isArray7 = (0, _isArray8.default)(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : (0, _getIterator2.default)(_iterator7);;) {
        var _ref7;

        if (_isArray7) {
          if (_i7 >= _iterator7.length) break;
          _ref7 = _iterator7[_i7++];
        } else {
          _i7 = _iterator7.next();
          if (_i7.done) break;
          _ref7 = _i7.value;
        }

        var objectType = _ref7;

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
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined);

    var builder1 = builder.path(function (o) {
      return o.prop1;
    });
    var rule1 = builder1.result();

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1'
    });
    var builder3 = builder1.path(function (o) {
      return o["prop '2'"].prop3;
    });
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result(), rule1);

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
    var builder4 = builder3.path(function (o) {
      return o.length;
    });
    checkType(builder4);

    _Assert.assert.strictEqual(builder4, builder);

    _Assert.assert.strictEqual(builder4.result(), rule1);

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
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined);

    var builder1 = builder.path(function (o) {
      return o['prop1|prop2']['#prop3']['#prop4||prop5']['*']['#']['#*'];
    });
    var rule1 = builder1.result();

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
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined); // @ts-ignore


    _Assert.assert.throws(function () {
      return builder.propertyRegexp();
    }, Error); // @ts-ignore


    _Assert.assert.throws(function () {
      return builder.propertyRegexp('string');
    }, Error);

    _Assert.assert.throws(function () {
      return builder.propertyRegexp(null);
    }, Error); // @ts-ignore


    _Assert.assert.throws(function () {
      return builder.propertyPredicate('string');
    }, Error);

    _Assert.assert.strictEqual(builder.result(), undefined);

    var builder1 = builder.propertyRegexp(/prop1|prop2/);
    var rule1 = builder1.result();

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/'
    });
    var builder2 = builder.propertyRegexp(/prop2|prop3/);
    checkType(builder2);

    _Assert.assert.strictEqual(builder2, builder);

    _Assert.assert.strictEqual(builder2.result(), rule1);

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
    var builder3 = builder.propertyRegexp(/prop3|prop4/);
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result(), rule1);

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

    var rule3 = builder3.result().next.next;
  });
  it('propertyAny', function () {
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined);

    var builder1 = builder.propertyAny();
    var rule1 = builder1.result();

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: _constants.ANY,
      description: _constants.ANY_DISPLAY
    });
    var builder2 = builder.propertyNames(_constants.ANY);
    checkType(builder2);

    _Assert.assert.strictEqual(builder2, builder);

    _Assert.assert.strictEqual(builder2.result(), rule1);

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
    var builder3 = builder.propertyNames('prop1', _constants.ANY, 'prop2');
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result(), rule1);

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
          description: "prop1|" + _constants.ANY_DISPLAY + "|prop2"
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    var rule3 = builder3.result().next.next;
  });
  it('propertyNames', function () {
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined);

    _Assert.assert.strictEqual(builder.result(), undefined);

    var builder1 = builder.propertyNames('prop1');
    var rule1 = builder1.result();

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1'
    });
    var builder2 = builder.propertyName('prop2');
    checkType(builder2);

    _Assert.assert.strictEqual(builder2, builder);

    _Assert.assert.strictEqual(builder2.result(), rule1);

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
    var builder3 = builder.propertyNames('prop3', 'prop4', 'prop5');
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result(), rule1);

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

    var rule3 = builder3.result().next.next;
  });
  it('map', function () {
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined); // @ts-ignore


    _Assert.assert.throws(function () {
      return builder.mapRegexp();
    }, Error); // @ts-ignore


    _Assert.assert.throws(function () {
      return builder.mapRegexp('string');
    }, Error);

    _Assert.assert.throws(function () {
      return builder.mapRegexp(null);
    }, Error); // @ts-ignore


    _Assert.assert.throws(function () {
      return builder.mapPredicate('string');
    }, Error);

    _Assert.assert.strictEqual(builder.result(), undefined);

    var builder1 = builder.mapRegexp(/prop1|prop2/);
    var rule1 = builder1.result();

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/'
    });
    var builder2 = builder.mapRegexp(/prop2|prop3/);
    checkType(builder2);

    _Assert.assert.strictEqual(builder2, builder);

    _Assert.assert.strictEqual(builder2.result(), rule1);

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
    var builder3 = builder.mapRegexp(/prop3|prop4/);
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result(), rule1);

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

    var rule3 = builder3.result().next.next;
  });
  it('mapAny', function () {
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined);

    var builder1 = builder.mapAny();
    var rule1 = builder1.result();

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['map'],
      properties: _constants.ANY,
      description: _constants.COLLECTION_PREFIX
    });
    var builder2 = builder.mapKeys();
    checkType(builder2);

    _Assert.assert.strictEqual(builder2, builder);

    _Assert.assert.strictEqual(builder2.result(), rule1);

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
    var builder3 = builder.mapKeys('prop1', _constants.ANY, 'prop2');
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result(), rule1);

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
          description: _constants.COLLECTION_PREFIX + "prop1|" + _constants.ANY_DISPLAY + "|prop2"
        }
      }
    });
    var builder4 = builder.mapKeys(_constants.ANY);
    checkType(builder4);

    _Assert.assert.strictEqual(builder4, builder);

    _Assert.assert.strictEqual(builder4.result(), rule1);

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
          description: _constants.COLLECTION_PREFIX + "prop1|" + _constants.ANY_DISPLAY + "|prop2",
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
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined);

    _Assert.assert.strictEqual(builder.result(), undefined);

    var builder1 = builder.mapKeys('prop1');
    var rule1 = builder1.result();

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['map'],
      properties: ['prop1'],
      description: _constants.COLLECTION_PREFIX + 'prop1'
    });
    var builder2 = builder.mapKey('prop2');
    checkType(builder2);

    _Assert.assert.strictEqual(builder2, builder);

    _Assert.assert.strictEqual(builder2.result(), rule1);

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
    var builder3 = builder.mapKeys('prop3', 'prop4', 'prop5');
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result(), rule1);

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

    var rule3 = builder3.result().next.next;
  });
  it('collection', function () {
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined);

    var builder1 = builder.collection();
    var rule1 = builder1.result();

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      objectTypes: ['set'],
      properties: _constants.ANY,
      description: _constants.COLLECTION_PREFIX
    });
    var builder2 = builder.collection();
    checkType(builder2);

    _Assert.assert.strictEqual(builder2, builder);

    _Assert.assert.strictEqual(builder2.result(), rule1);

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
    var builder3 = builder.collection();
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result(), rule1);

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

    var rule3 = builder3.result().next.next;
  });
  it('repeat', function () {
    var _context14, _context15;

    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined);

    _Assert.assert.throws(function () {
      return (0, _repeat.default)(builder).call(builder, 1, 1, null, function (b) {
        return null;
      });
    }, [Error, TypeError, ReferenceError]);

    _Assert.assert.throws(function () {
      return (0, _repeat.default)(builder).call(builder, 1, 1, null, function (b) {
        return {
          rule: null
        };
      });
    }, [Error, TypeError, ReferenceError]);

    var builder1 = (0, _repeat.default)(_context14 = (0, _repeat.default)(_context15 = (0, _repeat.default)(builder).call(builder, null, null, null, function (b) {
      var _context16, _context17;

      return (0, _repeat.default)(_context16 = (0, _repeat.default)(_context17 = (0, _repeat.default)(b).call(b, 1, null, null, function (b) {
        return b.path(function (o) {
          return o.prop1;
        });
      })).call(_context17, null, 2, null, function (b) {
        return b.path(function (o) {
          return o["prop '2'"];
        });
      })).call(_context16, 3, 4, null, function (b) {
        return b.path(function (o) {
          return o.prop4;
        });
      });
    })).call(_context15, 5, 6, null, function (b) {
      return b.path(function (o) {
        return o.prop5;
      });
    })).call(_context14, 7, 8, null, function (b) {
      return b.path(function (o) {
        return o.length;
      });
    });
    checkType(builder1);

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(builder1.result(), {
      type: _rules.RuleType.Repeat,
      countMin: 0,
      countMax: _maxSafeInteger.default,
      condition: null,
      rule: {
        type: _rules.RuleType.Repeat,
        countMin: 1,
        countMax: _maxSafeInteger.default,
        condition: null,
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
          condition: null,
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
            condition: null,
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
        condition: null,
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
          condition: null,
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
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined);

    _Assert.assert.throws(function () {
      return builder.any();
    }, [Error, TypeError, ReferenceError]);

    _Assert.assert.throws(function () {
      return builder.any(null);
    }, [Error, TypeError, ReferenceError]);

    _Assert.assert.throws(function () {
      return builder.any(function (b) {
        return null;
      });
    }, [Error, TypeError, ReferenceError]);

    _Assert.assert.throws(function () {
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

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(builder1.result(), {
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