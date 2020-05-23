"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.forEachRule = forEachRule;

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _rules = require("./builder/contracts/rules");

var repeatNext = function repeatNext(object, index, repeatRule, ruleNext, parent, key, keyType, resolveRuleSubscribe) {
  var repeatAction = repeatRule.condition ? repeatRule.condition(object, index) : _rules.RuleRepeatAction.All;

  if (index < repeatRule.countMin) {
    repeatAction = repeatAction & ~_rules.RuleRepeatAction.Fork;
  }

  if (index >= repeatRule.countMax) {
    repeatAction = repeatAction & ~_rules.RuleRepeatAction.Next;
  }

  if ((repeatAction & _rules.RuleRepeatAction.Fork) === 0) {
    if ((repeatAction & _rules.RuleRepeatAction.Next) === 0) {
      return;
    }

    forEachRule(repeatRule.rule, object, repeatRuleNext, parent, key, keyType, resolveRuleSubscribe);
    return;
  }

  if ((repeatAction & _rules.RuleRepeatAction.Next) === 0) {
    if (ruleNext) {
      ruleNext(object, key, keyType);
    }

    return;
  }

  if (ruleNext) {
    ruleNext(object, key, keyType);
  }

  forEachRule(repeatRule.rule, object, repeatRuleNext, parent, key, keyType, resolveRuleSubscribe);

  function repeatRuleNext(nextIterationObject) {
    repeatNext(nextIterationObject, index + 1, repeatRule, ruleNext, parent, key, keyType, resolveRuleSubscribe);
  }
};

function forEachRule(rule, object, next, parent, key, keyType, resolveRuleSubscribe) {
  while (true) {
    if (rule == null) {
      if (next != null) {
        next(object, parent, key, keyType);
      }

      return;
    }

    var ruleNext = rule.next || next ? function (nextObject, nextParent, nextKey, nextKeyType) {
      forEachRule(rule.next, nextObject, next, nextParent, nextKey, nextKeyType, resolveRuleSubscribe);
    } : null;

    switch (rule.type) {
      case _rules.RuleType.Nothing:
        rule = rule.next;
        break;

      case _rules.RuleType.Never:
        return;

      case _rules.RuleType.Action:
        resolveRuleSubscribe(rule, object, ruleNext, parent, key, keyType);
        return;

      case _rules.RuleType.If:
        {
          var _ref = rule,
              conditionRules = _ref.conditionRules;
          var len = conditionRules.length;
          var i = 0;

          for (; i < len; i++) {
            var conditionRule = conditionRules[i];

            if ((0, _isArray.default)(conditionRule)) {
              if (conditionRule[0](object)) {
                forEachRule(conditionRule[1], object, ruleNext, parent, key, keyType, resolveRuleSubscribe);
                break;
              }
            } else {
              forEachRule(conditionRule, object, ruleNext, parent, key, keyType, resolveRuleSubscribe);
              break;
            }
          }

          if (i !== len || ruleNext == null) {
            return;
          }

          rule = rule.next;
          break;
        }

      case _rules.RuleType.Any:
        var _ref2 = rule,
            rules = _ref2.rules;

        if (!rules.length) {
          return;
        }

        if (rules.length === 1) {
          forEachRule(rules[0], object, ruleNext, parent, key, keyType, resolveRuleSubscribe);
        }

        for (var _i = 0, _len = rules.length; _i < _len; _i++) {
          var subRule = rules[_i];

          if (!subRule) {
            throw new Error("RuleType.Any rule=" + subRule);
          }

          forEachRule(subRule, object, ruleNext, parent, key, keyType, resolveRuleSubscribe);
        }

        return;

      case _rules.RuleType.Repeat:
        {
          var _ref3 = rule,
              countMin = _ref3.countMin,
              countMax = _ref3.countMax;

          if (countMax < countMin || countMax < 0) {
            return;
          }

          repeatNext(object, 0, rule, ruleNext, parent, key, keyType, resolveRuleSubscribe);
          return;
        }

      default:
        throw new Error('Unknown RuleType: ' + rule.type);
    }
  }
}