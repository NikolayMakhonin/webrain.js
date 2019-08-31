import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { DependenciesBuilder } from './DependenciesBuilder';
export var CalcPropertyDependenciesBuilder =
/*#__PURE__*/
function (_DependenciesBuilder) {
  _inherits(CalcPropertyDependenciesBuilder, _DependenciesBuilder);

  function CalcPropertyDependenciesBuilder(buildSourceRule) {
    _classCallCheck(this, CalcPropertyDependenciesBuilder);

    return _possibleConstructorReturn(this, _getPrototypeOf(CalcPropertyDependenciesBuilder).call(this, buildSourceRule));
  }

  _createClass(CalcPropertyDependenciesBuilder, [{
    key: "invalidateOn",
    value: function invalidateOn(buildRule, predicate) {
      this.actionOn(buildRule, function (target) {
        target.invalidate();
      }, predicate);
      return this;
    }
  }, {
    key: "clearOn",
    value: function clearOn(buildRule, predicate) {
      this.actionOn(buildRule, function (target) {
        target.clear();
      }, predicate);
      return this;
    }
  }]);

  return CalcPropertyDependenciesBuilder;
}(DependenciesBuilder);