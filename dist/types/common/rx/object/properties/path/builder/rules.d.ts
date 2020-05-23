import { IConditionRule, IRepeatCondition, IRule, IRuleAny, IRuleIf, IRuleRepeat, RuleType } from './contracts/rules';
export declare function ruleTypeToString(ruleType: RuleType): "Never" | "Action" | "Any" | "If" | "Nothing" | "Repeat";
export declare class Rule implements IRule {
    readonly type: RuleType;
    subType?: any;
    next?: IRule;
    description?: string;
    constructor(type: RuleType, description?: string);
    clone(): IRule;
    toString(): string;
}
export declare class RuleNothing extends Rule {
    static instance: Readonly<RuleNothing>;
    constructor();
}
export declare class RuleNever extends Rule {
    static instance: Readonly<RuleNever>;
    private constructor();
    get next(): IRule;
    set next(value: IRule);
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
