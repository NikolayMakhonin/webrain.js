"use strict";

var _behavior = require("../../../../../../main/common/rx/subjects/behavior");

var _Assert = require("../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../main/common/test/Mocha");

var _TestSubject = require("../src/TestSubject");

/* eslint-disable class-methods-use-this */
(0, _Mocha.describe)('common > main > rx > subjects > behavior', function () {
  (0, _Mocha.it)('behavior', function () {
    var subject = new ((0, _behavior.behavior)(_TestSubject.TestSubject))();

    _Assert.assert.strictEqual(subject.subscribe(null), null);

    _Assert.assert.strictEqual(subject.subscribe(false), null);

    _Assert.assert.strictEqual(subject.subscribe(''), null);

    _Assert.assert.strictEqual(subject.subscribe(0), null);

    var results = [];

    var subscriber = function subscriber(value) {
      results.push(value);
    };

    var unsubscribe = [];

    _Assert.assert.strictEqual(typeof (unsubscribe[0] = subject.subscribe(subscriber)), 'function');

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.strictEqual(subject.emit('1'), subject);

    _Assert.assert.strictEqual(typeof (unsubscribe[0] = subject.subscribe(subscriber)), 'function');

    _Assert.assert.deepStrictEqual(results, ['1']);

    results = [];

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.strictEqual(typeof (unsubscribe[0] = subject.subscribe(subscriber)), 'function');

    _Assert.assert.deepStrictEqual(results, ['1']);

    results = [];

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.deepStrictEqual(results, []);

    subject = new ((0, _behavior.behavior)(_TestSubject.TestSubject))(null);

    _Assert.assert.strictEqual(typeof (unsubscribe[0] = subject.subscribe(subscriber)), 'function');

    _Assert.assert.deepStrictEqual(results, [null]);

    results = [];

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.deepStrictEqual(results, []);

    subject = new ((0, _behavior.behavior)(_TestSubject.TestSubject))('1');

    _Assert.assert.strictEqual(typeof (unsubscribe[0] = subject.subscribe(subscriber)), 'function');

    _Assert.assert.deepStrictEqual(results, ['1']);

    results = [];

    _Assert.assert.strictEqual(subject.emit('2'), subject);

    _Assert.assert.deepStrictEqual(results, ['2']);

    results = [];

    _Assert.assert.strictEqual(subject.emit('3'), subject);

    _Assert.assert.deepStrictEqual(results, ['3']);

    results = [];

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.strictEqual(subject.emit('4'), subject);

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.strictEqual(subject.emit('5'), subject);

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.strictEqual(typeof (unsubscribe[0] = subject.subscribe(subscriber)), 'function');

    _Assert.assert.strictEqual(typeof (unsubscribe[1] = subject.subscribe(subscriber)), 'function');

    _Assert.assert.strictEqual(subject.emit('6'), subject);

    _Assert.assert.deepStrictEqual(results, ['5', '5', '6', '6']);

    results = [];

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.strictEqual(subject.emit('7'), subject);

    _Assert.assert.deepStrictEqual(results, ['7']);

    results = [];

    _Assert.assert.strictEqual(unsubscribe[1](), undefined);

    _Assert.assert.strictEqual(subject.emit('8'), subject);

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.strictEqual(unsubscribe[1](), undefined);

    _Assert.assert.strictEqual(subject.emit('9'), subject);

    _Assert.assert.deepStrictEqual(results, []);
  });
});