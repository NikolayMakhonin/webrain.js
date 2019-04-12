import _regeneratorRuntime from "@babel/runtime/regenerator";

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(iterateRule);

import { RuleType } from './contracts/rules';
export function iterateRule(rule) {
  var next,
      nextRule,
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
          nextRule = function nextRule() {
            return iterateRule(rule.next, next);
          };

          _context3.t1 = rule.type;
          _context3.next = _context3.t1 === RuleType.Action ? 9 : _context3.t1 === RuleType.Any ? 13 : _context3.t1 === RuleType.Repeat ? 18 : 22;
          break;

        case 9:
          _context3.next = 11;
          return rule;

        case 11:
          return _context3.delegateYield(nextRule(), "t2", 12);

        case 12:
          return _context3.abrupt("break", 23);

        case 13:
          _ref = rule, rules = _ref.rules;
          any =
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee() {
            var i, len;
            return _regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    i = 0, len = rules.length;

                  case 1:
                    if (!(i < len)) {
                      _context.next = 7;
                      break;
                    }

                    _context.next = 4;
                    return iterateRule(rules[i], nextRule);

                  case 4:
                    i++;
                    _context.next = 1;
                    break;

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          });
          _context3.next = 17;
          return any();

        case 17:
          return _context3.abrupt("break", 23);

        case 18:
          _ref2 = rule, countMin = _ref2.countMin, countMax = _ref2.countMax, subRule = _ref2.rule;
          repeatNext =
          /*#__PURE__*/
          _regeneratorRuntime.mark(function _callee2(count) {
            var nextIteration;
            return _regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!(count >= countMax)) {
                      _context2.next = 3;
                      break;
                    }

                    return _context2.delegateYield(nextRule(), "t0", 2);

                  case 2:
                    return _context2.abrupt("return");

                  case 3:
                    nextIteration = function nextIteration() {
                      return iterateRule(subRule, function () {
                        return repeatNext(count + 1);
                      });
                    };

                    if (!(count < countMin)) {
                      _context2.next = 8;
                      break;
                    }

                    return _context2.delegateYield(nextIteration(), "t1", 6);

                  case 6:
                    _context2.next = 10;
                    break;

                  case 8:
                    _context2.next = 10;
                    return [nextRule(), nextIteration()];

                  case 10:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          });
          return _context3.delegateYield(repeatNext(0), "t3", 21);

        case 21:
          return _context3.abrupt("break", 23);

        case 22:
          throw new Error('Unknown RuleType: ' + rule.type);

        case 23:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked);
}