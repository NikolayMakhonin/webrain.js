import {IRule, IRuleAny, IRuleRepeat, RuleType} from './contracts/rules'

export class Rule implements IRule {
	public readonly type: RuleType
	public next?: IRule
	public description?: string

	public constructor(type: RuleType) {
		this.type = type
	}

	public clone(): IRule {
		const {type, next, description} = this
		const clone = {type, description} as IRule

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

export class RuleRepeat extends Rule implements IRuleRepeat {
	public readonly countMin: number
	public readonly countMax: number
	public readonly rule: IRule

	constructor(countMin: number, countMax: number, rule: IRule) {
		super(RuleType.Repeat)
		this.countMin = countMin
		this.countMax = countMax
		this.rule = rule
	}

	public clone(): IRuleAny {
		const clone = super.clone() as IRuleAny
		(clone as any).rule = this.rule.clone();
		(clone as any).countMin = this.countMin;
		(clone as any).countMax = this.countMax
		return clone
	}
}
