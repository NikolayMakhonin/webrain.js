"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.iterateRule = iterateRule;
exports.subscribeNextRule = subscribeNextRule;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _isArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _helpers = require("../../helpers/helpers");

var _rules = require("./contracts/rules");

var _rules2 = require("./rules");

var _marked =
/*#__PURE__*/
_regenerator.default.mark(iterateRule);

function iterateRule(object, rule, next) {
  var ruleNext, _ref, conditionRules, len, i, conditionRule, _ref2, rules, any, _ref3, countMin, countMax, condition, subRule, repeatNext;

  return _regenerator.default.wrap(function iterateRule$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (next === void 0) {
            next = null;
          }

          if (rule) {
            _context3.next = 5;
            break;
          }

          if (!next) {
            _context3.next = 4;
            break;
          }

          return _context3.delegateYield(next(object), "t0", 4);

        case 4:
          return _context3.abrupt("return");

        case 5:
          ruleNext = rule.next || next ? function (nextObject) {
            return iterateRule(nextObject, rule.next, next);
          } : null;
          _context3.t1 = rule.type;
          _context3.next = _context3.t1 === _rules.RuleType.Nothing ? 9 : _context3.t1 === _rules.RuleType.Never ? 12 : _context3.t1 === _rules.RuleType.Action ? 15 : _context3.t1 === _rules.RuleType.If ? 20 : _context3.t1 === _rules.RuleType.Any ? 39 : _context3.t1 === _rules.RuleType.Repeat ? 51 : 59;
          break;

        case 9:
          if (!ruleNext) {
            _context3.next = 11;
            break;
          }

          return _context3.delegateYield(ruleNext(object), "t2", 11);

        case 11:
          return _context3.abrupt("break", 60);

        case 12:
          _context3.next = 14;
          return rule;

        case 14:
          return _context3.abrupt("break", 60);

        case 15:
          _context3.next = 17;
          return rule;

        case 17:
          _context3.next = 19;
          return ruleNext;

        case 19:
          return _context3.abrupt("break", 60);

        case 20:
          _ref = rule, conditionRules = _ref.conditionRules;
          len = conditionRules.length;
          i = 0;

        case 23:
          if (!(i < len)) {
            _context3.next = 36;
            break;
          }

          conditionRule = conditionRules[i];

          if (!(0, _isArray2.default)(conditionRule)) {
            _context3.next = 31;
            break;
          }

          if (!conditionRule[0](object)) {
            _context3.next = 29;
            break;
          }

          return _context3.delegateYield(iterateRule(object, conditionRule[1], ruleNext), "t3", 28);

        case 28:
          return _context3.abrupt("break", 36);

        case 29:
          _context3.next = 33;
          break;

        case 31:
          return _context3.delegateYield(iterateRule(object, conditionRule, ruleNext), "t4", 32);

        case 32:
          return _context3.abrupt("break", 36);

        case 33:
          i++;
          _context3.next = 23;
          break;

        case 36:
          if (!(i === len && ruleNext)) {
            _context3.next = 38;
            break;
          }

          return _context3.delegateYield(ruleNext(object), "t5", 38);

        case 38:
          return _context3.abrupt("break", 60);

        case 39:
          _ref2 = rule, rules = _ref2.rules;

          if (rules.length) {
            _context3.next = 44;
            break;
          }

          _context3.next = 43;
          return _rules2.RuleNever.instance;

        case 43:
          return _context3.abrupt("break", 60);

        case 44:
          if (!(rules.length === 1)) {
            _context3.next = 47;
            break;
          }

          _context3.next = 47;
          return [iterateRule(object, rules[0], ruleNext)];

        case 47:
          any =
          /*#__PURE__*/
          _regenerator.default.mark(function any() {
            var _i, _len, subRule;

            return _regenerator.default.wrap(function any$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _i = 0, _len = rules.length;

                  case 1:
                    if (!(_i < _len)) {
                      _context.next = 10;
                      break;
                    }

                    subRule = rules[_i];

                    if (subRule) {
                      _context.next = 5;
                      break;
                    }

                    throw new Error("RuleType.Any rule=" + subRule);

                  case 5:
                    _context.next = 7;
                    return iterateRule(object, subRule, ruleNext);

                  case 7:
                    _i++;
                    _context.next = 1;
                    break;

                  case 10:
                  case "end":
                    return _context.stop();
                }
              }
            }, any);
          });
          _context3.next = 50;
          return any();

        case 50:
          return _context3.abrupt("break", 60);

        case 51:
          _ref3 = rule, countMin = _ref3.countMin, countMax = _ref3.countMax, condition = _ref3.condition, subRule = _ref3.rule; // if (countMin === 0 && countMin === countMax) {
          // 	// == RuleType.Nothing
          // 	if (ruleNext) {
          // 		yield* ruleNext(object)
          // 	}
          // 	break
          // }

          if (!(countMax < countMin || countMax < 0)) {
            _context3.next = 56;
            break;
          }

          _context3.next = 55;
          return _rules2.RuleNever.instance;

        case 55:
          return _context3.abrupt("break", 60);

        case 56:
          repeatNext =
          /*#__PURE__*/
          _regenerator.default.mark(function repeatNext(nextObject, index) {
            var repeatAction, nextIteration;
            return _regenerator.default.wrap(function repeatNext$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    nextIteration = function _ref4(newCount) {
                      return iterateRule(nextObject, subRule, function (nextIterationObject) {
                        return repeatNext(nextIterationObject, newCount);
                      });
                    };

                    repeatAction = condition ? condition(nextObject, index) : _rules.RuleRepeatAction.All;

                    if (index < countMin) {
                      repeatAction = repeatAction & ~_rules.RuleRepeatAction.Fork;
                    }

                    if (index >= countMax) {
                      repeatAction = repeatAction & ~_rules.RuleRepeatAction.Next;
                    }

                    if (!((repeatAction & _rules.RuleRepeatAction.Fork) === 0)) {
                      _context2.next = 11;
                      break;
                    }

                    if (!((repeatAction & _rules.RuleRepeatAction.Next) === 0)) {
                      _context2.next = 9;
                      break;
                    }

                    _context2.next = 8;
                    return _rules2.RuleNever.instance;

                  case 8:
                    return _context2.abrupt("return");

                  case 9:
                    return _context2.delegateYield(nextIteration(index + 1), "t0", 10);

                  case 10:
                    return _context2.abrupt("return");

                  case 11:
                    if (!((repeatAction & _rules.RuleRepeatAction.Next) === 0)) {
                      _context2.next = 15;
                      break;
                    }

                    if (!ruleNext) {
                      _context2.next = 14;
                      break;
                    }

                    return _context2.delegateYield(ruleNext(nextObject), "t1", 14);

                  case 14:
                    return _context2.abrupt("return");

                  case 15:
                    _context2.next = 17;
                    return [ruleNext ? ruleNext(nextObject) : [], nextIteration(index + 1)];

                  case 17:
                  case "end":
                    return _context2.stop();
                }
              }
            }, repeatNext);
          });
          return _context3.delegateYield(repeatNext(object, 0), "t6", 58);

        case 58:
          return _context3.abrupt("break", 60);

        case 59:
          throw new Error('Unknown RuleType: ' + rule.type);

        case 60:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked);
}

function subscribeNextRule(ruleIterator, iteration, fork, subscribeNode) {
  var ruleOrIterable = iteration.value;

  if ((0, _helpers.isIterable)(ruleOrIterable)) {
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

    for (var _iterator = ruleOrIterable, _isArray = (0, _isArray2.default)(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
      var _ref5;

      if (_isArray) {
        if (_i2 >= _iterator.length) break;
        _ref5 = _iterator[_i2++];
      } else {
        _i2 = _iterator.next();
        if (_i2.done) break;
        _ref5 = _i2.value;
      }

      var ruleIterable = _ref5;
      var unsubscribe = fork((0, _getIterator2.default)(ruleIterable));

      if (unsubscribe) {
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

    return function () {
      for (var i = 0, len = unsubscribers.length; i < len; i++) {
        unsubscribers[i]();
      }
    };
  }

  var nextIterable = ruleIterator.next().value;
  return subscribeNode(ruleOrIterable, nextIterable // ? () => nextIterable(object)[Symbol.iterator]()
  // : null,
  );
}