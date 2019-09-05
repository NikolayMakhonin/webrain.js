"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.RuleRepeat = exports.RuleAny = exports.RuleNothing = exports.Rule = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _rules = require("./contracts/rules");

var Rule =
/*#__PURE__*/
function () {
  function Rule(type) {
    (0, _classCallCheck2.default)(this, Rule);
    this.type = type;
  }

  (0, _createClass2.default)(Rule, [{
    key: "clone",
    value: function clone() {
      var type = this.type,
          next = this.next,
          description = this.description;
      var clone = {
        type: type,
        description: description
      };

      if (next != null) {
        clone.next = next.clone();
      }

      return clone;
    }
  }]);
  return Rule;
}();

exports.Rule = Rule;

var RuleNothing =
/*#__PURE__*/
function (_Rule) {
  (0, _inherits2.default)(RuleNothing, _Rule);

  function RuleNothing() {
    var _this;

    (0, _classCallCheck2.default)(this, RuleNothing);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleNothing).call(this, _rules.RuleType.Nothing));
    _this.description = 'nothing';
    return _this;
  }

  return RuleNothing;
}(Rule);

exports.RuleNothing = RuleNothing;

var RuleAny =
/*#__PURE__*/
function (_Rule2) {
  (0, _inherits2.default)(RuleAny, _Rule2);

  function RuleAny(rules) {
    var _this2;

    (0, _classCallCheck2.default)(this, RuleAny);
    _this2 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleAny).call(this, _rules.RuleType.Any));
    _this2.rules = rules;
    return _this2;
  }

  (0, _createClass2.default)(RuleAny, [{
    key: "clone",
    value: function clone() {
      var _context;

      var clone = (0, _get2.default)((0, _getPrototypeOf2.default)(RuleAny.prototype), "clone", this).call(this);
      clone.rules = (0, _map.default)(_context = this.rules).call(_context, function (o) {
        return o.clone();
      });
      return clone;
    }
  }]);
  return RuleAny;
}(Rule);

exports.RuleAny = RuleAny;

var RuleRepeat =
/*#__PURE__*/
function (_Rule3) {
  (0, _inherits2.default)(RuleRepeat, _Rule3);

  function RuleRepeat(countMin, countMax, rule) {
    var _this3;

    (0, _classCallCheck2.default)(this, RuleRepeat);
    _this3 = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(RuleRepeat).call(this, _rules.RuleType.Repeat));
    _this3.countMin = countMin;
    _this3.countMax = countMax;
    _this3.rule = rule;
    return _this3;
  }

  (0, _createClass2.default)(RuleRepeat, [{
    key: "clone",
    value: function clone() {
      var clone = (0, _get2.default)((0, _getPrototypeOf2.default)(RuleRepeat.prototype), "clone", this).call(this);
      clone.rule = this.rule.clone();
      clone.countMin = this.countMin;
      clone.countMax = this.countMax;
      return clone;
    }
  }]);
  return RuleRepeat;
}(Rule);

exports.RuleRepeat = RuleRepeat;