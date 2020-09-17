export declare enum RuleType {
    Nothing = 0,
    Never = 1,
    Action = 2,
    If = 3,
    Any = 4,
    Repeat = 5
}
export interface IRule {
    readonly type: RuleType;
    subType?: any;
    next?: IRule;
    description?: string;
    clone(): IRule;
}
export interface IRuleAction extends IRule {
}
export interface IRuleAny extends IRule {
    readonly rules: IRule[];
}
export declare type IConditionRule<TValue = any> = [(value: TValue) => boolean, IRule] | IRule;
export interface IRuleIf<TValue = any> extends IRule {
    readonly conditionRules: Array<IConditionRule<TValue>>;
}
export declare enum RuleRepeatAction {
    Never = 0,
    Next = 1,
    Fork = 2,
    All = 3
}
export declare type IRepeatCondition<TValue> = (value: TValue, index: number) => RuleRepeatAction;
export interface IRuleRepeat<TValue = any> extends IRule {
    readonly countMin: number;
    readonly countMax: number;
    readonly condition?: IRepeatCondition<TValue>;
    readonly rule: IRule;
}
