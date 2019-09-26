"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _rdtsc = require("rdtsc");

var _deepSubscribe = require("../../../main/common/rx/deep-subscribe/deep-subscribe");

var _ObservableObject2 = require("../../../main/common/rx/object/ObservableObject");

var _ObservableObjectBuilder = require("../../../main/common/rx/object/ObservableObjectBuilder");

var _Calc = require("../../../main/common/test/Calc");

/* tslint:disable:no-empty no-identical-functions */
// @ts-ignore
describe('ObservableObject', function () {
  this.timeout(300000);

  function createObject(init) {
    var Class =
    /*#__PURE__*/
    function (_ObservableObject) {
      (0, _inherits2.default)(Class, _ObservableObject);

      function Class() {
        (0, _classCallCheck2.default)(this, Class);
        return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(Class).apply(this, arguments));
      }

      return Class;
    }(_ObservableObject2.ObservableObject);

    new _ObservableObjectBuilder.ObservableObjectBuilder(_ObservableObject2.ObservableObject.prototype).writable('prop') // , o => o.prop, (o, v) => o.prop = v)
    .writable('prop2'); // , o => o.prop2, (o, v) => o.prop2 = v)

    var observableObject1 = new Class();
    var observableObject2 = new Class();

    if (init) {
      init(observableObject1);
      init(observableObject2);
    }

    var object1 = {
      prop: void 0,
      prop2: void 0
    };
    var object2 = {
      prop: void 0,
      prop2: void 0
    };
    var value = 1;
    object1.prop = value++;
    object1.prop2 = value++;
    object2.prop = value++;
    object2.prop2 = value++;
    observableObject1.prop = value++;
    observableObject1.prop2 = value++;
    observableObject2.prop = value++;
    observableObject2.prop2 = value++;
    return {
      object1: object1,
      object2: object2,
      observableObject1: observableObject1,
      observableObject2: observableObject2
    };
  }

  function testPerformance(_ref) {
    var _context;

    var object1 = _ref.object1,
        object2 = _ref.object2,
        observableObject1 = _ref.observableObject1,
        observableObject2 = _ref.observableObject2;
    var testFunc = (0, _bind.default)(_context = Function('o1', 'o2', 'v', "{\n\t\t\to1.prop = v\n\t\t\to1.prop2 = v\n\t\t\to2.prop = v\n\t\t\to2.prop2 = v\n\t\t\treturn o1.prop + o1.prop2 + o2.prop + o2.prop2\n\t\t} // " + Math.random())).call(_context, null, observableObject1, observableObject2);
    var value = -2000000000; // calcStat(1000, 10, time => {

    var result = (0, _rdtsc.calcPerformance)(20000, // () => {
    // 	// no operations
    // 	value++
    // },
    // () => { // 12
    // 	object1.prop = value++
    // 	object1.prop2 = value++
    // 	object2.prop = value++
    // 	object2.prop2 = value++
    // },
    // () => { // 4
    // 	return object1.prop && object1.prop2 && object2.prop && object2.prop2
    // },
    function () {
      return testFunc(value++ % 2 === 0 ? {
        value: value
      } : value);
    } // () => { // 0
    // 	return observableObject1.prop && observableObject1.prop2 && observableObject1.prop && observableObject2.prop2
    // },
    );
    console.log(result); // return result.cycles
    // })
  }

  it('simple', function () {
    // 173n | 184n
    testPerformance(createObject());
  });
  it('propertyChanged', function () {
    // 721n | 682n
    testPerformance(createObject(function (observableObject) {
      observableObject.propertyChanged.subscribe(function (v) {});
    }));
  });
  it('deepSubscribe', function () {
    // 2162n | 1890n
    var i = 0;
    testPerformance(createObject(function (observableObject) {
      (0, _deepSubscribe.deepSubscribe)({
        object: observableObject,
        lastValue: function lastValue(v) {
          return typeof v === 'object' && i++ % 3 === 0 ? function () {} : null;
        },
        ruleBuilder: function ruleBuilder(b) {
          return b.path(function (o) {
            return o.prop;
          });
        }
      });
    }));
  });
  it('propertyChanged memory', function () {
    // 48 | 0
    var object = createObject(function (observableObject) {
      observableObject.propertyChanged.subscribe(function (v) {});
    }).observableObject1;
    object.prop = 1;
    (0, _Calc.calcMemAllocate)(_Calc.CalcType.Min, 10000, function () {
      // 48 bytes for create event
      object.prop++;
    });
  });
  it('deepSubscribe memory', function () {
    // 48 | 0
    var object = createObject(function (observableObject) {
      (0, _deepSubscribe.deepSubscribe)({
        object: observableObject,
        // v => v != null && typeof v === 'object'
        // 	? () => {}
        // 	: null,
        lastValue: function lastValue(v) {
          return null;
        },
        ruleBuilder: function ruleBuilder(b) {
          return b.path(function (o) {
            return o.prop;
          });
        }
      });
    }).observableObject1;
    var value1 = {};
    var value2 = {};
    object.prop = 1;
    (0, _Calc.calcMemAllocate)(_Calc.CalcType.Min, 10000, function () {
      // 48 bytes for create event
      // 56 bytes for create unsubscribe function
      object.prop = object.prop === value1 ? value2 : value1;
    });
  });
  it('test memory', function () {
    (0, _Calc.calcMemAllocate)(_Calc.CalcType.Min, 10000, function () {
      var value;

      function calcValue() {
        value = 3;
      }

      calcValue();
      return value;
    });
  });
  it('test event as object or arguments', function () {
    var value1;
    var value2;
    var i = 0;

    function fakeThrow() {
      if (i < 0) {
        throw new Error(i + '');
      }
    }

    var subscribers1 = [function (name, newValue, oldValue) {
      value1 = newValue;
    }, function (name, newValue, oldValue) {
      value2 = newValue;
    }];
    var subscribers2 = [function (_ref2) {
      var name = _ref2.name,
          newValue = _ref2.newValue,
          oldValue = _ref2.oldValue;
      value1 = newValue;
    }, function (_ref3) {
      var name = _ref3.name,
          newValue = _ref3.newValue,
          oldValue = _ref3.oldValue;
      value2 = newValue;
    }];

    function change1(name, newValue, oldValue) {
      for (var j = 0, len = subscribers1.length; j < len; j++) {
        var subscriber = subscribers1[j];
        subscriber(name, newValue, oldValue);
      }
    }

    function change2(event) {
      for (var j = 0, len = subscribers1.length; j < len; j++) {
        var subscriber = subscribers2[j];
        subscriber(event);
      }
    }

    var heapUsed = process.memoryUsage().heapUsed;
    var result = (0, _rdtsc.calcPerformance)(20000, function () {
      return change1('prop', i++, i++);
    }, function () {
      return change2({
        name: 'prop',
        newValue: i++,
        oldValue: i++
      });
    });
    heapUsed = process.memoryUsage().heapUsed - heapUsed;
    (0, _Calc.calcMemAllocate)(_Calc.CalcType.Min, 10000, function () {
      change1('prop', i++, i++);
    });
    (0, _Calc.calcMemAllocate)(_Calc.CalcType.Min, 10000, function () {
      change2({
        name: 'prop',
        newValue: i++,
        oldValue: i++
      });
    });
    console.log('value1: ', value1);
    console.log('value2: ', value2);
    console.log('Memory used: ', heapUsed);
    console.log(result);
  });
});