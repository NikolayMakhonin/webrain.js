"use strict";

var _rules = require("../../../../../../main/common/rx/deep-subscribe/contracts/rules");

var _RuleBuilder = require("../../../../../../main/common/rx/deep-subscribe/RuleBuilder");

var _iterateRule = require("../../../../../../main/common/rx/deep-subscribe/iterate-rule");

/* tslint:disable:no-shadowed-variable */

/* eslint-disable no-useless-escape,computed-property-spacing */
describe('common > main > rx > deep-subscribe > RuleState', function () {
  function ruleToString(rule) {
    if (!rule) {
      return rule + '';
    }

    return `[${_rules.RuleType[rule.type]}]${rule.description ? ' ' + rule.description : ''}`;
  }

  function* resolveRules(ruleOrIterable) {
    if (!ruleOrIterable[Symbol.iterator]) {
      yield ruleOrIterable;
      return;
    }

    for (const rule of ruleOrIterable) {
      yield* resolveRules(rule);
    }
  }

  function rulesToString(rules) {
    return Array.from(resolveRules(rules)).map(o => ruleToString(o)).join('\n');
  }

  const endObject = {
    _end: true
  };

  function rulesToObject(ruleIterator) {
    const iteration = ruleIterator.next();

    if (iteration.done) {
      return endObject;
    }

    const ruleOrIterable = iteration.value;
    let obj = {};

    if (ruleOrIterable[Symbol.iterator]) {
      for (const ruleIterable of ruleOrIterable) {
        Object.assign(obj, rulesToObject(ruleIterable[Symbol.iterator]()));
      }
    } else {
      const rule = iteration.value;
      obj = {
        [rule.description]: rulesToObject(ruleIterator)
      };
    }

    return obj;
  }

  function* objectToPaths(obj, parentPath = '') {
    assert.ok(obj, parentPath);

    if (obj._end) {
      yield parentPath;
    }

    if (obj === endObject) {
      return;
    }

    let count = 0;

    for (const key in obj) {
      if (key !== '_end' && Object.prototype.hasOwnProperty.call(obj, key)) {
        count++;
        yield* objectToPaths(obj[key], (parentPath ? parentPath + '.' : '') + key);
      }
    }

    if (!count) {
      throw new Error(parentPath + ' is empty');
    }
  }

  function testIterateRule(buildRule, ...expectedPaths) {
    const result = (0, _iterateRule.iterateRule)(buildRule(new _RuleBuilder.RuleBuilder()).rule);
    assert.ok(result);
    const object = rulesToObject(result[Symbol.iterator]()); // console.log(JSON.stringify(objectTree, null, 4))

    const paths = Array.from(objectToPaths(object));
    assert.deepStrictEqual(paths.sort(), expectedPaths.sort(), JSON.stringify(paths, null, 4));
  }

  it('path', function () {
    const builder = new _RuleBuilder.RuleBuilder();
    testIterateRule(b => b.path(o => o.a), 'a');
    testIterateRule(b => b.path(o => o.a.b.c), 'a.b.c');
  });
  it('any', function () {
    const builder = new _RuleBuilder.RuleBuilder();
    testIterateRule(b => b.any(b => b.path(o => o.a), b => b.path(o => o.b)), 'a', 'b');
    testIterateRule(b => b.any(b => b.path(o => o.a.b), b => b.path(o => o.c.d)), 'a.b', 'c.d');
    testIterateRule(b => b.any(b => b.any(b => b.path(o => o.a.b), b => b.path(o => o.c.d)), b => b.path(o => o.e.f)), 'a.b', 'c.d', 'e.f');
    testIterateRule(b => b.any(b => b.path(o => o.a.b).any(b => b.path(o => o.c.d), b => b.path(o => o.e.f)), b => b.path(o => o.g.h)).path(o => o.i), 'a.b.c.d.i', 'a.b.e.f.i', 'g.h.i');
  });
  it('repeat', function () {
    const builder = new _RuleBuilder.RuleBuilder();
    testIterateRule(b => b.repeat(1, 1, b => b.path(o => o.a)), 'a');
    testIterateRule(b => b.repeat(0, 2, b => b.path(o => o.a)), '', 'a', 'a.a');
    testIterateRule(b => b.repeat(0, 2, b => b.repeat(0, 2, b => b.path(o => o.a)).path(o => o.b)), '', 'b', 'a.b', 'a.a.b', 'b.b', 'b.a.b', 'b.a.a.b', 'a.b.b', 'a.b.a.b', 'a.b.a.a.b', 'a.a.b.b', 'a.a.b.a.b', 'a.a.b.a.a.b');
    testIterateRule(b => b.repeat(1, 2, b => b.any(b => b.repeat(1, 2, b => b.path(o => o.a)), b => b.path(o => o.b.c))).path(o => o.d), 'a.d', 'a.a.d', 'b.c.d', // 'a.a.d',
    'a.a.a.d', 'a.b.c.d', // 'a.a.a.d',
    'a.a.a.a.d', 'a.a.b.c.d', 'b.c.a.d', 'b.c.a.a.d', 'b.c.b.c.d');
    testIterateRule(b => b.any(b => b.repeat(2, 2, b => b.any(b => b.path(o => o.a), b => b.path(o => o.b))), b => b.path(o => o.c)).path(o => o.d), 'a.a.d', 'a.b.d', 'b.a.d', 'b.b.d', 'c.d');
  });
  it('throws', function () {
    Array.from((0, _iterateRule.iterateRule)({
      type: 0
    }));
    assert.throws(() => Array.from((0, _iterateRule.iterateRule)({
      type: -1
    })), Error);
  });
});