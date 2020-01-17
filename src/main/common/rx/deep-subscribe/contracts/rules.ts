export enum RuleType {
	Nothing,
	Never,
	Action,
	If,
	Any,
	Repeat,
}

export interface IRule {
	readonly type: RuleType
	subType?: any
	next?: IRule
	description?: string
	clone(): IRule
}

// tslint:disable-next-line:no-empty-interface
export interface IRuleAction extends IRule {
}

export interface IRuleAny extends IRule {
	readonly rules: IRule[]
}

export type IConditionRule<TValue = any> = [ (value: TValue) => boolean, IRule ] | IRule

export interface IRuleIf<TValue = any> extends IRule {
	readonly conditionRules: Array<IConditionRule<TValue>>
}

export enum RuleRepeatAction {
	Never,
	Next,
	Fork,
	All = Next | Fork,
}

export type IRepeatCondition<TValue> = (value: TValue, index: number) => RuleRepeatAction

export interface IRuleRepeat<TValue = any> extends IRule {
	readonly countMin: number
	readonly countMax: number
	readonly condition?: IRepeatCondition<TValue>
	readonly rule: IRule
}
