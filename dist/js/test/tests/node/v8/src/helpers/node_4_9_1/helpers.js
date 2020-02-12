"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getObjectOptimizationInfo = getObjectOptimizationInfo;
exports.shouldNotOptimizationStatus = exports.shouldOptimizationStatus = exports.shouldObjectOptimizationInfo = exports.shouldArrayOptimizationInfo = void 0;

var _contracts = require("../contracts");

var _runtimeAdapter = _interopRequireDefault(require("./runtime-adapter"));

exports.v8 = _runtimeAdapter.default;

function getObjectOptimizationInfo(obj) {
  var result = {
    CountElementsTypes: 0,
    HasFastPackedElements: _runtimeAdapter.default.HasFastPackedElements(obj),
    HasDictionaryElements: _runtimeAdapter.default.HasDictionaryElements(obj),
    HasFastDoubleElements: _runtimeAdapter.default.HasFastDoubleElements(obj),
    // HasElementsInALargeObjectSpace: v8.HasElementsInALargeObjectSpace(obj),
    HasFastElements: false,
    HasFastProperties: _runtimeAdapter.default.HasFastProperties(obj),
    HasFixedFloat32Elements: _runtimeAdapter.default.HasFixedFloat32Elements(obj),
    HasFixedFloat64Elements: _runtimeAdapter.default.HasFixedFloat64Elements(obj),
    HasFixedInt16Elements: _runtimeAdapter.default.HasFixedInt16Elements(obj),
    HasFixedInt32Elements: _runtimeAdapter.default.HasFixedInt32Elements(obj),
    HasFixedInt8Elements: _runtimeAdapter.default.HasFixedInt8Elements(obj),
    HasFixedUint16Elements: _runtimeAdapter.default.HasFixedUint16Elements(obj),
    HasFixedUint32Elements: _runtimeAdapter.default.HasFixedUint32Elements(obj),
    HasFixedUint8ClampedElements: _runtimeAdapter.default.HasFixedUint8ClampedElements(obj),
    HasFixedUint8Elements: _runtimeAdapter.default.HasFixedUint8Elements(obj),
    HasFastHoleyElements: _runtimeAdapter.default.HasFastHoleyElements(obj),
    HasFastObjectElements: _runtimeAdapter.default.HasFastObjectElements(obj),
    HasSloppyArgumentsElements: _runtimeAdapter.default.HasSloppyArgumentsElements(obj),
    HasFastSmiElements: _runtimeAdapter.default.HasFastSmiElements(obj),
    HasFastSmiOrObjectElements: _runtimeAdapter.default.HasFastSmiOrObjectElements(obj)
  };
  result.HasFastElements = result.HasFastPackedElements || result.HasFastDoubleElements || result.HasFastHoleyElements || result.HasFastObjectElements || result.HasFastSmiElements || result.HasFastSmiOrObjectElements;

  if (result.HasFixedFloat32Elements) {
    result.CountElementsTypes++;
  }

  if (result.HasFastDoubleElements) {
    result.CountElementsTypes++;
  }

  if (result.HasFixedInt32Elements) {
    result.CountElementsTypes++;
  }

  if (result.HasFixedFloat64Elements) {
    result.CountElementsTypes++;
  }

  if (result.HasFixedInt8Elements) {
    result.CountElementsTypes++;
  }

  if (result.HasFixedInt16Elements) {
    result.CountElementsTypes++;
  }

  if (result.HasFixedUint8ClampedElements) {
    result.CountElementsTypes++;
  }

  if (result.HasFixedUint8Elements) {
    result.CountElementsTypes++;
  }

  if (result.HasFixedUint16Elements) {
    result.CountElementsTypes++;
  }

  if (result.HasFixedUint32Elements) {
    result.CountElementsTypes++;
  }

  if (result.HasFastObjectElements) {
    result.CountElementsTypes++;
  }

  if (result.HasFastSmiElements) {
    result.CountElementsTypes++;
  }

  return result;
}

var shouldArrayOptimizationInfo = {
  CountElementsTypes: 1,
  HasFastPackedElements: true,
  HasDictionaryElements: false,
  HasFastElements: true
};
exports.shouldArrayOptimizationInfo = shouldArrayOptimizationInfo;
var shouldObjectOptimizationInfo = {
  CountElementsTypes: 1,
  HasDictionaryElements: false,
  HasFastElements: true,
  HasFastHoleyElements: true,
  HasFastObjectElements: true,
  HasFastSmiOrObjectElements: true
};
exports.shouldObjectOptimizationInfo = shouldObjectOptimizationInfo;
var shouldOptimizationStatus = _contracts.OptimizationStatus.IsFunction | _contracts.OptimizationStatus.Optimized;
exports.shouldOptimizationStatus = shouldOptimizationStatus;
var shouldNotOptimizationStatus = _contracts.OptimizationStatus.NeverOptimize | _contracts.OptimizationStatus.AlwaysOptimize | _contracts.OptimizationStatus.Interpreted | _contracts.OptimizationStatus.MaybeDeopted | _contracts.OptimizationStatus.MaybeDeopted;
exports.shouldNotOptimizationStatus = shouldNotOptimizationStatus;