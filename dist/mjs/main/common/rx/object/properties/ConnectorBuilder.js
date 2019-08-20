import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { deepSubscribeRule } from '../../deep-subscribe/deep-subscribe';
import { RuleBuilder } from '../../deep-subscribe/RuleBuilder';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
export var ConnectorBuilder =
/*#__PURE__*/
function (_ObservableObjectBuil) {
  _inherits(ConnectorBuilder, _ObservableObjectBuil);

  function ConnectorBuilder() {
    _classCallCheck(this, ConnectorBuilder);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConnectorBuilder).apply(this, arguments));
  }

  _createClass(ConnectorBuilder, [{
    key: "connect",
    value: function connect(name, buildRule, options, initValue) {
      var ruleBuilder = buildRule(new RuleBuilder());
      var rule = ruleBuilder && ruleBuilder.result;

      if (rule == null) {
        throw new Error('buildRule() return null or not initialized RuleBuilder');
      }

      return this.readable(name, {
        factorySetOptions: options,
        factory: function factory() {
          var _this = this;

          var setValue = function setValue(value) {
            if (typeof value !== 'undefined') {
              initValue = value;
            }
          };

          var unsubscribe = deepSubscribeRule(this, function (value) {
            setValue(value);
            return null;
          }, true, rule);

          this._setUnsubscriber(name, unsubscribe);

          setValue = function setValue(value) {
            _this._set(name, value, options);
          };

          return initValue;
        }
      });
    }
  }]);

  return ConnectorBuilder;
}(ObservableObjectBuilder);