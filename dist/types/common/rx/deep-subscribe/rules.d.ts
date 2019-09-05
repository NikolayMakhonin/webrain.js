import { IRule, IRuleAny, IRuleRepeat, RuleType } from './contracts/rules';
export declare class Rule implements IRule {
    readonly type: RuleType;
    next?: IRule;
    description?: string;
    constructor(type: RuleType);
    clone(): IRule;
}
export declare class RuleNothing extends Rule {
    constructor();
}
export declare class RuleAny extends Rule implements IRuleAny {
    readonly rules: IRule[];
    constructor(rules: IRule[]);
    clone(): IRuleAny;
}
export declare class RuleRepeat extends Rule implements IRuleRepeat {
    readonly countMin: number;
    readonly countMax: number;
    readonly rule: IRule;
    constructor(countMin: number, countMax: number, rule: IRule);
    clone(): IRuleAny;
}
