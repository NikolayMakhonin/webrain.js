import _regeneratorRuntime from "@babel/runtime/regenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

/* tslint:disable:no-shadowed-variable no-empty */

/* eslint-disable no-useless-escape,computed-property-spacing */
import { iterateRule, subscribeNextRule } from '../../../../../../main/common/rx/deep-subscribe/iterate-rule';
import { RuleBuilder } from '../../../../../../main/common/rx/deep-subscribe/RuleBuilder';
import { Rule } from '../../../../../../main/common/rx/deep-subscribe/rules';
import { assert } from '../../../../../../main/common/test/Assert';
describe('common > main > rx > deep-subscribe > iterate-rule', function () {
  var _marked =
  /*#__PURE__*/
  _regeneratorRuntime.mark(objectToPaths);

  // function ruleToString(rule: IRule) {
  // 	if (!rule) {
  // 		return rule + ''
  // 	}
  //
  // 	return `[${RuleType[rule.type]}]${rule.description ? ' ' + rule.description : ''}`
  // }
  // function *resolveRules(ruleOrIterable: IRuleOrIterable): Iterable<IRule> {
  // 	if (!isIterable(ruleOrIterable)) {
  // 		yield ruleOrIterable as IRule
  // 		return
  // 	}
  // 	for (const rule of ruleOrIterable as IRuleIterable) {
  // 		yield* resolveRules(rule)
  // 	}
  // }
  // function rulesToString(rules: IRuleOrIterable) {
  // 	return Array
  // 		.from(resolveRules(rules))
  // 		.map(o => ruleToString(o)).join('\n')
  // }
  // const endObject = { _end: true }
  function rulesToObject(ruleIterator) {
    var obj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return subscribeNextRule(ruleIterator, function (nextRuleIterator) {
      return rulesToObject(nextRuleIterator, obj);
    }, function (rule, getRuleIterator) {
      var newObj = {};
      var unsubscribe = rulesToObject(getRuleIterator ? getRuleIterator() : null, newObj);
      Object.assign(obj, _defineProperty({}, rule.description, newObj));
      return unsubscribe;
    }, function () {
      obj._end = true;
      return function () {
        obj._end = false;
      };
    });
  }

  function objectToPaths(obj, endValue) {
    var parentPath,
        keys,
        count,
        key,
        _args = arguments;
    return _regeneratorRuntime.wrap(function objectToPaths$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            parentPath = _args.length > 2 && _args[2] !== undefined ? _args[2] : '';
            assert.ok(obj, parentPath);

            if (!(obj._end === endValue)) {
              _context.next = 8;
              break;
            }

            _context.next = 5;
            return parentPath;

          case 5:
            keys = Object.keys(obj);

            if (!(keys.length === 1 && keys[0] === '_end')) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return");

          case 8:
            count = 0;
            _context.t0 = _regeneratorRuntime.keys(obj);

          case 10:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 17;
              break;
            }

            key = _context.t1.value;

            if (!(key !== '_end' && Object.prototype.hasOwnProperty.call(obj, key))) {
              _context.next = 15;
              break;
            }

            count++;
            return _context.delegateYield(objectToPaths(obj[key], endValue, (parentPath ? parentPath + '.' : '') + key), "t2", 15);

          case 15:
            _context.next = 10;
            break;

          case 17:
            if (count) {
              _context.next = 19;
              break;
            }

            throw new Error(parentPath + ' is empty');

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _marked);
  }

  function testIterateRule(buildRule) {
    var result = iterateRule(buildRule(new RuleBuilder()).result);
    assert.ok(result);
    var object = {};
    var unsubscribe = rulesToObject(result[Symbol.iterator](), object); // console.log(JSON.stringify(object, null, 4))

    var paths = Array.from(objectToPaths(object, true));

    for (var _len = arguments.length, expectedPaths = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      expectedPaths[_key - 1] = arguments[_key];
    }

    assert.deepStrictEqual(paths.sort(), expectedPaths.sort(), JSON.stringify(paths, null, 4));
    unsubscribe(); // console.log(JSON.stringify(object, null, 4))

    paths = Array.from(objectToPaths(object, false));
    assert.deepStrictEqual(paths.sort(), expectedPaths.sort(), JSON.stringify(paths, null, 4));
  }

  it('path', function () {
    testIterateRule(function (b) {
      return b.path(function (o) {
        return o.a;
      });
    }, 'a');
    testIterateRule(function (b) {
      return b.path(function (o) {
        return o.a.b.c;
      });
    }, 'a.b.c');
  });
  it('any', function () {
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.path(function (o) {
          return o.a;
        });
      }, function (b) {
        return b.path(function (o) {
          return o.b;
        });
      });
    }, 'a', 'b');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.path(function (o) {
          return o.a.b;
        });
      }, function (b) {
        return b.path(function (o) {
          return o.c.d;
        });
      });
    }, 'a.b', 'c.d');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.any(function (b) {
          return b.path(function (o) {
            return o.a.b;
          });
        }, function (b) {
          return b.path(function (o) {
            return o.c.d;
          });
        });
      }, function (b) {
        return b.path(function (o) {
          return o.e.f;
        });
      });
    }, 'a.b', 'c.d', 'e.f');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.path(function (o) {
          return o.a.b;
        }).any(function (b) {
          return b.path(function (o) {
            return o.c.d;
          });
        }, function (b) {
          return b.path(function (o) {
            return o.e.f;
          });
        });
      }, function (b) {
        return b.path(function (o) {
          return o.g.h;
        });
      }).path(function (o) {
        return o.i;
      });
    }, 'a.b.c.d.i', 'a.b.e.f.i', 'g.h.i');
  });
  it('path any', function () {
    testIterateRule(function (b) {
      return b.path(function (o) {
        return o['a|b'].c;
      });
    }, 'a|b.c');
    testIterateRule(function (b) {
      return b.propertyRegexp(/[ab]/).path(function (o) {
        return o.c;
      });
    }, '/[ab]/.c');
  });
  it('repeat', function () {
    testIterateRule(function (b) {
      return b.repeat(1, 1, function (b) {
        return b.path(function (o) {
          return o.a;
        });
      });
    }, 'a');
    testIterateRule(function (b) {
      return b.repeat(2, 2, function (b) {
        return b.path(function (o) {
          return o.a;
        });
      });
    }, 'a.a');
    testIterateRule(function (b) {
      return b.repeat(1, 2, function (b) {
        return b.path(function (o) {
          return o.a;
        });
      });
    }, 'a', 'a.a');
    testIterateRule(function (b) {
      return b.repeat(0, 2, function (b) {
        return b.path(function (o) {
          return o.a;
        });
      });
    }, '', 'a', 'a.a');
    testIterateRule(function (b) {
      return b.repeat(0, 2, function (b) {
        return b.repeat(0, 2, function (b) {
          return b.path(function (o) {
            return o.a;
          });
        }).path(function (o) {
          return o.b;
        });
      });
    }, '', 'b', 'a.b', 'a.a.b', 'b.b', 'b.a.b', 'b.a.a.b', 'a.b.b', 'a.b.a.b', 'a.b.a.a.b', 'a.a.b.b', 'a.a.b.a.b', 'a.a.b.a.a.b');
    testIterateRule(function (b) {
      return b.repeat(1, 2, function (b) {
        return b.any(function (b) {
          return b.repeat(1, 2, function (b) {
            return b.path(function (o) {
              return o.a;
            });
          });
        }, function (b) {
          return b.path(function (o) {
            return o.b.c;
          });
        });
      }).path(function (o) {
        return o.d;
      });
    }, 'a.d', 'a.a.d', 'b.c.d', // 'a.a.d',
    'a.a.a.d', 'a.b.c.d', // 'a.a.a.d',
    'a.a.a.a.d', 'a.a.b.c.d', 'b.c.a.d', 'b.c.a.a.d', 'b.c.b.c.d');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.repeat(2, 2, function (b) {
          return b.any(function (b) {
            return b.path(function (o) {
              return o.a;
            });
          }, function (b) {
            return b.path(function (o) {
              return o.b;
            });
          });
        });
      }, function (b) {
        return b.path(function (o) {
          return o.c;
        });
      }).path(function (o) {
        return o.d;
      });
    }, 'a.a.d', 'a.b.d', 'b.a.d', 'b.b.d', 'c.d');
  });
  it('throws', function () {
    Array.from(iterateRule(new Rule(0)));
    assert["throws"](function () {
      return Array.from(iterateRule(new Rule(-1)), Error);
    });
    assert["throws"](function () {
      return new RuleBuilder().repeat(1, 2, function (b) {
        return b;
      });
    }, Error);
    assert["throws"](function () {
      return new RuleBuilder().any();
    }, Error);
  });
  it('specific', function () {
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.path(function (o) {
          return o.a;
        });
      }, function (b) {
        return b.repeat(0, 0, function (b) {
          return b.path(function (o) {
            return o.b;
          });
        }).path(function (o) {
          return o.c;
        });
      });
    }, 'a', 'c');
  });
});