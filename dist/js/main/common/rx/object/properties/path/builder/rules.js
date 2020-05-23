"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ruleTypeToString = ruleTypeToString;
exports.RuleRepeat = exports.RuleAny = exports.RuleIf = exports.RuleNever = exports.RuleNothing = exports.Rule = void 0;

var _construct = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/reflect/construct"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _rules = require("./contracts/rules");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = (0, _construct.default)(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !_construct.default) return false; if (_construct.default.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call((0, _construct.default)(Date, [], function () {})); return true; } catch (e) { return false; } }

function ruleTypeToString(ruleType) {
  switch (ruleType) {
    case _rules.RuleType.Never:
      return 'Never';

    case _rules.RuleType.Action:
      return 'Action';

    case _rules.RuleType.Any:
      return 'Any';

    case _rules.RuleType.If:
      return 'If';

    case _rules.RuleType.Nothing:
      return 'Nothing';

    case _rules.RuleType.Repeat:
      return 'Repeat';

    default:
      throw new Error('Unknown RuleType: ' + ruleType);
  }
}

function ruleToString(rule, customDescription, nestedRulesStr) {
  var description = customDescription || this.description || ruleTypeToString(this.type);
  return "" + description + (nestedRulesStr ? '(' + nestedRulesStr + ')' : '') + (this.next ? ' > ' + this.next : '');
}

var Rule = /*#__PURE__*/function () {
  function Rule(type, description) {
    (0, _classCallCheck2.default)(this, Rule);
    this.type = type;

    if (description != null) {
      this.description = description;
    }
  }

  (0, _createClass2.default)(Rule, [{
    key: "clone",
    value: function clone() {
      var type = this.type,
          subType = this.subType,
          description = this.description,
          next = this.next,
          toString = this.toString;
      var clone = {
        type: type,
        subType: subType,
        description: description,
        toString: toString
      };

      if (next != null) {
        clone.next = next.clone();
      }

      return clone;
    }
  }, {
    key: "toString",
    value: function toString() {
      return ruleToString(this);
    }
  }]);
  return Rule;
}();

exports.Rule = Rule;

var RuleNothing = /*#__PURE__*/function (_Rule) {
  (0, _inherits2.default)(RuleNothing, _Rule);

  var _super = _createSuper(RuleNothing);

  function RuleNothing() {
    var _this;

    (0, _classCallCheck2.default)(this, RuleNothing);
    _this = _super.call(this, _rules.RuleType.Nothing);
    _this.description = 'nothing';
    return _this;
  }

  return RuleNothing;
}(Rule);

exports.RuleNothing = RuleNothing;
RuleNothing.instance = (0, _freeze.default)(new RuleNothing());

var RuleNever = /*#__PURE__*/function (_Rule2) {
  (0, _inherits2.default)(RuleNever, _Rule2);

  var _super2 = _createSuper(RuleNever);

  function RuleNever() {
    var _this2;

    (0, _classCallCheck2.default)(this, RuleNever);
    _this2 = _super2.call(this, _rules.RuleType.Never);
    _this2.description = 'never';
    return _this2;
  }

  (0, _createClass2.default)(RuleNever, [{
    key: "clone",
    value: function clone() {
      return this;
    }
  }, {
    key: "next",
    get: function get() {
      return null;
    } // tslint:disable-next-line:no-empty
    ,
    set: function set(value) {}
  }]);
  return RuleNever;
}(Rule);

exports.RuleNever = RuleNever;
RuleNever.instance = (0, _freeze.default)(new RuleNever());

var RuleIf = /*#__PURE__*/function (_Rule3) {
  (0, _inherits2.default)(RuleIf, _Rule3);

  var _super3 = _createSuper(RuleIf);

  function RuleIf(conditionRules) {
    var _this3;

    (0, _classCallCheck2.default)(this, RuleIf);
    _this3 = _super3.call(this, _rules.RuleType.If);
    _this3.conditionRules = conditionRules;
    _this3.description = '<if>';
    return _this3;
  }

  (0, _createClass2.default)(RuleIf, [{
    key: "clone",
    value: function clone() {
      var _context;

      var clone = (0, _get2.default)((0, _getPrototypeOf2.default)(RuleIf.prototype), "clone", this).call(this);
      clone.conditionRules = (0, _map.default)(_context = this.conditionRules).call(_context, function (o) {
        return (0, _isArray.default)(o) ? [o[0], o[1].clone()] : o.clone();
      });
      return clone;
    }
  }]);
  return RuleIf;
}(Rule);

exports.RuleIf = RuleIf;

var RuleAny = /*#__PURE__*/function (_Rule4) {
  (0, _inherits2.default)(RuleAny, _Rule4);

  var _super4 = _createSuper(RuleAny);

  function RuleAny(rules) {
    var _this4;

    (0, _classCallCheck2.default)(this, RuleAny);
    _this4 = _super4.call(this, _rules.RuleType.Any);
    _this4.rules = rules;
    _this4.description = '<any>';
    return _this4;
  }

  (0, _createClass2.default)(RuleAny, [{
    key: "clone",
    value: function clone() {
      var _context2;

      var clone = (0, _get2.default)((0, _getPrototypeOf2.default)(RuleAny.prototype), "clone", this).call(this);
      clone.rules = (0, _map.default)(_context2 = this.rules).call(_context2, function (o) {
        return o.clone();
      });
      return clone;
    }
  }]);
  return RuleAny;
}(Rule);

exports.RuleAny = RuleAny;

var RuleRepeat = /*#__PURE__*/function (_Rule5) {
  (0, _inherits2.default)(RuleRepeat, _Rule5);

  var _super5 = _createSuper(RuleRepeat);

  function RuleRepeat(countMin, countMax, condition, rule) {
    var _this5;

    (0, _classCallCheck2.default)(this, RuleRepeat);
    _this5 = _super5.call(this, _rules.RuleType.Repeat);
    _this5.countMin = countMin;
    _this5.countMax = countMax;
    _this5.condition = condition;
    _this5.rule = rule;
    _this5.description = '<repeat>';
    return _this5;
  }

  (0, _createClass2.default)(RuleRepeat, [{
    key: "clone",
    value: function clone() {
      var clone = (0, _get2.default)((0, _getPrototypeOf2.default)(RuleRepeat.prototype), "clone", this).call(this);
      clone.rule = this.rule.clone();
      clone.countMin = this.countMin;
      clone.countMax = this.countMax;
      clone.condition = this.condition;
      return clone;
    }
  }]);
  return RuleRepeat;
}(Rule);

exports.RuleRepeat = RuleRepeat;