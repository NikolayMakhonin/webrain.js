"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleBuilder = void 0;

var _rules = require("./contracts/rules");

var _funcPropertiesPath = require("./helpers/func-properties-path");

class RuleBuilder {
  path(getValueFunc) {
    let {
      _ruleLast: ruleLast
    } = this;

    for (const propertyName of (0, _funcPropertiesPath.getFuncPropertiesPath)(getValueFunc)) {
      const rule = {
        type: _rules.RuleType.Property,
        predicate: name => name === propertyName,
        description: propertyName
      };

      if (ruleLast) {
        ruleLast.next = rule;
      } else {
        this.rule = rule;
      }

      ruleLast = rule;
    }

    this._ruleLast = ruleLast;
    return this;
  }

  property(predicate) {
    const {
      _ruleLast: ruleLast
    } = this;
    const rule = {
      type: _rules.RuleType.Property,
      predicate
    };

    if (ruleLast) {
      ruleLast.next = rule;
    } else {
      this.rule = rule;
    }

    this._ruleLast = rule;
    return this;
  }

  any(...getChilds) {
    const {
      _ruleLast: ruleLast
    } = this;
    const rule = {
      type: _rules.RuleType.Any,
      rules: getChilds.map(o => o(new RuleBuilder()).rule)
    };

    if (ruleLast) {
      ruleLast.next = rule;
    } else {
      this.rule = rule;
    }

    this._ruleLast = rule;
    return this;
  }

  repeat(countMin, countMax, getChild) {
    const {
      _ruleLast: ruleLast
    } = this;
    const rule = {
      type: _rules.RuleType.Repeat,
      countMin,
      countMax,
      rule: getChild(new RuleBuilder()).rule
    };

    if (ruleLast) {
      ruleLast.next = rule;
    } else {
      this.rule = rule;
    }

    this._ruleLast = rule;
    return this;
  }

}

exports.RuleBuilder = RuleBuilder;