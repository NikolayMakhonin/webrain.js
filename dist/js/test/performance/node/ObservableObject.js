"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _rdtsc = require("rdtsc");

var _deepSubscribe = require("../../../main/common/rx/deep-subscribe/deep-subscribe");

var _ObservableObject2 = require("../../../main/common/rx/object/ObservableObject");

var _ObservableObjectBuilder = require("../../../main/common/rx/object/ObservableObjectBuilder");

/* tslint:disable:no-empty no-identical-functions */
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
    var testFunc = (0, _bind.default)(_context = Function('o1', 'o2', 'v', "{\n\t\t\to1.prop = v\n\t\t\to1.prop2 = v\n\t\t\to2.prop = v\n\t\t\to2.prop2 = v\n\t\t\treturn o1.prop + o1.prop2 + o2.prop + o2.prop2\n\t\t} // ".concat(Math.random()))).call(_context, null, observableObject1, observableObject2);
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

  var CalcStatReport =
  /*#__PURE__*/
  function () {
    function CalcStatReport(data) {
      (0, _classCallCheck2.default)(this, CalcStatReport);
      (0, _assign.default)(this, data);
    }

    (0, _createClass2.default)(CalcStatReport, [{
      key: "clone",
      value: function clone() {
        return new CalcStatReport(this);
      }
    }, {
      key: "subtract",
      value: function subtract(other) {
        var result = this.clone();

        for (var j = 0, len = this.averageValue.length; j < len; j++) {
          result.averageValue[j] -= other.averageValue[j];
          result.standardDeviation[j] += other.standardDeviation[j];
        }

        return result;
      }
    }, {
      key: "toString",
      value: function toString() {
        var report = Array(this.averageValue.length);

        for (var j = 0, len = this.averageValue.length; j < len; j++) {
          var _context2, _context3;

          report[j] = (0, _concat.default)(_context2 = (0, _concat.default)(_context3 = "".concat(this.averageValue[j], " \xB1")).call(_context3, 2.5 * this.standardDeviation[j], " [")).call(_context2, this.count, "]");
        }

        return report.join(', ');
      }
    }]);
    return CalcStatReport;
  }();

  var CalcType;

  (function (CalcType) {
    CalcType[CalcType["Stat"] = 0] = "Stat";
    CalcType[CalcType["Min"] = 1] = "Min";
  })(CalcType || (CalcType = {}));

  function calcMin(countTests, testFunc) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    var min;
    var count = 0;

    for (var i = 0; i < countTests; i++) {
      var result = testFunc.apply(void 0, args);

      if (result == null) {
        i--;
        continue;
      }

      count++;

      if (min && i > 3) {
        for (var j = 0, len = result.length; j < len; j++) {
          var cycles = Number(result[j]);

          if (cycles < min[j]) {
            min[j] = cycles;
          }
        }
      } else {
        min = (0, _map.default)(result).call(result, function (o) {
          return Number(o);
        });
        count = 1;
      }
    }

    return new CalcStatReport({
      averageValue: min,
      standardDeviation: (0, _map.default)(min).call(min, function () {
        return 0;
      }),
      count: count
    });
  }

  function calcStat(countTests, testFunc) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    var sum;
    var sumSqr;
    var count = 0;

    for (var i = 0; i < countTests; i++) {
      var result = testFunc.apply(void 0, args);

      if (result == null) {
        i--;
        continue;
      }

      count++;

      if (sum && i > 3) {
        for (var j = 0, len = result.length; j < len; j++) {
          var cycles = Number(result[j]);
          sum[j] += cycles;
          sumSqr[j] += cycles * cycles;
        }
      } else {
        sum = (0, _map.default)(result).call(result, function (o) {
          return Number(o);
        });
        sumSqr = (0, _map.default)(sum).call(sum, function (o) {
          return o * o;
        });
        count = 1;
      }
    }

    var averageValue = Array(sum.length);
    var standardDeviation = Array(sum.length);

    for (var _j = 0, _len3 = sum.length; _j < _len3; _j++) {
      standardDeviation[_j] = Math.sqrt(sumSqr[_j] / count - sum[_j] * sum[_j] / (count * count));
      averageValue[_j] = sum[_j] / count;
    }

    return new CalcStatReport({
      averageValue: averageValue,
      standardDeviation: standardDeviation,
      count: count
    });
  }

  function calc(calcType, countTests, testFunc) {
    var _context4, _context5;

    for (var _len4 = arguments.length, args = new Array(_len4 > 3 ? _len4 - 3 : 0), _key3 = 3; _key3 < _len4; _key3++) {
      args[_key3 - 3] = arguments[_key3];
    }

    switch (calcType) {
      case CalcType.Stat:
        return calcStat.apply(void 0, (0, _concat.default)(_context4 = [countTests, testFunc]).call(_context4, args));

      case CalcType.Min:
        return calcMin.apply(void 0, (0, _concat.default)(_context5 = [countTests, testFunc]).call(_context5, args));

      default:
        throw new Error('Unknown CalcType: ' + calcType);
    }
  }

  function _calcMemAllocate(calcType, countTests, testFunc) {
    var _context6;

    for (var _len5 = arguments.length, testFuncArgs = new Array(_len5 > 3 ? _len5 - 3 : 0), _key4 = 3; _key4 < _len5; _key4++) {
      testFuncArgs[_key4 - 3] = arguments[_key4];
    }

    return calc.apply(void 0, (0, _concat.default)(_context6 = [calcType, countTests, function () {
      var heapUsed = process.memoryUsage().heapUsed;
      testFunc.apply(void 0, arguments);
      heapUsed = process.memoryUsage().heapUsed - heapUsed;
      return heapUsed < 0 ? null : [heapUsed];
    }]).call(_context6, testFuncArgs));
  }

  function calcMemAllocate(calcType, countTests, testFunc) {
    var _context7, _context8;

    for (var _len6 = arguments.length, testFuncArgs = new Array(_len6 > 3 ? _len6 - 3 : 0), _key5 = 3; _key5 < _len6; _key5++) {
      testFuncArgs[_key5 - 3] = arguments[_key5];
    }

    var zero = _calcMemAllocate.apply(void 0, (0, _concat.default)(_context7 = [calcType, countTests, function () {}]).call(_context7, testFuncArgs));

    var value = _calcMemAllocate.apply(void 0, (0, _concat.default)(_context8 = [calcType, countTests, testFunc]).call(_context8, testFuncArgs));

    console.log(value.subtract(zero).toString());
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
      (0, _deepSubscribe.deepSubscribe)(observableObject, function (v) {
        return (0, _typeof2.default)(v) === 'object' && i++ % 3 === 0 ? function () {} : null;
      }, true, function (b) {
        return b.path(function (o) {
          return o.prop;
        });
      });
    }));
  });
  it('propertyChanged memory', function () {
    // 48 | 0
    var object = createObject(function (observableObject) {
      observableObject.propertyChanged.subscribe(function (v) {});
    }).observableObject1;
    object.prop = 1;
    calcMemAllocate(CalcType.Min, 10000, function () {
      // 48 bytes for create event
      object.prop++;
    });
  });
  it('deepSubscribe memory', function () {
    // 48 | 0
    var object = createObject(function (observableObject) {
      (0, _deepSubscribe.deepSubscribe)(observableObject, // v => v != null && typeof v === 'object'
      // 	? () => {}
      // 	: null,
      function (v) {
        return null;
      }, true, function (b) {
        return b.path(function (o) {
          return o.prop;
        });
      });
    }).observableObject1;
    var value1 = {};
    var value2 = {};
    object.prop = 1;
    calcMemAllocate(CalcType.Min, 10000, function () {
      // 48 bytes for create event
      // 56 bytes for create unsubscribe function
      object.prop = object.prop === value1 ? value2 : value1;
    });
  });
  it('test memory', function () {
    calcMemAllocate(CalcType.Min, 10000, function () {
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
    calcMemAllocate(CalcType.Min, 10000, function () {
      change1('prop', i++, i++);
    });
    calcMemAllocate(CalcType.Min, 10000, function () {
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