"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _rdtsc = require("rdtsc");

var _ObservableClass2 = require("../../../main/common/rx/object/ObservableClass");

var _ObservableObjectBuilder = require("../../../main/common/rx/object/ObservableObjectBuilder");

var _calc = require("../../../main/common/test/calc");

var _calcMemAllocate = require("../../../main/common/test/calc-mem-allocate");

var _Mocha = require("../../../main/common/test/Mocha");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

(0, _Mocha.describe)('ObservableClass', function () {
  this.timeout(300000);

  function createObject(init) {
    var Class = /*#__PURE__*/function (_ObservableClass) {
      (0, _inherits2.default)(Class, _ObservableClass);

      var _super = _createSuper(Class);

      function Class() {
        (0, _classCallCheck2.default)(this, Class);
        return _super.apply(this, arguments);
      }

      return Class;
    }(_ObservableClass2.ObservableClass);

    new _ObservableObjectBuilder.ObservableObjectBuilder(_ObservableClass2.ObservableClass.prototype).writable('prop') // , o => o.prop, (o, v) => o.prop = v)
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

  (0, _Mocha.it)('simple', function () {
    // 173n | 184n
    testPerformance(createObject());
  });
  (0, _Mocha.it)('propertyChanged', function () {
    // 721n | 682n
    testPerformance(createObject(function (observableObject) {
      observableObject.propertyChanged.subscribe(function (v) {});
    }));
  });
  (0, _Mocha.it)('propertyChanged memory', function () {
    // 48 | 0
    var object = createObject(function (observableObject) {
      observableObject.propertyChanged.subscribe(function (v) {});
    }).observableObject1;
    object.prop = 1;
    console.log((0, _calcMemAllocate.calcMemAllocate)(_calc.CalcType.Min, 10000, function () {
      // 48 bytes for create event
      object.prop++;
    }).toString());
  });
  (0, _Mocha.it)('test memory', function () {
    console.log((0, _calcMemAllocate.calcMemAllocate)(_calc.CalcType.Min, 10000, function () {
      var value;

      function calcValue() {
        value = 3;
      }

      calcValue();
      return value;
    }).toString());
  });
  (0, _Mocha.it)('test event as object or arguments', function () {
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
    console.log((0, _calcMemAllocate.calcMemAllocate)(_calc.CalcType.Min, 10000, function () {
      change1('prop', i++, i++);
    }).toString());
    console.log((0, _calcMemAllocate.calcMemAllocate)(_calc.CalcType.Min, 10000, function () {
      change2({
        name: 'prop',
        newValue: i++,
        oldValue: i++
      });
    }).toString());
    console.log('value1: ', value1);
    console.log('value2: ', value2);
    console.log('Memory used: ', heapUsed);
    console.log(result);
  });
});