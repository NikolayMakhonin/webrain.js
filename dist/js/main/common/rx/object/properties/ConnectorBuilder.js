"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConnectorBuilder = void 0;

var _deepSubscribe = require("../../deep-subscribe/deep-subscribe");

var _RuleBuilder = require("../../deep-subscribe/RuleBuilder");

var _ObservableObjectBuilder = require("../ObservableObjectBuilder");

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

    const setOptions = options && options.setOptions;
    return this.readable(name, {
      setOptions,
      hidden: options && options.hidden,

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