import {IRule, IRuleAny, IRuleProperty, IRuleRepeat, RuleType} from './contracts/rules'
import {getFuncPropertiesPath} from './helpers/func-properties-path'

export class RuleBuilder<TObject> {
	public rule: IRule
	private _ruleLast: IRule

	public path<TValue>(getValueFunc: (o: TObject) => TValue): RuleBuilder<TValue> {
		let {_ruleLast: ruleLast} = this

		for (const propertyName of getFuncPropertiesPath(getValueFunc)) {
			const rule: IRuleProperty = {
				type: RuleType.Property,
				predicate: name => name === propertyName,
				description: propertyName,
			}

			if (ruleLast) {
				ruleLast.next = rule
			} else {
				this.rule = rule
			}

			ruleLast = rule
		}

		this._ruleLast = ruleLast

		return this as unknown as RuleBuilder<TValue>
	}

	public property<TValue>(predicate: (propertyName: string, object) => boolean): RuleBuilder<TValue> {
		const {_ruleLast: ruleLast} = this

		const rule: IRuleProperty = {
			type: RuleType.Property,
			predicate,
		}

		if (ruleLast) {
			ruleLast.next = rule
		} else {
			this.rule = rule
		}

		this._ruleLast = rule

		return this as unknown as RuleBuilder<TValue>
	}

	public any<TValue>(
		...getChilds: Array<(builder: RuleBuilder<TObject>) => RuleBuilder<TValue>>
	): RuleBuilder<TValue> {
		const {_ruleLast: ruleLast} = this

		const rule: IRuleAny = {
			type: RuleType.Any,
			rules: getChilds.map(o => o(new RuleBuilder<TObject>()).rule),
		}

		if (ruleLast) {
			ruleLast.next = rule
		} else {
			this.rule = rule
		}

		this._ruleLast = rule

		return this as unknown as RuleBuilder<TValue>
	}

	public repeat<TValue>(
		countMin: number,
		countMax: number,
		getChild: (builder: RuleBuilder<TObject>) => RuleBuilder<TValue>,
	): RuleBuilder<TValue> {
		const {_ruleLast: ruleLast} = this

		const rule: IRuleRepeat = {
			type: RuleType.Repeat,
			countMin,
			countMax,
			rule: getChild(new RuleBuilder<TObject>()).rule,
		}

		if (ruleLast) {
			ruleLast.next = rule
		} else {
			this.rule = rule
		}

		this._ruleLast = rule

		return this as unknown as RuleBuilder<TValue>
	}
}
