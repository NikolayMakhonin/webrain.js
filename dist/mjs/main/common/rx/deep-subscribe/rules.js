import { RuleType } from './contracts/rules';
export function ruleTypeToString(ruleType) {
  switch (ruleType) {
    case RuleType.Never:
      return 'Never';

    case RuleType.Action:
      return 'Action';

    case RuleType.Any:
      return 'Any';

    case RuleType.If:
      return 'If';

    case RuleType.Nothing:
      return 'Nothing';

    case RuleType.Repeat:
      return 'Repeat';

    default:
      throw new Error('Unknown RuleType: ' + ruleType);
  }
}
export const RULE_STRING_SEPARATOR = ' > ';

function ruleToString(rule, customDescription, nestedRulesStr) {
  const description = customDescription || this.description || ruleTypeToString(this.type);
  return `${description}${nestedRulesStr ? '(' + nestedRulesStr + ')' : ''}${this.next ? ' > ' + this.next : ''}`;
}

export class Rule {
  constructor(type, description) {
    this.type = type;

    if (description != null) {
      this.description = description;
    }
  }

  clone() {
    const {
      type,
      subType,
      description,
      next,
      toString
    } = this;
    const clone = {
      type,
      subType,
      description,
      toString
    };

    if (next != null) {
      clone.next = next.clone();
    }

    return clone;
  }

  toString() {
    return ruleToString(this);
  }

}
export class RuleNothing extends Rule {
  constructor() {
    super(RuleType.Nothing);
    this.description = 'nothing';
  }

}
RuleNothing.instance = Object.freeze(new RuleNothing());
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
    this.description = '<if>';
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
    this.description = '<any>';
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
    this.description = '<repeat>';
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