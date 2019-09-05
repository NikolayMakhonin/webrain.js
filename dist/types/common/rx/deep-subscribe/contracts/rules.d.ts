export declare enum RuleType {
    Nothing = 0,
    Action = 1,
    Any = 2,
    Repeat = 3
}
export interface IRule {
    readonly type: RuleType;
    next?: IRule;
    description?: string;
    clone(): IRule;
}
export interface IRuleAction extends IRule {
}
export interface IRuleAny extends IRule {
    readonly rules: IRule[];
}
export interface IRuleRepeat extends IRule {
    readonly countMin: number;
    readonly countMax: number;
    readonly rule: IRule;
}
