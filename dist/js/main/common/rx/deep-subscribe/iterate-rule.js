"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iterateRule = iterateRule;

var _rules = require("./contracts/rules");

function* iterateRule(rule, next = null) {
  if (!rule) {
    if (next) {
      yield* next();
    }

    return;
  }

  const nextRule = () => iterateRule(rule.next, next);

  switch (rule.type) {
    case _rules.RuleType.Action:
      yield rule;
      yield* nextRule();
      break;

    case _rules.RuleType.Any:
      const {
        rules
      } = rule;

      function* any() {
        for (let i = 0, len = rules.length; i < len; i++) {
          yield iterateRule(rules[i], nextRule);
        }
      }

      yield any();
      break;

    case _rules.RuleType.Repeat:
      const {
        countMin,
        countMax,
        rule: subRule
      } = rule;

      function* repeatNext(count) {
        if (count >= countMax) {
          yield* nextRule();
          return;
        }

        const nextIteration = () => iterateRule(subRule, () => repeatNext(count + 1));

        if (count < countMin) {
          yield* nextIteration();
        } else {
          yield [nextRule(), nextIteration()];
        }
      }

      yield* repeatNext(0);
      break;

    default:
      throw new Error('Unknown RuleType: ' + rule.type);
  }
}