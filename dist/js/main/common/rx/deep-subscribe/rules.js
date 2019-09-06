"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.RuleRepeat = exports.RuleAny = exports.RuleNothing = exports.Rule = void 0;

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _rules = require("./contracts/rules");

var Rule =
/*#__PURE__*/
function () {
  function Rule(type) {
    this.type = type;
  }

  var _proto = Rule.prototype;

  _proto.clone = function clone() {
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
  };

  return Rule;
}();

exports.Rule = Rule;

var RuleNothing =
/*#__PURE__*/
function (_Rule) {
  (0, _inheritsLoose2.default)(RuleNothing, _Rule);

  function RuleNothing() {
    var _this;

    _this = _Rule.call(this, _rules.RuleType.Nothing) || this;
    _this.description = 'nothing';
    return _this;
  }

  return RuleNothing;
}(Rule);

exports.RuleNothing = RuleNothing;

var RuleAny =
/*#__PURE__*/
function (_Rule2) {
  (0, _inheritsLoose2.default)(RuleAny, _Rule2);

  function RuleAny(rules) {
    var _this2;

    _this2 = _Rule2.call(this, _rules.RuleType.Any) || this;
    _this2.rules = rules;
    return _this2;
  }

  var _proto2 = RuleAny.prototype;

  _proto2.clone = function clone() {
    var _context;

    var clone = _Rule2.prototype.clone.call(this);

    clone.rules = (0, _map.default)(_context = this.rules).call(_context, function (o) {
      return o.clone();
    });
    return clone;
  };

  return RuleAny;
}(Rule);

exports.RuleAny = RuleAny;

var RuleRepeat =
/*#__PURE__*/
function (_Rule3) {
  (0, _inheritsLoose2.default)(RuleRepeat, _Rule3);

  function RuleRepeat(countMin, countMax, rule) {
    var _this3;

    _this3 = _Rule3.call(this, _rules.RuleType.Repeat) || this;
    _this3.countMin = countMin;
    _this3.countMax = countMax;
    _this3.rule = rule;
    return _this3;
  }

  var _proto3 = RuleRepeat.prototype;

  _proto3.clone = function clone() {
    var clone = _Rule3.prototype.clone.call(this);

    clone.rule = this.rule.clone();
    clone.countMin = this.countMin;
    clone.countMax = this.countMax;
    return clone;
  };

  return RuleRepeat;
}(Rule);

exports.RuleRepeat = RuleRepeat;