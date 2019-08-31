import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import { createFunction } from '../../../helpers/helpers';
import { deepSubscribeRule } from '../../deep-subscribe/deep-subscribe';
import { cloneRule, RuleBuilder } from '../../deep-subscribe/RuleBuilder';
import { _set, _setExt } from '../ObservableObject';
import { ObservableObjectBuilder } from '../ObservableObjectBuilder';
import { Connector } from './Connector';
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

      var setOptions = options && options.setOptions; // optimization

      var getValue = createFunction('o', "return o.__fields[\"".concat(name, "\"]"));
      var setValue = createFunction('o', 'v', "o.__fields[\"".concat(name, "\"] = v"));
      var set = setOptions ? _setExt.bind(null, name, getValue, setValue, setOptions) : _set.bind(null, name, getValue, setValue);
      return this.readable(name, {
        setOptions: setOptions,
        hidden: options && options.hidden,
        // tslint:disable-next-line:no-shadowed-variable
        factory: function factory(initValue) {
          var _this2 = this;

          var setVal = function setVal(obj, value) {
            if (typeof value !== 'undefined') {
              initValue = value;
            }
          };

          var unsubscribe = deepSubscribeRule(this, function (value) {
            setVal(_this2, value);
            return null;
          }, true, this === object ? ruleBase : cloneRule(ruleBase));

          this._setUnsubscriber(name, unsubscribe);

          setVal = set;
          return initValue;
        }
      }, initValue);
    }
  }]);

  return ConnectorBuilder;
}(ObservableObjectBuilder);
export function connectorClass(build, baseClass) {
  var NewConnector =
  /*#__PURE__*/
  function (_ref) {
    _inherits(NewConnector, _ref);

    function NewConnector() {
      _classCallCheck(this, NewConnector);

      return _possibleConstructorReturn(this, _getPrototypeOf(NewConnector).apply(this, arguments));
    }

    return NewConnector;
  }(baseClass || Connector);

  build(new ConnectorBuilder(NewConnector.prototype, function (b) {
    return b.propertyName('connectorSource');
  }));
  return NewConnector;
}
export function connectorFactory(build, baseClass) {
  var NewConnector = connectorClass(build, baseClass);
  return function (source) {
    return new NewConnector(source);
  };
} // const builder = new ConnectorBuilder(true as any)
//
// export function connect<TObject extends ObservableObject, TValue = any>(
// 	options?: IConnectFieldOptions<TObject, TValue>,
// 	initValue?: TValue,
// ) {
// 	return (target: TObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.connect(propertyKey, options, initValue)
// 	}
// }
// class Class1 extends ObservableObject {
// }
// class Class extends Class1 {
// 	@connect()
// 	public prop: number
// }