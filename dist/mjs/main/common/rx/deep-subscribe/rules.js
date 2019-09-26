import { RuleType } from './contracts/rules';
export class Rule {
  constructor(type) {
    this.type = type;
  }

  clone() {
    const {
      type,
      subType,
      description,
      next
    } = this;
    const clone = {
      type,
      subType,
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
export class RuleNever extends Rule {
  constructor() {
    super(RuleType.Never);
    this.description = 'never';
  }

  get next() {
    return null;
  } // tslint:disable-next-line:no-empty


  set next(value) {}

  clone() {
    return this;
  }

}
RuleNever.instance = Object.freeze(new RuleNever());
export class RuleIf extends Rule {
  constructor(conditionRules) {
    super(RuleType.If);
    this.conditionRules = conditionRules;
  }

  clone() {
    const clone = super.clone();
    clone.conditionRules = this.conditionRules.map(o => Array.isArray(o) ? [o[0], o[1].clone()] : o.clone());
    return clone;
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
  constructor(countMin, countMax, condition, rule) {
    super(RuleType.Repeat);
    this.countMin = countMin;
    this.countMax = countMax;
    this.condition = condition;
    this.rule = rule;
  }

  clone() {
    const clone = super.clone();
    clone.rule = this.rule.clone();
    clone.countMin = this.countMin;
    clone.countMax = this.countMax;
    clone.condition = this.condition;
    return clone;
  }

}