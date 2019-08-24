import _typeof from "@babel/runtime/helpers/typeof";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";

/* tslint:disable:no-duplicate-string */

/* eslint-disable guard-for-in */
import { ObservableObject } from '../../../../../../../main/common/rx/object/ObservableObject';
import { ObservableObjectBuilder } from '../../../../../../../main/common/rx/object/ObservableObjectBuilder';
import { ConnectorBuilder } from '../../../../../../../main/common/rx/object/properties/ConnectorBuilder';
import { createObject } from '../../deep-subscribe/helpers/Tester';
xdescribe('common > main > rx > properties > CalcProperty', function () {
  it('connect', function () {
    var source = createObject().observableObject;
    new ObservableObjectBuilder(source).writable('baseProp1').writable('baseProp2').writable('prop1').writable('prop2');
    source.baseProp1 = 'baseProp1_init_source';

    var BaseClass1 =
    /*#__PURE__*/
    function (_ObservableObject) {
      _inherits(BaseClass1, _ObservableObject);

      function BaseClass1() {
        var _getPrototypeOf2;

        var _this;

        _classCallCheck(this, BaseClass1);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(BaseClass1)).call.apply(_getPrototypeOf2, [this].concat(args)));
        _this.source = source;
        return _this;
      }

      return BaseClass1;
    }(ObservableObject);

    var BaseClass2 =
    /*#__PURE__*/
    function (_BaseClass) {
      _inherits(BaseClass2, _BaseClass);

      function BaseClass2() {
        _classCallCheck(this, BaseClass2);

        return _possibleConstructorReturn(this, _getPrototypeOf(BaseClass2).apply(this, arguments));
      }

      return BaseClass2;
    }(BaseClass1);

    var Class1 =
    /*#__PURE__*/
    function (_BaseClass2) {
      _inherits(Class1, _BaseClass2);

      function Class1() {
        _classCallCheck(this, Class1);

        return _possibleConstructorReturn(this, _getPrototypeOf(Class1).apply(this, arguments));
      }

      return Class1;
    }(BaseClass1);

    var Class2 =
    /*#__PURE__*/
    function (_BaseClass3) {
      _inherits(Class2, _BaseClass3);

      function Class2() {
        _classCallCheck(this, Class2);

        return _possibleConstructorReturn(this, _getPrototypeOf(Class2).apply(this, arguments));
      }

      return Class2;
    }(BaseClass2);

    var baseBuilder1 = new ConnectorBuilder(BaseClass1.prototype).connect('baseProp1', {
      buildRule: function buildRule(b) {
        return b.path(function (o) {
          return o.source.property['@value_property'].observableMap['#observableList']['#'].baseProp1;
        });
      }
    }, 'baseProp1_init');
    var baseBuilder2 = new ConnectorBuilder(BaseClass2.prototype).connect('baseProp2', {
      buildRule: function buildRule(b) {
        return b.path(function (o) {
          return o.source.property['@value_property'].observableMap['#observableList']['#'].baseProp2;
        });
      }
    }, 'baseProp2_init');
    var builder1 = new ConnectorBuilder(Class1.prototype).connect('prop1', {
      buildRule: function buildRule(b) {
        return b.path(function (o) {
          return o.source.property['@value_property'].observableMap['#observableList']['#'].prop1;
        });
      }
    }, 'prop1_init');
    var builder2 = new ConnectorBuilder(Class2.prototype).connect('prop2', {
      buildRule: function buildRule(b) {
        return b.path(function (o) {
          return o.source.property['@value_property'].observableMap['#observableList']['#'].prop2;
        });
      }
    }, 'prop2_init');
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
    assert.strictEqual(_typeof(baseUnsubscribe1[0] = baseObject1.propertyChanged.subscribe(baseSubscriber1)), 'function');
    assert.strictEqual(_typeof(baseUnsubscribe2[0] = baseObject2.propertyChanged.subscribe(baseSubscriber2)), 'function');
    assert.strictEqual(_typeof(unsubscribe1[0] = object1.propertyChanged.subscribe(subscriber1)), 'function');
    assert.strictEqual(_typeof(unsubscribe2[0] = object2.propertyChanged.subscribe(subscriber2)), 'function');
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
    assert.deepStrictEqual(baseObject2.baseProp1, 'baseProp1_init_source');
    assert.deepStrictEqual(object1.baseProp1, 'baseProp1_init_source');
    assert.deepStrictEqual(object2.baseProp1, 'baseProp1_init_source');
    assert.strictEqual(baseObject2.baseProp2, 'baseProp2_init');
    source.baseProp2 = '3';
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, [{
      name: 'baseProp2',
      newValue: '3',
      oldValue: 'baseProp2_init'
    }]);
    baseResults2 = [];
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, []);
    assert.deepStrictEqual(baseObject1.baseProp2, undefined);
    assert.deepStrictEqual(baseObject2.baseProp2, '3');
    assert.deepStrictEqual(object1.baseProp2, undefined);
    assert.deepStrictEqual(object2.baseProp2, 'baseProp2_init');
    new ConnectorBuilder(object2).readable('baseProp1', null, '7');
    assert.deepStrictEqual(baseResults1, []);
    assert.deepStrictEqual(baseResults2, []);
    assert.deepStrictEqual(results1, []);
    assert.deepStrictEqual(results2, [{
      name: 'baseProp1',
      newValue: '7',
      oldValue: 'baseProp1_init_source'
    }]);
    results2 = [];
    assert.deepStrictEqual(baseObject1.baseProp1, '1');
    assert.deepStrictEqual(baseObject2.baseProp1, 'baseProp1_init_source');
    assert.deepStrictEqual(object1.baseProp1, 'baseProp1_init_source');
    assert.deepStrictEqual(object2.baseProp1, '7');
  });
});