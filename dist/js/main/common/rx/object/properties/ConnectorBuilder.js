"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectorClass = connectorClass;
exports.connectorFactory = connectorFactory;
exports.ConnectorBuilder = void 0;

var _helpers = require("../../../helpers/helpers");

var _deepSubscribe = require("../../deep-subscribe/deep-subscribe");

var _RuleBuilder = require("../../deep-subscribe/RuleBuilder");

var _ObservableObject = require("../ObservableObject");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

var _Connector = require("./Connector");

class ConnectorBuilder extends _ObservableObjectBuilder.ObservableObjectBuilder {
  constructor(object, buildSourceRule) {
    super(object);
    this.buildSourceRule = buildSourceRule;
  }

  connect(name, buildRule, options, initValue) {
    const {
      object,
      buildSourceRule
    } = this;
    let ruleBuilder = new _RuleBuilder.RuleBuilder();

    if (buildSourceRule) {
      ruleBuilder = buildSourceRule(ruleBuilder);
    }

    ruleBuilder = buildRule(ruleBuilder);
    const ruleBase = ruleBuilder && ruleBuilder.result;

    if (ruleBase == null) {
      throw new Error('buildRule() return null or not initialized RuleBuilder');
    }

    const setOptions = options && options.setOptions; // optimization

    const getValue = (0, _helpers.createFunction)('o', `return o.__fields["${name}"]`);
    const setValue = (0, _helpers.createFunction)('o', 'v', `o.__fields["${name}"] = v`);
    const set = setOptions ? _ObservableObject._setExt.bind(null, name, getValue, setValue, setOptions) : _ObservableObject._set.bind(null, name, getValue, setValue);
    return this.readable(name, {
      setOptions,
      hidden: options && options.hidden,

      // tslint:disable-next-line:no-shadowed-variable
      factory(initValue) {
        let setVal = (obj, value) => {
          if (typeof value !== 'undefined') {
            initValue = value;
          }
        };

        const unsubscribe = (0, _deepSubscribe.deepSubscribeRule)(this, value => {
          setVal(this, value);
          return null;
        }, true, this === object ? ruleBase : (0, _RuleBuilder.cloneRule)(ruleBase));

        this._setUnsubscriber(name, unsubscribe);

        setVal = set;
        return initValue;
      }

    }, initValue);
  }

}

exports.ConnectorBuilder = ConnectorBuilder;

function connectorClass(build, baseClass) {
  class NewConnector extends (baseClass || _Connector.Connector) {}

  build(new ConnectorBuilder(NewConnector.prototype, b => b.propertyName('connectorSource')));
  return NewConnector;
}

function connectorFactory(build, baseClass) {
  const NewConnector = connectorClass(build, baseClass);
  return source => new NewConnector(source);
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