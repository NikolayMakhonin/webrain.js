"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iterateRule = iterateRule;
exports.subscribeNextRule = subscribeNextRule;

var _rules = require("./contracts/rules");

function* iterateRule(rule, next = null) {
  if (!rule) {
    if (next) {
      yield* next();
    }

    return;
  }

  const ruleNext = () => iterateRule(rule.next, next);

  switch (rule.type) {
    case _rules.RuleType.Action:
      yield rule;
      yield* ruleNext();
      break;

    case _rules.RuleType.Any:
      const {
        rules
      } = rule;

      function* any() {
        for (let i = 0, len = rules.length; i < len; i++) {
          yield iterateRule(rules[i], ruleNext);
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
          yield* ruleNext();
          return;
        }

        const nextIteration = newCount => {
          return iterateRule(subRule, () => repeatNext(newCount));
        };

        if (count < countMin) {
          yield* nextIteration(count + 1);
        } else {
          yield [ruleNext(), nextIteration(count + 1)];
        }
      }

      yield* repeatNext(0);
      break;

    default:
      throw new Error('Unknown RuleType: ' + rule.type);
  }
}

function subscribeNextRule(ruleIterator, fork, subscribeNode, subscribeLeaf) {
  const iteration = ruleIterator.next();

  if (iteration.done) {
    return subscribeLeaf();
  }

  const ruleOrIterable = iteration.value;

  if (ruleOrIterable[Symbol.iterator]) {
    let unsubscribers;

    for (const ruleIterable of ruleOrIterable) {
      const unsubscribe = fork(ruleIterable[Symbol.iterator]());

      if (unsubscribe != null) {
        if (!unsubscribers) {
          unsubscribers = [unsubscribe];
        } else {
          unsubscribers.push(unsubscribe);
        }
      }
    }

    if (!unsubscribers) {
      return null;
    }

    return () => {
      for (let i = 0, len = unsubscribers.length; i < len; i++) {
        unsubscribers[i]();
      }
    };
  }

  return subscribeNode(ruleOrIterable);
}