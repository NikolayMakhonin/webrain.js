"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _ObservableClass3 = require("../../../../../../main/common/rx/object/ObservableClass");

var _ObservableObjectBuilder = require("../../../../../../main/common/rx/object/ObservableObjectBuilder");

var _Assert = require("../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../main/common/test/Mocha");

/* eslint-disable guard-for-in */
(0, _Mocha.describe)('common > main > rx > observable-object-builder-prototype', function () {
  function assertEvents(events, check) {
    events = events && (0, _map.default)(events).call(events, function (o) {
      return {
        name: o.name,
        oldValue: o.oldValue,
        newValue: o.newValue
      };
    });

    _Assert.assert.deepStrictEqual(events, check);
  }

  (0, _Mocha.it)('writable', function () {
    var BaseClass1 =
    /*#__PURE__*/
    function (_ObservableClass) {
      (0, _inherits2.default)(BaseClass1, _ObservableClass);

      function BaseClass1() {
        (0, _classCallCheck2.default)(this, BaseClass1);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(BaseClass1).apply(this, arguments));
      }

      return BaseClass1;
    }(_ObservableClass3.ObservableClass);

    var BaseClass2 =
    /*#__PURE__*/
    function (_BaseClass) {
      (0, _inherits2.default)(BaseClass2, _BaseClass);

      function BaseClass2() {
        (0, _classCallCheck2.default)(this, BaseClass2);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(BaseClass2).apply(this, arguments));
      }

      return BaseClass2;
    }(BaseClass1);

    var Class1 =
    /*#__PURE__*/
    function (_BaseClass2) {
      (0, _inherits2.default)(Class1, _BaseClass2);

      function Class1() {
        (0, _classCallCheck2.default)(this, Class1);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Class1).apply(this, arguments));
      }

      return Class1;
    }(BaseClass1);

    var Class2 =
    /*#__PURE__*/
    function (_BaseClass3) {
      (0, _inherits2.default)(Class2, _BaseClass3);

      function Class2() {
        (0, _classCallCheck2.default)(this, Class2);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Class2).apply(this, arguments));
      }

      return Class2;
    }(BaseClass2);

    var baseBuilder1 = new _ObservableObjectBuilder.ObservableObjectBuilder(BaseClass1.prototype).writable('baseProp1');
    var baseBuilder2 = new _ObservableObjectBuilder.ObservableObjectBuilder(BaseClass2.prototype).writable('baseProp2');
    var builder1 = new _ObservableObjectBuilder.ObservableObjectBuilder(Class1.prototype).writable('prop1');
    var builder2 = new _ObservableObjectBuilder.ObservableObjectBuilder(Class2.prototype).writable('prop2');
    var baseObject1 = new BaseClass1();
    var baseObject2 = new BaseClass2();
    var object1 = new Class1();
    var object2 = new Class2(); // eslint-disable-next-line prefer-const

    var baseResults1 = [];

    var baseSubscriber1 = function baseSubscriber1(value) {
      baseResults1.push(value);
    }; // eslint-disable-next-line prefer-const


    var baseResults2 = [];

    var baseSubscriber2 = function baseSubscriber2(value) {
      baseResults2.push(value);
    }; // eslint-disable-next-line prefer-const


    var results1 = [];

    var subscriber1 = function subscriber1(value) {
      results1.push(value);
    }; // eslint-disable-next-line prefer-const


    var results2 = [];

    var subscriber2 = function subscriber2(value) {
      results2.push(value);
    };

    var baseUnsubscribe1 = [];
    var baseUnsubscribe2 = [];
    var unsubscribe1 = [];
    var unsubscribe2 = [];

    _Assert.assert.strictEqual(typeof (baseUnsubscribe1[0] = baseObject1.propertyChanged.subscribe(baseSubscriber1)), 'function');

    _Assert.assert.strictEqual(typeof (baseUnsubscribe2[0] = baseObject2.propertyChanged.subscribe(baseSubscriber2)), 'function');

    _Assert.assert.strictEqual(typeof (unsubscribe1[0] = object1.propertyChanged.subscribe(subscriber1)), 'function');

    _Assert.assert.strictEqual(typeof (unsubscribe2[0] = object2.propertyChanged.subscribe(subscriber2)), 'function');

    baseObject1.baseProp1 = '1';
    assertEvents(baseResults1, [{
      name: 'baseProp1',
      newValue: '1',
      oldValue: undefined
    }]);
    baseResults1 = [];
    assertEvents(baseResults2, []);
    assertEvents(results1, []);
    assertEvents(results2, []);

    _Assert.assert.deepStrictEqual(baseObject1.baseProp1, '1');

    _Assert.assert.deepStrictEqual(baseObject2.baseProp1, undefined);

    _Assert.assert.deepStrictEqual(object1.baseProp1, undefined);

    _Assert.assert.deepStrictEqual(object2.baseProp1, undefined);

    baseObject2.baseProp1 = '2';
    assertEvents(baseResults1, []);
    assertEvents(baseResults2, [{
      name: 'baseProp1',
      newValue: '2',
      oldValue: undefined
    }]);
    baseResults2 = [];
    assertEvents(results1, []);
    assertEvents(results2, []);

    _Assert.assert.deepStrictEqual(baseObject1.baseProp1, '1');

    _Assert.assert.deepStrictEqual(baseObject2.baseProp1, '2');

    _Assert.assert.deepStrictEqual(object1.baseProp1, undefined);

    _Assert.assert.deepStrictEqual(object2.baseProp1, undefined);

    baseObject2.baseProp2 = '3';
    assertEvents(baseResults1, []);
    assertEvents(baseResults2, [{
      name: 'baseProp2',
      newValue: '3',
      oldValue: undefined
    }]);
    baseResults2 = [];
    assertEvents(results1, []);
    assertEvents(results2, []);

    _Assert.assert.deepStrictEqual(baseObject1.baseProp2, undefined);

    _Assert.assert.deepStrictEqual(baseObject2.baseProp2, '3');

    _Assert.assert.deepStrictEqual(object1.baseProp2, undefined);

    _Assert.assert.deepStrictEqual(object2.baseProp2, undefined);

    object1.baseProp1 = '4';
    assertEvents(baseResults1, []);
    assertEvents(baseResults2, []);
    assertEvents(results1, [{
      name: 'baseProp1',
      newValue: '4',
      oldValue: undefined
    }]);
    results1 = [];
    assertEvents(results2, []);

    _Assert.assert.deepStrictEqual(baseObject1.baseProp1, '1');

    _Assert.assert.deepStrictEqual(baseObject2.baseProp1, '2');

    _Assert.assert.deepStrictEqual(object1.baseProp1, '4');

    _Assert.assert.deepStrictEqual(object2.baseProp1, undefined);

    object2.baseProp1 = '5';
    assertEvents(baseResults1, []);
    assertEvents(baseResults2, []);
    assertEvents(results1, []);
    assertEvents(results2, [{
      name: 'baseProp1',
      newValue: '5',
      oldValue: undefined
    }]);
    results2 = [];

    _Assert.assert.deepStrictEqual(baseObject1.baseProp1, '1');

    _Assert.assert.deepStrictEqual(baseObject2.baseProp1, '2');

    _Assert.assert.deepStrictEqual(object1.baseProp1, '4');

    _Assert.assert.deepStrictEqual(object2.baseProp1, '5');

    object2.baseProp2 = '6';
    assertEvents(baseResults1, []);
    assertEvents(baseResults2, []);
    assertEvents(results1, []);
    assertEvents(results2, [{
      name: 'baseProp2',
      newValue: '6',
      oldValue: undefined
    }]);
    results2 = [];

    _Assert.assert.deepStrictEqual(baseObject1.baseProp2, undefined);

    _Assert.assert.deepStrictEqual(baseObject2.baseProp2, '3');

    _Assert.assert.deepStrictEqual(object1.baseProp2, undefined);

    _Assert.assert.deepStrictEqual(object2.baseProp2, '6');

    new _ObservableObjectBuilder.ObservableObjectBuilder(object2).readable('baseProp1', null, '7');
    assertEvents(baseResults1, []);
    assertEvents(baseResults2, []);
    assertEvents(results1, []);
    assertEvents(results2, [{
      name: 'baseProp1',
      newValue: '7',
      oldValue: '5'
    }]);
    results2 = [];

    _Assert.assert.deepStrictEqual(baseObject1.baseProp1, '1');

    _Assert.assert.deepStrictEqual(baseObject2.baseProp1, '2');

    _Assert.assert.deepStrictEqual(object1.baseProp1, '4');

    _Assert.assert.deepStrictEqual(object2.baseProp1, '7');
  });
  (0, _Mocha.it)('readable', function () {
    var BaseClass1 =
    /*#__PURE__*/
    function (_ObservableClass2) {
      (0, _inherits2.default)(BaseClass1, _ObservableClass2);

      function BaseClass1() {
        (0, _classCallCheck2.default)(this, BaseClass1);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(BaseClass1).apply(this, arguments));
      }

      return BaseClass1;
    }(_ObservableClass3.ObservableClass);

    var BaseClass2 =
    /*#__PURE__*/
    function (_BaseClass4) {
      (0, _inherits2.default)(BaseClass2, _BaseClass4);

      function BaseClass2() {
        (0, _classCallCheck2.default)(this, BaseClass2);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(BaseClass2).apply(this, arguments));
      }

      return BaseClass2;
    }(BaseClass1);

    var Class1 =
    /*#__PURE__*/
    function (_BaseClass5) {
      (0, _inherits2.default)(Class1, _BaseClass5);

      function Class1() {
        (0, _classCallCheck2.default)(this, Class1);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Class1).apply(this, arguments));
      }

      return Class1;
    }(BaseClass1);

    var Class2 =
    /*#__PURE__*/
    function (_BaseClass6) {
      (0, _inherits2.default)(Class2, _BaseClass6);

      function Class2() {
        (0, _classCallCheck2.default)(this, Class2);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Class2).apply(this, arguments));
      }

      return Class2;
    }(BaseClass2);

    var baseBuilder1 = new _ObservableObjectBuilder.ObservableObjectBuilder(BaseClass1.prototype).readable('baseProp1');
    var baseBuilder2 = new _ObservableObjectBuilder.ObservableObjectBuilder(BaseClass2.prototype).readable('baseProp2');
    var builder1 = new _ObservableObjectBuilder.ObservableObjectBuilder(Class1.prototype).readable('prop1');
    var builder2 = new _ObservableObjectBuilder.ObservableObjectBuilder(Class2.prototype).readable('prop2');
    var baseObject1 = new BaseClass1();
    var baseObject2 = new BaseClass2();
    var object1 = new Class1();
    var object2 = new Class2(); // eslint-disable-next-line prefer-const

    var baseResults1 = [];

    var baseSubscriber1 = function baseSubscriber1(value) {
      baseResults1.push(value);
    }; // eslint-disable-next-line prefer-const


    var baseResults2 = [];

    var baseSubscriber2 = function baseSubscriber2(value) {
      baseResults2.push(value);
    }; // eslint-disable-next-line prefer-const


    var results1 = [];

    var subscriber1 = function subscriber1(value) {
      results1.push(value);
    }; // eslint-disable-next-line prefer-const


    var results2 = [];

    var subscriber2 = function subscriber2(value) {
      results2.push(value);
    };

    var baseUnsubscribe1 = [];
    var baseUnsubscribe2 = [];
    var unsubscribe1 = [];
    var unsubscribe2 = [];

    _Assert.assert.strictEqual(typeof (baseUnsubscribe1[0] = baseObject1.propertyChanged.subscribe(baseSubscriber1)), 'function');

    _Assert.assert.strictEqual(typeof (baseUnsubscribe2[0] = baseObject2.propertyChanged.subscribe(baseSubscriber2)), 'function');

    _Assert.assert.strictEqual(typeof (unsubscribe1[0] = object1.propertyChanged.subscribe(subscriber1)), 'function');

    _Assert.assert.strictEqual(typeof (unsubscribe2[0] = object2.propertyChanged.subscribe(subscriber2)), 'function');

    baseBuilder1.readable('baseProp1', null, '1');
    assertEvents(baseResults1, []);
    baseResults1 = [];
    assertEvents(baseResults2, []);
    assertEvents(results1, []);
    assertEvents(results2, []);

    _Assert.assert.deepStrictEqual(baseObject1.baseProp1, '1');

    _Assert.assert.deepStrictEqual(baseObject2.baseProp1, '1');

    _Assert.assert.deepStrictEqual(object1.baseProp1, '1');

    _Assert.assert.deepStrictEqual(object2.baseProp1, '1');

    baseBuilder2.readable('baseProp1', {
      factory: function factory() {
        return '2';
      }
    });
    assertEvents(baseResults1, []);
    assertEvents(baseResults2, []);
    baseResults2 = [];
    assertEvents(results1, []);
    assertEvents(results2, []);

    _Assert.assert.deepStrictEqual(baseObject1.baseProp1, '1');

    _Assert.assert.deepStrictEqual(baseObject2.baseProp1, '1');

    _Assert.assert.deepStrictEqual(object1.baseProp1, '1');

    _Assert.assert.deepStrictEqual(object2.baseProp1, '1');

    delete baseObject1.baseProp1;
    delete baseObject2.baseProp1;
    delete object1.baseProp1;
    delete object2.baseProp1;
    assertEvents(baseResults1, []);
    assertEvents(baseResults2, []);
    baseResults2 = [];
    assertEvents(results1, []);
    assertEvents(results2, []);

    _Assert.assert.deepStrictEqual(baseObject1.baseProp1, '1');

    _Assert.assert.deepStrictEqual(baseObject2.baseProp1, '2');

    _Assert.assert.deepStrictEqual(object1.baseProp1, '1');

    _Assert.assert.deepStrictEqual(object2.baseProp1, '2');

    baseBuilder2.readable('baseProp2', null, '3');
    assertEvents(baseResults1, []);
    assertEvents(baseResults2, []);
    baseResults2 = [];
    assertEvents(results1, []);
    assertEvents(results2, []);

    _Assert.assert.deepStrictEqual(baseObject1.baseProp2, undefined);

    _Assert.assert.deepStrictEqual(baseObject2.baseProp2, '3');

    _Assert.assert.deepStrictEqual(object1.baseProp2, undefined);

    _Assert.assert.deepStrictEqual(object2.baseProp2, '3');

    builder1.readable('baseProp1', {
      factory: function factory() {
        return '4';
      }
    });
    assertEvents(baseResults1, []);
    assertEvents(baseResults2, []);
    assertEvents(results1, []);
    results1 = [];
    assertEvents(results2, []);

    _Assert.assert.deepStrictEqual(baseObject1.baseProp1, '1');

    _Assert.assert.deepStrictEqual(baseObject2.baseProp1, '2');

    _Assert.assert.deepStrictEqual(object1.baseProp1, '1');

    delete object1.baseProp1;

    _Assert.assert.deepStrictEqual(object1.baseProp1, '4');

    _Assert.assert.deepStrictEqual(object2.baseProp1, '2');

    builder2.readable('baseProp1', null, '5');
    assertEvents(baseResults1, []);
    assertEvents(baseResults2, []);
    assertEvents(results1, []);
    assertEvents(results2, []);
    results2 = [];

    _Assert.assert.deepStrictEqual(baseObject1.baseProp1, '1');

    _Assert.assert.deepStrictEqual(baseObject2.baseProp1, '2');

    _Assert.assert.deepStrictEqual(object1.baseProp1, '4');

    _Assert.assert.deepStrictEqual(object2.baseProp1, '2');

    delete object2.baseProp1;

    _Assert.assert.deepStrictEqual(object2.baseProp1, '5');

    builder2.readable('baseProp2', {
      factory: function factory() {
        return '6';
      }
    });
    assertEvents(baseResults1, []);
    assertEvents(baseResults2, []);
    assertEvents(results1, []);
    assertEvents(results2, []);
    results2 = [];

    _Assert.assert.deepStrictEqual(baseObject1.baseProp2, undefined);

    _Assert.assert.deepStrictEqual(baseObject2.baseProp2, '3');

    _Assert.assert.deepStrictEqual(object1.baseProp2, undefined);

    _Assert.assert.deepStrictEqual(object2.baseProp2, '3');

    delete object2.baseProp2;

    _Assert.assert.deepStrictEqual(object2.baseProp2, '6');

    new _ObservableObjectBuilder.ObservableObjectBuilder(object2).readable('baseProp1', null, '7');
    assertEvents(baseResults1, []);
    assertEvents(baseResults2, []);
    assertEvents(results1, []);
    assertEvents(results2, [{
      name: 'baseProp1',
      newValue: '7',
      oldValue: '5'
    }]);
    results2 = [];

    _Assert.assert.deepStrictEqual(baseObject1.baseProp1, '1');

    _Assert.assert.deepStrictEqual(baseObject2.baseProp1, '2');

    _Assert.assert.deepStrictEqual(object1.baseProp1, '4');

    _Assert.assert.deepStrictEqual(object2.baseProp1, '7');

    new _ObservableObjectBuilder.ObservableObjectBuilder(object2).readable('baseProp2', {
      factory: function factory() {
        return '8';
      }
    });
    assertEvents(baseResults1, []);
    assertEvents(baseResults2, []);
    assertEvents(results1, []);
    assertEvents(results2, [{
      name: 'baseProp2',
      newValue: '8',
      oldValue: '6'
    }]);
    results2 = [];

    _Assert.assert.deepStrictEqual(baseObject1.baseProp2, undefined);

    _Assert.assert.deepStrictEqual(baseObject2.baseProp2, '3');

    _Assert.assert.deepStrictEqual(object1.baseProp2, undefined);

    _Assert.assert.deepStrictEqual(object2.baseProp2, '8');
  });
});