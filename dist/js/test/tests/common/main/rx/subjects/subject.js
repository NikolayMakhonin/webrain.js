"use strict";

var _subject = require("../../../../../../main/common/rx/subjects/subject");

var _Assert = require("../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../main/common/test/Mocha");

(0, _Mocha.describe)('common > main > rx > subjects > subject', function () {
  (0, _Mocha.it)('Subject', function () {
    var subject = new _subject.Subject();

    _Assert.assert.strictEqual(subject.hasSubscribers, false);

    _Assert.assert.strictEqual(subject.subscribe(null), null);

    _Assert.assert.strictEqual(subject.subscribe(false), null);

    _Assert.assert.strictEqual(subject.subscribe(''), null);

    _Assert.assert.strictEqual(subject.subscribe(0), null);

    _Assert.assert.strictEqual(subject.emit('1'), subject);

    var results = [];

    var subscriber = function subscriber(value) {
      results.push(value);
    };

    _Assert.assert.strictEqual(subject.hasSubscribers, false);

    var unsubscribe = [];

    _Assert.assert.strictEqual(typeof (unsubscribe[0] = subject.subscribe(subscriber)), 'function');

    _Assert.assert.strictEqual(subject.hasSubscribers, true);

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.strictEqual(subject.emit('2'), subject);

    _Assert.assert.deepStrictEqual(results, ['2']);

    _Assert.assert.strictEqual(subject.hasSubscribers, true);

    results = [];

    _Assert.assert.strictEqual(subject.emit('3'), subject);

    _Assert.assert.deepStrictEqual(results, ['3']);

    _Assert.assert.strictEqual(subject.hasSubscribers, true);

    results = [];

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.strictEqual(subject.hasSubscribers, false);

    _Assert.assert.strictEqual(subject.emit('4'), subject);

    _Assert.assert.strictEqual(subject.hasSubscribers, false);

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.strictEqual(subject.hasSubscribers, false);

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.strictEqual(subject.hasSubscribers, false);

    _Assert.assert.strictEqual(subject.emit('5'), subject);

    _Assert.assert.strictEqual(subject.hasSubscribers, false);

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.strictEqual(typeof (unsubscribe[0] = subject.subscribe(subscriber)), 'function');

    _Assert.assert.strictEqual(subject.hasSubscribers, true);

    _Assert.assert.strictEqual(typeof (unsubscribe[1] = subject.subscribe(subscriber)), 'function');

    _Assert.assert.strictEqual(subject.hasSubscribers, true);

    _Assert.assert.strictEqual(subject.emit('6'), subject);

    _Assert.assert.strictEqual(subject.hasSubscribers, true);

    _Assert.assert.deepStrictEqual(results, ['6', '6']);

    results = [];

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.strictEqual(subject.hasSubscribers, true);

    _Assert.assert.strictEqual(subject.emit('7'), subject);

    _Assert.assert.strictEqual(subject.hasSubscribers, true);

    _Assert.assert.deepStrictEqual(results, ['7']);

    results = [];

    _Assert.assert.strictEqual(unsubscribe[1](), undefined);

    _Assert.assert.strictEqual(subject.hasSubscribers, false);

    _Assert.assert.strictEqual(subject.emit('8'), subject);

    _Assert.assert.strictEqual(subject.hasSubscribers, false);

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.strictEqual(unsubscribe[1](), undefined);

    _Assert.assert.strictEqual(subject.emit('9'), subject);

    _Assert.assert.deepStrictEqual(results, []);
  });
});