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

export interface IRuleRepeat<TValue = any> extends IRule {
	readonly countMin: number
	readonly countMax: number
	readonly condition?: (value: TValue) => boolean
	readonly rule: IRule
}
