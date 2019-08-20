"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectorBuilder = void 0;

var _deepSubscribe = require("../../deep-subscribe/deep-subscribe");

var _RuleBuilder = require("../../deep-subscribe/RuleBuilder");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

class ConnectorBuilder extends _ObservableObjectBuilder.ObservableObjectBuilder {
  connect(name, buildRule, options, initValue) {
    const ruleBuilder = buildRule(new _RuleBuilder.RuleBuilder());
    const rule = ruleBuilder && ruleBuilder.result;

    if (rule == null) {
      throw new Error('buildRule() return null or not initialized RuleBuilder');
    }

    return this.readable(name, {
      factorySetOptions: options,

      factory() {
        let setValue = value => {
          if (typeof value !== 'undefined') {
            initValue = value;
          }
        };

        const unsubscribe = (0, _deepSubscribe.deepSubscribeRule)(this, value => {
          setValue(value);
          return null;
        }, true, rule);

        this._setUnsubscriber(name, unsubscribe);

        setValue = value => {
          this._set(name, value, options);
        };

        return initValue;
      }

    });
  }

}

exports.ConnectorBuilder = ConnectorBuilder;