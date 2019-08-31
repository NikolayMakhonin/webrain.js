import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { deepSubscribeRule } from '../../deep-subscribe/deep-subscribe';
import { RuleBuilder } from '../../deep-subscribe/RuleBuilder';
export var DependenciesBuilder =
/*#__PURE__*/
function () {
  function DependenciesBuilder(buildSourceRule) {
    _classCallCheck(this, DependenciesBuilder);

    this.dependencies = [];
    this.buildSourceRule = buildSourceRule;
  }

  _createClass(DependenciesBuilder, [{
    key: "actionOn",
    value: function actionOn(buildRule, action, predicate) {
      var buildSourceRule = this.buildSourceRule;
      var ruleBuilder = new RuleBuilder();

      if (buildSourceRule) {
        ruleBuilder = buildSourceRule(ruleBuilder);
      }

      ruleBuilder = buildRule(ruleBuilder);
      var ruleBase = ruleBuilder && ruleBuilder.result;

      if (ruleBase == null) {
        throw new Error('buildRule() return null or not initialized RuleBuilder');
      }

      this.dependencies.push([ruleBase, predicate ? function (target, value, parent, propertyName) {
        if (predicate(value, parent)) {
          action(target, value, parent, propertyName);
        }
      } : action]);
      return this;
    }
  }]);

  return DependenciesBuilder;
}();
export function subscribeDependencies(subscribeObject, actionTarget, dependencies) {
  var unsubscribers = [];

  var _loop = function _loop(i, len) {
    var _dependencies$i = _slicedToArray(dependencies[i], 2),
        rule = _dependencies$i[0],
        action = _dependencies$i[1];

    unsubscribers.push(deepSubscribeRule(subscribeObject, function (value, parent, propertyName) {
      action(actionTarget, value, parent, propertyName);
      return null;
    }, true, rule));
  };

  for (var i = 0, len = dependencies.length; i < len; i++) {
    _loop(i, len);
  }

  return function () {
    for (var i = 0, len = unsubscribers.length; i < len; i++) {
      unsubscribers[i]();
    }
  };
}