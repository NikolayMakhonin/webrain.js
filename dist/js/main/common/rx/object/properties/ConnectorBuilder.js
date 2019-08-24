"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connector = connector;
exports.connect = connect;
exports.ConnectorBuilder = void 0;

var _deepSubscribe = require("../../deep-subscribe/deep-subscribe");

var _RuleBuilder = require("../../deep-subscribe/RuleBuilder");

var _ObservableObject = require("../ObservableObject");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

class ConnectorBuilder extends _ObservableObjectBuilder.ObservableObjectBuilder {
  connect(name, options, initValue) {
    const {
      buildRule,
      setOptions,
      hidden
    } = options;
    const ruleBuilder = buildRule(new _RuleBuilder.RuleBuilder());
    const ruleBase = ruleBuilder && ruleBuilder.result;

    if (ruleBase == null) {
      throw new Error('buildRule() return null or not initialized RuleBuilder');
    }

    const {
      object
    } = this;
    return this.readable(name, {
      setOptions,
      hidden,

      // tslint:disable-next-line:no-shadowed-variable
      factory(initValue) {
        let setValue = value => {
          if (typeof value !== 'undefined') {
            initValue = value;
          }
        };

        const unsubscribe = (0, _deepSubscribe.deepSubscribeRule)(this, value => {
          setValue(value);
          return null;
        }, true, this === object ? ruleBase : (0, _RuleBuilder.cloneRule)(ruleBase));

        this._setUnsubscriber(name, unsubscribe);

        setValue = value => {
          this._set(name, value, setOptions);
        };

        return initValue;
      }

    }, initValue);
  }

}

exports.ConnectorBuilder = ConnectorBuilder;
const CONNECTOR_SOURCE_PROPERTY_NAME = Math.random().toString(36);

class ConnectorBase extends _ObservableObject.ObservableObject {
  constructor(source) {
    super();
    this[CONNECTOR_SOURCE_PROPERTY_NAME] = source;
  }

}

Object.defineProperty(ConnectorBase.prototype, CONNECTOR_SOURCE_PROPERTY_NAME, {
  configurable: false,
  enumerable: false,
  writable: false,
  value: null
});

function connector(build) {
  class Connector extends ConnectorBase {}

  const connectorBuilder = new ConnectorBuilder(Connector.prototype);
  build(connectorBuilder);
  return Connector;
}

const builder = new ConnectorBuilder(true);

function connect(options, initValue) {
  return (target, propertyKey) => {
    builder.object = target;
    builder.connect(propertyKey, options, initValue);
  };
} // class Class1 extends ObservableObject {
// }
// class Class extends Class1 {
// 	@connect()
// 	public prop: number
// }