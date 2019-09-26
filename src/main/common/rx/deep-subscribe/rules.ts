import {
	IConditionRule,
	IRepeatCondition,
	IRule,
	IRuleAny,
	IRuleIf,
	IRuleRepeat,
	RuleRepeatAction,
	RuleType,
} from './contracts/rules'

export class Rule implements IRule {
	public readonly type: RuleType
	public subType?: any
	public next?: IRule
	public description?: string

	public constructor(type: RuleType) {
		this.type = type
	}

	public clone(): IRule {
		const {type, subType, description, next} = this
		const clone = {type, subType, description} as IRule

		if (next != null) {
			clone.next = next.clone()
		}

		return clone
	}
}

export class RuleNothing extends Rule {
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
