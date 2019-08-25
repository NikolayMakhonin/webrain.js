import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { deepSubscribeRule } from '../../deep-subscribe/deep-subscribe';
import { cloneRule, RuleBuilder } from '../../deep-subscribe/RuleBuilder';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
export var ConnectorBuilder =
/*#__PURE__*/
function (_ObservableObjectBuil) {
  _inherits(ConnectorBuilder, _ObservableObjectBuil);

  function ConnectorBuilder(object, buildSourceRule) {
    var _this;

    _classCallCheck(this, ConnectorBuilder);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ConnectorBuilder).call(this, object));
    _this.buildSourceRule = buildSourceRule;
    return _this;
  }

  _createClass(ConnectorBuilder, [{
    key: "connect",
    value: function connect(name, buildRule, options, initValue) {
      var object = this.object,
          buildSourceRule = this.buildSourceRule;
      var ruleBuilder = new RuleBuilder();

      if (buildSourceRule) {
        ruleBuilder = buildSourceRule(ruleBuilder);
      }

      ruleBuilder = buildRule(ruleBuilder);
      var ruleBase = ruleBuilder && ruleBuilder.result;

      if (ruleBase == null) {
        throw new Error('buildRule() return null or not initialized RuleBuilder');
      }

      var setOptions = options && options.setOptions;
      return this.readable(name, {
        setOptions: setOptions,
        hidden: options && options.hidden,
        // tslint:disable-next-line:no-shadowed-variable
        factory: function factory(initValue) {
          var _this2 = this;

          var setValue = function setValue(value) {
            if (typeof value !== 'undefined') {
              initValue = value;
            }
          };

          var unsubscribe = deepSubscribeRule(this, function (value) {
            setValue(value);
            return null;
          }, true, this === object ? ruleBase : cloneRule(ruleBase));

          this._setUnsubscriber(name, unsubscribe);

          setValue = function setValue(value) {
            _this2._set(name, value, setOptions);
          };

          return initValue;
        }
      }, initValue);
    }
  }]);

  return ConnectorBuilder;
}(ObservableObjectBuilder);