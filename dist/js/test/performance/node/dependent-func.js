"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _map2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/map"));

var _rdtsc = require("rdtsc");

var _objectUniqueId = require("../../../main/common/helpers/object-unique-id");

var _all = require("../../../main/common/rx/depend/all");

var _Assert = require("../../../main/common/test/Assert");

var _calc = require("../../../main/common/test/calc");

var _calcMemAllocate = require("../../../main/common/test/calc-mem-allocate");

var _Mocha = require("../../../main/common/test/Mocha");

var _helpers = require("../../tests/common/main/rx/depend/src/helpers");

// @ts-ignore
(0, _Mocha.describe)('dependent-func perf', function () {
  (0, _Mocha.it)('perceptron recalc', function () {
    var _context, _context2, _context3, _context4, _context5;

    this.timeout(300000);

    var _createPerceptron = (0, _helpers.createPerceptron)(2, 2),
        countFuncs = _createPerceptron.countFuncs,
        input = _createPerceptron.input,
        inputState = _createPerceptron.inputState,
        output = _createPerceptron.output;

    var naked = (0, _helpers.createPerceptronNaked)(2, 2);
    var map1 = new _map2.default();
    var map2 = new _map2.default();
    map2.set(2, 3);
    map1.set(1, map2);
    var result = (0, _rdtsc.calcPerformance)(10000, function () {
      naked.call(2, 5, 10);
    }, function () {
      (0, _all.invalidate)(inputState);
    }, function () {
      output.call(2, 5, 10);
    }, function () {
      return map1.get(1).get(2);
    });
    console.log(result);
    var cyclesPerSecond = result.calcInfo.iterationCycles * result.calcInfo.iterations / result.calcInfo.testTime * 1000;
    console.log('cyclesPerSecond: ' + cyclesPerSecond);
    console.log('countFuncs: ' + countFuncs);
    console.log("absoluteDiff per func: [" + (0, _map.default)(_context = result.absoluteDiff).call(_context, function (o) {
      return o / countFuncs;
    }).join(', ') + "]");
    console.log("funcs per second: [" + (0, _map.default)(_context2 = result.absoluteDiff).call(_context2, function (o) {
      return countFuncs * cyclesPerSecond / o;
    }).join(', ') + "]");
    console.log("funcs per frame: [" + (0, _map.default)(_context3 = result.absoluteDiff).call(_context3, function (o) {
      return countFuncs * cyclesPerSecond / o / 60;
    }).join(', ') + "]");
    console.log("chrome funcs per second: [" + (0, _map.default)(_context4 = result.absoluteDiff).call(_context4, function (o) {
      return countFuncs * cyclesPerSecond / o / 210;
    }).join(', ') + "]");
    console.log("chrome funcs per frame: [" + (0, _map.default)(_context5 = result.absoluteDiff).call(_context5, function (o) {
      return countFuncs * cyclesPerSecond / o / 60 / 210;
    }).join(', ') + "]");
    var chromeFuncsPerFrame = countFuncs * cyclesPerSecond / result.absoluteDiff[1] / 60 / 210;

    _Assert.assert.ok(chromeFuncsPerFrame >= 150);
  });
  (0, _Mocha.xit)('set memory', function () {
    this.timeout(300000);
    var set = new _set.default();
    var setArray = {};
    var objects = [];

    for (var i = 0; i < 10; i++) {
      objects[i] = {};
      (0, _objectUniqueId.getObjectUniqueId)(objects[i]);
    }

    console.log((0, _calcMemAllocate.calcMemAllocate)(_calc.CalcType.Min, 50000, function () {
      for (var _i = 0; _i < 10; _i++) {
        set.add(_i * _i * 10000000);
      }

      for (var _i2 = 0; _i2 < 10; _i2++) {
        set.delete(_i2 * _i2 * 10000000);
      }
    }).toString());
  });
  (0, _Mocha.it)('perceptron memory create', function () {
    var _context6;

    this.timeout(300000);
    var countFuncs;
    var result = (0, _calcMemAllocate.calcMemAllocate)(_calc.CalcType.Min, 50000, function () {
      countFuncs = (0, _helpers.createPerceptron)(10, 5, false).countFuncs;
    }).scale(1 / countFuncs);
    console.log(result.toString());
    (0, _forEach.default)(_context6 = result.averageValue).call(_context6, function (o) {
      return _Assert.assert.ok(o <= 750);
    });
  });
  (0, _Mocha.it)('perceptron create', function () {
    this.timeout(300000);

    var _createPerceptron2 = (0, _helpers.createPerceptron)(2, 2),
        countFuncs = _createPerceptron2.countFuncs,
        input = _createPerceptron2.input,
        inputState = _createPerceptron2.inputState,
        output = _createPerceptron2.output;

    var naked = (0, _helpers.createPerceptronNaked)(2, 2);
    var map1 = new _map2.default();
    var map2 = new _map2.default();
    map2.set(2, 3);
    map1.set(1, map2);
    var perceptron;
    var result = (0, _rdtsc.calcPerformance)(10000, function () {
      perceptron = (0, _helpers.createPerceptronNaked)(2, 2);
    }, function () {
      perceptron = (0, _helpers.createPerceptron)(2, 2, false);
    }, function () {
      perceptron.output.call(2, 5, 10);
    }, function () {
      (0, _all.invalidate)(perceptron.inputState);
      perceptron.output.call(2, 5, 10);
    });
    console.log(result);
  });
  (0, _Mocha.it)('perceptron memory recalc', function () {
    var _context7;

    this.timeout(300000);

    var _createPerceptron3 = (0, _helpers.createPerceptron)(10, 5),
        countFuncs = _createPerceptron3.countFuncs,
        input = _createPerceptron3.input,
        inputState = _createPerceptron3.inputState,
        output = _createPerceptron3.output; // const subscriberLinkPoolSize = subscriberLinkPool.size
    // const subscriberLinkPoolAllocatedSize = subscriberLinkPool.allocatedSize
    // const subscriberLinkPoolUsedSize = subscriberLinkPool.usedSize
    // console.log('subscriberLinkPool.size = ' + subscriberLinkPoolSize)
    // console.log('subscriberLinkPool.allocatedSize = ' + subscriberLinkPoolAllocatedSize)
    // console.log('subscriberLinkPool.usedSize = ' + subscriberLinkPoolUsedSize)
    // assert.strictEqual(subscriberLinkPool.size + subscriberLinkPool.usedSize, subscriberLinkPool.allocatedSize)


    var result = (0, _calcMemAllocate.calcMemAllocate)(_calc.CalcType.Min, 2000, function () {
      (0, _all.invalidate)(inputState);
      output.call(2, 5, 10);
    }).scale(1 / countFuncs);
    console.log(result.toString());
    (0, _forEach.default)(_context7 = result.averageValue).call(_context7, function (o) {
      return _Assert.assert.ok(o <= 0);
    }); // assert.strictEqual(subscriberLinkPool.size + subscriberLinkPool.usedSize, subscriberLinkPool.allocatedSize)
    // assert.strictEqual(subscriberLinkPool.size, subscriberLinkPoolSize)
    // assert.strictEqual(subscriberLinkPool.allocatedSize, subscriberLinkPoolAllocatedSize)
    // assert.strictEqual(subscriberLinkPool.usedSize, subscriberLinkPoolUsedSize)
  });
});