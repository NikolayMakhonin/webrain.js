"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _hasSubscribers = require("../../../../../../main/common/rx/subjects/hasSubscribers");

var _Assert = require("../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../main/common/test/Mocha");

var _TestSubject = require("../src/TestSubject");

/* eslint-disable class-methods-use-this */
(0, _Mocha.describe)('common > main > rx > subjects > hasSubscribers', function () {
  function deleteFromArray(array, item) {
    var index = (0, _indexOf.default)(array).call(array, item);

    if (index > -1) {
      (0, _splice.default)(array).call(array, index, 1);
    }
  }

  (0, _Mocha.it)('hasSubscribers', function () {
    var subscribers = [];
    var subject = new ((0, _hasSubscribers.hasSubscribers)(_TestSubject.TestSubject))();

    _Assert.assert.strictEqual(subject.subscribe(null), null);

    _Assert.assert.strictEqual(subject.subscribe(false), null);

    _Assert.assert.strictEqual(subject.subscribe(''), null);

    _Assert.assert.strictEqual(subject.subscribe(0), null);

    var hasSubscribers = [];

    var hasSubscribersSubscriber = function hasSubscribersSubscriber(value) {
      hasSubscribers.push(value);
    };

    var hasSubscribersUnsubscribe = [];

    _Assert.assert.strictEqual(typeof (hasSubscribersUnsubscribe[0] = subject.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function');

    _Assert.assert.deepStrictEqual(hasSubscribers, [false]);

    hasSubscribers = [];

    _Assert.assert.strictEqual(subject.hasSubscribers, false);

    _Assert.assert.strictEqual(subject.emit('1'), subject);

    var results = [];

    var subscriber = function subscriber(value) {
      results.push(value);
    };

    var unsubscribe = [];

    _Assert.assert.strictEqual(typeof (unsubscribe[0] = subject.subscribe(subscriber)), 'function');

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.deepStrictEqual(hasSubscribers, [true]);

    hasSubscribers = [];

    _Assert.assert.strictEqual(hasSubscribersUnsubscribe[0](), undefined);

    _Assert.assert.deepStrictEqual(hasSubscribers, [null]);

    hasSubscribers = [];

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.strictEqual(subject.emit('2'), subject);

    _Assert.assert.deepStrictEqual(results, ['2']);

    results = [];

    _Assert.assert.strictEqual(typeof (hasSubscribersUnsubscribe[0] = subject.hasSubscribersObservable.subscribe(hasSubscribersSubscriber)), 'function');

    _Assert.assert.deepStrictEqual(hasSubscribers, [true]);

    hasSubscribers = [];

    _Assert.assert.strictEqual(subject.emit('3'), subject);

    _Assert.assert.deepStrictEqual(results, ['3']);

    results = [];

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    hasSubscribers = [];

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.deepStrictEqual(hasSubscribers, [false]);

    hasSubscribers = [];

    _Assert.assert.strictEqual(subject.emit('4'), subject);

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.strictEqual(unsubscribe[0](), undefined);

    _Assert.assert.strictEqual(subject.emit('5'), subject);

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    _Assert.assert.strictEqual(typeof (unsubscribe[0] = subject.subscribe(subscriber)), 'function');

    _Assert.assert.deepStrictEqual(hasSubscribers, [true]);

    hasSubscribers = [];

    _Assert.assert.strictEqual(typeof (unsubscribe[1] = subject.subscribe(subscriber)), 'function');

    _Assert.assert.deepStrictEqual(hasSubscribers, []);

    _Assert.assert.strictEqual(hasSubscribersUnsubscribe[0](), undefined);

    _Assert.assert.deepStrictEqual(hasSubscribers, [null]);

    hasSubscribers = [];

    _Assert.assert.strictEqual(subject.emit('6'), subject);

    _Assert.assert.deepStrictEqual(results, ['6', '6']);

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