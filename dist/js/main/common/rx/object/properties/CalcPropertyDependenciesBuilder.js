"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.CalcPropertyDependenciesBuilder = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));

var _CalcObjectDebugger = require("./CalcObjectDebugger");

var _DependenciesBuilder2 = require("./DependenciesBuilder");

var CalcPropertyDependenciesBuilder =
/*#__PURE__*/
function (_DependenciesBuilder) {
  (0, _inheritsLoose2.default)(CalcPropertyDependenciesBuilder, _DependenciesBuilder);

  function CalcPropertyDependenciesBuilder(buildSourceRule) {
    return _DependenciesBuilder.call(this, buildSourceRule) || this;
  }

  var _proto = CalcPropertyDependenciesBuilder.prototype;

  _proto.invalidateOn = function invalidateOn(buildRule, predicate) {
    this.actionOn(buildRule, function (target, value, parent, propertyName) {
      _CalcObjectDebugger.CalcObjectDebugger.Instance.onDependencyChanged(target, value, parent, propertyName);

      target.invalidate();
    }, predicate);
    return this;
  };

  _proto.clearOn = function clearOn(buildRule, predicate) {
    this.actionOn(buildRule, function (target, value, parent, propertyName) {
      _CalcObjectDebugger.CalcObjectDebugger.Instance.onDependencyChanged(target, value, parent, propertyName);

      target.clear();
    }, predicate);
    return this;
  };

  return CalcPropertyDependenciesBuilder;
}(_DependenciesBuilder2.DependenciesBuilder);

exports.CalcPropertyDependenciesBuilder = CalcPropertyDependenciesBuilder;