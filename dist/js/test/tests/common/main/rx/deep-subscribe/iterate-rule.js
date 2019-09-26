"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _repeat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/repeat"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _keys2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _iterateRule = require("../../../../../../main/common/rx/deep-subscribe/iterate-rule");

var _RuleBuilder = require("../../../../../../main/common/rx/deep-subscribe/RuleBuilder");

var _rules = require("../../../../../../main/common/rx/deep-subscribe/rules");

var _Assert = require("../../../../../../main/common/test/Assert");

/* tslint:disable:no-shadowed-variable no-empty */

/* eslint-disable no-useless-escape,computed-property-spacing */
describe('common > main > rx > deep-subscribe > iterate-rule', function () {
  var _marked =
  /*#__PURE__*/
  _regenerator.default.mark(objectToPaths);

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
  var testObject = {};

  function rulesToObject(ruleIterator, obj) {
    if (obj === void 0) {
      obj = {};
    }

    var iteration;

    if (!ruleIterator || (iteration = ruleIterator.next()).done) {
      obj._end = true;
      return function () {
        obj._end = false;
      };
    }

    return (0, _iterateRule.subscribeNextRule)(ruleIterator, iteration, function (nextRuleIterator) {
      return rulesToObject(nextRuleIterator, obj);
    }, function (rule, getRuleIterable) {
      var _Object$assign2;

      var newObj = {};
      var unsubscribe = rulesToObject(getRuleIterable ? (0, _getIterator2.default)(getRuleIterable(testObject)) : null, newObj);
      (0, _assign.default)(obj, (_Object$assign2 = {}, _Object$assign2[rule.description] = newObj, _Object$assign2));
      return unsubscribe;
    });
  }

  function objectToPaths(obj, endValue, parentPath) {
    var keys, count, key;
    return _regenerator.default.wrap(function objectToPaths$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (parentPath === void 0) {
              parentPath = '';
            }

            _Assert.assert.ok(obj, parentPath);

            if (!(obj._end === endValue)) {
              _context.next = 8;
              break;
            }

            _context.next = 5;
            return parentPath;

          case 5:
            keys = (0, _keys2.default)(obj);

            if (!(keys.length === 1 && keys[0] === '_end')) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return");

          case 8:
            count = 0;
            _context.t0 = (0, _keys.default)(_regenerator.default).call(_regenerator.default, obj);

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
    var result = (0, _iterateRule.iterateRule)(testObject, buildRule(new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    })).result());

    _Assert.assert.ok(result);

    var object = {};
    var unsubscribe = rulesToObject((0, _getIterator2.default)(result), object); // console.log(JSON.stringify(object, null, 4))

    var paths = (0, _from.default)(objectToPaths(object, true));

    for (var _len = arguments.length, expectedPaths = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      expectedPaths[_key - 1] = arguments[_key];
    }

    _Assert.assert.deepStrictEqual((0, _sort.default)(paths).call(paths), (0, _sort.default)(expectedPaths).call(expectedPaths), (0, _stringify.default)(paths, null, 4));

    unsubscribe(); // console.log(JSON.stringify(object, null, 4))

    paths = (0, _from.default)(objectToPaths(object, false));

    _Assert.assert.deepStrictEqual((0, _sort.default)(paths).call(paths), (0, _sort.default)(expectedPaths).call(expectedPaths), (0, _stringify.default)(paths, null, 4));
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
      return (0, _repeat.default)(b).call(b, 1, 1, null, function (b) {
        return b.path(function (o) {
          return o.a;
        });
      });
    }, 'a');
    testIterateRule(function (b) {
      return (0, _repeat.default)(b).call(b, 2, 2, null, function (b) {
        return b.path(function (o) {
          return o.a;
        });
      });
    }, 'a.a');
    testIterateRule(function (b) {
      return (0, _repeat.default)(b).call(b, 1, 2, null, function (b) {
        return b.path(function (o) {
          return o.a;
        });
      });
    }, 'a', 'a.a');
    testIterateRule(function (b) {
      return (0, _repeat.default)(b).call(b, 0, 2, null, function (b) {
        return b.path(function (o) {
          return o.a;
        });
      });
    }, '', 'a', 'a.a');
    testIterateRule(function (b) {
      return (0, _repeat.default)(b).call(b, 0, 2, null, function (b) {
        return (0, _repeat.default)(b).call(b, 0, 2, null, function (b) {
          return b.path(function (o) {
            return o.a;
          });
        }).path(function (o) {
          return o.b;
        });
      });
    }, '', 'b', 'a.b', 'a.a.b', 'b.b', 'b.a.b', 'b.a.a.b', 'a.b.b', 'a.b.a.b', 'a.b.a.a.b', 'a.a.b.b', 'a.a.b.a.b', 'a.a.b.a.a.b');
    testIterateRule(function (b) {
      return (0, _repeat.default)(b).call(b, 1, 2, null, function (b) {
        return b.any(function (b) {
          return (0, _repeat.default)(b).call(b, 1, 2, null, function (b) {
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
        return (0, _repeat.default)(b).call(b, 2, 2, null, function (b) {
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
    (0, _from.default)((0, _iterateRule.iterateRule)(testObject, new _rules.Rule(0)));

    _Assert.assert.throws(function () {
      return (0, _from.default)((0, _iterateRule.iterateRule)(testObject, new _rules.Rule(-1)), Error);
    });

    _Assert.assert.throws(function () {
      var _context2;

      return (0, _repeat.default)(_context2 = new _RuleBuilder.RuleBuilder({
        autoInsertValuePropertyDefault: false
      })).call(_context2, 1, 2, null, function (b) {
        return b;
      });
    }, Error);

    _Assert.assert.throws(function () {
      return new _RuleBuilder.RuleBuilder({
        autoInsertValuePropertyDefault: false
      }).any();
    }, Error);
  });
  it('specific', function () {
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.path(function (o) {
          return o.a;
        });
      }, function (b) {
        return (0, _repeat.default)(b).call(b, 0, 0, null, function (b) {
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