"use strict";

var _Assert = require("../../../../../../main/common/test/Assert");

var _Mocha = require("../../../../../../main/common/test/Mocha");

var _timing = require("./src/timing");

(0, _Mocha.describe)('common > main > rx > deferred-calc > timing', function () {
  (0, _Mocha.it)('base', function () {
    var timing = new _timing.TestTiming();
    var results = [];

    _Assert.assert.throws(function () {
      return timing.setTime(0);
    }, Error);

    _Assert.assert.throws(function () {
      return timing.addTime(-1);
    }, Error);

    timing.setTimeout(function () {
      return results.push(1);
    }, 0);
    timing.addTime(0);

    _Assert.assert.deepStrictEqual(results, [1]);

    results = [];
    timing.addTime(0);

    _Assert.assert.deepStrictEqual(results, []);

    timing.setTimeout(function () {
      return results.push(2);
    }, 0);
    var timerId1 = timing.setTimeout(function () {
      return results.push(3);
    }, 0);
    timing.setTimeout(function () {
      return results.push(4);
    }, 0);
    timing.setTimeout(function () {
      return results.push(5);
    }, 1);
    var timerId2 = timing.setTimeout(function () {
      return results.push(6);
    }, 1);
    timing.setTimeout(function () {
      return results.push(7);
    }, 1);
    timing.setTimeout(function () {
      return results.push(8);
    }, 1);
    timing.setTimeout(function () {
      return results.push(9);
    }, 1);
    timing.setTimeout(function () {
      return results.push(10);
    }, 1);
    timing.clearTimeout(timerId1);
    timing.clearTimeout(timerId2);

    _Assert.assert.deepStrictEqual(results, []);

    timing.addTime(0);

    _Assert.assert.deepStrictEqual(results, [2, 4]);

    results = [];
    timing.addTime(0);

    _Assert.assert.deepStrictEqual(results, []);

    timing.addTime(1);

    _Assert.assert.deepStrictEqual(results, [5, 7, 8, 9, 10]);

    results = [];
    timing.addTime(1);

    _Assert.assert.deepStrictEqual(results, []);

    timing.setTime(4);
    timing.setTimeout(function () {
      return results.push(1);
    }, 1); // 5

    timing.setTimeout(function () {
      return results.push(2);
    }, 2); // 6

    timing.setTime(1);
    timing.setTimeout(function () {
      return results.push(5);
    }, 4); // 5

    timing.setTimeout(function () {
      return results.push(3);
    }, 2); // 3

    timing.setTimeout(function () {
      return results.push(4);
    }, 2); // 3

    timing.setTimeout(function () {
      return results.push(6);
    }, 2); // 3

    timing.setTimeout(function () {
      return results.push(0);
    }, 0); // 0

    results = [];
    timing.addTime(10);

    _Assert.assert.deepStrictEqual(results, [0, 3, 4, 6, 1, 5, 2]);

    results = [];
    timing.addTime(1);

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.strictEqual(timing.now(), 12);

    timing.setTimeout(function () {
      return results.push(1);
    }, 1);
    timing.setTimeout(function () {
      return results.push(2);
    }, 2);
    timing.setTimeout(function () {
      return results.push(3);
    }, 3);
    timing.setTimeout(function () {
      return results.push(4);
    }, 4);
    timing.setTimeout(function () {
      return results.push(5);
    }, 5);
    timing.addTime(5);

    _Assert.assert.deepStrictEqual(results, [1, 2, 3, 4, 5]);

    results = [];
    timing.addTime(10);

    _Assert.assert.deepStrictEqual(results, []);

    _Assert.assert.strictEqual(timing.now(), 27);
  });
});