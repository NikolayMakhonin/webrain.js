"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _getIteratorMethod2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator-method"));

var _symbol = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/symbol"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _maxSafeInteger = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/max-safe-integer"));

var _repeat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/repeat"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _create = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/create"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _filter = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/filter"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _trim = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/trim"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _valueProperty = require("../../../../../../../../../main/common/helpers/value-property");

var _ObservableObjectBuilder = require("../../../../../../../../../main/common/rx/object/ObservableObjectBuilder");

var _common = require("../../../../../../../../../main/common/rx/object/properties/path/builder/contracts/common");

var _constants = require("../../../../../../../../../main/common/rx/object/properties/path/builder/contracts/constants");

var _rules = require("../../../../../../../../../main/common/rx/object/properties/path/builder/contracts/rules");

var _RuleBuilder = require("../../../../../../../../../main/common/rx/object/properties/path/builder/RuleBuilder");

var _rulesSubscribe = require("../../../../../../../../../main/common/rx/object/properties/path/builder/rules-subscribe");

var _Assert = require("../../../../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../../../../main/common/test/Mocha");

function _createForOfIteratorHelperLoose(o) { var _context16; var i = 0; if (typeof _symbol.default === "undefined" || (0, _getIteratorMethod2.default)(o) == null) { if ((0, _isArray.default)(o) || (o = _unsupportedIterableToArray(o))) return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } i = (0, _getIterator2.default)(o); return (0, _bind.default)(_context16 = i.next).call(_context16, i); }

