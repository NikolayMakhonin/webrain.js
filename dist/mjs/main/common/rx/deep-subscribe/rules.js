import _get from "@babel/runtime/helpers/get";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { RuleType } from './contracts/rules';
export var Rule =
/*#__PURE__*/
function () {
  function Rule(type) {
    _classCallCheck(this, Rule);

    this.type = type;
  }

  _createClass(Rule, [{
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
export var RuleNothing =
/*#__PURE__*/
function (_Rule) {
  _inherits(RuleNothing, _Rule);

  function RuleNothing() {
    var _this;

    _classCallCheck(this, RuleNothing);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RuleNothing).call(this, RuleType.Nothing));
    _this.description = 'nothing';
    return _this;
  }

  return RuleNothing;
}(Rule);
export var RuleAny =
/*#__PURE__*/
function (_Rule2) {
  _inherits(RuleAny, _Rule2);

  function RuleAny(rules) {
    var _this2;

    _classCallCheck(this, RuleAny);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(RuleAny).call(this, RuleType.Any));
    _this2.rules = rules;
    return _this2;
  }

  _createClass(RuleAny, [{
    key: "clone",
    value: function clone() {
      var clone = _get(_getPrototypeOf(RuleAny.prototype), "clone", this).call(this);

      clone.rules = this.rules.map(function (o) {
        return o.clone();
      });
      return clone;
    }
  }]);

  return RuleAny;
}(Rule);
export var RuleRepeat =
/*#__PURE__*/
function (_Rule3) {
  _inherits(RuleRepeat, _Rule3);

  function RuleRepeat(countMin, countMax, rule) {
    var _this3;

    _classCallCheck(this, RuleRepeat);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(RuleRepeat).call(this, RuleType.Repeat));
    _this3.countMin = countMin;
    _this3.countMax = countMax;
    _this3.rule = rule;
    return _this3;
  }

  _createClass(RuleRepeat, [{
    key: "clone",
    value: function clone() {
      var clone = _get(_getPrototypeOf(RuleRepeat.prototype), "clone", this).call(this);

      clone.rule = this.rule.clone();
      clone.countMin = this.countMin;
      clone.countMax = this.countMax;
      return clone;
    }
  }]);

  return RuleRepeat;
}(Rule);