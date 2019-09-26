"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _ObservableObject2 = require("../../../../../../../main/common/rx/object/ObservableObject");

var _ObservableObjectBuilder = require("../../../../../../../main/common/rx/object/ObservableObjectBuilder");

var _ConnectorBuilder = require("../../../../../../../main/common/rx/object/properties/ConnectorBuilder");

var _TestDeepSubscribe = require("../../deep-subscribe/helpers/src/TestDeepSubscribe");

/* tslint:disable:no-duplicate-string */

/* eslint-disable guard-for-in */
describe('common > main > rx > properties > ConnectorBuilder', function () {
  it('connect', function () {
    var source = new _ObservableObjectBuilder.ObservableObjectBuilder((0, _TestDeepSubscribe.createObject)().observableObject).writable('baseProp1').writable('baseProp2').writable('prop1').writable('prop2').object;
    source.baseProp1 = 'baseProp1_init_source';

    var BaseClass1 =
    /*#__PURE__*/
    function (_ObservableObject) {
      (0, _inherits2.default)(BaseClass1, _ObservableObject);

      function BaseClass1() {
        var _getPrototypeOf2, _context;

        var _this;

        (0, _classCallCheck2.default)(this, BaseClass1);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(BaseClass1)).call.apply(_getPrototypeOf2, (0, _concat.default)(_context = [this]).call(_context, args)));
        _this.source = source;
        return _this;
      }

      return BaseClass1;
    }(_ObservableObject2.ObservableObject);

    var BaseClass2 =
    /*#__PURE__*/
    function (_BaseClass) {
      (0, _inherits2.default)(BaseClass2, _BaseClass);

      function BaseClass2() {
        (0, _classCallCheck2.default)(this, BaseClass2);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf3.default)(BaseClass2).apply(this, arguments));
      }

      return BaseClass2;
    }(BaseClass1);

    var Class1 =
    /*#__PURE__*/
    function (_BaseClass2) {
      (0, _inherits2.default)(Class1, _BaseClass2);

      function Class1() {
        (0, _classCallCheck2.default)(this, Class1);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf3.default)(Class1).apply(this, arguments));
      }

      return Class1;
    }(BaseClass1);

    var Class2 =
    /*#__PURE__*/
    function (_BaseClass3) {
      (0, _inherits2.default)(Class2, _BaseClass3);

      function Class2() {
        (0, _classCallCheck2.default)(this, Class2);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf3.default)(Class2).apply(this, arguments));
      }

      return Class2;
    }(BaseClass2);

    new _ConnectorBuilder.ConnectorBuilder(BaseClass1.prototype).connect('baseProp1', function (b) {
      return b.path(function (o) {
        return o.source.property['@value_property'].observableMap['#observableList']['#'].baseProp1;
      });
    });
    new _ConnectorBuilder.ConnectorBuilder(BaseClass2.prototype).connectWritable('baseProp2', function (b) {
      return b.path(function (o) {
        return o['@value_property'].source.property['@value_property'].observableMap['#observableList']['#'].baseProp2;
      });
    }, null, 'baseProp2_init');
    new _ConnectorBuilder.ConnectorBuilder(Class1.prototype).connect('prop1', function (b) {
      return b.path(function (o) {
        return o['@value_property'].source.property['@value_property'].observableMap['#observableList']['#'].prop1;
      });
    }, null, 'prop1_init');
    new _ConnectorBuilder.ConnectorBuilder(Class2.prototype).connectWritable('prop2', function (b) {
      return b.path(function (o) {
        return o['@value_property'].source.property['@value_property'].observableMap['#observableList']['#'].prop2;
      });
    }, null, 'prop2_init');
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
    assert.strictEqual(typeof (baseUnsubscribe1[0] = baseObject1.propertyChanged.subscribe(baseSubscriber1)), 'function');
    assert.strictEqual(typeof (baseUnsubscribe2[0] = baseObject2.propertyChanged.subscribe(baseSubscriber2)), 'function');
    assert.strictEqual(typeof (unsubscribe1[0] = object1.propertyChanged.subscribe(subscriber1)), 'function');
    assert.strictEqual(typeof (unsubscribe2[0] = object2.propertyChanged.subscribe(subscriber2)), 'function'); // assert.strictEqual(baseObject2.baseProp1, void 0)

    assert.strictEqual(baseObject1.baseProp1, 'baseProp1_init_source');
    source.baseProp1 = '1';
    assert.deepStrictEqual(baseResults1, [{
      name: 'baseProp1',
      newValue: '1',
      oldValue: 'baseProp1_init_source'
    }]);
    baseResults1 = [];
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '1');
    assert.deepStrictEqual(object1.baseProp1, '1');
    assert.deepStrictEqual(object2.baseProp1, '1');
    assert.strictEqual(baseObject2.baseProp2, 'baseProp2_init');
    baseObject2.baseProp2 = '1';
    assert.deepStrictEqual(source.baseProp2, '1');
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, [{
      name: 'baseProp2',
      newValue: '1',
      oldValue: 'baseProp2_init'
    }]);
    baseResults2 = [];
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp2, undefined);
    assert.deepStrictEqual(baseObject2.baseProp2, '1');
    assert.deepStrictEqual(object1.baseProp2, undefined);
    assert.deepStrictEqual(object2.baseProp2, '1');
    object2.baseProp2 = '2';
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, [{
      name: 'baseProp2',
      newValue: '2',
      oldValue: '1'
    }]);
    baseResults2 = [];
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, [{
      name: 'baseProp2',
      newValue: '2',
      oldValue: '1'
    }]);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp2, undefined);
    assert.deepStrictEqual(baseObject2.baseProp2, '2');
    assert.deepStrictEqual(object1.baseProp2, undefined);
    assert.deepStrictEqual(object2.baseProp2, '2');
    source.baseProp2 = '3';
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, [{
      name: 'baseProp2',
      newValue: '3',
      oldValue: '2'
    }]);
    baseResults2 = [];
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, [{
      name: 'baseProp2',
      newValue: '3',
      oldValue: '2'
    }]);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp2, undefined);
    assert.deepStrictEqual(baseObject2.baseProp2, '3');
    assert.deepStrictEqual(object1.baseProp2, undefined);
    assert.deepStrictEqual(object2.baseProp2, '3');
    new _ConnectorBuilder.ConnectorBuilder(object2).readable('baseProp1', null, '7');
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, [{
      name: 'baseProp1',
      newValue: '7',
      oldValue: '1'
    }]);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, '1');
    assert.deepStrictEqual(object1.baseProp1, '1');
    assert.deepStrictEqual(object2.baseProp1, '7');
  });
});