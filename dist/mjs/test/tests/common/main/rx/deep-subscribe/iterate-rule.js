/* tslint:disable:no-shadowed-variable no-empty */
import { isIterable } from '../../../../../../main/common';
/* eslint-disable no-useless-escape,computed-property-spacing */

import { RuleType } from '../../../../../../main/common/rx/deep-subscribe/contracts/rules';
import { iterateRule, subscribeNextRule } from '../../../../../../main/common/rx/deep-subscribe/iterate-rule';
import { RuleBuilder } from '../../../../../../main/common/rx/deep-subscribe/RuleBuilder';
import { Rule } from '../../../../../../main/common/rx/deep-subscribe/rules';
import { assert } from '../../../../../../main/common/test/Assert';
import { describe, it } from '../../../../../../main/common/test/Mocha';
describe('common > main > rx > deep-subscribe > iterate-rule', function () {
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
  const testObject = {};

  function mergeObjects(dest, source) {
    if (!dest) {
      return source;
    }

    if (!source) {
      return dest;
    }

    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        dest[key] = mergeObjects(dest[key], source[key]);
      }
    }

    return dest;
  }

  function rulesToObject(ruleIterator, obj = {}, prevIsFork) {
    let iteration;

    if (!ruleIterator || (iteration = ruleIterator.next()).done) {
      obj._end = true;
      return () => {
        obj._end = false;
      };
    }

    const isFork = isIterable(iteration.value);

    if (isFork) {
      assert.notOk(prevIsFork);
      assert.ok(Array.isArray(iteration.value));

      if (iteration.value.length > 0) {
        for (let i = 0; i < iteration.value.length; i++) {
          const item = iteration.value[i];

          if (i > 0) {
            assert.ok(!Array.isArray(item) || item.length > 0);
            assert.ok(item.type == null || item.type === RuleType.Action);
          } else {
            assert.ok(item.type == null || item.type === RuleType.Action || item.type === RuleType.Never);
          }
        }
      }
    }

    return subscribeNextRule(ruleIterator, iteration, nextRuleIterator => rulesToObject(nextRuleIterator, obj, isFork), (rule, getRuleIterable) => {
      if (rule.type === RuleType.Never) {
        return null;
      }

      const newObj = {};
      const unsubscribe = rulesToObject(getRuleIterable ? getRuleIterable(testObject)[Symbol.iterator]() : null, newObj, isFork);
      mergeObjects(obj, {
        [rule.description]: newObj
      });
      return unsubscribe;
    });
  }

  function* objectToPaths(obj, endValue, parentPath = '') {
    assert.ok(obj, parentPath);

    if (obj._end === endValue) {
      yield parentPath;
      const keys = Object.keys(obj);

      if (keys.length === 1 && keys[0] === '_end') {
        return;
      }
    }

    let count = 0;

    for (const key in obj) {
      if (key !== '_end' && Object.prototype.hasOwnProperty.call(obj, key)) {
        count++;
        yield* objectToPaths(obj[key], endValue, (parentPath ? parentPath + '.' : '') + key);
      }
    } // if (!count) {
    // 	throw new Error(parentPath + ' is empty')
    // }

  }

  function testIterateRule(buildRule, ...expectedPaths) {
    const result = iterateRule(testObject, buildRule(new RuleBuilder({
      autoInsertValuePropertyDefault: false
    })).result());
    assert.ok(result);
    const object = {};
    const unsubscribe = rulesToObject(result[Symbol.iterator](), object); // console.log(JSON.stringify(object, null, 4))

    let paths = Array.from(objectToPaths(object, true));
    assert.deepStrictEqual(paths.sort(), expectedPaths.sort(), JSON.stringify(paths, null, 4));

    if (expectedPaths.length) {
      assert.ok(unsubscribe);
      unsubscribe();
    } else {
      assert.notOk(unsubscribe);
    } // console.log(JSON.stringify(object, null, 4))


    paths = Array.from(objectToPaths(object, false));
    assert.deepStrictEqual(paths.sort(), expectedPaths.sort(), JSON.stringify(paths, null, 4));
  }

  it('path', function () {
    testIterateRule(b => b.path(o => o.a), 'a');
    testIterateRule(b => b.path(o => o.a.b.c), 'a.b.c');
  });
  it('never', function () {
    testIterateRule(b => b.any(b => b.never(), b => b.never().p('a')).any(b => b.never(), b => b.never().p('a')).p('a'));
    testIterateRule(b => b.any(b => b.never(), b => b.p('a')).p('a'), 'a.a');
    testIterateRule(b => b.any(b => b.never(), b => b.nothing()).p('a'), 'a');
    testIterateRule(b => b.repeat(0, 3, null, b => b.any(b => b.never(), b => b.nothing())).p('a'), 'a');
    testIterateRule(b => b.repeat(1, 3, null, b => b.any(b => b.never(), b => b.never().p('a'))).p('b'));
  });
  it('nothing', function () {
    testIterateRule(b => b.any(b => b.any(b => b.nothing()), b => b.any(b => b.nothing())).any(b => b.p('a'), b => b.nothing()).any(b => b.p('a'), b => b.nothing(), b => b.p('a'), b => b.nothing(), b => b.any(b => b.p('a'), b => b.nothing())).p('c'), 'a.a.c', 'a.c', 'c');
    testIterateRule(b => b.p('a').any(b => b.p('b'), b => b.nothing()).p('c'), 'a.b.c', 'a.c');
    testIterateRule(b => b.any(b => b.p('a'), b => b.nothing()).any(b => b.p('b'), b => b.nothing()).p('c'), 'a.b.c', 'a.c', 'b.c', 'c');
    testIterateRule(b => b.any(b => b.p('a'), b => b.nothing()).p('b'), 'a.b', 'b');
    testIterateRule(b => b.repeat(0, 3, null, b => b.any(b => b.p('a'), b => b.nothing())).p('b'), 'a.a.a.b', 'a.a.b', 'a.b', 'b');
  });
  it('any', function () {
    testIterateRule(b => b.any(b => b.never(), b => b.never().p('a')).p('a'));
    testIterateRule(b => b.any(b => b.path(o => o.a), b => b.path(o => o.b)), 'a', 'b');
    testIterateRule(b => b.any(b => b.path(o => o.a.b), b => b.path(o => o.c.d)), 'a.b', 'c.d');
    testIterateRule(b => b.any(b => b.any(b => b.path(o => o.a.b), b => b.path(o => o.c.d)), b => b.path(o => o.e.f)), 'a.b', 'c.d', 'e.f');
    testIterateRule(b => b.any(b => b.path(o => o.a.b).any(b => b.path(o => o.c.d), b => b.path(o => o.e.f), b => b.any(b => b.never(), b => b.never())), b => b.path(o => o.g.h)).path(o => o.i), 'a.b.c.d.i', 'a.b.e.f.i', 'g.h.i');
    testIterateRule(b => b.any(b => b.never(), b => b.path(o => o.a), b => b.nothing(), b => b.path(o => o.b)), '', 'a', 'b');
  });
  it('path any', function () {
    testIterateRule(b => b.path(o => o['a|b'].c), 'a|b.c');
    testIterateRule(b => b.propertyRegexp(/[ab]/).path(o => o.c), '/[ab]/.c');
  });
  it('repeat', function () {
    testIterateRule(b => b.repeat(1, 1, null, b => b.path(o => o.a)), 'a');
    testIterateRule(b => b.repeat(2, 2, null, b => b.path(o => o.a)), 'a.a');
    testIterateRule(b => b.repeat(1, 2, null, b => b.path(o => o.a)), 'a', 'a.a');
    testIterateRule(b => b.repeat(0, 2, null, b => b.path(o => o.a)), '', 'a', 'a.a');
    testIterateRule(b => b.repeat(0, 2, null, b => b.repeat(0, 2, null, b => b.path(o => o.a)).path(o => o.b)), '', 'b', 'a.b', 'a.a.b', 'b.b', 'b.a.b', 'b.a.a.b', 'a.b.b', 'a.b.a.b', 'a.b.a.a.b', 'a.a.b.b', 'a.a.b.a.b', 'a.a.b.a.a.b');
    testIterateRule(b => b.repeat(1, 2, null, b => b.any(b => b.repeat(1, 2, null, b => b.path(o => o.a)), b => b.path(o => o.b.c))).path(o => o.d), 'a.d', 'a.a.d', 'b.c.d', // 'a.a.d',
    'a.a.a.d', 'a.b.c.d', // 'a.a.a.d',
    'a.a.a.a.d', 'a.a.b.c.d', 'b.c.a.d', 'b.c.a.a.d', 'b.c.b.c.d');
    testIterateRule(b => b.any(b => b.repeat(2, 2, null, b => b.any(b => b.path(o => o.a), b => b.path(o => o.b))), b => b.path(o => o.c)).path(o => o.d), 'a.a.d', 'a.b.d', 'b.a.d', 'b.b.d', 'c.d');
  });
  it('throws', function () {
    Array.from(iterateRule(testObject, new Rule(0)));
    assert.throws(() => Array.from(iterateRule(testObject, new Rule(-1)), Error));
    assert.throws(() => new RuleBuilder({
      autoInsertValuePropertyDefault: false
    }).repeat(1, 2, null, b => b), Error);
    assert.throws(() => new RuleBuilder({
      autoInsertValuePropertyDefault: false
    }).any(), Error);
  });
  it('specific', function () {
    testIterateRule(b => b.any(b => b.path(o => o.a), b => b.repeat(0, 0, null, b => b.path(o => o.b)).path(o => o.c)), 'a', 'c');
  });
});