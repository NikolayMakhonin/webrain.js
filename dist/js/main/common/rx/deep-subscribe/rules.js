"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleRepeat = exports.RuleAny = exports.RuleNothing = exports.Rule = void 0;

var _rules = require("./contracts/rules");

class Rule {
  constructor(type) {
    this.type = type;
  }

  clone() {
    const {
      type,
      next,
      description
    } = this;
    const clone = {
      type,
      description
    };

    if (next != null) {
      clone.next = next.clone();
    }

    return clone;
  }

}

exports.Rule = Rule;

class RuleNothing extends Rule {
  constructor() {
    super(_rules.RuleType.Nothing);
    this.description = 'nothing';
  }

}

exports.RuleNothing = RuleNothing;

class RuleAny extends Rule {
  constructor(rules) {
    super(_rules.RuleType.Any);
    this.rules = rules;
  }

  clone() {
    const clone = super.clone();
    clone.rules = this.rules.map(o => o.clone());
    return clone;
  }

}

exports.RuleAny = RuleAny;

class RuleRepeat extends Rule {
  constructor(countMin, countMax, rule) {
    super(_rules.RuleType.Repeat);
    this.countMin = countMin;
    this.countMax = countMax;
    this.rule = rule;
  }

  clone() {
    const clone = super.clone();
    clone.rule = this.rule.clone();
    clone.countMin = this.countMin;
    clone.countMax = this.countMax;
    return clone;
  }

}

exports.RuleRepeat = RuleRepeat;