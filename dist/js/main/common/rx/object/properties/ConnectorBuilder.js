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

var _Debugger = require("../../Debugger");

var _deepSubscribe = require("../../deep-subscribe/deep-subscribe");

var _common = require("../../deep-subscribe/helpers/common");

var _RuleBuilder = require("../../deep-subscribe/RuleBuilder");

var _ObservableClass = require("../ObservableClass");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _Connector = require("./Connector");

var buildSourceRule = function buildSourceRule(b) {
  return b.p('source');
};

var ConnectorBuilder =
/*#__PURE__*/
function (_ObservableObjectBuil) {
  (0, _inherits2.default)(ConnectorBuilder, _ObservableObjectBuil);

  function ConnectorBuilder(object) {
    (0, _classCallCheck2.default)(this, ConnectorBuilder);
    return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ConnectorBuilder).call(this, object));
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
      var object = this.object;
      var ruleBuilder = new _RuleBuilder.RuleBuilder({
        valuePropertyDefaultName: 'last'
      });

      if (object instanceof _Connector.Connector) {
        ruleBuilder = buildSourceRule(ruleBuilder);
      }

      ruleBuilder = buildRule(ruleBuilder);
      var ruleBase = ruleBuilder && ruleBuilder.result();

      if (ruleBase == null) {
        throw new Error('buildRule() return null or not initialized RuleBuilder');
      }

      var setOptions = options && options.setOptions; // optimization

      var baseGetValue = options && options.getValue || (0, _helpers.createFunction)(function () {
        return function () {
          return this.__fields[name];
        };
      }, "return this.__fields[\"" + name + "\"]");
      var baseSetValue = options && options.setValue || (0, _helpers.createFunction)(function () {
        return function (v) {
          this.__fields[name] = v;
        };
      }, 'v', "this.__fields[\"" + name + "\"] = v");
      var getValue = !writable ? baseGetValue : function () {
        return baseGetValue.call(this).value;
      };
      var setValue = !writable ? baseSetValue : function (value) {
        var baseValue = baseGetValue.call(this);
        baseValue.value = value;
      };
      var set = setOptions ? (0, _bind.default)(_ObservableClass._setExt).call(_ObservableClass._setExt, null, name, getValue, setValue, setOptions) : (0, _bind.default)(_ObservableClass._set).call(_ObservableClass._set, null, name, getValue, setValue);
      return this.updatable(name, {
        setOptions: setOptions,
        hidden: options && options.hidden,
        // tslint:disable-next-line:no-shadowed-variable
        factory: function factory(initValue) {
          var _this = this;

          if (writable) {
            baseSetValue.call(this, {
              value: initValue,
              parent: null,
              key: null,
              keyType: null
            });
          }

          var setVal = function setVal(obj, value) {
            if (typeof value !== 'undefined') {
              initValue = value;
            }
          };

          var receiveValue = writable ? function (value, parent, key, keyType) {
            _Debugger.Debugger.Instance.onConnectorChanged(_this, name, value, parent, key, keyType);

            var baseValue = baseGetValue.call(_this);
            baseValue.parent = parent;
            baseValue.key = key;
            baseValue.keyType = keyType;
            setVal(_this, value);
            return null;
          } : function (value, parent, key, keyType) {
            _Debugger.Debugger.Instance.onConnectorChanged(_this, name, value, parent, key, keyType);

            setVal(_this, value);
            return null;
          };
          var rule = this === object ? ruleBase : ruleBase.clone();
          this.propertyChanged.hasSubscribersObservable.subscribe(function (hasSubscribers) {
            _this._setUnsubscriber(name, null);

            if (hasSubscribers) {
              var unsubscribe = (0, _deepSubscribe.deepSubscribeRule)({
                object: _this instanceof _Connector.Connector ? _this.connectorState : _this,
                lastValue: receiveValue,
                debugTarget: _this,
                rule: rule
              });

              if (unsubscribe) {
                _this._setUnsubscriber(name, unsubscribe);
              }
            }
          }, "Connector." + name + ".hasSubscribersObservable for deepSubscribe");
          setVal = set;
          return initValue;
        },
        update: writable && function (value) {
          var baseValue = baseGetValue.call(this);

          if (baseValue.parent != null) {
            (0, _common.setObjectValue)(baseValue.parent, baseValue.key, baseValue.keyType, value);
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

function connectorClass(_ref) {
  var buildRule = _ref.buildRule,
      baseClass = _ref.baseClass;

  // @ts-ignore
  var NewConnector =
  /*#__PURE__*/
  function (_ref2) {
    (0, _inherits2.default)(NewConnector, _ref2);

    function NewConnector() {
      (0, _classCallCheck2.default)(this, NewConnector);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(NewConnector).apply(this, arguments));
    }

    return NewConnector;
  }(baseClass || _Connector.Connector); // @ts-ignore


  buildRule(new ConnectorBuilder(NewConnector.prototype));
  return NewConnector;
}

function connectorFactory(_ref3) {
  var name = _ref3.name,
      buildRule = _ref3.buildRule,
      baseClass = _ref3.baseClass;
  var NewConnector = connectorClass({
    buildRule: buildRule,
    baseClass: baseClass
  });
  return function (source, sourceName) {
    return new NewConnector(source, name || sourceName);
  };
} // const builder = new ConnectorBuilder(true as any)
//
// export function connect<TObject extends ObservableClass, TValue = any>(
// 	options?: IConnectFieldOptions<TObject, TValue>,
// 	initValue?: TValue,
// ) {
// 	return (target: TObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.connect(propertyKey, options, initValue)
// 	}
// }
// class Class1 extends ObservableClass {
// }
// class Class extends Class1 {
// 	@connect()
// 	public prop: number
// }