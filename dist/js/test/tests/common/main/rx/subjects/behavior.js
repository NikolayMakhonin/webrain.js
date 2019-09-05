"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _typeof2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/typeof"));

var _behavior = require("../../../../../../main/common/rx/subjects/behavior");

var _TestSubject = require("../src/TestSubject");

/* eslint-disable class-methods-use-this */
describe('common > main > rx > subjects > behavior', function () {
  it('behavior', function () {
    var subject = new ((0, _behavior.behavior)(_TestSubject.TestSubject))();
    assert.strictEqual(subject.subscribe(null), null);
    assert.strictEqual(subject.subscribe(false), null);
    assert.strictEqual(subject.subscribe(''), null);
    assert.strictEqual(subject.subscribe(0), null);
    var results = [];

    var subscriber = function subscriber(value) {
      results.push(value);
    };

    var unsubscribe = [];
    assert.strictEqual((0, _typeof2.default)(unsubscribe[0] = subject.subscribe(subscriber)), 'function');
    assert.deepStrictEqual(results, []);
    assert.strictEqual(unsubscribe[0](), undefined);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(subject.emit('1'), subject);
    assert.strictEqual((0, _typeof2.default)(unsubscribe[0] = subject.subscribe(subscriber)), 'function');
    assert.deepStrictEqual(results, ['1']);
    results = [];
    assert.strictEqual(unsubscribe[0](), undefined);
    assert.deepStrictEqual(results, []);
    assert.strictEqual((0, _typeof2.default)(unsubscribe[0] = subject.subscribe(subscriber)), 'function');
    assert.deepStrictEqual(results, ['1']);
    results = [];
    assert.strictEqual(unsubscribe[0](), undefined);
    assert.deepStrictEqual(results, []);
    subject = new ((0, _behavior.behavior)(_TestSubject.TestSubject))(null);
    assert.strictEqual((0, _typeof2.default)(unsubscribe[0] = subject.subscribe(subscriber)), 'function');
    assert.deepStrictEqual(results, [null]);
    results = [];
    assert.strictEqual(unsubscribe[0](), undefined);
    assert.deepStrictEqual(results, []);
    subject = new ((0, _behavior.behavior)(_TestSubject.TestSubject))('1');
    assert.strictEqual((0, _typeof2.default)(unsubscribe[0] = subject.subscribe(subscriber)), 'function');
    assert.deepStrictEqual(results, ['1']);
    results = [];
    assert.strictEqual(subject.emit('2'), subject);
    assert.deepStrictEqual(results, ['2']);
    results = [];
    assert.strictEqual(subject.emit('3'), subject);
    assert.deepStrictEqual(results, ['3']);
    results = [];
    assert.strictEqual(unsubscribe[0](), undefined);
    assert.strictEqual(subject.emit('4'), subject);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(unsubscribe[0](), undefined);
    assert.strictEqual(unsubscribe[0](), undefined);
    assert.strictEqual(subject.emit('5'), subject);
    assert.deepStrictEqual(results, []);
    assert.strictEqual((0, _typeof2.default)(unsubscribe[0] = subject.subscribe(subscriber)), 'function');
    assert.strictEqual((0, _typeof2.default)(unsubscribe[1] = subject.subscribe(subscriber)), 'function');
    assert.strictEqual(subject.emit('6'), subject);
    assert.deepStrictEqual(results, ['5', '5', '6', '6']);
    results = [];
    assert.strictEqual(unsubscribe[0](), undefined);
    assert.strictEqual(subject.emit('7'), subject);
    assert.deepStrictEqual(results, ['7']);
    results = [];
    assert.strictEqual(unsubscribe[1](), undefined);
    assert.strictEqual(subject.emit('8'), subject);
    assert.deepStrictEqual(results, []);
    assert.strictEqual(unsubscribe[0](), undefined);
    assert.strictEqual(unsubscribe[1](), undefined);
    assert.strictEqual(subject.emit('9'), subject);
    assert.deepStrictEqual(results, []);
  });
});