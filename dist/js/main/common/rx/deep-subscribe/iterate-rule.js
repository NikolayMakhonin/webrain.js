"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iterateRule = iterateRule;
exports.subscribeNextRule = subscribeNextRule;

var _helpers = require("../../helpers/helpers");

var _rules = require("./contracts/rules");

var _PeekIterator = require("./helpers/PeekIterator");

function* iterateRule(rule, next = null) {
  if (!rule) {
    if (next) {
      yield* next();
    }

    return;
  }

  const ruleNext = rule.next || next ? () => iterateRule(rule.next, next) : null;

  switch (rule.type) {
    case _rules.RuleType.Action:
      yield rule;
      yield ruleNext;
      break;

    case _rules.RuleType.Any:
      const {
        rules
      } = rule;

      if (rules.length <= 1) {
        throw new Error(`RuleType.Any rules.length=${rules.length}`);
      }

      const any = function* () {
        for (let i = 0, len = rules.length; i < len; i++) {
          const subRule = rules[i];

          if (!subRule) {
            throw new Error(`RuleType.Any rule=${subRule}`);
          }

          yield iterateRule(subRule, ruleNext);
        }
      };

      yield any();
      break;

    case _rules.RuleType.Repeat:
      {
        const {
          countMin,
          countMax,
          rule: subRule
        } = rule;

        if (countMax < countMin || countMax <= 0 || rule == null) {
          throw new Error(`RuleType.Repeat countMin=${countMin} countMax=${countMax} rule=${rule}`);
        }

        const repeatNext = function* (count) {
          if (count >= countMax) {
            if (ruleNext) {
              yield* ruleNext();
            }

            return;
          }

          const nextIteration = newCount => {
            return iterateRule(subRule, () => repeatNext(newCount));
          };

          if (count < countMin) {
            yield* nextIteration(count + 1);
          } else {
            yield [ruleNext ? ruleNext() : [], nextIteration(count + 1)];
          }
        };

        yield* repeatNext(0);
        break;
      }

    default:
      throw new Error('Unknown RuleType: ' + rule.type);
  }
}

function subscribeNextRule(ruleIterator, fork, subscribeNode, subscribeLeaf) {
  let iteration;

  if (!ruleIterator || (iteration = ruleIterator.next()).done) {
    return subscribeLeaf();
  }

  const ruleOrIterable = iteration.value;

  if ((0, _helpers.isIterable)(ruleOrIterable)) {
    let unsubscribers; // for (let step, innerIterator = ruleOrIterable[Symbol.iterator](); !(step = innerIterator.next()).done;) {
    // 	const ruleIterable = step.value
    // 	const unsubscribe = fork(ruleIterable[Symbol.iterator]())
    // 	if (unsubscribe != null) {
    // 		if (!unsubscribers) {
    // 			unsubscribers = [unsubscribe]
    // 		} else {
    // 			unsubscribers.push(unsubscribe)
    // 		}
    // 	}
    // }

    for (const ruleIterable of ruleOrIterable) {
      const unsubscribe = fork(new _PeekIterator.PeekIterator(ruleIterable[Symbol.iterator]()));

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

  const nextIterable = ruleIterator.next().value;
  return subscribeNode(ruleOrIterable, nextIterable ? () => new _PeekIterator.PeekIterator(nextIterable()[Symbol.iterator]()) : null);
}