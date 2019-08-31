import _typeof from "@babel/runtime/helpers/typeof";
import _createClass from "@babel/runtime/helpers/createClass";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";

/* tslint:disable:no-empty no-identical-functions */
import { calcPerformance } from 'rdtsc';
import { deepSubscribe } from '../../../main/common/rx/deep-subscribe/deep-subscribe';
import { ObservableObject } from '../../../main/common/rx/object/ObservableObject';
import { ObservableObjectBuilder } from '../../../main/common/rx/object/ObservableObjectBuilder';
describe('ObservableObject', function () {
  this.timeout(300000);

  function createObject(init) {
    var Class =
    /*#__PURE__*/
    function (_ObservableObject) {
      _inherits(Class, _ObservableObject);

      function Class() {
        _classCallCheck(this, Class);

        return _possibleConstructorReturn(this, _getPrototypeOf(Class).apply(this, arguments));
      }

      return Class;
    }(ObservableObject);

    new ObservableObjectBuilder(ObservableObject.prototype).writable('prop') // , o => o.prop, (o, v) => o.prop = v)
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
    var object1 = _ref.object1,
        object2 = _ref.object2,
        observableObject1 = _ref.observableObject1,
        observableObject2 = _ref.observableObject2;
    var testFunc = Function('o1', 'o2', 'v', "{\n\t\t\to1.prop = v\n\t\t\to1.prop2 = v\n\t\t\to2.prop = v\n\t\t\to2.prop2 = v\n\t\t\treturn o1.prop + o1.prop2 + o2.prop + o2.prop2\n\t\t} // ".concat(Math.random())).bind(null, observableObject1, observableObject2);
    var value = -2000000000; // calcStat(1000, 10, time => {

    var result = calcPerformance(20000, // () => {
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
      _classCallCheck(this, CalcStatReport);

      Object.assign(this, data);
    }

    _createClass(CalcStatReport, [{
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
          report[j] = "".concat(this.averageValue[j], " \xB1").concat(2.5 * this.standardDeviation[j], " [").concat(this.count, "]");
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
        min = result.map(function (o) {
          return Number(o);
        });
        count = 1;
      }
    }

    return new CalcStatReport({
      averageValue: min,
      standardDeviation: min.map(function () {
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
        sum = result.map(function (o) {
          return Number(o);
        });
        sumSqr = sum.map(function (o) {
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
    for (var _len4 = arguments.length, args = new Array(_len4 > 3 ? _len4 - 3 : 0), _key3 = 3; _key3 < _len4; _key3++) {
      args[_key3 - 3] = arguments[_key3];
    }

    switch (calcType) {
      case CalcType.Stat:
        return calcStat.apply(void 0, [countTests, testFunc].concat(args));

      case CalcType.Min:
        return calcMin.apply(void 0, [countTests, testFunc].concat(args));

      default:
        throw new Error('Unknown CalcType: ' + calcType);
    }
  }

  function _calcMemAllocate(calcType, countTests, testFunc) {
    for (var _len5 = arguments.length, testFuncArgs = new Array(_len5 > 3 ? _len5 - 3 : 0), _key4 = 3; _key4 < _len5; _key4++) {
      testFuncArgs[_key4 - 3] = arguments[_key4];
    }

    return calc.apply(void 0, [calcType, countTests, function () {
      var heapUsed = process.memoryUsage().heapUsed;
      testFunc.apply(void 0, arguments);
      heapUsed = process.memoryUsage().heapUsed - heapUsed;
      return heapUsed < 0 ? null : [heapUsed];
    }].concat(testFuncArgs));
  }

  function calcMemAllocate(calcType, countTests, testFunc) {
    for (var _len6 = arguments.length, testFuncArgs = new Array(_len6 > 3 ? _len6 - 3 : 0), _key5 = 3; _key5 < _len6; _key5++) {
      testFuncArgs[_key5 - 3] = arguments[_key5];
    }

    var zero = _calcMemAllocate.apply(void 0, [calcType, countTests, function () {}].concat(testFuncArgs));

    var value = _calcMemAllocate.apply(void 0, [calcType, countTests, testFunc].concat(testFuncArgs));

    console.log(value.subtract(zero).toString());
  }

  it('simple', function () {
    testPerformance(createObject());
  });
  it('propertyChanged', function () {
    testPerformance(createObject(function (observableObject) {
      observableObject.propertyChanged.subscribe(function (v) {});
    }));
  });
  it('deepSubscribe', function () {
    var i = 0;
    testPerformance(createObject(function (observableObject) {
      deepSubscribe(observableObject, function (v) {
        return _typeof(v) === 'object' && i++ % 3 === 0 ? function () {} : null;
      }, true, function (b) {
        return b.path(function (o) {
          return o.prop;
        });
      });
    }));
  });
  it('propertyChanged memory', function () {
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
    var object = createObject(function (observableObject) {
      deepSubscribe(observableObject, // v => v != null && typeof v === 'object'
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
});