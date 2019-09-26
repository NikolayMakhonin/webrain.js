"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
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
      return this._connect(false, name, buildRule, options, initValue);
    }
  }, {
    key: "connectWritable",
    value: function connectWritable(name, buildRule, options, initValue) {
      return this._connect(true, name, buildRule, options, initValue);
    }
  }, {
    key: "_connect",
    value: function _connect(writable, name, buildRule, options, initValue) {
      var object = this.object,
          buildSourceRule = this.buildSourceRule;
      var ruleBuilder = new _RuleBuilder.RuleBuilder();

      if (buildSourceRule) {
        ruleBuilder = buildSourceRule(ruleBuilder);
      }

      ruleBuilder = buildRule(ruleBuilder);
      var ruleBase = ruleBuilder && ruleBuilder.result();

      if (ruleBase == null) {
        throw new Error('buildRule() return null or not initialized RuleBuilder');
      }

      var setOptions = options && options.setOptions; // optimization

      var baseGetValue = options && options.getValue || (0, _helpers.createFunction)("return this.__fields[\"" + name + "\"]");
      var baseSetValue = options && options.setValue || (0, _helpers.createFunction)('v', "this.__fields[\"" + name + "\"] = v");
      var getValue = !writable ? baseGetValue : function () {
        return baseGetValue.call(this).value;
      };
      var setValue = !writable ? baseSetValue : function (value) {
        var baseValue = baseGetValue.call(this);
        baseValue.value = value;
      };
      var set = setOptions ? (0, _bind.default)(_ObservableObject._setExt).call(_ObservableObject._setExt, null, name, getValue, setValue, setOptions) : (0, _bind.default)(_ObservableObject._set).call(_ObservableObject._set, null, name, getValue, setValue);
      return this.updatable(name, {
        setOptions: setOptions,
        hidden: options && options.hidden,
        // tslint:disable-next-line:no-shadowed-variable
        factory: function factory(initValue) {
          var _this2 = this;

          if (writable) {
            baseSetValue.call(this, {
              value: initValue,
              parent: null,
              propertyName: null
            });
          }

          var setVal = function setVal(obj, value) {
            if (typeof value !== 'undefined') {
              initValue = value;
            }
          };

          var receiveValue = writable ? function (value, parent, propertyName) {
            _CalcObjectDebugger.CalcObjectDebugger.Instance.onConnectorChanged(_this2, value, parent, propertyName);

            var baseValue = baseGetValue.call(_this2);
            baseValue.parent = parent;
            baseValue.propertyName = propertyName;
            setVal(_this2, value);
            return null;
          } : function (value, parent, propertyName) {
            _CalcObjectDebugger.CalcObjectDebugger.Instance.onConnectorChanged(_this2, value, parent, propertyName);

            setVal(_this2, value);
            return null;
          };
          var rule = this === object ? ruleBase : ruleBase.clone();
          this.propertyChanged.hasSubscribersObservable.subscribe(function (hasSubscribers) {
            _this2._setUnsubscriber(name, null);

            if (hasSubscribers) {
              var unsubscribe = (0, _deepSubscribe.deepSubscribeRule)({
                object: _this2,
                lastValue: receiveValue,
                rule: rule
              });

              if (unsubscribe) {
                _this2._setUnsubscriber(name, unsubscribe);
              }
            }
          });
          setVal = set;
          return initValue;
        },
        update: writable && function (value) {
          var baseValue = baseGetValue.call(this);

          if (baseValue.parent != null) {
            baseValue.parent[baseValue.propertyName] = value;
          } // return value

        },
        getValue: getValue,
        setValue: setValue
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