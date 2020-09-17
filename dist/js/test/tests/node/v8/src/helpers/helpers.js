"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.checkIsOptimized = checkIsOptimized;
exports.assertIsOptimized = assertIsOptimized;
exports.assertIsNotOptimized = assertIsNotOptimized;

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _Assert = require("../../../../../../main/common/test/Assert");

var _helpers = require("./common/helpers");

var _contracts = require("./contracts");

function _checkIsOptimized(obj, optimized, scanned) {
  if (optimized === void 0) {
    optimized = null;
  }

  if (scanned === void 0) {
    scanned = new _set.default();
  }

  if (scanned.has(obj)) {
    return null;
  }

  scanned.add(obj);

  if (typeof obj === 'function') {
    var status = _helpers.v8.GetOptimizationStatus(obj);

    var actualStatus = status & (_helpers.shouldOptimizationStatus | _helpers.shouldNotOptimizationStatus);

    if ((status & _contracts.OptimizationStatus.MarkedForOptimization) !== 0) {
      actualStatus |= _contracts.OptimizationStatus.Optimized | _contracts.OptimizationStatus.TurboFanned;
    }

    var expectedStatus = actualStatus | _helpers.shouldOptimizationStatus;
    var differentFlags = actualStatus ^ expectedStatus;
    actualStatus &= differentFlags;
    expectedStatus &= differentFlags;
    var actualFunc = {};
    var expectedFunc = {};
    var hasError;

    if (actualStatus !== expectedStatus) {
      if (optimized && !optimized.has(obj)) {
        return null;
      }

      actualFunc['()'] = (0, _helpers.optimizationStatusToString)(status);
      expectedFunc['()'] = (0, _helpers.optimizationStatusToString)(expectedStatus);
      hasError = true;
    }

    if (obj.prototype) {
      var res = _checkIsOptimized(obj.prototype, optimized, scanned);

      if (res) {
        hasError = true;
        actualFunc._prototype = res.actual;
        expectedFunc._prototype = res.expected;
      }
    }

    if (hasError) {
      return {
        actual: actualFunc,
        expected: expectedFunc
      };
    }
  } else if (obj != null && typeof obj === 'object') {
    if (obj.valueOf() !== obj) {
      return null;
    }

    if (obj instanceof Int8Array || obj instanceof Int16Array || obj instanceof Int32Array || obj instanceof BigInt64Array || obj instanceof Uint8Array || obj instanceof Uint16Array || obj instanceof Uint32Array || obj instanceof BigUint64Array || obj instanceof Float32Array || obj instanceof Float64Array || obj instanceof Uint8ClampedArray) {
      return null;
    }

    var shouldInfo = (0, _isArray.default)(obj) ? _helpers.shouldArrayOptimizationInfo : _helpers.shouldObjectOptimizationInfo;
    var objInfo = (0, _helpers.getObjectOptimizationInfo)(obj);
    var actualInfo = {};
    var expectedInfo = {};

    var _hasError;

    for (var key in shouldInfo) {
      if (Object.prototype.hasOwnProperty.call(shouldInfo, key)) {
        // tslint:disable-next-line:no-collapsible-if
        if (objInfo[key] !== shouldInfo[key]) {
          actualInfo[key] = objInfo[key];
          expectedInfo[key] = shouldInfo[key];
          _hasError = true;
        }
      }
    }

    if (_hasError) {
      return {
        actual: actualInfo,
        expected: expectedInfo
      };
    } else {
      if ((0, _isArray.default)(obj)) {
        var actualArr = [];
        var expectedArr = [];

        for (var i = 0, len = obj.length; i < len; i++) {
          var item = obj[i];

          if (typeof item === 'function' || item != null && typeof item === 'object') {
            var _res = _checkIsOptimized(item, optimized, scanned);

            if (_res) {
              _hasError = true;
              actualArr.push(_res.actual);
              expectedArr.push(_res.expected);
            }
          }
        }

        if (_hasError) {
          return {
            actual: actualArr,
            expected: expectedArr
          };
        }
      } else {
        var actualObj = {};
        var expectedObj = {}; // tslint:disable-next-line:forin

        for (var _key in obj) {
          var _item = obj[_key];

          if (typeof _item === 'function' || _item != null && typeof _item === 'object') {
            var _res2 = _checkIsOptimized(_item, optimized, scanned);

            if (_res2) {
              _hasError = true;
              actualObj[_key] = _res2.actual;
              expectedObj[_key] = _res2.expected;
            }
          }
        }

        if (_hasError) {
          return {
            actual: actualObj,
            expected: expectedObj
          };
        }
      }
    }
  } else {
    throw new Error("object type === " + (obj == null ? obj : typeof obj));
  }

  if (optimized) {
    optimized.add(obj);
  }

  return null;
}

function checkIsOptimized(objectOrFunc, optimized) {
  if (optimized === void 0) {
    optimized = null;
  }

  return !_checkIsOptimized(objectOrFunc, optimized);
}

function assertIsOptimized(objectOrFunc, optimized) {
  if (optimized === void 0) {
    optimized = null;
  }

  var res = _checkIsOptimized(objectOrFunc, optimized);

  if (res) {
    var actual = res.actual,
        expected = res.expected;

    _Assert.assert.deepStrictEqual(actual, expected);

    _Assert.assert.notOk(res);
  }
}

function assertIsNotOptimized(objectOrFunc, optimized) {
  if (optimized === void 0) {
    optimized = null;
  }

  var res = _checkIsOptimized(objectOrFunc, optimized);

  _Assert.assert.ok(res);
}