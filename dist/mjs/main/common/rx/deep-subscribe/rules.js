import { RuleType } from './contracts/rules';
export class Rule {
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
export class RuleNothing extends Rule {
  constructor() {
    super(RuleType.Nothing);
    this.description = 'nothing';
  }

}
export class RuleAny extends Rule {
  constructor(rules) {
    super(RuleType.Any);
    this.rules = rules;
  }

  clone() {
    const clone = super.clone();
    clone.rules = this.rules.map(o => o.clone());
    return clone;
  }

}
export class RuleRepeat extends Rule {
  constructor(countMin, countMax, rule) {
    super(RuleType.Repeat);
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