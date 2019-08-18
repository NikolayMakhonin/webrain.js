import _regeneratorRuntime from "@babel/runtime/regenerator";

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(iterateRule);

import { isIterable } from '../../helpers/helpers';
import { RuleType } from './contracts/rules';
import { PeekIterator } from './helpers/PeekIterator';
export function iterateRule(rule) {
  var next,
      ruleNext,
      _ref,
      rules,
      any,
      _ref2,
      countMin,
      countMax,
      subRule,
      repeatNext,
      _args3 = arguments;

  return _regeneratorRuntime.wrap(function iterateRule$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          next = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : null;

          if (rule) {
            _context3.next = 5;
            break;
          }

          if (!next) {
            _context3.next = 4;
            break;
          }

          return _context3.delegateYield(next(), "t0", 4);

        case 4:
          return _context3.abrupt("return");

        case 5:
          ruleNext = rule.next || next ? function () {
            return iterateRule(rule.next, next);
          } : null;
          _context3.t1 = rule.type;
          _context3.next = _context3.t1 === RuleType.Nothing ? 9 : _context3.t1 === RuleType.Action ? 12 : _context3.t1 === RuleType.Any ? 17 : _context3.t1 === RuleType.Repeat ? 24 : 30;
          break;

        case 9:
          if (!ruleNext) {
            _context3.next = 11;
            break;
          }

          return _context3.delegateYield(ruleNext(), "t2", 11);

        case 11:
          return _context3.abrupt("break", 31);

        case 12:
          _context3.next = 14;
          return rule;

        case 14:
          _context3.next = 16;
          return ruleNext;

        case 16:
          return _context3.abrupt("break", 31);

        case 17:
          _ref = rule, rules = _ref.rules;

          if (!(rules.length <= 1)) {
            _context3.next = 20;
            break;
          }

          throw new Error("RuleType.Any rules.length=".concat(rules.length));

        case 20:
          any =
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee() {
            var i, len, subRule;
            return _regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    i = 0, len = rules.length;

                  case 1:
                    if (!(i < len)) {
                      _context.next = 10;
                      break;
                    }

                    subRule = rules[i];

                    if (subRule) {
                      _context.next = 5;
                      break;
                    }

                    throw new Error("RuleType.Any rule=".concat(subRule));

                  case 5:
                    _context.next = 7;
                    return iterateRule(subRule, ruleNext);

                  case 7:
                    i++;
                    _context.next = 1;
                    break;

                  case 10:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          });
          _context3.next = 23;
          return any();

        case 23:
          return _context3.abrupt("break", 31);

        case 24:
          _ref2 = rule, countMin = _ref2.countMin, countMax = _ref2.countMax, subRule = _ref2.rule;

          if (!(countMax < countMin || countMax <= 0 || rule == null)) {
            _context3.next = 27;
            break;
          }

          throw new Error("RuleType.Repeat countMin=".concat(countMin, " countMax=").concat(countMax, " rule=").concat(rule));

        case 27:
          repeatNext =
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee2(count) {
            var nextIteration;
            return _regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!(count >= countMax)) {
                      _context2.next = 4;
                      break;
                    }

                    if (!ruleNext) {
                      _context2.next = 3;
                      break;
                    }

                    return _context2.delegateYield(ruleNext(), "t0", 3);

                  case 3:
                    return _context2.abrupt("return");

                  case 4:
                    nextIteration = function nextIteration(newCount) {
                      return iterateRule(subRule, function () {
                        return repeatNext(newCount);
                      });
                    };

                    if (!(count < countMin)) {
                      _context2.next = 9;
                      break;
                    }

                    return _context2.delegateYield(nextIteration(count + 1), "t1", 7);

                  case 7:
                    _context2.next = 11;
                    break;

                  case 9:
                    _context2.next = 11;
                    return [ruleNext ? ruleNext() : [], nextIteration(count + 1)];

                  case 11:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          });
          return _context3.delegateYield(repeatNext(0), "t3", 29);

        case 29:
          return _context3.abrupt("break", 31);

        case 30:
          throw new Error('Unknown RuleType: ' + rule.type);

        case 31:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked);
}
export function subscribeNextRule(ruleIterator, fork, subscribeNode, subscribeLeaf) {
  var iteration;

  if (!ruleIterator || (iteration = ruleIterator.next()).done) {
    return subscribeLeaf();
  }

  var ruleOrIterable = iteration.value;

  if (isIterable(ruleOrIterable)) {
    var unsubscribers; // for (let step, innerIterator = ruleOrIterable[Symbol.iterator](); !(step = innerIterator.next()).done;) {
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

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = ruleOrIterable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var ruleIterable = _step.value;
        var unsubscribe = fork(new PeekIterator(ruleIterable[Symbol.iterator]()));

        if (unsubscribe != null) {
          if (!unsubscribers) {
            unsubscribers = [unsubscribe];
          } else {
            unsubscribers.push(unsubscribe);
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"] != null) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (!unsubscribers) {
      return null;
    }

    return function () {
      for (var i = 0, len = unsubscribers.length; i < len; i++) {
        unsubscribers[i]();
      }
    };
  }

  var nextIterable = ruleIterator.next().value;
  return subscribeNode(ruleOrIterable, nextIterable ? function () {
    return new PeekIterator(nextIterable()[Symbol.iterator]());
  } : null);
}