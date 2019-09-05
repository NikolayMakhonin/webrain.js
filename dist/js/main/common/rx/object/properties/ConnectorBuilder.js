"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports.connectorClass = connectorClass;
exports.connectorFactory = connectorFactory;
exports.ConnectorBuilder = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _helpers = require("../../../helpers/helpers");

var _deepSubscribe = require("../../deep-subscribe/deep-subscribe");

var _RuleBuilder = require("../../deep-subscribe/RuleBuilder");

var _ObservableObject = require("../ObservableObject");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _CalcObjectDebugger = require("./CalcObjectDebugger");

var _Connector = require("./Connector");

var ConnectorBuilder =
/*#__PURE__*/
function (_ObservableObjectBuil) {
  (0, _inherits2.default)(ConnectorBuilder, _ObservableObjectBuil);

  function ConnectorBuilder(object, buildSourceRule) {
    var _this;

    (0, _classCallCheck2.default)(this, ConnectorBuilder);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ConnectorBuilder).call(this, object));
    _this.buildSourceRule = buildSourceRule;
    return _this;
  }

  (0, _createClass2.default)(ConnectorBuilder, [{
    key: "connect",
    value: function connect(name, buildRule, options, initValue) {
      var object = this.object,
          buildSourceRule = this.buildSourceRule;
      var ruleBuilder = new _RuleBuilder.RuleBuilder();

      if (buildSourceRule) {
        ruleBuilder = buildSourceRule(ruleBuilder);
      }

      ruleBuilder = buildRule(ruleBuilder);
      var ruleBase = ruleBuilder && ruleBuilder.result;

      if (ruleBase == null) {
        throw new Error('buildRule() return null or not initialized RuleBuilder');
      }

      var setOptions = options && options.setOptions; // optimization

      var getValue = (0, _helpers.createFunction)('o', "return o.__fields[\"".concat(name, "\"]"));
      var setValue = (0, _helpers.createFunction)('o', 'v', "o.__fields[\"".concat(name, "\"] = v"));
      var set = setOptions ? (0, _bind.default)(_ObservableObject._setExt).call(_ObservableObject._setExt, null, name, getValue, setValue, setOptions) : (0, _bind.default)(_ObservableObject._set).call(_ObservableObject._set, null, name, getValue, setValue);
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

          var receiveValue = function receiveValue(value, parent, propertyName) {
            _CalcObjectDebugger.CalcObjectDebugger.Instance.onConnectorChanged(_this2, value, parent, propertyName);

            setVal(_this2, value);
            return null;
          };

          var rule = this === object ? ruleBase : (0, _RuleBuilder.cloneRule)(ruleBase);
          this.propertyChanged.hasSubscribersObservable.subscribe(function (hasSubscribers) {
            _this2._setUnsubscriber(name, null);

            if (hasSubscribers) {
              var unsubscribe = (0, _deepSubscribe.deepSubscribeRule)(_this2, receiveValue, true, rule);

              _this2._setUnsubscriber(name, unsubscribe);
            }
          });
          setVal = set;
          return initValue;
        }
      }, initValue);
    }
  }]);
  return ConnectorBuilder;
}(_ObservableObjectBuilder.ObservableObjectBuilder);

exports.ConnectorBuilder = ConnectorBuilder;

function connectorClass(build, baseClass) {
  var NewConnector =
  /*#__PURE__*/
  function (_ref) {
    (0, _inherits2.default)(NewConnector, _ref);

    function NewConnector() {
      (0, _classCallCheck2.default)(this, NewConnector);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(NewConnector).apply(this, arguments));
    }

    return NewConnector;
  }(baseClass || _Connector.Connector);

  build(new ConnectorBuilder(NewConnector.prototype, function (b) {
    return b.propertyName('connectorSource');
  }));
  return NewConnector;
}

function connectorFactory(build, baseClass) {
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