function _unsupportedIterableToArray(o, minLen) { var _context15; if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = (0, _slice.default)(_context15 = Object.prototype.toString.call(o)).call(_context15, 8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return (0, _from.default)(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(0, _Mocha.describe)('common > main > rx > properties > builder > RuleBuilder', function () {
  // noinspection JSUnusedLocalSymbols
  function checkType(builder) {
    return true;
  }

  (0, _Mocha.it)('constructor', function () {
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined);
  });
  var nonSubscribeProperty = Math.random().toString(36);

  function testSubscribe(isCollection, isMap, isValueObject, observableObject, subscribe, properties, subscribeProperties, add, change, remove) {
    var nonSubscribeProperties = (0, _slice.default)(properties).call(properties);

    for (var _iterator = _createForOfIteratorHelperLoose(subscribeProperties), _step; !(_step = _iterator()).done;) {
      var _property4 = _step.value;
      var index = void 0; // tslint:disable-next-line:no-conditional-assignment

      while ((index = (0, _indexOf.default)(nonSubscribeProperties).call(nonSubscribeProperties, _property4)) >= 0) {
        (0, _splice.default)(nonSubscribeProperties).call(nonSubscribeProperties, index, 1);
      }
    }

    function checkDebugPropertyName(value, key, keyType) {
      if (isMap) {
        _Assert.assert.ok(typeof key, 'string');

        _Assert.assert.strictEqual('value_' + key, value);

        _Assert.assert.strictEqual(keyType, _common.ValueKeyType.MapKey);
      } else if (isCollection) {
        _Assert.assert.strictEqual(key, null);

        _Assert.assert.strictEqual(keyType, _common.ValueKeyType.CollectionAny);
      } else {
        _Assert.assert.ok(typeof key, 'string');

        _Assert.assert.ok(key);

        _Assert.assert.ok(key.length);

        _Assert.assert.strictEqual(keyType, isValueObject ? _common.ValueKeyType.ValueProperty : _common.ValueKeyType.Property);
      }
    }

    var subscribedItems = [];

    function changeItem(value, parent, key, keyType) {
      _Assert.assert.ok(value);

      _Assert.assert.strictEqual(typeof value, 'string', value);

      value = (0, _trim.default)(value).call(value);
      checkDebugPropertyName(value, key, keyType);
      subscribedItems.push('+' + value);
    }

    function testNonSubscribeProperties(object) {
      for (var _iterator2 = _createForOfIteratorHelperLoose(nonSubscribeProperties), _step2; !(_step2 = _iterator2()).done;) {
        var _property = _step2.value;
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
        // region Observable
        var testObservableObject = function testObservableObject(object) {
          for (var _iterator3 = _createForOfIteratorHelperLoose(subscribeProperties), _step3; !(_step3 = _iterator3()).done;) {
            var _property2 = _step3.value;
            add(object, _property2);

            if (change) {
              change(object, _property2);
            }
          }

          subscribedItems = [];
          subscribe(object, changeItem);

          if (isValueObject) {
            var _context, _context2, _context3;

            _Assert.assert.deepStrictEqual((0, _sort.default)(subscribedItems).call(subscribedItems), (0, _sort.default)(_context = (0, _map2.default)(_context2 = (0, _filter.default)(_context3 = (0, _filter.default)(subscribeProperties).call(subscribeProperties, function (o) {
              return o !== _valueProperty.VALUE_PROPERTY_DEFAULT;
            })).call(_context3, function (o, i) {
              return i === 0;
            })).call(_context2, function (o) {
              return '+value_' + o;
            })).call(_context));
          } else {
            var _context4;

            _Assert.assert.deepStrictEqual((0, _sort.default)(subscribedItems).call(subscribedItems), (0, _sort.default)(_context4 = (0, _map2.default)(subscribeProperties).call(subscribeProperties, function (o) {
              return '+value_' + o;
            })).call(_context4));
          }

          subscribedItems = [];

          for (var _iterator4 = _createForOfIteratorHelperLoose(subscribeProperties), _step4; !(_step4 = _iterator4()).done;) {
            var _property3 = _step4.value;
            remove(object, _property3, false);
          }

          subscribedItems = [];
        }; // endregion


        if (observableObject) {
          testObservableObject(observableObject);
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

  function testObject(properties, subscribe, isValueObject) {
    var _context5, _context6;

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

    testSubscribe(false, false, isValueObject, builder.object, subscribe, (0, _concat.default)(_context5 = [nonSubscribeProperty]).call(_context5, properties === _constants.ANY ? [] : properties), properties === _constants.ANY ? [nonSubscribeProperty, 'p1', 'p2', 'p3'] : properties, add, change, remove); // builder
    // 	.writable('p1', null, 'value_p1')
    // 	.writable('p2', null, 'value_p2')
    // 	.writable('p3', null, 'value_p3')

    testSubscribe(false, true, isValueObject, (0, _create.default)(builder.object), subscribe, (0, _concat.default)(_context6 = [nonSubscribeProperty]).call(_context6, properties === _constants.ANY ? [] : properties), [], function (object, property) {
      (0, _defineProperty.default)(object, property, {
        configurable: true,
        writable: true,
        value: 'value_' + property
      });
    }, change, function (object, property) {
      delete object[property];
    });
  }

  function testArray(properties, subscribe, isValueObject) {
    var _context7;

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

    testSubscribe(false, true, isValueObject, null, // object,
    subscribe, (0, _concat.default)(_context7 = [nonSubscribeProperty]).call(_context7, properties === _constants.ANY ? [] : properties), properties === _constants.ANY ? [nonSubscribeProperty] : properties, change, change, remove);
  }

  function testMap(properties, subscribe) {
    var _context8;

    var map = new _map.default();

    if (properties !== _constants.ANY) {
      map.set(nonSubscribeProperty, 'value_' + nonSubscribeProperty);
    }

    function change(object, property) {
      object.set(property, object.get(property) ? object.get(property) + ' ' : 'value_' + property);
    }

    function remove(object, property) {
      object.delete(property);
    }

    testSubscribe(true, true, false, map, subscribe, (0, _concat.default)(_context8 = [nonSubscribeProperty]).call(_context8, properties === _constants.ANY ? [] : properties), properties === _constants.ANY ? [nonSubscribeProperty, 'p1', 'p2', 'p3'] : properties, change, change, remove);
  }

  function testSet(properties, subscribe) {
    var set = new _set.default();

    function add(object, property) {
      object.add('value_' + property);
    }

    function remove(object, property) {
      object.delete('value_' + property);
    }

    testSubscribe(true, false, false, set, subscribe, [], ['p1', 'p2', 'p3'], add, null, remove);
  }

  function testIterable(properties, subscribe) {
    _Assert.assert.strictEqual(subscribe({}, function (item) {
      _Assert.assert.fail();
    }), null);

    var array = []; // tslint:disable-next-line:no-identical-functions

    function add(object, property) {
      object.push('value_' + property);
    }

    function change(object, property) {
      for (var i = object.length - 1; i >= 0; i--) {
        var _context9;

        if ((0, _trim.default)(_context9 = object[i]).call(_context9) === 'value_' + property) {
          object[i] += ' ';
          return;
        }
      }
    }

    function remove(object, property) {
      for (var i = object.length - 1; i >= 0; i--) {
        var _context10;

        if ((0, _trim.default)(_context10 = object[i]).call(_context10) === 'value_' + property) {
          (0, _splice.default)(object).call(object, i, 1);
          return;
        }
      }
    }

    testSubscribe(true, false, false, null, // array,
    subscribe, [], ['p1', 'p2', 'p3'], add, change, remove);
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
    delete rule.toString;
    delete expected.objectTypes;
    delete expected.properties;
    delete expected.next;
    delete expected.rule;
    delete expected.rules;

    _Assert.assert.deepStrictEqual(rule, expected, null, {
      customIsPrimitive: function customIsPrimitive(o) {
        if (typeof o === 'function') {
          return false;
        }

        return null;
      },
      customEqual: function customEqual(o1, o2) {
        if (typeof o1 === 'function') {
          return typeof o2 === 'function';
        } else if (typeof o2 === 'function') {
          return typeof o1 === 'function';
        }

        return null;
      }
    });
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

      for (var _iterator5 = _createForOfIteratorHelperLoose(expected.objectTypes), _step5; !(_step5 = _iterator5()).done;) {
        var objectType = _step5.value;

        switch (objectType) {
          case 'object':
            testObject(expected.properties, rule.subscribe, rule.subType === _rulesSubscribe.SubscribeObjectType.ValueProperty);
            break;

          case 'array':
            testArray(expected.properties, rule.subscribe, rule.subType === _rulesSubscribe.SubscribeObjectType.ValueProperty);
            break;

          case 'map':
            testMap(expected.properties, rule.subscribe);
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

  (0, _Mocha.it)('property', function () {
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
      objectTypes: ['object', 'array'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
      objectTypes: ['object', 'array'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
        objectTypes: ['object', 'array'],
        properties: ['prop2', 'prop3'],
        description: '/prop2|prop3/',
        next: {
          type: _rules.RuleType.Action,
          subType: _rulesSubscribe.SubscribeObjectType.Property,
          objectTypes: ['object', 'array'],
          properties: ['prop3', 'prop4'],
          description: '/prop3|prop4/'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    var rule3 = builder3.result().next.next;
  });
  (0, _Mocha.it)('value property', function () {
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined);

    var builder1 = builder.valuePropertyNames('prop1', 'prop2');
    var rule1 = builder1.result();

    _Assert.assert.strictEqual(builder1, builder);

    function toSimpleRule(rule) {
      if (rule == null) {
        return rule;
      }

      var innerRule = rule.conditionRules[1][1].clone();
      innerRule.next = toSimpleRule(rule.next);
      return innerRule;
    }

    var simpleRule1 = toSimpleRule(rule1);
    assertRule(simpleRule1, {
      type: _rules.RuleType.Action,
      subType: _rulesSubscribe.SubscribeObjectType.ValueProperty,
      objectTypes: ['object', 'array'],
      properties: [_valueProperty.VALUE_PROPERTY_DEFAULT, 'prop1', 'prop2'],
      description: '@prop1|prop2'
    });
    var builder2 = builder.valuePropertyNames('prop2', 'prop3');
    checkType(builder2);

    _Assert.assert.strictEqual(builder2, builder);

    _Assert.assert.strictEqual(builder2.result(), rule1);

    simpleRule1 = toSimpleRule(rule1);
    assertRule(simpleRule1, {
      type: _rules.RuleType.Action,
      subType: _rulesSubscribe.SubscribeObjectType.ValueProperty,
      objectTypes: ['object', 'array'],
      properties: [_valueProperty.VALUE_PROPERTY_DEFAULT, 'prop1', 'prop2'],
      description: '@prop1|prop2',
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.ValueProperty,
        objectTypes: ['object', 'array'],
        properties: [_valueProperty.VALUE_PROPERTY_DEFAULT, 'prop2', 'prop3'],
        description: '@prop2|prop3'
      }
    });
    var builder3 = builder.valuePropertyNames('prop3', 'prop4');
    checkType(builder3);

    _Assert.assert.strictEqual(builder3, builder);

    _Assert.assert.strictEqual(builder3.result(), rule1);

    simpleRule1 = toSimpleRule(rule1);
    assertRule(simpleRule1, {
      type: _rules.RuleType.Action,
      subType: _rulesSubscribe.SubscribeObjectType.ValueProperty,
      objectTypes: ['object', 'array'],
      properties: [_valueProperty.VALUE_PROPERTY_DEFAULT, 'prop1', 'prop2'],
      description: '@prop1|prop2',
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.ValueProperty,
        objectTypes: ['object', 'array'],
        properties: [_valueProperty.VALUE_PROPERTY_DEFAULT, 'prop2', 'prop3'],
        description: '@prop2|prop3',
        next: {
          type: _rules.RuleType.Action,
          subType: _rulesSubscribe.SubscribeObjectType.ValueProperty,
          objectTypes: ['object', 'array'],
          properties: [_valueProperty.VALUE_PROPERTY_DEFAULT, 'prop3', 'prop4'],
          description: '@prop3|prop4'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    var rule3 = builder3.result().next.next;
  });
  (0, _Mocha.it)('propertyAny', function () {
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined);

    var builder1 = builder.propertyAny();
    var rule1 = builder1.result();

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      subType: _rulesSubscribe.SubscribeObjectType.Property,
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
      objectTypes: ['object', 'array'],
      properties: _constants.ANY,
      description: _constants.ANY_DISPLAY,
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
      objectTypes: ['object', 'array'],
      properties: _constants.ANY,
      description: _constants.ANY_DISPLAY,
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
        objectTypes: ['object', 'array'],
        properties: _constants.ANY,
        description: _constants.ANY_DISPLAY,
        next: {
          type: _rules.RuleType.Action,
          subType: _rulesSubscribe.SubscribeObjectType.Property,
          objectTypes: ['object', 'array'],
          properties: _constants.ANY,
          description: "prop1|" + _constants.ANY_DISPLAY + "|prop2"
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    var rule3 = builder3.result().next.next;
  });
  (0, _Mocha.it)('propertyNames', function () {
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1',
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
      objectTypes: ['object', 'array'],
      properties: ['prop1'],
      description: 'prop1',
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
        objectTypes: ['object', 'array'],
        properties: ['prop2'],
        description: 'prop2',
        next: {
          type: _rules.RuleType.Action,
          subType: _rulesSubscribe.SubscribeObjectType.Property,
          objectTypes: ['object', 'array'],
          properties: ['prop3', 'prop4', 'prop5'],
          description: 'prop3|prop4|prop5'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    var rule3 = builder3.result().next.next;
  });
  (0, _Mocha.it)('map', function () {
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
      objectTypes: ['map'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
      objectTypes: ['map'],
      properties: ['prop1', 'prop2'],
      description: '/prop1|prop2/',
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
        objectTypes: ['map'],
        properties: ['prop2', 'prop3'],
        description: '/prop2|prop3/',
        next: {
          type: _rules.RuleType.Action,
          subType: _rulesSubscribe.SubscribeObjectType.Property,
          objectTypes: ['map'],
          properties: ['prop3', 'prop4'],
          description: '/prop3|prop4/'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    var rule3 = builder3.result().next.next;
  });
  (0, _Mocha.it)('mapAny', function () {
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined);

    var builder1 = builder.mapAny();
    var rule1 = builder1.result();

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      subType: _rulesSubscribe.SubscribeObjectType.Property,
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
      objectTypes: ['map'],
      properties: _constants.ANY,
      description: _constants.COLLECTION_PREFIX,
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
      objectTypes: ['map'],
      properties: _constants.ANY,
      description: _constants.COLLECTION_PREFIX,
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
        objectTypes: ['map'],
        properties: _constants.ANY,
        description: _constants.COLLECTION_PREFIX,
        next: {
          type: _rules.RuleType.Action,
          subType: _rulesSubscribe.SubscribeObjectType.Property,
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
      objectTypes: ['map'],
      properties: _constants.ANY,
      description: _constants.COLLECTION_PREFIX,
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
        objectTypes: ['map'],
        properties: _constants.ANY,
        description: _constants.COLLECTION_PREFIX,
        next: {
          type: _rules.RuleType.Action,
          subType: _rulesSubscribe.SubscribeObjectType.Property,
          objectTypes: ['map'],
          properties: _constants.ANY,
          description: _constants.COLLECTION_PREFIX + "prop1|" + _constants.ANY_DISPLAY + "|prop2",
          next: {
            type: _rules.RuleType.Action,
            subType: _rulesSubscribe.SubscribeObjectType.Property,
            objectTypes: ['map'],
            properties: _constants.ANY,
            description: _constants.COLLECTION_PREFIX + _constants.ANY_DISPLAY
          }
        }
      }
    });
  });
  (0, _Mocha.it)('mapKeys', function () {
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
      objectTypes: ['map'],
      properties: ['prop1'],
      description: _constants.COLLECTION_PREFIX + 'prop1',
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
      objectTypes: ['map'],
      properties: ['prop1'],
      description: _constants.COLLECTION_PREFIX + 'prop1',
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
        objectTypes: ['map'],
        properties: ['prop2'],
        description: _constants.COLLECTION_PREFIX + 'prop2',
        next: {
          type: _rules.RuleType.Action,
          subType: _rulesSubscribe.SubscribeObjectType.Property,
          objectTypes: ['map'],
          properties: ['prop3', 'prop4', 'prop5'],
          description: _constants.COLLECTION_PREFIX + 'prop3|prop4|prop5'
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    var rule3 = builder3.result().next.next;
  });
  (0, _Mocha.it)('collection', function () {
    var builder = new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    });

    _Assert.assert.strictEqual(builder.result(), undefined);

    var builder1 = builder.collection();
    var rule1 = builder1.result();

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(rule1, {
      type: _rules.RuleType.Action,
      subType: _rulesSubscribe.SubscribeObjectType.Property,
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
      objectTypes: ['map', 'set', 'iterable'],
      properties: _constants.ANY,
      description: _constants.COLLECTION_PREFIX,
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
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
      subType: _rulesSubscribe.SubscribeObjectType.Property,
      objectTypes: ['set'],
      properties: _constants.ANY,
      description: _constants.COLLECTION_PREFIX,
      next: {
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
        objectTypes: ['set'],
        properties: _constants.ANY,
        description: _constants.COLLECTION_PREFIX,
        next: {
          type: _rules.RuleType.Action,
          subType: _rulesSubscribe.SubscribeObjectType.Property,
          objectTypes: ['set'],
          properties: _constants.ANY,
          description: _constants.COLLECTION_PREFIX
        }
      }
    }); // noinspection JSUnusedLocalSymbols

    var rule3 = builder3.result().next.next;
  });
  (0, _Mocha.it)('repeat', function () {
    var _context11, _context12;

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

    var builder1 = (0, _repeat.default)(_context11 = (0, _repeat.default)(_context12 = (0, _repeat.default)(builder).call(builder, null, null, null, function (b) {
      var _context13, _context14;

      return (0, _repeat.default)(_context13 = (0, _repeat.default)(_context14 = (0, _repeat.default)(b).call(b, 1, null, null, function (b) {
        return b.p('prop1');
      })).call(_context14, null, 2, null, function (b) {
        return b.p("prop '2'");
      })).call(_context13, 3, 4, null, function (b) {
        return b.p('prop4');
      });
    })).call(_context12, 5, 6, null, function (b) {
      return b.p('prop5');
    })).call(_context11, 7, 8, null, function (b) {
      return b.p('length');
    });
    checkType(builder1);

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(builder1.result(), {
      type: _rules.RuleType.Repeat,
      countMin: 0,
      countMax: _maxSafeInteger.default,
      condition: null,
      description: '<repeat>',
      rule: {
        type: _rules.RuleType.Repeat,
        countMin: 1,
        countMax: _maxSafeInteger.default,
        condition: null,
        description: '<repeat>',
        rule: {
          type: _rules.RuleType.Action,
          subType: _rulesSubscribe.SubscribeObjectType.Property,
          objectTypes: ['object', 'array'],
          properties: ['prop1'],
          description: 'prop1'
        },
        next: {
          type: _rules.RuleType.Repeat,
          countMin: 0,
          countMax: 2,
          condition: null,
          description: '<repeat>',
          rule: {
            type: _rules.RuleType.Action,
            subType: _rulesSubscribe.SubscribeObjectType.Property,
            objectTypes: ['object', 'array'],
            properties: ["prop '2'"],
            description: "prop '2'"
          },
          next: {
            type: _rules.RuleType.Repeat,
            countMin: 3,
            countMax: 4,
            condition: null,
            description: '<repeat>',
            rule: {
              type: _rules.RuleType.Action,
              subType: _rulesSubscribe.SubscribeObjectType.Property,
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
        description: '<repeat>',
        rule: {
          type: _rules.RuleType.Action,
          subType: _rulesSubscribe.SubscribeObjectType.Property,
          objectTypes: ['object', 'array'],
          properties: ['prop5'],
          description: 'prop5'
        },
        next: {
          type: _rules.RuleType.Repeat,
          countMin: 7,
          countMax: 8,
          condition: null,
          description: '<repeat>',
          rule: {
            type: _rules.RuleType.Action,
            subType: _rulesSubscribe.SubscribeObjectType.Property,
            objectTypes: ['object', 'array'],
            properties: ['length'],
            description: 'length'
          }
        }
      }
    });
  });
  (0, _Mocha.it)('any', function () {
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
      return b.p('prop1');
    }).any(function (b) {
      return b.p("prop '2'");
    }).any(function (b) {
      return b.any(function (b) {
        return b.p('prop4');
      });
    }, function (b) {
      return b.any(function (b) {
        return b.p('prop4');
      }, function (b) {
        return b.p('prop4_1');
      });
    }, function (b) {
      return b.any(function (b) {
        return b.p('prop4');
      }, function (b) {
        return b.p('prop4_1');
      }, function (b) {
        return b.p('prop4_2');
      });
    }).any(function (b) {
      return b.p('prop5');
    }).any(function (b) {
      return b.p('length');
    });
    checkType(builder1);

    _Assert.assert.strictEqual(builder1, builder);

    assertRule(builder1.result(), {
      type: _rules.RuleType.Any,
      description: '<any>',
      rules: [{
        type: _rules.RuleType.Action,
        subType: _rulesSubscribe.SubscribeObjectType.Property,
        objectTypes: ['object', 'array'],
        properties: ['prop1'],
        description: 'prop1'
      }],
      next: {
        type: _rules.RuleType.Any,
        description: '<any>',
        rules: [{
          type: _rules.RuleType.Action,
          subType: _rulesSubscribe.SubscribeObjectType.Property,
          objectTypes: ['object', 'array'],
          properties: ["prop '2'"],
          description: "prop '2'"
        }],
        next: {
          type: _rules.RuleType.Any,
          description: '<any>',
          rules: [{
            type: _rules.RuleType.Any,
            description: '<any>',
            rules: [{
              type: _rules.RuleType.Action,
              subType: _rulesSubscribe.SubscribeObjectType.Property,
              objectTypes: ['object', 'array'],
              properties: ['prop4'],
              description: 'prop4'
            }]
          }, {
            type: _rules.RuleType.Any,
            description: '<any>',
            rules: [{
              type: _rules.RuleType.Action,
              subType: _rulesSubscribe.SubscribeObjectType.Property,
              objectTypes: ['object', 'array'],
              properties: ['prop4'],
              description: 'prop4'
            }, {
              type: _rules.RuleType.Action,
              subType: _rulesSubscribe.SubscribeObjectType.Property,
              objectTypes: ['object', 'array'],
              properties: ['prop4_1'],
              description: 'prop4_1'
            }]
          }, {
            type: _rules.RuleType.Any,
            description: '<any>',
            rules: [{
              type: _rules.RuleType.Action,
              subType: _rulesSubscribe.SubscribeObjectType.Property,
              objectTypes: ['object', 'array'],
              properties: ['prop4'],
              description: 'prop4'
            }, {
              type: _rules.RuleType.Action,
              subType: _rulesSubscribe.SubscribeObjectType.Property,
              objectTypes: ['object', 'array'],
              properties: ['prop4_1'],
              description: 'prop4_1'
            }, {
              type: _rules.RuleType.Action,
              subType: _rulesSubscribe.SubscribeObjectType.Property,
              objectTypes: ['object', 'array'],
              properties: ['prop4_2'],
              description: 'prop4_2'
            }]
          }],
          next: {
            type: _rules.RuleType.Any,
            description: '<any>',
            rules: [{
              type: _rules.RuleType.Action,
              subType: _rulesSubscribe.SubscribeObjectType.Property,
              objectTypes: ['object', 'array'],
              properties: ['prop5'],
              description: 'prop5'
            }],
            next: {
              type: _rules.RuleType.Any,
              description: '<any>',
              rules: [{
                type: _rules.RuleType.Action,
                subType: _rulesSubscribe.SubscribeObjectType.Property,
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