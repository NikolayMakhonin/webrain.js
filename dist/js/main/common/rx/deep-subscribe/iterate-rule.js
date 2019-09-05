"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.iterateRule = iterateRule;
exports.subscribeNextRule = subscribeNextRule;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _helpers = require("../../helpers/helpers");

var _rules = require("./contracts/rules");

var _marked =
/*#__PURE__*/
_regenerator.default.mark(iterateRule);

function iterateRule(rule) {
  var next,
      ruleNext,
      _ref,
      rules,
      any,
      _ref2,
      countMin,
      countMax,
      subRule,
      _context2,
      _context3,
      repeatNext,
      _args3 = arguments;

  return _regenerator.default.wrap(function iterateRule$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          next = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : null;

          if (rule) {
            _context5.next = 5;
            break;
          }

          if (!next) {
            _context5.next = 4;
            break;
          }

          return _context5.delegateYield(next(), "t0", 4);

        case 4:
          return _context5.abrupt("return");

        case 5:
          ruleNext = rule.next || next ? function () {
            return iterateRule(rule.next, next);
          } : null;
          _context5.t1 = rule.type;
          _context5.next = _context5.t1 === _rules.RuleType.Nothing ? 9 : _context5.t1 === _rules.RuleType.Action ? 12 : _context5.t1 === _rules.RuleType.Any ? 17 : _context5.t1 === _rules.RuleType.Repeat ? 24 : 30;
          break;

        case 9:
          if (!ruleNext) {
            _context5.next = 11;
            break;
          }

          return _context5.delegateYield(ruleNext(), "t2", 11);

        case 11:
          return _context5.abrupt("break", 31);

        case 12:
          _context5.next = 14;
          return rule;

        case 14:
          _context5.next = 16;
          return ruleNext;

        case 16:
          return _context5.abrupt("break", 31);

        case 17:
          _ref = rule, rules = _ref.rules;

          if (!(rules.length <= 1)) {
            _context5.next = 20;
            break;
          }

          throw new Error("RuleType.Any rules.length=".concat(rules.length));

        case 20:
          any =
          /*#__PURE__*/
          _regenerator.default.mark(function any() {
            var i, len, subRule;
            return _regenerator.default.wrap(function any$(_context) {
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
            }, any);
          });
          _context5.next = 23;
          return any();

        case 23:
          return _context5.abrupt("break", 31);

        case 24:
          _ref2 = rule, countMin = _ref2.countMin, countMax = _ref2.countMax, subRule = _ref2.rule;

          if (!(countMax < countMin || countMax <= 0)) {
            _context5.next = 27;
            break;
          }

          throw new Error((0, _concat.default)(_context2 = (0, _concat.default)(_context3 = "RuleType.Repeat countMin=".concat(countMin, " countMax=")).call(_context3, countMax, " rule=")).call(_context2, rule));

        case 27:
          repeatNext =
          /*#__PURE__*/
          _regenerator.default.mark(function repeatNext(count) {
            var nextIteration;
            return _regenerator.default.wrap(function repeatNext$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (!(count >= countMax)) {
                      _context4.next = 4;
                      break;
                    }

                    if (!ruleNext) {
                      _context4.next = 3;
                      break;
                    }

                    return _context4.delegateYield(ruleNext(), "t0", 3);

                  case 3:
                    return _context4.abrupt("return");

                  case 4:
                    nextIteration = function nextIteration(newCount) {
                      return iterateRule(subRule, function () {
                        return repeatNext(newCount);
                      });
                    };

                    if (!(count < countMin)) {
                      _context4.next = 9;
                      break;
                    }

                    return _context4.delegateYield(nextIteration(count + 1), "t1", 7);

                  case 7:
                    _context4.next = 11;
                    break;

                  case 9:
                    _context4.next = 11;
                    return [ruleNext ? ruleNext() : [], nextIteration(count + 1)];

                  case 11:
                  case "end":
                    return _context4.stop();
                }
              }
            }, repeatNext);
          });
          return _context5.delegateYield(repeatNext(0), "t3", 29);

        case 29:
          return _context5.abrupt("break", 31);

        case 30:
          throw new Error('Unknown RuleType: ' + rule.type);

        case 31:
        case "end":
          return _context5.stop();
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

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = (0, _getIterator2.default)(ruleOrIterable), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var ruleIterable = _step.value;
        var unsubscribe = fork((0, _getIterator2.default)(ruleIterable));

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
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
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
    return (0, _getIterator2.default)(nextIterable());
  } : null);
}