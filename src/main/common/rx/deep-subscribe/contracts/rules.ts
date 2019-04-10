export enum RuleType {
	Property,
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
	readonly iterateObject: (object) => Iterable<any>
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
