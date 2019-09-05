"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.CalcPropertyDependenciesBuilder = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _CalcObjectDebugger = require("./CalcObjectDebugger");

var _DependenciesBuilder2 = require("./DependenciesBuilder");

var CalcPropertyDependenciesBuilder =
/*#__PURE__*/
function (_DependenciesBuilder) {
  (0, _inherits2.default)(CalcPropertyDependenciesBuilder, _DependenciesBuilder);

  function CalcPropertyDependenciesBuilder(buildSourceRule) {
    (0, _classCallCheck2.default)(this, CalcPropertyDependenciesBuilder);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(CalcPropertyDependenciesBuilder).call(this, buildSourceRule));
  }

  (0, _createClass2.default)(CalcPropertyDependenciesBuilder, [{
    key: "invalidateOn",
    value: function invalidateOn(buildRule, predicate) {
      this.actionOn(buildRule, function (target, value, parent, propertyName) {
        _CalcObjectDebugger.CalcObjectDebugger.Instance.onDependencyChanged(target, value, parent, propertyName);

        target.invalidate();
      }, predicate);
      return this;
    }
  }, {
    key: "clearOn",
    value: function clearOn(buildRule, predicate) {
      this.actionOn(buildRule, function (target, value, parent, propertyName) {
        _CalcObjectDebugger.CalcObjectDebugger.Instance.onDependencyChanged(target, value, parent, propertyName);

        target.clear();
      }, predicate);
      return this;
    }
  }]);
  return CalcPropertyDependenciesBuilder;
}(_DependenciesBuilder2.DependenciesBuilder);

exports.CalcPropertyDependenciesBuilder = CalcPropertyDependenciesBuilder;