"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _repeat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/repeat"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _keys2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/keys"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _helpers = require("../../../../../../../../main/common/helpers/helpers");

var _rules = require("../../../../../../../../main/common/rx/object/properties/path/builder/contracts/rules");

var _forEachRule = require("../../../../../../../../main/common/rx/object/properties/path/forEachRule");

var _iterateRule = require("../../../../../../../../main/common/rx/object/properties/path/iterate-rule");

var _RuleBuilder = require("../../../../../../../../main/common/rx/object/properties/path/builder/RuleBuilder");

var _rules2 = require("../../../../../../../../main/common/rx/object/properties/path/builder/rules");

var _Assert = require("../../../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../../../main/common/test/Mocha");

/* tslint:disable:no-shadowed-variable no-empty */

/* eslint-disable no-useless-escape,computed-property-spacing */
(0, _Mocha.describe)('common > main > rx > properties > builder > iterate-rule', function () {
  var _marked = /*#__PURE__*/_regenerator.default.mark(objectToPaths);

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

  function mergeObjects(dest, source) {
    if (!dest) {
      return source;
    }

    if (!source) {
      return dest;
    }

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        dest[key] = mergeObjects(dest[key], source[key]);
      }
    }

    return dest;
  }

  function rulesIteratorToObject(ruleIterator, obj, prevIsFork) {
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

    var isFork = (0, _helpers.isIterable)(iteration.value);

    if (isFork) {
      _Assert.assert.notOk(prevIsFork);

      _Assert.assert.ok((0, _isArray.default)(iteration.value));

      if (iteration.value.length > 0) {
        for (var i = 0; i < iteration.value.length; i++) {
          var item = iteration.value[i];

          if (i > 0) {
            _Assert.assert.ok(!(0, _isArray.default)(item) || item.length > 0);

            _Assert.assert.ok(item.type == null || item.type === _rules.RuleType.Action);
          } else {
            _Assert.assert.ok(item.type == null || item.type === _rules.RuleType.Action || item.type === _rules.RuleType.Never);
          }
        }
      }
    }

    return (0, _iterateRule.subscribeNextRule)(ruleIterator, iteration, function (nextRuleIterator) {
      return rulesIteratorToObject(nextRuleIterator, obj, isFork);
    }, function (rule, getRuleIterable) {
      var _mergeObjects;

      if (rule.type === _rules.RuleType.Never) {
        return null;
      }

      var newObj = {};
      var unsubscribe = rulesIteratorToObject(getRuleIterable ? (0, _getIterator2.default)(getRuleIterable(testObject)) : null, newObj, isFork);
      mergeObjects(obj, (_mergeObjects = {}, _mergeObjects[rule.description] = newObj, _mergeObjects));
      return unsubscribe;
    });
  }

  function forEachRuleToObject(rule, obj, prevIsFork) {
    if (obj === void 0) {
      obj = {};
    }

    (0, _forEachRule.forEachRule)(rule, obj, function (value, parent, key, keyType) {
      if (parent != null) {
        _Assert.assert.strictEqual(parent[key], value);
      }

      value._end = true;
    }, null, null, null, function (rule, value, next, parent, key, keyType) {
      var _newObj;

      if (parent != null) {
        _Assert.assert.strictEqual(parent[key], value);
      }

      var newObj = (_newObj = {}, _newObj[rule.description] = {}, _newObj);
      rule.subscribe(newObj, next);
      mergeObjects(value, newObj);
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
          case "end":
            return _context.stop();
        }
      }
    }, _marked);
  }

  function testForEachRules(buildRule) {
    var rule = buildRule(new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    })).result();
    var object = {};
    forEachRuleToObject(rule, object); // console.log(JSON.stringify(object, null, 4))

    var paths = (0, _from.default)(objectToPaths(object, true));

    for (var _len = arguments.length, expectedPaths = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      expectedPaths[_key - 1] = arguments[_key];
    }

    _Assert.assert.deepStrictEqual((0, _sort.default)(paths).call(paths), (0, _sort.default)(expectedPaths).call(expectedPaths), (0, _stringify.default)(paths, null, 4));
  }

  function testIterateRule(buildRule) {
    var _context2;

    var rule = buildRule(new _RuleBuilder.RuleBuilder({
      autoInsertValuePropertyDefault: false
    })).result();
    var result = (0, _iterateRule.iterateRule)(testObject, rule);

    _Assert.assert.ok(result);

    var object = {};
    var unsubscribe = rulesIteratorToObject((0, _getIterator2.default)(result), object); // console.log(JSON.stringify(object, null, 4))

    var paths = (0, _from.default)(objectToPaths(object, true));

    for (var _len2 = arguments.length, expectedPaths = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      expectedPaths[_key2 - 1] = arguments[_key2];
    }

    _Assert.assert.deepStrictEqual((0, _sort.default)(paths).call(paths), (0, _sort.default)(expectedPaths).call(expectedPaths), (0, _stringify.default)(paths, null, 4));

    if (expectedPaths.length) {
      _Assert.assert.ok(unsubscribe);

      unsubscribe();
    } else {
      _Assert.assert.notOk(unsubscribe);
    } // console.log(JSON.stringify(object, null, 4))


    paths = (0, _from.default)(objectToPaths(object, false));

    _Assert.assert.deepStrictEqual((0, _sort.default)(paths).call(paths), (0, _sort.default)(expectedPaths).call(expectedPaths), (0, _stringify.default)(paths, null, 4));

    testForEachRules.apply(void 0, (0, _concat.default)(_context2 = [buildRule]).call(_context2, expectedPaths));
  }

  (0, _Mocha.it)('never', function () {
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.never();
      }, function (b) {
        return b.never().p('a');
      }).any(function (b) {
        return b.never();
      }, function (b) {
        return b.never().p('a');
      }).p('a');
    });
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.never();
      }, function (b) {
        return b.p('a');
      }).p('a');
    }, 'a.a');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.never();
      }, function (b) {
        return b.nothing();
      }).p('a');
    }, 'a');
    testIterateRule(function (b) {
      return (0, _repeat.default)(b).call(b, 0, 3, null, function (b) {
        return b.any(function (b) {
          return b.never();
        }, function (b) {
          return b.nothing();
        });
      }).p('a');
    }, 'a');
    testIterateRule(function (b) {
      return (0, _repeat.default)(b).call(b, 1, 3, null, function (b) {
        return b.any(function (b) {
          return b.never();
        }, function (b) {
          return b.never().p('a');
        });
      }).p('b');
    });
  });
  (0, _Mocha.it)('nothing', function () {
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.p('a');
      }, function (b) {
        return b.nothing();
      }).any(function (b) {
        return b.p('a');
      }, function (b) {
        return b.nothing();
      }).p('c');
    }, 'a.a.c', 'a.c', 'c');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.any(function (b) {
          return b.nothing();
        });
      }, function (b) {
        return b.any(function (b) {
          return b.nothing();
        });
      }).any(function (b) {
        return b.p('a');
      }, function (b) {
        return b.nothing();
      }).any(function (b) {
        return b.p('a');
      }, function (b) {
        return b.nothing();
      }, function (b) {
        return b.p('a');
      }, function (b) {
        return b.nothing();
      }, function (b) {
        return b.any(function (b) {
          return b.p('a');
        }, function (b) {
          return b.nothing();
        });
      }).p('c');
    }, 'a.a.c', 'a.c', 'c');
    testIterateRule(function (b) {
      return b.p('a').any(function (b) {
        return b.p('b');
      }, function (b) {
        return b.nothing();
      }).p('c');
    }, 'a.b.c', 'a.c');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.p('a');
      }, function (b) {
        return b.nothing();
      }).any(function (b) {
        return b.p('b');
      }, function (b) {
        return b.nothing();
      }).p('c');
    }, 'a.b.c', 'a.c', 'b.c', 'c');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.p('a');
      }, function (b) {
        return b.nothing();
      }).p('b');
    }, 'a.b', 'b');
    testIterateRule(function (b) {
      return (0, _repeat.default)(b).call(b, 0, 3, null, function (b) {
        return b.any(function (b) {
          return b.p('a');
        }, function (b) {
          return b.nothing();
        });
      }).p('b');
    }, 'a.a.a.b', 'a.a.b', 'a.b', 'b');
  });
  (0, _Mocha.it)('any', function () {
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.never();
      }, function (b) {
        return b.never().p('a');
      }).p('a');
    });
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.p('a');
      }, function (b) {
        return b.p('b');
      });
    }, 'a', 'b');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.p('a').p('b');
      }, function (b) {
        return b.p('c').p('d');
      });
    }, 'a.b', 'c.d');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.any(function (b) {
          return b.p('a').p('b');
        }, function (b) {
          return b.p('c').p('d');
        });
      }, function (b) {
        return b.p('e').p('f');
      });
    }, 'a.b', 'c.d', 'e.f');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.p('a').p('b').any(function (b) {
          return b.p('c').p('d');
        }, function (b) {
          return b.p('e').p('f');
        }, function (b) {
          return b.any(function (b) {
            return b.never();
          }, function (b) {
            return b.never();
          });
        });
      }, function (b) {
        return b.p('g').p('h');
      }).p('i');
    }, 'a.b.c.d.i', 'a.b.e.f.i', 'g.h.i');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.never();
      }, function (b) {
        return b.p('a');
      }, function (b) {
        return b.nothing();
      }, function (b) {
        return b.p('b');
      });
    }, '', 'a', 'b');
  });
  (0, _Mocha.xit)('path any', function () {
    testIterateRule(function (b) {
      return b.p('a', 'b').p('c');
    }, 'a|b.c');
    testIterateRule(function (b) {
      return b.propertyRegexp(/[ab]/).p('c');
    }, '/[ab]/.c');
  });
  (0, _Mocha.it)('repeat', function () {
    testIterateRule(function (b) {
      return (0, _repeat.default)(b).call(b, 1, 1, null, function (b) {
        return b.p('a');
      });
    }, 'a');
    testIterateRule(function (b) {
      return (0, _repeat.default)(b).call(b, 2, 2, null, function (b) {
        return b.p('a');
      });
    }, 'a.a');
    testIterateRule(function (b) {
      return (0, _repeat.default)(b).call(b, 1, 2, null, function (b) {
        return b.p('a');
      });
    }, 'a', 'a.a');
    testIterateRule(function (b) {
      return (0, _repeat.default)(b).call(b, 0, 2, null, function (b) {
        return b.p('a');
      });
    }, '', 'a', 'a.a');
    testIterateRule(function (b) {
      return (0, _repeat.default)(b).call(b, 0, 2, null, function (b) {
        return (0, _repeat.default)(b).call(b, 0, 2, null, function (b) {
          return b.p('a');
        }).p('b');
      });
    }, '', 'b', 'a.b', 'a.a.b', 'b.b', 'b.a.b', 'b.a.a.b', 'a.b.b', 'a.b.a.b', 'a.b.a.a.b', 'a.a.b.b', 'a.a.b.a.b', 'a.a.b.a.a.b');
    testIterateRule(function (b) {
      return (0, _repeat.default)(b).call(b, 1, 2, null, function (b) {
        return b.any(function (b) {
          return (0, _repeat.default)(b).call(b, 1, 2, null, function (b) {
            return b.p('a');
          });
        }, function (b) {
          return b.p('b').p('c');
        });
      }).p('d');
    }, 'a.d', 'a.a.d', 'b.c.d', // 'a.a.d',
    'a.a.a.d', 'a.b.c.d', // 'a.a.a.d',
    'a.a.a.a.d', 'a.a.b.c.d', 'b.c.a.d', 'b.c.a.a.d', 'b.c.b.c.d');
    testIterateRule(function (b) {
      return b.any(function (b) {
        return (0, _repeat.default)(b).call(b, 2, 2, null, function (b) {
          return b.any(function (b) {
            return b.p('a');
          }, function (b) {
            return b.p('b');
          });
        });
      }, function (b) {
        return b.p('c');
      }).p('d');
    }, 'a.a.d', 'a.b.d', 'b.a.d', 'b.b.d', 'c.d');
  });
  (0, _Mocha.it)('throws', function () {
    (0, _from.default)((0, _iterateRule.iterateRule)(testObject, new _rules2.Rule(0)));

    _Assert.assert.throws(function () {
      return (0, _from.default)((0, _iterateRule.iterateRule)(testObject, new _rules2.Rule(-1)), Error);
    });

    _Assert.assert.throws(function () {
      var _context3;

      return (0, _repeat.default)(_context3 = new _RuleBuilder.RuleBuilder({
        autoInsertValuePropertyDefault: false
      })).call(_context3, 1, 2, null, function (b) {
        return b;
      });
    }, Error);

    _Assert.assert.throws(function () {
      return new _RuleBuilder.RuleBuilder({
        autoInsertValuePropertyDefault: false
      }).any();
    }, Error);
  });
  (0, _Mocha.it)('specific', function () {
    testIterateRule(function (b) {
      return b.any(function (b) {
        return b.p('a');
      }, function (b) {
        return (0, _repeat.default)(b).call(b, 0, 0, null, function (b) {
          return b.p('b');
        }).p('c');
      });
    }, 'a', 'c');
  });
});