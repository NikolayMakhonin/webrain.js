"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.CalcPropertyDependenciesBuilder = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _Debugger = require("../../Debugger");

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
      this.actionOn(buildRule, function (target, value, parent, key, keyType) {
        _Debugger.Debugger.Instance.onDependencyChanged(target, value, parent, key, keyType);

        target.invalidate();
      }, predicate);
      return this;
    }
  }, {
    key: "clearOn",
    value: function clearOn(buildRule, predicate) {
      this.actionOn(buildRule, function (target, value, parent, key, keyType) {
        _Debugger.Debugger.Instance.onDependencyChanged(target, value, parent, key, keyType);

        target.clear();
      }, predicate);
      return this;
    }
  }]);
  return CalcPropertyDependenciesBuilder;
}(_DependenciesBuilder2.DependenciesBuilder);

exports.CalcPropertyDependenciesBuilder = CalcPropertyDependenciesBuilder;