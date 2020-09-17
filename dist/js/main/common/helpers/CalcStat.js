"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.CalcStat = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var CalcStat = /*#__PURE__*/function () {
  function CalcStat() {
    (0, _classCallCheck2.default)(this, CalcStat);
    this.count = 0;
    this.sum = 0;
    this.sumSqr = 0;
  }

  (0, _createClass2.default)(CalcStat, [{
    key: "add",
    value: function add(value) {
      this.count++;
      this.sum += value;
      this.sumSqr += value * value;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.count ? round(this.sum) + " | " + round(this.average) + " \xB1" + round(this.range) : '-';
    }
  }, {
    key: "average",
    get: function get() {
      return this.sum / this.count;
    }
  }, {
    key: "dispersion",
    get: function get() {
      var count = this.count,
          sum = this.sum;
      return this.sumSqr / count - sum * sum / (count * count);
    }
  }, {
    key: "standardDeviation",
    get: function get() {
      return Math.sqrt(this.dispersion);
    } // value is in the: average ± range

  }, {
    key: "range",
    get: function get() {
      return 2.5 * this.standardDeviation;
    }
  }]);
  return CalcStat;
}();

exports.CalcStat = CalcStat;

function round(value) {
  return +value.toPrecision(3);
}