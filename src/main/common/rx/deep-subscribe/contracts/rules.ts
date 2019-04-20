import {IUnsubscribe} from '../../subjects/subject'

export enum RuleType {
	Action,
	Any,
	Repeat,
}

export interface IRule {
	readonly type: RuleType
	next?: IRule
	description?: string
}

// tslint:disable-next-line:no-empty-interface
export interface IRuleAction extends IRule {
}

export interface IRuleAny extends IRule {
	readonly rules: IRule[]
}

export interface IRuleRepeat extends IRule {
	readonly countMin: number
	readonly countMax: number
	readonly rule: IRule
}