"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.calcMin = calcMin;
exports.calcStat = calcStat;
exports.calc = calc;
exports.calcMemAllocate = calcMemAllocate;
exports.CalcType = exports.CalcStatReport = void 0;

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

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
        report[j] = this.averageValue[j] + " \xB1" + 2.5 * this.standardDeviation[j] + " [" + this.count + "]";
      }

      return report.join(', ');
    }
  }]);
  return CalcStatReport;
}();

exports.CalcStatReport = CalcStatReport;
var CalcType;
exports.CalcType = CalcType;

(function (CalcType) {
  CalcType[CalcType["Stat"] = 0] = "Stat";
  CalcType[CalcType["Min"] = 1] = "Min";
})(CalcType || (exports.CalcType = CalcType = {}));

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
  var _context, _context2;

  for (var _len4 = arguments.length, args = new Array(_len4 > 3 ? _len4 - 3 : 0), _key3 = 3; _key3 < _len4; _key3++) {
    args[_key3 - 3] = arguments[_key3];
  }

  switch (calcType) {
    case CalcType.Stat:
      return calcStat.apply(void 0, (0, _concat.default)(_context = [countTests, testFunc]).call(_context, args));

    case CalcType.Min:
      return calcMin.apply(void 0, (0, _concat.default)(_context2 = [countTests, testFunc]).call(_context2, args));

    default:
      throw new Error('Unknown CalcType: ' + calcType);
  }
}

function _calcMemAllocate(calcType, countTests, testFunc) {
  var _context3;

  for (var _len5 = arguments.length, testFuncArgs = new Array(_len5 > 3 ? _len5 - 3 : 0), _key4 = 3; _key4 < _len5; _key4++) {
    testFuncArgs[_key4 - 3] = arguments[_key4];
  }

  return calc.apply(void 0, (0, _concat.default)(_context3 = [calcType, countTests, function () {
    var heapUsed = process.memoryUsage().heapUsed;
    testFunc.apply(void 0, arguments);
    heapUsed = process.memoryUsage().heapUsed - heapUsed;
    return heapUsed < 0 ? null : [heapUsed];
  }]).call(_context3, testFuncArgs));
}

function calcMemAllocate(calcType, countTests, testFunc) {
  var _context4, _context5;

  for (var _len6 = arguments.length, testFuncArgs = new Array(_len6 > 3 ? _len6 - 3 : 0), _key5 = 3; _key5 < _len6; _key5++) {
    testFuncArgs[_key5 - 3] = arguments[_key5];
  }

  // tslint:disable-next-line:no-empty
  var zero = _calcMemAllocate.apply(void 0, (0, _concat.default)(_context4 = [calcType, countTests, function () {}]).call(_context4, testFuncArgs));

  var value = _calcMemAllocate.apply(void 0, (0, _concat.default)(_context5 = [calcType, countTests, testFunc]).call(_context5, testFuncArgs));

  console.log(value.subtract(zero).toString());
}