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
	/**
	 * Default: 0
	 */
	readonly countMin?: number

	/**
	 * Default: Infinity
	 */
	readonly countMax?: number

	readonly rule: IRule
}
