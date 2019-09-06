"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.iterateRule = iterateRule;
exports.subscribeNextRule = subscribeNextRule;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _helpers = require("../../helpers/helpers");

var _rules = require("./contracts/rules");

var _marked =
/*#__PURE__*/
_regenerator.default.mark(iterateRule);

function iterateRule(rule, next) {
  var ruleNext, _ref, rules, any, _ref2, countMin, countMax, subRule, repeatNext;

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

          return _context3.delegateYield(next(), "t0", 4);

        case 4:
          return _context3.abrupt("return");

        case 5:
          ruleNext = rule.next || next ? function () {
            return iterateRule(rule.next, next);
          } : null;
          _context3.t1 = rule.type;
          _context3.next = _context3.t1 === _rules.RuleType.Nothing ? 9 : _context3.t1 === _rules.RuleType.Action ? 12 : _context3.t1 === _rules.RuleType.Any ? 17 : _context3.t1 === _rules.RuleType.Repeat ? 24 : 30;
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

          throw new Error("RuleType.Any rules.length=" + rules.length);

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

                    throw new Error("RuleType.Any rule=" + subRule);

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
          _context3.next = 23;
          return any();

        case 23:
          return _context3.abrupt("break", 31);

        case 24:
          _ref2 = rule, countMin = _ref2.countMin, countMax = _ref2.countMax, subRule = _ref2.rule;

          if (!(countMax < countMin || countMax <= 0)) {
            _context3.next = 27;
            break;
          }

          throw new Error("RuleType.Repeat countMin=" + countMin + " countMax=" + countMax + " rule=" + rule);

        case 27:
          repeatNext =
          /*#__PURE__*/
          _regenerator.default.mark(function repeatNext(count) {
            var nextIteration;
            return _regenerator.default.wrap(function repeatNext$(_context2) {
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
            }, repeatNext);
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

    for (var _iterator = ruleOrIterable, _isArray = (0, _isArray2.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
      var _ref3;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref3 = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref3 = _i.value;
      }

      var ruleIterable = _ref3;
      var unsubscribe = fork((0, _getIterator2.default)(ruleIterable));

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