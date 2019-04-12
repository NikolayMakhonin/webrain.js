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

export interface IRuleProperty extends IRule {
	readonly predicate: (propertyName: string, object) => boolean
	readonly forEachChilds: (object: any, callbackfn: (propertyName: string, value) => void) => void
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
