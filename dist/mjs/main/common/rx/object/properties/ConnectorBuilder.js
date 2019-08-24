import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { deepSubscribeRule } from '../../deep-subscribe/deep-subscribe';
import { cloneRule, RuleBuilder } from '../../deep-subscribe/RuleBuilder';
import { ObservableObject } from '../ObservableObject';
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
    value: function connect(name, options, initValue) {
      var buildRule = options.buildRule,
          setOptions = options.setOptions,
          hidden = options.hidden;
      var ruleBuilder = buildRule(new RuleBuilder());
      var ruleBase = ruleBuilder && ruleBuilder.result;

      if (ruleBase == null) {
        throw new Error('buildRule() return null or not initialized RuleBuilder');
      }

      var object = this.object;
      return this.readable(name, {
        setOptions: setOptions,
        hidden: hidden,
        // tslint:disable-next-line:no-shadowed-variable
        factory: function factory(initValue) {
          var _this = this;

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
            _this._set(name, value, setOptions);
          };

          return initValue;
        }
      }, initValue);
    }
  }]);

  return ConnectorBuilder;
}(ObservableObjectBuilder);
var CONNECTOR_SOURCE_PROPERTY_NAME = Math.random().toString(36);

var ConnectorBase =
/*#__PURE__*/
function (_ObservableObject) {
  _inherits(ConnectorBase, _ObservableObject);

  function ConnectorBase(source) {
    var _this2;

    _classCallCheck(this, ConnectorBase);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(ConnectorBase).call(this));
    _this2[CONNECTOR_SOURCE_PROPERTY_NAME] = source;
    return _this2;
  }

  return ConnectorBase;
}(ObservableObject);

Object.defineProperty(ConnectorBase.prototype, CONNECTOR_SOURCE_PROPERTY_NAME, {
  configurable: false,
  enumerable: false,
  writable: false,
  value: null
});
export function connector(build) {
  var Connector =
  /*#__PURE__*/
  function (_ConnectorBase) {
    _inherits(Connector, _ConnectorBase);

    function Connector() {
      _classCallCheck(this, Connector);

      return _possibleConstructorReturn(this, _getPrototypeOf(Connector).apply(this, arguments));
    }

    return Connector;
  }(ConnectorBase);

  var connectorBuilder = new ConnectorBuilder(Connector.prototype);
  build(connectorBuilder);
  return Connector;
}
var builder = new ConnectorBuilder(true);
export function connect(options, initValue) {
  return function (target, propertyKey) {
    builder.object = target;
    builder.connect(propertyKey, options, initValue);
  };
} // class Class1 extends ObservableObject {
// }
// class Class extends Class1 {
// 	@connect()
// 	public prop: number
// }