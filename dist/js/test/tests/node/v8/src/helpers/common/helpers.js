"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

exports.__esModule = true;
exports.filterObjectByKeys = filterObjectByKeys;
exports.optimizationStatusToString = optimizationStatusToString;
exports.shouldNotOptimizationStatus = exports.shouldOptimizationStatus = exports.getObjectOptimizationInfo = exports.shouldObjectOptimizationInfo = exports.shouldArrayOptimizationInfo = exports.v8 = void 0;

var node_4_9_1 = _interopRequireWildcard(require("../node_4_9_1/helpers"));

var node_latest = _interopRequireWildcard(require("../node_latest/helpers"));

function filterObjectByKeys(obj, keys) {
  var objFiltered = {};

  for (var _key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, _key) && Object.prototype.hasOwnProperty.call(keys, _key)) {
      objFiltered[_key] = obj[_key];
    }
  }

  return objFiltered;
} // https://gist.github.com/naugtur/4b03a9f9f72346a9f79d7969728a849f


var optimizationStatusDescriptions = ['IsFunction', 'NeverOptimize', 'AlwaysOptimize', 'MaybeDeopted', 'Optimized', 'TurboFanned', 'Interpreted', 'MarkedForOptimization', 'MarkedForConcurrentOptimization', 'OptimizingConcurrently', 'IsExecuting', 'TopmostFrameIsTurboFanned', 'LiteMode', 'MarkedForDeoptimization'];

function optimizationStatusToString(status) {
  var result = [];
  var _status = status;

  for (var i = 0, len = optimizationStatusDescriptions.length; i < len; i++) {
    if ((_status & 1) === 1) {
      result.push(optimizationStatusDescriptions[i]);
    }

    _status >>= 1;
  }

  if (_status) {
    result.push('unknown');
  }

  return status + ': [' + result.join(', ') + ']';
}

var node_current = process.version === 'v4.9.1' ? node_4_9_1 : node_latest;
var v8 = node_current.v8;
exports.v8 = v8;
var shouldArrayOptimizationInfo = node_current.shouldArrayOptimizationInfo;
exports.shouldArrayOptimizationInfo = shouldArrayOptimizationInfo;
var shouldObjectOptimizationInfo = node_current.shouldObjectOptimizationInfo;
exports.shouldObjectOptimizationInfo = shouldObjectOptimizationInfo;
var getObjectOptimizationInfo = node_current.getObjectOptimizationInfo;
exports.getObjectOptimizationInfo = getObjectOptimizationInfo;
var shouldOptimizationStatus = node_current.shouldOptimizationStatus;
exports.shouldOptimizationStatus = shouldOptimizationStatus;
var shouldNotOptimizationStatus = node_current.shouldNotOptimizationStatus;
exports.shouldNotOptimizationStatus = shouldNotOptimizationStatus;