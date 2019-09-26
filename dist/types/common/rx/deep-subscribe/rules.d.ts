import { IConditionRule, IRepeatCondition, IRule, IRuleAny, IRuleIf, IRuleRepeat, RuleType } from './contracts/rules';
export declare class Rule implements IRule {
    readonly type: RuleType;
    subType?: any;
    next?: IRule;
    description?: string;
    constructor(type: RuleType);
    clone(): IRule;
}
export declare class RuleNothing extends Rule {
    constructor();
}
export declare class RuleNever extends Rule {
    static instance: Readonly<RuleNever>;
    private constructor();
    next: IRule;
    clone(): this;
}
export declare class RuleIf<TValue> extends Rule implements IRuleIf<TValue> {
    readonly conditionRules: Array<IConditionRule<TValue>>;
    constructor(conditionRules: Array<IConditionRule<TValue>>);
    clone(): IRuleIf<TValue>;
}
export declare class RuleAny extends Rule implements IRuleAny {
    readonly rules: IRule[];
    constructor(rules: IRule[]);
    clone(): IRuleAny;
}
export declare class RuleRepeat<TValue = any> extends Rule implements IRuleRepeat {
    readonly countMin: number;
    readonly countMax: number;
    readonly condition?: IRepeatCondition<TValue>;
    readonly rule: IRule;
    constructor(countMin: number, countMax: number, condition: IRepeatCondition<TValue>, rule: IRule);
    clone(): IRuleAny;
}
