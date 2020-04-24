import {
	IConditionRule,
	IRepeatCondition,
	IRule,
	IRuleAny,
	IRuleIf,
	IRuleRepeat,
	RuleType,
} from './contracts/rules'

export function ruleTypeToString(ruleType: RuleType) {
	switch (ruleType) {
		case RuleType.Never:
			return 'Never'
		case RuleType.Action:
			return 'Action'
		case RuleType.Any:
			return 'Any'
		case RuleType.If:
			return 'If'
		case RuleType.Nothing:
			return 'Nothing'
		case RuleType.Repeat:
			return 'Repeat'
		default:
			throw new Error('Unknown RuleType: ' + ruleType)
	}
}

function ruleToString(
	rule: IRule,
	customDescription?: string,
	nestedRulesStr?: string,
): string {
	const description = customDescription || this.description || ruleTypeToString(this.type)
	
	return `${
		description
	}${
		nestedRulesStr ? '(' + nestedRulesStr + ')' : ''
	}${
		this.next ? ' > ' + this.next : ''
	}`
}

export class Rule implements IRule {
	public readonly type: RuleType
	public subType?: any
	public next?: IRule
	public description?: string

	public constructor(type: RuleType, description?: string) {
		this.type = type
		if (description != null) {
			this.description = description
		}
	}

	public clone(): IRule {
		const {type, subType, description, next, toString} = this
		const clone = {type, subType, description, toString} as IRule

		if (next != null) {
			clone.next = next.clone()
		}

		return clone
	}

	public toString() {
		return ruleToString(this)
	}
}

export class RuleNothing extends Rule {
	public static instance = Object.freeze(new RuleNothing())
	constructor() {
		super(RuleType.Nothing)
		this.description = 'nothing'
	}
}

export class RuleNever extends Rule {
	public static instance = Object.freeze(new RuleNever())
	private constructor() {
		super(RuleType.Never)
		this.description = 'never'
	}

	public get next(): IRule {
		return null
	}
	// tslint:disable-next-line:no-empty
	public set next(value: IRule) {	}

	public clone() {
		return this
	}
}

export class RuleIf<TValue> extends Rule implements IRuleIf<TValue> {
	public readonly conditionRules: Array<IConditionRule<TValue>>

	constructor(conditionRules: Array<IConditionRule<TValue>>) {
		super(RuleType.If)
		this.conditionRules = conditionRules
		this.description = '<if>'
	}

	public clone(): IRuleIf<TValue> {
		const clone = super.clone() as IRuleIf<TValue>
		(clone as any).conditionRules = this.conditionRules
			.map(o => Array.isArray(o)
				? [ o[0], o[1].clone() ]
				: o.clone())
		return clone
	}
}

export class RuleAny extends Rule implements IRuleAny {
	public readonly rules: IRule[]

	constructor(rules: IRule[]) {
		super(RuleType.Any)
		this.rules = rules
		this.description = '<any>'
	}

	public clone(): IRuleAny {
		const clone = super.clone() as IRuleAny
		(clone as any).rules = this.rules.map(o => o.clone())
		return clone
	}
}

export class RuleRepeat<TValue = any> extends Rule implements IRuleRepeat {
	public readonly countMin: number
	public readonly countMax: number
	public readonly condition?: IRepeatCondition<TValue>
	public readonly rule: IRule

	constructor(
		countMin: number,
		countMax: number,
		condition: IRepeatCondition<TValue>,
		rule: IRule,
	) {
		super(RuleType.Repeat)
		this.countMin = countMin
		this.countMax = countMax
		this.condition = condition
		this.rule = rule
		this.description = '<repeat>'
	}

	public clone(): IRuleAny {
		const clone = super.clone() as IRuleAny
		(clone as any).rule = this.rule.clone();
		(clone as any).countMin = this.countMin;
		(clone as any).countMax = this.countMax;
		(clone as any).condition = this.condition
		return clone
	}
}
